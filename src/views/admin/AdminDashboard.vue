<template>
  <div class="admin-container">
    <el-container>
      <el-header style="display: flex; justify-content: space-between; align-items: center;">
  <span>招聘网站管理后台</span>
  <el-button type="primary" @click="goToFrontend">返回前台</el-button>
</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-openeds="['1', '2']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-user"></i>用户管理</template>
              <el-menu-item index="1-1" @click="activeTab = 'userManagement'">用户列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-edit"></i>内容审核</template>
              <el-menu-item index="2-1" @click="activeTab = 'dynamicReview'">动态审核</el-menu-item>
              <el-menu-item index="2-2" @click="activeTab = 'commentReview'">评论审核</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <div v-if="activeTab === 'userManagement'">
            <h3>用户管理</h3>
            <el-table :data="users" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="username" label="用户名" width="180"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
              <el-table-column prop="role" label="角色" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.role === 0">求职者</span>
                  <span v-if="scope.row.role === 1">企业</span>
                  <span v-if="scope.row.role === 2">管理员</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1" style="color: green">正常</span>
                  <span v-if="scope.row.status === 0" style="color: red">禁用</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="toggleUserStatus(scope.row)">
                    {{ scope.row.status === 1 ? '禁用' : '启用' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="activeTab === 'dynamicReview'">
            <h3>动态审核</h3>
            <!-- 动态审核内容 -->
            <el-table :data="dynamics" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
              <el-table-column prop="content" label="内容" width="300"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0" style="color: orange">待审核</span>
                  <span v-if="scope.row.status === 1" style="color: green">已通过</span>
                  <span v-if="scope.row.status === 2" style="color: red">已拒绝</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="approveDynamic(scope.row)">通过</el-button>
                  <el-button type="danger" size="small" @click="rejectDynamic(scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="activeTab === 'commentReview'">
            <h3>评论审核</h3>
            <!-- 评论审核内容 -->
            <el-table :data="comments" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
              <el-table-column prop="content" label="内容" width="300"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0" style="color: orange">待审核</span>
                  <span v-if="scope.row.status === 1" style="color: green">已通过</span>
                  <span v-if="scope.row.status === 2" style="color: red">已拒绝</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="approveComment(scope.row)">通过</el-button>
                  <el-button type="danger" size="small" @click="rejectComment(scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'userManagement',
      users: [],
      dynamics: [],
      comments: []
    };
  },
  created() {
    this.checkAdminRole();
    this.loadUsers();
    this.loadDynamics();
    this.loadComments();
  },
  methods: {
    goToFrontend() {
      this.$router.push('/');
    },

    checkAdminRole() {
      if (!this.$store.state.user || this.$store.state.user.role !== 2) {
        this.$message.error('您没有权限访问管理后台');
        this.$router.push('/');
      }
    },
    loadUsers() {
      // 调用后端接口获取用户数据
      axios.get('/admin/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          this.$message.error('获取用户数据失败: ' + error.message);
          console.error('Failed to load users:', error);
        });
    },
    loadDynamics() {
      // 调用后端接口获取待审核动态
      axios.get('/admin/dynamics')
        .then(response => {
          this.dynamics = response.data;
        })
        .catch(error => {
          this.$message.error('获取动态数据失败: ' + error.message);
          console.error('Failed to load dynamics:', error);
        });
    },
    loadComments() {
      // 调用后端接口获取待审核评论
      axios.get('/admin/comments')
        .then(response => {
          this.comments = response.data;
        })
        .catch(error => {
          this.$message.error('获取评论数据失败: ' + error.message);
          console.error('Failed to load comments:', error);
        });
    },
    toggleUserStatus(user) {
      const newStatus = user.status === 1 ? 0 : 1;
      // 调用后端接口切换用户状态
      axios.put(`/admin/users/${user.id}/status?status=${newStatus}`)
        .then(() => {
          user.status = newStatus;
          this.$message.success(`用户${newStatus === 1 ? '启用' : '禁用'}成功`);
        })
        .catch(error => {
          this.$message.error(`用户${newStatus === 1 ? '启用' : '禁用'}失败: ` + error.message);
          console.error('Failed to toggle user status:', error);
        });
    },
    approveDynamic(dynamic) {
      // 调用后端接口审核通过动态
      axios.put(`/admin/dynamics/${dynamic.id}/status?status=1`)
        .then(() => {
          dynamic.status = 1;
          this.$message.success('动态审核通过');
        })
        .catch(error => {
          this.$message.error('动态审核失败: ' + error.message);
          console.error('Failed to approve dynamic:', error);
        });
    },
    rejectDynamic(dynamic) {
      // 调用后端接口拒绝动态
      axios.put(`/admin/dynamics/${dynamic.id}/status?status=2`)
        .then(() => {
          dynamic.status = 2;
          this.$message.success('动态已拒绝');
        })
        .catch(error => {
          this.$message.error('动态拒绝失败: ' + error.message);
          console.error('Failed to reject dynamic:', error);
        });
    },
    approveComment(comment) {
      // 调用后端接口审核通过评论
      axios.put(`/admin/comments/${comment.id}/status?status=1`)
        .then(() => {
          comment.status = 1;
          this.$message.success('评论审核通过');
        })
        .catch(error => {
          this.$message.error('评论审核失败: ' + error.message);
          console.error('Failed to approve comment:', error);
        });
    },
    rejectComment(comment) {
      // 调用后端接口拒绝评论
      axios.put(`/admin/comments/${comment.id}/status?status=2`)
        .then(() => {
          comment.status = 2;
          this.$message.success('评论已拒绝');
        })
        .catch(error => {
          this.$message.error('评论拒绝失败: ' + error.message);
          console.error('Failed to reject comment:', error);
        });
    }
  }
};
</script>

<style scoped>
.admin-container {
  height: 100vh;
}
.el-header {
  background-color: #1890ff;
  color: #fff;
  font-size: 20px;
  line-height: 60px;
  text-align: center;
}
.el-aside {
  background-color: #5d7fa5;
}
.el-menu {
  background-color: #5d7fa5;
  color: #ecf0f1;
}
.el-submenu__title {
  color: #fff;
}
.el-menu-item {
  color: #bdc3c7;
}
.el-menu-item:hover {
  background-color: #3498db;
  color: #fff;
}
.el-menu-item.is-active {
  background-color: #3498db;
  color: #fff;
}
.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>