<template>
  <div class="chat-room-container">
    <!-- 导航栏 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <!-- 首页 - 始终显示 -->
      <el-menu-item index="1">首页</el-menu-item>
      
      <!-- 企业用户导航项 -->
      <template v-if="isLoggedIn && currentUser.role === 1 && currentUser.role !== 2">
        <!-- 2. 发布职位 - 仅企业用户显示 -->
        <el-menu-item index="9">发布职位</el-menu-item>
        <!-- 3. 消息 - 企业用户显示 -->
        <el-menu-item index="4">消息</el-menu-item>
      </template>
      
      <!-- 非企业用户导航项 -->
      <template v-if="!isLoggedIn || currentUser.role !== 1">
        <el-menu-item index="2">职位</el-menu-item>
        <el-menu-item index="3">企业</el-menu-item>
        <el-menu-item index="4" v-if="isLoggedIn && currentUser.role !== 2">消息</el-menu-item>
        <el-menu-item index="5" v-if="isLoggedIn && currentUser.role === 0">论坛</el-menu-item>
        <el-menu-item index="6" v-if="!isLoggedIn">登录</el-menu-item>
        <el-menu-item index="7" v-if="!isLoggedIn">注册</el-menu-item>
      </template>
      
      <!-- 消息 - 已移至上方 -->
      
      <!-- 用户下拉菜单 - 所有登录用户显示 -->
      <el-submenu index="8" v-if="isLoggedIn">
        <template slot="title">{{ currentUser.username }}</template>
        <el-menu-item index="8-1">个人中心</el-menu-item>
        <el-menu-item index="8-2" v-if="currentUser.role === 2">管理员面板</el-menu-item>
        <el-menu-item index="8-3" @click="logout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>

    <div class="chat-container">
      <!-- 左侧消息列表 -->
      <div class="message-list">
        <div class="search-bar">
          <el-input placeholder="搜索聊天" prefix-icon="el-icon-search"></el-input>
        </div>
        <div class="contact-list">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            :class="{ 'active': selectedContactId === contact.id }"
            class="contact-item"
            @click="selectContact(contact.id)"
          >
            <img :src="contact.avatar" alt="头像" class="avatar">
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
              <div class="last-message">{{ contact.lastMessage }}</div>
            </div>
            <div class="message-time">{{ contact.time }}</div>
            <div v-if="contact.unreadCount > 0" class="unread-count">{{ contact.unreadCount }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天内容 -->
      <div class="chat-content" v-if="selectedContactId">
        <div class="chat-header">
          <img :src="selectedContact.avatar" alt="头像" class="avatar">
          <div class="contact-name">{{ selectedContact.name }}</div>
        </div>
        <div class="messages-container">
          <div v-if="messages.length > 0">
            <div v-for="message in messages" :key="message.id" class="message-wrapper">
              <div :class="{ 'sent': message.isSent, 'received': !message.isSent }" class="message-bubble">
                {{ message.content }}
              </div>
              <div :class="{ 'sent-time': message.isSent, 'received-time': !message.isSent }" class="message-time">
                {{ message.time }}
              </div>
            </div>
          </div>
          <div v-else class="no-messages">
            <div class="no-messages-text">暂无聊天记录</div>
            <div class="no-messages-hint">您可以联系公司咨询求职相关信息</div>
          </div>
        </div>
        <div class="message-input">
          <el-input
            v-model="inputMessage"
            type="textarea"
            placeholder="请输入消息..."
            :rows="4"
            @keyup.enter.native="sendMessage"
          ></el-input>
          <div class="send-button">
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </div>
        </div>
      </div>
      <div class="no-selection" v-else>
        请选择一个聊天
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatRoom',
  data() {
      return {
        activeIndex: '4',
        contacts: [],
        selectedContactId: null,
        messages: [],
        inputMessage: '',
        socket: null
      };
    },
    mounted() {
      this.loadContacts();
      this.initWebSocket();
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.close();
      }
    },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    selectedContact() {
      return this.contacts.find(contact => contact.id === this.selectedContactId) || {};
    }
  },
  methods: {
    loadContacts() {
      // 从后端获取联系人列表
      this.$axios.get('/messages/contacts')
        .then(response => {
          this.contacts = response.data;
        })
        .catch(error => {
          console.error('加载联系人失败:', error);
          this.$message.error('加载联系人失败，请稍后重试');
        });
    },
    initWebSocket() {
      // 建立WebSocket连接
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws/chat`;
      this.socket = new WebSocket(wsUrl);

      // 监听连接建立
      this.socket.onopen = () => {
        console.log('WebSocket连接已建立');
      };

      // 监听消息接收
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // 检查是否是当前选中联系人的消息
        if (this.selectedContactId === message.contactId) {
          this.messages.push(message);
        } else {
          // 更新未读消息计数
          const contact = this.contacts.find(c => c.id === message.contactId);
          if (contact) {
            contact.unreadCount = (contact.unreadCount || 0) + 1;
            contact.lastMessage = message.content;
            contact.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
      };

      // 监听连接关闭
      this.socket.onclose = () => {
        console.log('WebSocket连接已关闭');
        // 可以在这里实现重连逻辑
        setTimeout(() => this.initWebSocket(), 3000);
      };

      // 监听错误
      this.socket.onerror = (event) => {
        console.error('WebSocket错误:', event);
        // 尝试获取更详细的错误信息
        let errorMessage = 'WebSocket连接错误，请检查服务器是否正常运行';
        if (event && event.message) {
          errorMessage += `: ${event.message}`;
        }
        this.$message.error(errorMessage);
      };
    },
    handleSelect(key) {
      switch(key) {
        case '1':
          this.$router.push('/');
          break;
        case '9':  // 发布职位
          this.$router.push('/company/PublishJob');  // 跳转到发布职位页面
          break;
        case '2':
          this.$router.push('/jobs');
          break;
        case '3':
          this.$router.push('/companies');
          break;
        case '4':
          if (this.$route.path !== '/chat') {
            this.$router.push('/chat');
          }
          break;
        case '5':
          this.$router.push('/forum');
          break;
        case '6':
          this.$router.push('/login');
          break;
        case '7':
          this.$router.push('/register');
          break;
        case '8-1':
          this.$router.push('/user');
          break;
        case '8-2':
          this.$router.push('/admin');
          break;
        default:
          return;
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
    selectContact(id) {
      this.selectedContactId = id;
      // 模拟加载聊天记录
      this.loadMessages(id);
      // 清空未读消息
      const contact = this.contacts.find(c => c.id === id);
      if (contact) {
        contact.unreadCount = 0;
      }
    },
    loadMessages(contactId) {
      // 从后端获取聊天记录
      this.$axios.get(`/messages/history/${contactId}`)
        .then(response => {
          this.messages = response.data;
        })
        .catch(error => {
          console.error('加载聊天记录失败:', error);
          this.$message.error('加载聊天记录失败，请稍后重试');
        });
    },
    sendMessage() {
      if (!this.inputMessage.trim()) return;
      const newMessage = {
        id: this.messages.length + 1,
        content: this.inputMessage,
        isSent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contactId: this.selectedContactId
      };
      this.messages.push(newMessage);
      this.inputMessage = '';

      // 通过WebSocket发送消息
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(newMessage));
      } else {
        this.$message.error('WebSocket连接未建立，无法发送消息');
      }
    }
  }
};
</script>

<style scoped>
.chat-room-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  border-top: 1px solid #eee;
}

.message-list {
  width: 300px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  align-items: center;
}

.contact-item:hover {
  background-color: #f5f5f5;
}

.contact-item.active {
  background-color: #e9f5ff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.contact-info {
  flex: 1;
  overflow: hidden;
}

.contact-name {
  font-weight: bold;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-message {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}

.unread-count {
  background-color: #ff4d4f;
  color: white;
  border-radius: 10px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.no-messages {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.no-messages-text {
  font-size: 18px;
  margin-bottom: 10px;
}

.no-messages-hint {
  font-size: 14px;
  text-align: center;
  max-width: 250px;
}

.message-wrapper {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message-bubble {
  max-width: 60%;
  padding: 10px;
  border-radius: 8px;
  word-break: break-word;
}

.sent {
  background-color: #95ec69;
  align-self: flex-end;
}

.received {
  background-color: white;
  align-self: flex-start;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.sent-time {
  align-self: flex-end;
}

.received-time {
  align-self: flex-start;
}

.message-input {
  padding: 10px;
  border-top: 1px solid #eee;
}

.send-button {
  text-align: right;
  margin-top: 10px;
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
}
</style>