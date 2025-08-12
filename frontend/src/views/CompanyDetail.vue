<template>
  <div class="company-detail">
    <el-card>
      <div class="company-header">
        <img :src="`https://picsum.photos/200/200?random=${company.id}`" alt="企业logo" class="company-logo">
        <div class="company-title">
          <h2>{{ company.name }}</h2>
          <div class="company-meta">
            <span>{{ company.industry }}</span>
            <span>{{ company.size }}</span>
          </div>
        </div>
      </div>

      <div class="company-info">
        <h3>公司简介</h3>
        <p>{{ company.description }}</p>
      </div>

      <div class="company-jobs">
        <h3>正在招聘的职位</h3>
        <div v-if="companyJobs.length > 0">
          <el-card class="job-card" v-for="job in companyJobs" :key="job.id" @click="goToJobDetail(job.id)">
            <div class="job-info">
              <h4>{{ job.title }}</h4>
              <div class="job-meta">
                <span class="salary">{{ job.salary }}</span>
                <span>{{ job.location }}</span>
              </div>
              <div class="job-description">{{ job.description }}</div>
            </div>
          </el-card>
        </div>
        <div v-else class="no-jobs">暂无招聘信息</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CompanyDetail',
  data() {
    return {
      company: {},
      companyJobs: []
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser'])
  },
  mounted() {
    this.getCompanyDetail();
    this.getCompanyJobs();
  },
  methods: {
    getCompanyDetail() {
      // 在实际项目中，这里应该通过API获取企业详情
      // 这里使用模拟数据
      const companyId = parseInt(this.$route.params.id);
      // 从热门企业中查找匹配的企业
      const hotCompanies = [
        { id: 1, name: '科技有限公司', industry: '互联网', size: '500-1000人', description: '科技有限公司成立于2010年，是一家专注于互联网技术研发的高新技术企业，致力于为客户提供优质的技术解决方案。' },
        { id: 2, name: '互联网有限公司', industry: '软件', size: '1000-2000人', description: '互联网有限公司是国内领先的软件服务提供商，专注于企业级应用开发和云计算服务，拥有多项自主知识产权。' },
        { id: 3, name: '软件有限公司', industry: '科技', size: '2000-5000人', description: '软件有限公司成立于2005年，是一家全球化的软件公司，产品覆盖操作系统、数据库和企业应用软件等多个领域。' },
        { id: 4, name: '设计有限公司', industry: '设计', size: '100-500人', description: '设计有限公司是一家专业的设计机构，提供品牌设计、UI/UX设计和产品设计等服务，客户遍布国内外。' },
        { id: 5, name: '金融投资有限公司', industry: '金融', size: '500-1000人', description: '金融投资有限公司是一家综合性金融服务企业，业务涵盖投资银行、资产管理和财富管理等多个领域。' },
        { id: 6, name: '硬件科技有限公司', industry: '硬件', size: '1000-2000人', description: '硬件科技有限公司是一家专注于智能硬件研发和制造的企业，产品包括智能手机、智能家居和可穿戴设备等。' },
        { id: 7, name: '教育培训有限公司', industry: '教育', size: '200-500人', description: '教育培训有限公司是一家专业的教育机构，提供职业技能培训、语言培训和学历教育等服务，帮助学员提升竞争力。' },
        { id: 8, name: '医疗健康有限公司', industry: '医疗', size: '500-1000人', description: '医疗健康有限公司是一家集医疗服务、健康管理和医药研发于一体的综合性医疗企业，致力于提升人们的健康水平。' },
        { id: 9, name: '电子商务有限公司', industry: '电商', size: '1000-2000人', description: '电子商务有限公司是国内知名的电商平台运营商，提供B2B、B2C和C2C等多种电商服务，连接全球商家和消费者。' },
        { id: 10, name: '文化传媒有限公司', industry: '文化', size: '200-500人', description: '文化传媒有限公司是一家专注于内容创作和传播的企业，业务涵盖影视制作、广告代理和新媒体运营等多个领域。' },
        { id: 11, name: '房地产开发有限公司', industry: '房地产', size: '1000-2000人', description: '房地产开发有限公司是一家综合性房地产企业，业务涵盖房地产开发、物业管理和商业运营等多个领域。' },
        { id: 12, name: '制造产业有限公司', industry: '制造', size: '2000-5000人', description: '制造产业有限公司是一家大型制造企业，产品涵盖机械装备、电子产品和消费品等多个领域，远销国内外。' },
        { id: 13, name: '物流运输有限公司', industry: '物流', size: '500-1000人', description: '物流运输有限公司是一家综合性物流企业，提供仓储、运输和配送等一站式物流服务，覆盖全国主要城市。' },
        { id: 14, name: '餐饮管理有限公司', industry: '餐饮', size: '100-500人', description: '餐饮管理有限公司是一家连锁餐饮企业，拥有多个知名餐饮品牌，提供中餐、西餐和快餐等多种餐饮服务。' },
        { id: 15, name: '零售连锁有限公司', industry: '零售', size: '1000-2000人', description: '零售连锁有限公司是一家大型零售企业，拥有多家连锁超市和便利店，提供食品、日用品和家用电器等多种商品。' }
      ];
      
      this.company = hotCompanies.find(company => company.id === companyId) || {};
    },
    
    getCompanyJobs() {
      // 在实际项目中，这里应该通过API获取企业的招聘职位
      // 这里使用模拟数据
      const companyId = parseInt(this.$route.params.id);
      // 从热门岗位中筛选出属于该企业的职位
      const hotJobs = [
        { id: 1, title: '前端开发工程师', company: '科技有限公司', salary: '15k-25k', location: '北京', description: '负责公司网站和移动端应用的前端开发工作，参与产品需求讨论和技术方案设计。' },
        { id: 2, title: '后端开发工程师', company: '互联网有限公司', salary: '18k-30k', location: '上海', description: '负责公司核心系统的后端开发和维护，设计数据库结构和API接口。' },
        { id: 3, title: '产品经理', company: '软件有限公司', salary: '20k-35k', location: '广州', description: '负责产品的需求分析、功能规划和项目管理，协调研发、设计和测试团队。' },
        { id: 4, title: 'UI设计师', company: '设计有限公司', salary: '12k-22k', location: '深圳', description: '负责产品的界面设计和用户体验优化，参与产品设计讨论和用户研究。' },
        { id: 5, title: '金融分析师', company: '金融投资有限公司', salary: '25k-40k', location: '北京', description: '负责金融市场分析和投资策略制定，撰写研究报告。' },
        { id: 6, title: '投资顾问', company: '金融投资有限公司', salary: '20k-35k', location: '上海', description: '为客户提供投资咨询服务，制定个性化投资方案。' },
        { id: 7, title: '硬件工程师', company: '硬件科技有限公司', salary: '18k-30k', location: '深圳', description: '负责硬件产品的设计、开发和测试，参与产品需求分析和技术方案制定。' },
        { id: 8, title: '嵌入式开发工程师', company: '硬件科技有限公司', salary: '20k-35k', location: '杭州', description: '负责嵌入式系统的开发和调试，编写驱动程序和应用程序。' },
        { id: 9, title: '讲师', company: '教育培训有限公司', salary: '15k-25k', location: '成都', description: '负责课程的讲授和学员管理，参与课程研发和教学资料编写。' },
        { id: 10, title: '课程顾问', company: '教育培训有限公司', salary: '12k-20k', location: '武汉', description: '负责课程咨询和销售，为客户提供专业的课程推荐和学习规划。' },
        { id: 11, title: '医生', company: '医疗健康有限公司', salary: '30k-50k', location: '北京', description: '负责患者的诊断和治疗，制定治疗方案，书写病历。' },
        { id: 12, title: '护士', company: '医疗健康有限公司', salary: '8k-15k', location: '上海', description: '负责患者的护理和基础治疗，协助医生进行诊疗工作。' },
        { id: 13, title: '电商运营', company: '电子商务有限公司', salary: '15k-25k', location: '杭州', description: '负责电商平台的运营和管理，制定运营策略，提升销售额。' },
        { id: 14, title: '客服专员', company: '电子商务有限公司', salary: '6k-12k', location: '广州', description: '负责解答客户咨询，处理客户投诉，维护客户关系。' },
        { id: 15, title: '编辑', company: '文化传媒有限公司', salary: '10k-18k', location: '北京', description: '负责内容的策划和编辑，撰写稿件，审核内容。' },
        { id: 16, title: '摄影师', company: '文化传媒有限公司', salary: '12k-20k', location: '上海', description: '负责照片和视频的拍摄和后期制作，参与拍摄方案的制定。' },
        { id: 17, title: '房地产经纪人', company: '房地产开发有限公司', salary: '10k-30k', location: '深圳', description: '负责房源的开发和销售，为客户提供专业的房地产咨询服务。' },
        { id: 18, title: '建筑设计师', company: '房地产开发有限公司', salary: '20k-35k', location: '广州', description: '负责建筑方案的设计和绘制，参与项目的规划和设计。' },
        { id: 19, title: '生产经理', company: '制造产业有限公司', salary: '15k-25k', location: '苏州', description: '负责生产计划的制定和执行，管理生产团队，确保生产效率和质量。' },
        { id: 20, title: '质检员', company: '制造产业有限公司', salary: '6k-12k', location: '东莞', description: '负责产品的质量检验，确保产品符合质量标准。' }
      ];
      
      this.companyJobs = hotJobs.filter(job => {
        // 查找企业名称对应的ID
        const companyMap = {
          '科技有限公司': 1,
          '互联网有限公司': 2,
          '软件有限公司': 3,
          '设计有限公司': 4,
          '金融投资有限公司': 5,
          '硬件科技有限公司': 6,
          '教育培训有限公司': 7,
          '医疗健康有限公司': 8,
          '电子商务有限公司': 9,
          '文化传媒有限公司': 10,
          '房地产开发有限公司': 11,
          '制造产业有限公司': 12
        };
        return companyMap[job.company] === companyId;
      });
    },
    
    goToJobDetail(id) {
      this.$router.push(`/jobs/${id}`);
    }
  }
};
</script>

<style scoped>
.company-detail {
  padding: 30px;
}

.company-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.company-logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 30px;
}

.company-title {
  flex: 1;
}

.company-title h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.company-meta {
  display: flex;
  gap: 20px;
  color: #666;
}

.company-info,
.company-jobs {
  margin-bottom: 30px;
}

.company-info h3,
.company-jobs h3 {
  font-size: 20px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.company-info p {
  line-height: 1.6;
  color: #333;
}

.job-card {
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.job-info h4 {
  font-size: 18px;
  margin-bottom: 10px;
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

.no-jobs {
  text-align: center;
  padding: 30px;
  color: #999;
}
</style>