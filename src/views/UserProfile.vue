<template>
  <div class="user-profile-container">
    <!-- 导航栏 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <!-- 首页 - 始终显示 -->
      <el-menu-item index="1">首页</el-menu-item>
      
      <!-- 企业用户导航项 -->
      <template v-if="isLoggedIn && currentUser.role === 1 && currentUser.role !== 2">
        <!-- 2. 发布职位 - 仅企业用户显示 -->
        <el-menu-item index="9">发布职位</el-menu-item>
        <!-- 3. 消息 - 企业用户显示 -->
        <el-menu-item index="4" v-if="isLoggedIn && currentUser.role !== 2">消息</el-menu-item>
      </template>
      
      <!-- 非企业用户导航项 -->
      <template v-if="!isLoggedIn || currentUser.role !== 1">
        <el-menu-item index="2">职位</el-menu-item>
        <el-menu-item index="3">企业</el-menu-item>
        <el-menu-item index="4" v-if="isLoggedIn && currentUser.role !== 2">消息</el-menu-item>
        <el-menu-item index="5">论坛</el-menu-item>
      </template>
      
      <!-- 用户下拉菜单 - 所有登录用户显示 -->
      <el-submenu index="6" v-if="isLoggedIn">
        <template slot="title">{{ currentUser.username }}</template>
        <el-menu-item index="6-1" class="active">个人中心</el-menu-item>
        <el-menu-item index="6-2" v-if="currentUser.role === 2">管理员面板</el-menu-item>
        <el-menu-item index="6-3" @click="logout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>

    <div class="profile-content">
      <el-card class="profile-card">
        <div slot="header" class="clearfix">
          <span>个人资料</span>
        </div>
        <div class="profile-info">
          <div class="avatar-container">
            <img :src="userAvatar" alt="用户头像" class="avatar">
            <el-button type="primary" size="small" @click="uploadAvatar">更换头像</el-button>
            <input type="file" ref="avatarInput" style="display: none;" accept="image/*" @change="handleAvatarUpload">
          </div>
          <div class="user-details">
            <el-form ref="userForm" :model="userForm" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="角色">
                <el-input v-model="userRole" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-card class="settings-card" v-if="isJobSeeker">
        <div slot="header" class="clearfix">
          <span>求职意向</span>
        </div>
        <el-form ref="jobPreferenceForm" :model="jobPreferenceForm" label-width="100px">
          <el-form-item label="期望职位">
            <el-input v-model="jobPreferenceForm.expectedPosition"></el-input>
          </el-form-item>
          <el-form-item label="期望薪资">
            <el-input v-model="jobPreferenceForm.expectedSalary"></el-input>
          </el-form-item>
          <el-form-item label="期望城市">
            <el-input v-model="jobPreferenceForm.expectedLocation"></el-input>
          </el-form-item>
          <el-form-item label="工作经验">
            <el-select v-model="jobPreferenceForm.workExperience" placeholder="请选择工作经验">
              <el-option label="应届毕业生" value="0"></el-option>
              <el-option label="1年以内" value="1"></el-option>
              <el-option label="1-3年" value="2"></el-option>
              <el-option label="3-5年" value="3"></el-option>
              <el-option label="5年以上" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitJobPreferenceForm('jobPreferenceForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="resume-card" v-if="isJobSeeker">
        <div slot="header" class="clearfix">
          <span>我的简历</span>
        </div>
        <div class="resume-upload">
          <el-upload
            class="upload-resume"
              action="" 
             :http-request="uploadResume"
              :on-success="handleResumeUploadSuccess"
            :on-error="handleResumeUploadError"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">上传简历</el-button>
          </el-upload>
          <div v-if="resumeUrl" class="resume-download">
            <p>已上传简历: <a :href="resumeUrl" target="_blank">查看简历</a></p>
          </div>
        </div>
      </el-card>

      <el-card class="applications-card" v-if="isJobSeeker">
        <div slot="header" class="clearfix">
          <span>我的申请</span>
        </div>
        <el-table :data="jobApplications" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="jobTitle" label="职位名称" width="200"></el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="200"></el-table-column>
          <el-table-column prop="status" label="申请状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" style="color: #999">待处理</span>
              <span v-if="scope.row.status === 1" style="color: #1890ff">已查看</span>
              <span v-if="scope.row.status === 2" style="color: #52c41a">面试邀请</span>
              <span v-if="scope.row.status === 3" style="color: #ff4d4f">已拒绝</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" width="180"></el-table-column>
        </el-table>
      </el-card>

      <el-card class="posted-jobs-card" v-if="isCompany">
        <div slot="header" class="clearfix">
          <span>我发布的职位</span>
          <el-button type="primary" size="small" @click="goToPublishJob">发布新职位</el-button>
        </div>
        <el-table :data="postedJobs" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="职位名称" width="200"></el-table-column>
          <el-table-column prop="salary" label="薪资范围" width="120"></el-table-column>
          <el-table-column prop="location" label="工作地点" width="120"></el-table-column>
          <el-table-column prop="applications" label="申请数" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" style="color: #52c41a">已发布</span>
              <span v-if="scope.row.status === 0" style="color: #999">未发布</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editJob(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteJob(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      activeIndex: '6-1',
      userForm: {
        username: '',
        email: '',
        phone: ''
      },
      userRole: '',
      userAvatar: 'https://picsum.photos/200/200?random=1',
      isJobSeeker: false,
      isCompany: false,
      jobPreferenceForm: {
        expectedPosition: '',
        expectedSalary: '',
        expectedLocation: '',
        workExperience: ''
      },
      resumeUrl: '',
      jobApplications: [
        { id: 1, jobTitle: '前端开发工程师', companyName: '科技有限公司', status: 2, applyTime: '2023-06-15 10:30' },
        { id: 2, jobTitle: '后端开发工程师', companyName: '互联网有限公司', status: 1, applyTime: '2023-06-14 09:15' },
        { id: 3, jobTitle: '产品经理', companyName: '软件有限公司', status: 0, applyTime: '2023-06-12 14:45' }
      ],
      postedJobs: [
        { id: 1, title: '前端开发工程师', salary: '15k-25k', location: '北京', applications: 24, status: 1 },
        { id: 2, title: 'UI设计师', salary: '12k-20k', location: '上海', applications: 18, status: 1 },
        { id: 3, title: '后端开发工程师', salary: '18k-30k', location: '广州', applications: 32, status: 0 }
      ]
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.loadUserInfo();
      this.checkUserRole();
      if (this.isJobSeeker) {
        this.loadJobApplications();
        this.loadResumeInfo();
      } else if (this.isCompany) {
        this.loadPostedJobs();
      } else {
        // 确保求职者角色时加载简历信息
        this.loadResumeInfo();
      }
    } else {
      this.$router.push('/login');
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
        case '6-2':
          this.$router.push('/admin');
          break;
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
    loadUserInfo() {
      // 从API获取用户信息
      this.$axios.get('/user/profile')
        .then(({ data }) => {
          const user = data;
          this.userForm.username = user.username;
          this.userForm.email = user.email || '';
          this.userForm.phone = user.phone || '';
          this.userAvatar = user.avatar ? 'http://localhost:8081/api' + user.avatar : 'https://picsum.photos/200/200?random=1';
          
          // 设置用户角色显示
          if (user.role === 0) {
            this.userRole = '求职者';
          } else if (user.role === 1) {
            this.userRole = '企业';
          } else if (user.role === 2) {
            this.userRole = '管理员';
          }
        })
        .catch(error => {
          console.error('加载用户信息失败:', error);
          this.$message.error('加载用户信息失败');
        });

      // 加载求职意向
      this.loadJobPreference();
    },

    loadJobPreference() {
      this.$axios.get('/user/job-preference')
        .then(({ data }) => {
          this.jobPreferenceForm = data;
        })
        .catch(error => {
          console.error('加载求职意向失败:', error);
          this.$message.error('加载求职意向失败');
        });
    },
    checkUserRole() {
      const role = this.currentUser.role;
      this.isJobSeeker = role === 0;
      this.isCompany = role === 1;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/profile/update', this.userForm)
            .then(() => {
              this.$message.success('个人信息更新成功');
              // 更新store中的用户信息
              this.$store.dispatch('updateUserInfo', this.userForm);
            })
            .catch(error => {
              console.error('更新个人信息失败:', error);
              this.$message.error('更新个人信息失败，请稍后重试');
            });
        } else {
          return false;
        }
      });
    },
    uploadAvatar() {
      this.$refs.avatarInput.click();
    },
    handleAvatarUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        
          this.$axios.post('/user/avatar/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        .then(({ data }) => {
          this.userAvatar = 'http://localhost:8081/api' + data.avatarUrl;
          this.$message.success('头像上传成功');
          // 更新store中的头像信息
          this.$store.commit('setUser', { ...this.currentUser, avatar: this.userAvatar });
        })
        .catch(error => {
          console.error('头像上传失败:', error);
          this.$message.error('头像上传失败，请稍后重试');
        });
        
        // 清空input值，以便能重复上传同一文件
        e.target.value = '';
      }
    },
    submitJobPreferenceForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/job-preference', this.jobPreferenceForm)
            .then(() => {
              this.$message.success('求职意向保存成功');
            })
            .catch(error => {
              console.error('保存求职意向失败:', error);
              this.$message.error('保存求职意向失败，请稍后重试');
            });
        } else {
          return false;
        }
      });
    },
    handleResumeUploadSuccess(response) {
      if (response.resumeUrl) {
        this.resumeUrl = 'http://localhost:8081/api' + response.resumeUrl;
        // 保存到本地存储
        localStorage.setItem('resumeUrl', this.resumeUrl);
        this.$message.success('简历上传成功');
      } else {
        this.$message.error('简历URL获取失败');
      }
    },
    uploadResume(params) {
      const formData = new FormData();
      formData.append('resume', params.file);
      
      this.$axios.post('/user/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        params.onSuccess(response.data);
      })
      .catch(error => {
        params.onError(error);
      });
    },
    handleResumeUploadError() {
      this.$message.error('简历上传失败，请重试');
    },
    loadJobApplications() {
      // 模拟API调用获取职位申请列表
      // 实际项目中应替换为真实API调用
    },
    loadResumeInfo() {
      this.$axios.get('/user/resume')
        .then(({ data }) => {
          if (data.resumeUrl) {
            this.resumeUrl = 'http://localhost:8081/api' + data.resumeUrl;
            // 保存到本地存储
            localStorage.setItem('resumeUrl', this.resumeUrl);
          } else {
            // 从本地存储获取
            const savedResumeUrl = localStorage.getItem('resumeUrl');
            this.resumeUrl = savedResumeUrl || null;
            if (!savedResumeUrl) {
              console.log('未找到简历信息');
            }
          }
        })
        .catch(error => {
          console.error('加载简历信息失败:', error);
          // 从本地存储获取
          this.resumeUrl = localStorage.getItem('resumeUrl') || null;
        });
    },
    loadPostedJobs() {
      // 模拟API调用获取已发布职位
      // 实际项目中应替换为真实API调用
    },
    goToPublishJob() {
      this.$router.push('/company/publish-job');
    },
    editJob(id) {
      // 跳转到编辑职位页面
      this.$router.push(`/company/edit-job/${id}`);
    },
    deleteJob(id) {
      this.$confirm('确定要删除该职位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API调用删除职位
        setTimeout(() => {
          this.postedJobs = this.postedJobs.filter(job => job.id !== id);
          this.$message.success('职位删除成功');
        }, 500);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
};
</script>

<style scoped>
.user-profile-container {
  padding-bottom: 30px;
}

.profile-content {
  padding: 20px;
}

.profile-card,
.settings-card,
.resume-card,
.applications-card,
.posted-jobs-card {
  margin-bottom: 20px;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
}

.applications-card .el-card__body,
.posted-jobs-card .el-card__body {
  padding-left: 0;
  padding-right: 0;
}

.applications-card .el-table,
.posted-jobs-card .el-table {
  width: 100% !important;
}

.profile-info {
  display: flex;
  padding: 20px 0;
}

.avatar-container {
  flex: 0 0 200px;
  text-align: center;
  margin-right: 40px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.user-details {
  flex: 1;
}

.resume-upload {
  padding: 20px 0;
}

.resume-download {
  margin-top: 10px;
}

.posted-jobs-card .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>