<template>
  <div class="forum-container">
    <!-- 导航栏 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">职位</el-menu-item>
      <el-menu-item index="3">企业</el-menu-item>
      <el-menu-item index="4">消息</el-menu-item>
      <el-menu-item index="5">论坛</el-menu-item>
      <el-menu-item index="6" v-if="!isLoggedIn">登录</el-menu-item>
      <el-menu-item index="7" v-if="!isLoggedIn">注册</el-menu-item>
      <el-submenu index="8" v-if="isLoggedIn">
        <template slot="title">{{ currentUser.username }}</template>
        <el-menu-item index="8-1">个人中心</el-menu-item>
        <el-menu-item index="8-2" v-if="currentUser.role === 2">管理员面板</el-menu-item>
        <el-menu-item index="8-3" @click="logout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>

    <div class="forum-content">
      <!-- 发布动态区域 -->
      <div class="post-create">
        <el-card>
          <div slot="header" class="clearfix">
            <span>发布动态</span>
          </div>
          <div class="post-form">
            <el-input
              v-model="postContent"
              type="textarea"
              placeholder="分享你的求职经验、面试技巧或职场感悟..."
              :rows="4"
            ></el-input>
            <div class="post-actions">
              <el-button type="primary" @click="createPost">发布</el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 动态列表 -->
      <div class="posts-list">
        <h3>最新动态</h3>
        <el-card v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <img :src="post.userAvatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4='" alt="用户头像" class="user-avatar" :onerror="'this.src=\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4=\''">
            <div class="user-info">
              <div class="username">{{ post.username }}</div>
              <div class="post-time">{{ post.time }}</div>
            </div>
          </div>
          <div class="post-content">
            {{ post.content }}
          </div>
          <div class="post-actions">
            <div class="action-item" @click="toggleLike(post.id)">
              <i :class="{ 'el-icon-heart': !post.liked, 'el-icon-heart-on': post.liked }" :style="{ color: post.liked ? '#ff4d4f' : '' }"></i>
              <span>{{ post.likesCount }}</span>
            </div>
            <div class="action-item" @click="toggleComment(post.id)">
              <i class="el-icon-chat-dot-round"></i>
              <span>{{ (post.comments || []).length }}</span>
            </div>
          </div>
          <!-- 评论区域 -->
          <div class="comments-section" v-if="post.showComments">
            <div v-for="(comment, index) in (post.comments || [])" :key="comment?.id || index" class="comment-item">
              <img :src="comment?.userAvatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4='" alt="评论用户头像" class="comment-avatar" :onerror="'this.src=\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4=\''">
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username">{{ comment?.username || '未知用户' }}</span>
                  <span class="comment-time">{{ comment?.time || '未知时间' }}</span>
                </div>
                <div class="comment-text">{{ comment?.content || '' }}</div>
              </div>
            </div>
            <div class="add-comment">
              <el-input
                v-model="commentContent[post.id]"
                placeholder="添加评论..."
                @keyup.enter.native="addComment(post.id)"
              ></el-input>
              <el-button size="small" type="primary" @click="addComment(post.id)">发送</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumPage',
  data() {
    return {
      activeIndex: '5',
      postContent: '',
      commentContent: {},
      posts: []
    };
  },
  mounted() {
    // 组件挂载时加载最新动态
    this.loadPosts();
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn || true; // 模拟登录状态
    },
    currentUser() {
        return this.$store.getters.currentUser || { id: 1, username: '当前用户', role: 1 }; // 模拟用户数据，确保包含id
      }
  },
  methods: {
    // 加载最新动态
    loadPosts() {
      this.$axios.get('/forum/posts')
        .then(({ data }) => {
          // 确保posts数据正确，并且每个post都有comments数组
          // 从localStorage恢复showComments状态
          this.posts = data.map(post => ({
            ...post,
            comments: post.comments || [],
            showComments: JSON.parse(localStorage.getItem(`post_${post.id}_showComments`)) || false
          }));
          console.log('加载的帖子数据:', this.posts);
          // 加载每个帖子的评论
          this.posts.forEach(post => {
            this.loadComments(post.id);
          });
        })
        .catch(error => {
          console.error('加载动态失败:', error);
          console.error('错误详情:', error.response ? error.response.data : '无响应数据');
          this.$message.error(`加载动态失败: ${error.response ? error.response.data.message || '服务器内部错误' : '网络连接问题'}`);
        });
    },
    // 新增方法：专门加载特定帖子的评论
    loadComments(postId) {
      // 确保帖子存在
      const post = this.posts.find(p => p.id === postId);
      if (!post) {
        console.error(`帖子${postId}不存在，无法加载评论`);
        return;
      }

      this.$axios.get(`/forum/posts/${postId}/comments`)
        .then(({ data }) => {
          console.log(`加载的帖子${postId}评论数据:`, data);
          // 确保data是数组
          if (!Array.isArray(data)) {
            console.warn(`帖子${postId}的评论数据不是数组:`, data);
            data = [];
          }
          post.comments = data;
        })
        .catch(error => {
          console.error(`加载帖子${postId}评论失败:`, error);
        });
    },
    handleSelect(key) {
      switch(key) {
        case '1':
          this.$router.push('/');
          break;
        case '2':
          this.$router.push('/jobs');
          break;
        case '3':
          this.$router.push('/companies');
          break;
        case '4':
          this.$router.push('/chat');
          break;
        case '5':
          if (this.$route.path !== '/forum') {
            this.$router.push('/forum');
          }
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
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
    toggleLike(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        // 先更新本地状态
        const newLikedState = !post.liked;
        const likeChange = newLikedState ? 1 : -1;
        post.liked = newLikedState;
        post.likesCount += likeChange;

        // 调用后端API同步点赞状态
        this.$axios.post(`/forum/posts/${postId}/like`, { liked: newLikedState })
          .catch(error => {
            console.error('更新点赞状态失败:', error);
            // 失败时回滚本地状态
            post.liked = !newLikedState;
            post.likesCount -= likeChange;
            this.$message.error('更新点赞状态失败，请重试');
          });
      }
    },
    toggleComment(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.showComments = !post.showComments;
        // 保存评论显示状态到localStorage
        localStorage.setItem(`post_${postId}_showComments`, JSON.stringify(post.showComments));
        // 初始化评论输入框，使用$set确保响应式
        if (!this.commentContent[postId]) {
          this.$set(this.commentContent, postId, '');
        }
        // 显示评论时加载最新评论数据
        if (post.showComments) {
          this.loadComments(postId);
        }
      }
    },
    addComment(postId) {
        // 确保commentContent[postId]已初始化，使用$set确保响应式
        if (!this.commentContent[postId]) {
          this.$set(this.commentContent, postId, '');
        }
        const content = this.commentContent[postId];
        if (!content.trim()) {
          this.$message.warning('评论内容不能为空');
          return;
        }

        // 确保currentUser有id属性
        if (!this.currentUser.id) {
          console.error('用户ID不存在，无法添加评论');
          this.$message.error('用户信息不完整，请重新登录');
          return;
        }

        // 获取当前帖子
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
          this.$message.error('找不到指定帖子');
          return;
        }

        // 确保post.comments是一个数组
        if (!Array.isArray(post.comments)) {
          post.comments = [];
        }

        // 创建临时评论对象（显示用户输入的内容）
        const tempComment = {
          id: Date.now(), // 临时ID
          content: content,
          username: this.currentUser.username,
          userAvatar: this.currentUser.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4=', // 使用用户头像或默认头像
          time: new Date().toLocaleString(),
          isTemp: true // 标记为临时评论
        };

        // 先添加临时评论到本地
        post.comments.push(tempComment);
        this.commentContent[postId] = '';

      // 调用后端API添加评论，包含用户ID
      this.$axios.post(`/forum/posts/${postId}/comments`, {
        content,
        userId: this.currentUser.id
      })
        .then(({ data }) => {
          console.log('后端返回的评论数据:', data);
          const post = this.posts.find(p => p.id === postId);
          if (post) {
            // 确保post.comments是一个数组
            if (!Array.isArray(post.comments)) {
              post.comments = [];
            }
            // 查找并替换临时评论
            const tempIndex = post.comments.findIndex(comment => comment.isTemp);
            if (tempIndex !== -1) {
              // 确保替换的评论内容与用户输入一致
              // 确保评论有时间字段，优先使用后端返回的时间，如果没有则使用临时评论的时间
              const updatedComment = {
                ...data,
                content: post.comments[tempIndex].content,
                time: data.time || post.comments[tempIndex].time
              };
              post.comments.splice(tempIndex, 1, updatedComment);
            } else {
              // 如果没有找到临时评论，直接添加，并确保有时间字段
            post.comments.push({
              ...data,
              time: data.time || new Date().toLocaleString()
            });
            }
            this.$message.success('评论成功');
          }
        })
        .catch(error => {
          console.error('添加评论失败:', error);
          this.$message.error('添加评论失败，请重试');
        });
    },
    // 发布新动态
    createPost() {
      console.log('当前用户信息:', this.currentUser);
      console.log('用户ID:', this.currentUser.id);
      
      if (!this.currentUser || !this.currentUser.id) {
        console.error('用户未登录或用户信息不完整');
        this.$message.error('请先登录');
        return;
      }
      if (!this.postContent.trim()) {
        this.$message.warning('动态内容不能为空');
        return;
      }

      const postData = {
        content: this.postContent,
        userId: this.currentUser.id
      };
      console.log('发送的请求数据:', postData);
      
      this.$axios.post('/forum/posts', postData)
        .then(() => {
          // 成功发布后，重新加载动态列表
          this.loadPosts();
          this.postContent = '';
          this.$message.success('发布成功');
        })
        .catch(error => {
          console.error('发布动态失败:', error);
          console.error('错误详情:', error.response ? error.response.data : '无响应数据');
          this.$message.error(`发布动态失败: ${error.response ? error.response.data.message || '服务器内部错误' : '网络连接问题'}`);
        });
    }
  }
}
</script>

<style scoped>
.forum-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.forum-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}

.post-create {
  margin-bottom: 30px;
}

.post-form {
  margin-top: 15px;
}

.post-actions {
  text-align: right;
  margin-top: 10px;
}

.posts-list h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.post-card {
  margin-bottom: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: bold;
  margin-bottom: 2px;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.action-item i {
  margin-right: 5px;
}

.comments-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.comment-item {
  display: flex;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-content {
  flex: 1;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-username {
  font-weight: bold;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
}

.add-comment {
  display: flex;
  margin-top: 15px;
}

.add-comment .el-input {
  flex: 1;
  margin-right: 10px;
}
</style>