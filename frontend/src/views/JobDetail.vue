<template>
  <div class="job-detail-container">
    <el-card class="job-detail-card">
      <div slot="header" class="clearfix">
        <span>岗位详情</span>
      </div>
      <div v-if="job" class="job-detail-content">
        <div class="job-basic-info">
          <h2>{{job.title}}</h2>
          <div class="job-meta">
            <span class="salary">{{job.salary}}</span>
            <span>{{job.location}}</span>
          </div>
          <div class="company-info">
            <h3>{{job.companyName}}</h3>
          </div>
        </div>

        <div class="job-description">
          <h3>岗位描述</h3>
          <p>{{job.description}}</p>
        </div>

        <div class="job-requirements">
          <h3>工作要求</h3>
          <p>{{job.requirements}}</p>
        </div>

        <div class="job-benefits">
          <h3>福利待遇</h3>
          <p>{{job.benefits}}</p>
        </div>

        <div class="job-actions">
          <el-upload
            class="upload-resume"
            action="/api/resumes/upload"
            :headers="getAuthHeaders()"
            :data="{ jobId: job.id }"
            accept=".pdf,.doc,.docx,.jpg,.png"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :show-file-list="false"
          >
            <el-button type="primary">上传简历</el-button>
          </el-upload>
          <el-button type="primary" v-if="isCompany && isCurrentCompany">编辑岗位</el-button>
          <el-button type="danger" v-if="isCompany && isCurrentCompany">下架岗位</el-button>
        </div>
      </div>
      <div v-else class="loading">
        <el-loading-spinner></el-loading-spinner>
        <p>加载中...</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JobDetail',
  data() {
    return {
      job: null,
      isJobSeeker: false,
      isCompany: false,
      isCurrentCompany: false
    };
  },
  created() {
    this.getJobDetail();
    this.checkUserRole();
  },
  methods: {
    getJobDetail() {
      const jobId = this.$route.params.id;
      // 模拟数据，实际项目中替换为API调用
      const hotJobs = [
        { id: 1, title: '前端开发工程师', company: '科技有限公司', salary: '15k-25k', location: '北京', description: '负责公司网站和移动端应用的前端开发工作，参与产品需求讨论和技术方案设计。', requirements: '本科及以上学历，计算机相关专业，2年以上前端开发经验，熟悉Vue、React等框架。', benefits: '五险一金，年终奖，定期团建，弹性工作。' },
        { id: 2, title: '后端开发工程师', company: '互联网有限公司', salary: '18k-30k', location: '上海', description: '负责公司核心系统的后端开发和维护，设计数据库结构和API接口。', requirements: '本科及以上学历，计算机相关专业，3年以上后端开发经验，熟悉Java、Spring Boot等技术。', benefits: '五险一金，股票期权，带薪年假，节日福利。' },
        { id: 3, title: '产品经理', company: '软件有限公司', salary: '20k-35k', location: '广州', description: '负责产品的需求分析、功能规划和项目管理，协调研发、设计和测试团队。', requirements: '本科及以上学历，2年以上产品经理经验，有互联网产品经验者优先。', benefits: '五险一金，绩效奖金，定期培训，晋升空间大。' },
        { id: 4, title: 'UI设计师', company: '设计有限公司', salary: '12k-22k', location: '深圳', description: '负责产品的界面设计和用户体验优化，参与产品设计讨论和用户研究。', requirements: '本科及以上学历，设计相关专业，2年以上UI设计经验，熟练使用Figma、Sketch等工具。', benefits: '五险一金，创意奖金，定期体检，员工旅游。' }
      ];
      this.job = hotJobs.find(job => job.id === parseInt(jobId));
      if (this.job) {
        this.job.companyName = this.job.company;
        this.checkIsCurrentCompany();
      } else {
        this.$message.error('未找到该岗位信息');
      }
    },
    checkUserRole() {
      if (this.$store.getters.isLoggedIn) {
        const role = this.$store.state.user.role;
        this.isJobSeeker = role === 0;
        this.isCompany = role === 1;
      }
    },
    checkIsCurrentCompany() {
      if (this.isCompany && this.job) {
        this.isCurrentCompany = this.$store.state.user.id === this.job.companyId;
      }
    },
    handleUploadSuccess() {
      this.$message.success('简历上传成功！');
      
      // 只有求职者才需要创建聊天室
      if (this.isJobSeeker && this.job && this.job.companyId) {
        // 调用创建聊天室的API
        this.$axios.post('/api/chats/create', {
          companyId: this.job.companyId
        })
        .then(() => {
          this.$message.success('已成功建立与企业的聊天通道！');
        })
        .catch(error => {
          console.error('创建聊天室失败:', error);
          this.$message.error('建立聊天通道失败，请稍后重试');
        });
      }
    },
    handleUploadError(error) {
      this.$message.error('简历上传失败，请重试。');
      console.error('Upload error:', error);
    },
    getAuthHeaders() {
      return { Authorization: `Bearer ${window.localStorage ? window.localStorage.getItem('token') : ''}` };
    },
  }
};
</script>

<style scoped>
.job-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
}
.job-detail-card {
  max-width: 800px;
  margin: 0 auto;
}
.job-detail-content {
  padding: 20px;
}
.job-basic-info {
  margin-bottom: 30px;
}
.job-basic-info h2 {
  font-size: 24px;
  margin-bottom: 15px;
}
.job-meta {
  display: flex;
  margin-bottom: 15px;
  font-size: 16px;
}
.salary {
  color: #ff7e00;
  font-weight: bold;
  margin-right: 20px;
}
.company-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.company-info h3 {
  font-size: 18px;
  color: #333;
}
.job-description, .job-requirements, .job-benefits {
  margin-bottom: 30px;
}
.job-description h3, .job-requirements h3, .job-benefits h3 {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.job-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}
</style>