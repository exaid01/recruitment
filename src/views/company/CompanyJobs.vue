<template>
  <div class="company-jobs-container">
    <h1>我发布的职位</h1>
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <div v-else-if="jobs.length === 0" class="no-jobs">
      暂无发布的职位
    </div>
    <div v-else class="jobs-list">
      <el-card v-for="job in jobs" :key="job.id" class="job-card">
        <div class="job-title">{{ job.title }}</div>
        <div class="job-info">
          <span class="job-salary">{{ job.salary }}</span>
          <span class="job-location">{{ job.location }}</span>
          <span class="job-type">{{ job.jobType }}</span>
        </div>
        <div class="job-requirements">
          {{ job.requirements.substring(0, 100) }}...
        </div>
        <div class="job-actions">
          <el-button type="primary" size="small" @click="editJob(job.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteJob(job.id)">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyJobs',
  data() {
    return {
      jobs: [],
      loading: true
    };
  },
  mounted() {
    this.fetchCompanyJobs();
  },
  methods: {
    fetchCompanyJobs() {
      this.loading = true;
      // 获取当前公司ID，假设从localStorage中获取
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('用户数据:', user);
      const companyId = user && user.companyId;
      console.log('公司ID:', companyId);

      if (!companyId) {
        this.$message.error('无法获取公司信息');
        this.loading = false;
        return;
      }

      console.log('API请求URL:', `/jobs/company/${companyId}`);
      this.$axios.get(`/jobs/company/${companyId}`)
        .then(response => {
          this.jobs = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取职位列表失败:', error);
          this.$message.error('获取职位列表失败');
          this.loading = false;
        });
    },
    editJob(id) {
      // 跳转到编辑页面，假设存在编辑页面
      this.$router.push(`/company/edit-job/${id}`);
    },
    deleteJob(id) {
      this.$confirm('确定要删除这个职位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/jobs/${id}`)
          .then(() => {
            this.$message.success('职位删除成功');
            this.fetchCompanyJobs(); // 重新获取职位列表
          })
          .catch(error => {
            console.error('删除职位失败:', error);
            this.$message.error('删除职位失败');
          });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
};
</script>

<style scoped>
.company-jobs-container {
  padding: 20px;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-jobs {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

.jobs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.job-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.job-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.job-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  color: #666;
}

.job-requirements {
  color: #666;
  margin-bottom: 15px;
  flex-grow: 1;
}

.job-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>