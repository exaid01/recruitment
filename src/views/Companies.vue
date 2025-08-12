<template>
  <div class="companies-container">
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

    <el-card class="companies-card">
      <div slot="header" class="clearfix">
        <span>全部企业</span>
      </div>
      <div class="companies-list">
        <div
          v-for="company in companies"
          :key="company.id"
          class="company-item"
          @click="goToCompanyDetail(company.id)"
        >
          <div class="company-name">{{company.name}}</div>
          <div class="company-location">{{company.location}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CompanyList',
  data() {
    return {
      companies: [],
      activeIndex: '3'
    };
  },
  created() {
    this.loadCompanies();
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    }
  },
  methods: {
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
          this.$router.push('/chat');
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
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
    loadCompanies() {
      this.$axios.get('/companies')
        .then(response => {
          this.companies = response.data;
        })
        .catch(error => {
          console.error('获取企业数据失败:', error);
          this.$message.error('获取企业数据失败，请稍后重试');
        });
    },
    goToCompanyDetail(companyId) {
      this.$router.push(`/companies/${companyId}`);
    }
  }
};
</script>

<style scoped>
.companies-container {
  background-color: #f5f7fa;
}
.companies-card {
  width: 100%;
}
.companies-list {
  padding: 20px 0;
}
.company-item {
  padding: 20px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.company-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.company-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.company-location {
  font-size: 14px;
  color: #666;
}
</style>