<template>
  <div class="publish-job-container">
    <!-- 顶部导航栏 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <!-- 1. 首页 - 始终显示 -->
      <el-menu-item index="1">首页</el-menu-item>
      
      <!-- 2. 职位 - 非企业用户显示 -->
      <el-menu-item index="2" v-if="!isLoggedIn || currentUser.role !== 1">职位</el-menu-item>
      
      <!-- 3. 企业 - 非企业用户显示 -->
      <el-menu-item index="3" v-if="!isLoggedIn || currentUser.role !== 1">企业</el-menu-item>
      
      <!-- 4. 发布职位 - 仅企业用户显示 -->
      <el-menu-item index="9" v-if="isLoggedIn && currentUser.role === 1">发布职位</el-menu-item>
      
      <!-- 5. 消息 - 非管理员用户显示 -->
      <el-menu-item index="4" v-if="isLoggedIn && currentUser.role !== 2">消息</el-menu-item>
      
      <!-- 6. 论坛 - 仅登录的普通用户显示 -->
      <el-menu-item index="5" v-if="isLoggedIn && currentUser.role === 0">论坛</el-menu-item>
      
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
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-if="errorMessage" class="error-message">
      <el-alert :message="errorMessage" type="error" show-icon></el-alert>
    </div>
    <div class="page-header">
      <h1>发布新职位</h1>
      <p class="subtitle">填写以下信息，发布您的招聘职位</p>
    </div>

    <el-card class="publish-job-card">
      <!-- 公司信息预览 -->
      <div class="company-info" v-if="companyInfo">
        <img :src="'/default-company-logo.png'" alt="公司logo" class="company-logo">
        <div class="company-details">
          <h3>{{ companyInfo.name }}</h3>
          <p class="company-desc">{{ companyInfo.industry }} | {{ companyInfo.scale }} | {{ companyInfo.location }}</p>
        </div>
      </div>

      <el-form ref="jobForm" :model="jobForm" :rules="rules" label-width="120px" class="job-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="岗位名称" prop="title" class="required">
              <el-input v-model="jobForm.title" placeholder="请输入岗位名称" size="medium"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="薪资范围" prop="salary" class="required">
              <el-input v-model="jobForm.salary" placeholder="请输入薪资范围，如：10k-20k" size="medium"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作地点" prop="location" class="required">
              <el-input v-model="jobForm.location" placeholder="请输入工作地点" size="medium"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="职位类型" prop="jobType" class="required">
              <el-select v-model="jobForm.jobType" placeholder="请选择职位类型" size="medium">
                <el-option label="全职" value="full-time"></el-option>
                <el-option label="兼职" value="part-time"></el-option>
                <el-option label="实习" value="internship"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作经验" prop="experience" class="required">
              <el-select v-model="jobForm.experience" placeholder="请选择工作经验" size="medium">
                <el-option label="应届毕业生" value="fresh-graduate"></el-option>
                <el-option label="1年以下" value="less-than-1-year"></el-option>
                <el-option label="1-3年" value="1-3-years"></el-option>
                <el-option label="3-5年" value="3-5-years"></el-option>
                <el-option label="5-10年" value="5-10-years"></el-option>
                <el-option label="10年以上" value="more-than-10-years"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学历要求" prop="education" class="required">
              <el-select v-model="jobForm.education" placeholder="请选择学历要求" size="medium">
                <el-option label="大专" value="college"></el-option>
                <el-option label="本科" value="bachelor"></el-option>
                <el-option label="硕士" value="master"></el-option>
                <el-option label="博士" value="doctor"></el-option>
                <el-option label="不限" value="no-limit"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="招聘人数" prop="headcount">
              <el-input v-model="jobForm.headcount" placeholder="请输入招聘人数" size="medium"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="岗位描述" prop="description" class="required">
              <el-input type="textarea" v-model="jobForm.description" placeholder="请详细描述岗位职责和工作内容" :rows="5" size="medium"></el-input>
              <div class="form-hint">建议包含：工作职责、团队情况、项目介绍等信息</div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工作要求" prop="requirements" class="required">
              <el-input type="textarea" v-model="jobForm.requirements" placeholder="请详细描述任职要求" :rows="5" size="medium"></el-input>
              <div class="form-hint">建议包含：技能要求、经验要求、性格特质等信息</div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="福利待遇" prop="benefits">
              <el-input type="textarea" v-model="jobForm.benefits" placeholder="请输入福利待遇" :rows="3" size="medium"></el-input>
              <div class="form-hint">例如：五险一金、年终奖、带薪年假、节日福利等</div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="职位标签">
              <el-tag v-for="tag in jobForm.tags" :key="tag" closable @close="handleTagClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input
                v-model="inputTag"
                placeholder="输入标签，按回车添加"
                @keyup.enter.native="handleTagAdd"
                size="small"
                class="tag-input"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="form-actions">
            <el-button type="primary" @click="submitForm('jobForm')" size="medium">发布岗位</el-button>
            <el-button @click="resetForm('jobForm')" size="medium">重置</el-button>
            <el-button @click="$router.go(-1)" size="medium">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'PublishJob',
  data() {
    return {
      activeIndex: this.$route.path === '/company/PublishJob' ? '9' : '1',
      loading: false,
      errorMessage: '',
      jobForm: {
        title: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        education: '',
        headcount: '',
        description: '',
        requirements: '',
        benefits: '',
        tags: [],
        status: 1,
        companyId: '1' // 设置默认公司ID
      },
      inputTag: '',
      companyInfo: {}, // 初始化为空对象而非null
      rules: {
        title: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          { min: 2, max: 50, message: '岗位名称长度应在2-50个字符之间', trigger: 'blur' }
        ],
        salary: [
          { required: true, message: '请输入薪资范围', trigger: 'blur' },
          { pattern: /^[0-9]+k-[0-9]+k$/, message: '薪资范围格式应为：数字k-数字k', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入工作地点', trigger: 'blur' }
        ],
        jobType: [
          { required: true, message: '请选择职位类型', trigger: 'change' }
        ],
        experience: [
          { required: true, message: '请选择工作经验', trigger: 'change' }
        ],
        education: [
          { required: true, message: '请选择学历要求', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入岗位描述', trigger: 'blur' },
          { min: 10, message: '岗位描述至少10个字符', trigger: 'blur' }
        ],
        requirements: [
          { required: true, message: '请输入工作要求', trigger: 'blur' },
          { min: 10, message: '工作要求至少10个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser'])
  },
  watch: {
    '$route'(to) {
      this.activeIndex = to.path === '/company/PublishJob' ? '9' : '1';
    }
  },
  methods: {
    handleSelect(key) {
      // 先设置activeIndex
      this.activeIndex = key;
      
      switch(key) {
        case '1':
          this.$router.push('/');
          break;
        case '9':  // 发布职位
          this.$router.push('/company/PublishJob');
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
      if (this.$route.path !== '/') {
        this.$router.push('/');
      } else {
        window.location.reload();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 准备提交数据
          const jobData = {
            ...this.jobForm,
            // 确保companyId是数字类型
            companyId: Number(this.jobForm.companyId)
          };
          
          console.log('提交的职位数据:', jobData);
          
          // 提交表单数据
          this.$axios.post('/jobs', jobData)
            .then(response => {
              console.log('发布成功响应:', response);
              this.$message.success('岗位发布成功');
              this.$router.push('/company/jobs');
            })
            .catch(error => {
              console.error('发布失败错误:', error);
              this.$message.error('岗位发布失败: ' + (error.response?.data?.message || '服务器错误'));
            });
        } else {
          this.$message.warning('请完善表单信息');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.jobForm.tags = [];
      this.inputTag = '';
    },
    handleTagAdd() {
      if (this.inputTag && this.jobForm.tags.indexOf(this.inputTag) === -1) {
        this.jobForm.tags.push(this.inputTag);
      }
      this.inputTag = '';
    },
    handleTagClose(tag) {
      const index = this.jobForm.tags.indexOf(tag);
      if (index !== -1) {
        this.jobForm.tags.splice(index, 1);
      }
    },
    getCompanyInfo() {
      console.log('getCompanyInfo called');
      this.loading = true;
      console.log('Loading set to true');
      const companyId = this.jobForm.companyId;
      console.log('Company ID for API call:', companyId);
      console.log('API URL:', `/companies/${companyId}`);
      console.log('Axios base URL:', this.$axios.defaults.baseURL);
      this.$axios.get(`/companies/${companyId}`)
        .then(response => {
          console.log('Company info API response:', response);
          this.companyInfo = response.data;
          console.log('Company info set:', this.companyInfo);
          this.loading = false;
          console.log('Loading set to false');
        })
        .catch(error => {
          console.error('获取公司信息失败:', error);
          console.error('Error response:', error.response);
          this.errorMessage = '获取公司信息失败: ' + (error.response?.data?.message || '网络错误');
          console.log('Error message set:', this.errorMessage);
          this.loading = false;
          console.log('Loading set to false');
        });
    }
  },
  mounted() {
    // 检查用户是否登录且为企业角色
    console.log('PublishJob mounted - store.user:', this.$store.state.user);
    console.log('PublishJob mounted - localStorage.user:', localStorage.getItem('user'));
    console.log('PublishJob mounted - isLoggedIn:', this.$store.getters.isLoggedIn);
    
    try {
      // 暂时注释权限检查，用于测试
      /*if (!this.$store.state.user) {
        console.log('User not logged in');
        this.$message.error('请先登录');
        this.$router.push('/login');
      } else if (this.$store.state.user.role !== 1) {
        console.log('User role is not company:', this.$store.state.user.role);
        this.$message.error('您没有权限访问此页面');
        this.$router.push('/');
      } else */{
        console.log('Bypassing auth check for testing');
        // 模拟公司ID
        this.jobForm.companyId = 1;
        console.log('Company ID set to:', this.jobForm.companyId);
        // 获取公司信息
        this.getCompanyInfo();
      }
    } catch (error) {
      console.error('Error in mounted hook:', error);
      this.errorMessage = '页面加载失败: ' + error.message;
      console.log('Error message set:', this.errorMessage);
    }
    console.log('Mounted hook completed');
  }
};
</script>

<style scoped>
.publish-job-container {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-bottom: 20px;
}

.publish-job-container {
  padding-bottom: 50px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.page-header .subtitle {
  color: #666;
  font-size: 16px;
}

.publish-job-card {
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.company-info {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.company-logo {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 20px;
}

.company-details h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.company-desc {
  color: #666;
  font-size: 14px;
}

.job-form {
  padding: 0 20px 20px 20px;
}

.required .el-form-item__label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.form-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.tag-input {
  width: 160px;
  display: inline-block;
  margin-left: 10px;
}

.el-tag {
  margin-right: 10px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.form-actions .el-button {
  margin: 0 10px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .el-col {
    width: 100% !important;
  }

  .company-info {
    flex-direction: column;
    text-align: center;
  }

  .company-logo {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>