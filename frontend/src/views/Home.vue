<template>
  <div class="home">
    <!-- 导航栏 - 固定顺序 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <!-- 1. 首页 - 始终显示 -->
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
        <!-- 2. 职位 - 非企业用户显示 -->
        <el-menu-item index="2">职位</el-menu-item>
        <!-- 3. 企业 - 非企业用户显示 -->
        <el-menu-item index="3">企业</el-menu-item>
        <!-- 4. 消息 - 非管理员用户显示 -->
        <el-menu-item index="4" v-if="isLoggedIn && currentUser.role !== 2">消息</el-menu-item>
        <!-- 5. 论坛 - 仅登录的普通用户显示 -->
        <el-menu-item index="5" v-if="isLoggedIn && currentUser.role === 0">论坛</el-menu-item>
      </template>
      
      <!-- 7. 登录 - 非登录用户显示 -->
      <el-menu-item index="6" v-if="!isLoggedIn">登录</el-menu-item>
      
      <!-- 8. 注册 - 非登录用户显示 -->
      <el-menu-item index="7" v-if="!isLoggedIn">注册</el-menu-item>
      
      <!-- 9. 用户下拉菜单 - 所有登录用户显示 -->
      <el-submenu index="8" v-if="isLoggedIn">
        <template slot="title">{{ currentUser.username }}</template>
        <el-menu-item index="8-1">个人中心</el-menu-item>
        <el-menu-item index="8-2" v-if="currentUser.role === 2">管理员面板</el-menu-item>
        <el-menu-item index="8-3" @click="logout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>

    <!-- 轮播图 -->
    <el-carousel height="400px">
      <el-carousel-item v-for="item in 3" :key="item">
        <img :src="`https://picsum.photos/1200/400?random=${item}`" alt="轮播图" style="width: 100%; height: 100%; object-fit: cover;">
      </el-carousel-item>
    </el-carousel>

    <!-- 搜索框 -->
    <div class="search-container" style="margin: 30px; text-align: center;">
      <el-input v-model="searchKeyword" placeholder="搜索职位或公司" style="width: 50%;">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>

    <!-- 企业类型选择器 -->
    <div class="hot-companies">
      <h2>企业类型选择</h2>
      <el-tabs v-model="activeType" @tab-click="handleTypeChange">
        <el-tab-pane label="全部企业" name="all"></el-tab-pane>
        <el-tab-pane label="互联网IT" name="internet"></el-tab-pane>
        <el-tab-pane label="金融管理" name="finance"></el-tab-pane>
        <el-tab-pane label="硬件设备" name="hardware"></el-tab-pane>
        <el-tab-pane label="教育培训" name="education"></el-tab-pane>
        <el-tab-pane label="医疗健康" name="healthcare"></el-tab-pane>
        <el-tab-pane label="电子商务" name="ecommerce"></el-tab-pane>
        <el-tab-pane label="文化传媒" name="media"></el-tab-pane>
        <el-tab-pane label="房地产" name="realestate"></el-tab-pane>
        <el-tab-pane label="制造业" name="manufacturing"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="6" v-for="company in filteredCompanies" :key="company.id">
          <el-card class="company-card">
            <div class="company-info">
              <img :src="company.logo || `https://picsum.photos/200/200?random=${company.id}`" alt="企业logo" class="company-logo">
              <h3>{{ company.name }}</h3>
              <p>{{ company.industry }}</p>
              <p>{{ company.scale }}</p>
            </div>
            <el-button type="primary" size="small" @click="goToCompanyDetail(company.id)">查看详情</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 热门岗位 -->
    <div class="hot-jobs">
      <h3>热门岗位</h3>
      <div class="job-list">
        <el-card class="job-card" v-for="job in hotJobs" :key="job.id" @click="goToJobDetail(job.id)">
          <div class="job-info">
            <h4>{{ job.title }}</h4>
            <div class="job-meta">
              <span class="salary">{{ job.salary }}</span>
              <span>{{ job.location }}</span>
            </div>
            <div class="company-name">{{ job.company }}</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 热门企业 -->
    <div class="hot-companies">
      <h2>热门企业</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="company in hotCompanies" :key="company.id">
          <el-card class="company-card">
            <div class="company-info">
              <img :src="company.logo || `https://picsum.photos/200/200?random=${company.id}`" alt="企业logo" class="company-logo">
              <h3>{{ company.name }}</h3>
              <p>{{ company.industry }}</p>
              <p>{{ company.scale }}</p>
            </div>
            <el-button type="primary" size="small" @click="goToCompanyDetail(company.id)">查看详情</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      activeIndex: '1',
      activeType: 'all',
      searchKeyword: '',
      hotJobs: [],
      hotCompanies: []
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    filteredCompanies() {
      if (this.activeType === 'all') {
        return this.hotCompanies;
      } else if (this.activeType === 'internet') {
        return this.hotCompanies.filter(company => company.industry === '互联网' || company.industry === '软件' || company.industry === '科技');
      } else if (this.activeType === 'finance') {
        return this.hotCompanies.filter(company => company.industry === '金融');
      } else if (this.activeType === 'hardware') {
        return this.hotCompanies.filter(company => company.industry === '硬件');
      } else if (this.activeType === 'education') {
        return this.hotCompanies.filter(company => company.industry === '教育');
      } else if (this.activeType === 'healthcare') {
        return this.hotCompanies.filter(company => company.industry === '医疗');
      } else if (this.activeType === 'ecommerce') {
        return this.hotCompanies.filter(company => company.industry === '电商');
      } else if (this.activeType === 'media') {
        return this.hotCompanies.filter(company => company.industry === '文化');
      } else if (this.activeType === 'realestate') {
        return this.hotCompanies.filter(company => company.industry === '房地产');
      } else if (this.activeType === 'manufacturing') {
        return this.hotCompanies.filter(company => company.industry === '制造' || company.industry === '物流' || company.industry === '餐饮' || company.industry === '零售');
      }
      return this.hotCompanies;
    }
  },
  mounted() {
    // 获取热门职位
    this.$axios.get('/jobs/hot')
      .then(response => {
        this.hotJobs = response.data;
      })
      .catch(error => {
        console.error('获取热门职位失败:', error);
        this.$message.error('获取热门职位失败，请重试');
      });

    // 获取热门企业
    this.$axios.get('/companies/hot')
      .then(response => {
        this.hotCompanies = response.data;
      })
      .catch(error => {
        console.error('获取热门企业失败:', error);
        this.$message.error('获取热门企业失败，请重试');
      });
  },

  methods: {
    handleTypeChange(tab) {
      this.activeType = tab.name;
      // 根据行业类型获取企业
      if (tab.name !== 'all') {
        // 获取行业列表
        const industries = this.getIndustryNames(tab.name);
        if (industries.length > 1) {
          // 多行业查询
          this.$axios.post('/companies/industries', industries)
            .then(response => {
              this.hotCompanies = response.data;
            })
            .catch(error => {
              console.error('获取企业失败:', error);
              this.$message.error('获取企业失败，请重试');
            });
        } else {
          // 单行业查询
          this.$axios.get('/companies/industry', {
            params: {
              industry: industries[0]
            }
          })
          .then(response => {
            this.hotCompanies = response.data;
          })
          .catch(error => {
            console.error('获取企业失败:', error);
            this.$message.error('获取企业失败，请重试');
          });
        }
      } else {
        // 获取所有热门企业
        this.$axios.get('/companies/hot')
          .then(response => {
            this.hotCompanies = response.data;
          })
          .catch(error => {
            console.error('获取热门企业失败:', error);
            this.$message.error('获取热门企业失败，请重试');
          });
      }
    },

    getIndustryNames(type) {
      switch(type) {
        case 'internet': return ['互联网', '软件', '科技'];
        case 'finance': return ['金融'];
        case 'hardware': return ['硬件'];
        case 'education': return ['教育'];
        case 'healthcare': return ['医疗'];
        case 'ecommerce': return ['电商'];
        case 'media': return ['文化'];
        case 'realestate': return ['房地产'];
        case 'manufacturing': return ['制造', '物流', '餐饮', '零售'];
        default: return [];
      }
    },
    search() {
      if (!this.searchKeyword.trim()) {
        this.$message.warning('请输入搜索关键词');
        return;
      }

      this.$axios.get('/search', {
        params: {
          keyword: this.searchKeyword
        }
      })
      .then(response => {
        const { jobs, companies } = response.data;
        // 更新热门职位和企业数据
        this.hotJobs = jobs || [];
        this.hotCompanies = companies || [];
        this.$message.success('搜索成功');
      })
      .catch(error => {
        console.error('搜索失败:', error);
        this.$message.error('搜索失败，请重试');
      });
    },

    handleSelect(key) {
      switch(key) {
        case '1':
          this.$router.push('/');
          break;
        case '9':  // 发布职位
          this.$router.push('/company/PublishJob');  // 跳转到发布职位页面假设发布职位的路由是/post-job
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
      // 避免重复导航到当前页面
      if (this.$route.path !== '/') {
        this.$router.push('/');
      } else {
        // 如果已经在首页，刷新页面
        window.location.reload();
      }
    },
    goToJobDetail(id) {
      this.$router.push(`/jobs/${id}`);
    },
    goToCompanyDetail(id) {
      this.$router.push(`/companies/${id}`);
    },
    getHotJobs() {
      this.$axios.get('/jobs')
        .then(response => {
          // 模拟企业名称，实际项目中需要关联企业表
          this.hotJobs = response.data.map(job => ({
            ...job,
            company: '企业名称 ' + Math.floor(Math.random() * 100)
          }));
        })
        .catch(error => {
          console.error('获取岗位失败:', error);
        });
    }
  }
}
</script>

<style scoped>
.hot-companies h2 {
  font-size: 24px;
  font-weight: bold;
}

.el-tabs__item {
  font-size: 56px;
}
</style>

<style scoped>
.home {
  padding-bottom: 50px;
}
.el-row {
  margin: 20px 0;
}
.hot-jobs,
.hot-companies {
  margin: 50px 30px;
}
.job-card,
.company-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.job-info,
.company-info {
  margin-bottom: 15px;
}
.company-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 15px;
}

.job-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
}

.job-card {
  width: 30%;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.job-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.salary {
  color: #ff7e00;
  font-weight: bold;
}
</style>