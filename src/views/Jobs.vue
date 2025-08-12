<template>
  <div class="jobs-container">
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
        <!-- 企业 - 仅在职位页面显示 -->
        <el-menu-item index="3" v-if="$route.path === '/jobs'">企业</el-menu-item>
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

    <el-card class="jobs-card">
      <div slot="header" class="clearfix">
        <span>全部在招职位</span>
      </div>
      <div class="jobs-list">
        <div
          v-for="job in jobs"
          :key="job.id"
          class="job-item"
          @click="goToJobDetail(job.id)"
        >
          <div class="job-company">{{job.company}}</div>
          <div class="job-title">{{job.title}}</div>
          <div class="job-info">
            <span class="job-salary">{{job.salary}}</span>
            <span class="job-location">{{job.location}}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JobList',
  data() {
    return {
      jobs: [],
      activeIndex: '2'
    };
  },
  created() {
    this.loadJobs();
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
      // 避免重复导航到当前路由
      const currentRoute = this.$router.currentRoute.path;
      let targetRoute = '';
      
      switch(key) {
        case '1':
          targetRoute = '/';
          break;
        case '9':  // 发布职位
          targetRoute = '/company/PublishJob';  // 跳转到发布职位页面
          break;
        case '2':
          targetRoute = '/jobs';
          break;
        case '3':
          targetRoute = '/companies';
          break;
        case '4':
          targetRoute = '/chat';
          break;
        case '5':
          targetRoute = '/forum';
          break;
        case '6':
          targetRoute = '/login';
          break;
        case '7':
          targetRoute = '/register';
          break;
        case '8-1':
          targetRoute = '/user';
          break;
        case '8-2':
          targetRoute = '/admin';
          break;
        default:
          return;
      }
      
      // 只有当目标路由与当前路由不同时才进行导航
      if (targetRoute && targetRoute !== currentRoute) {
        this.$router.push(targetRoute);
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
    loadJobs() {
      this.$axios.get('/jobs')
        .then(response => {
          this.jobs = response.data;
        })
        .catch(error => {
          console.error('获取职位数据失败:', error);
          this.$message.error('获取职位数据失败，请稍后重试');
        });
    },
    goToJobDetail(jobId) {
      this.$router.push(`/jobs/${jobId}`);
    }
  }
};
</script>

<style scoped>
.jobs-container {
  background-color: #f5f7fa;
}
.jobs-card {
  width: 100%;
}
.jobs-list {
  padding: 20px 0;
}
.job-item {
  padding: 20px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.job-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.job-company {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}
.job-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.job-info {
  display: flex;
  font-size: 14px;
}
.job-salary {
  color: #ff7e00;
  margin-right: 20px;
}
.job-location {
  color: #666;
}
</style>