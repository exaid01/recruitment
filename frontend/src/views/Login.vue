<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色">
            <el-option label="求职者" value="0"></el-option>
            <el-option label="企业" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item>
          <span>还没有账号？</span>
          <el-button type="text" @click="goToRegister">立即注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        role: '0'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      console.log('开始提交登录表单:', formName);
      console.log('当前表单数据:', JSON.stringify(this.loginForm));
      this.$refs[formName].validate((valid) => {
        console.log('表单验证结果:', valid);
        if (valid) {
          console.log('登录请求参数:', this.loginForm);
          console.log('是否选择管理员角色:', this.loginForm.role === '2');
          console.log('请求URL:', '/user/login');
          console.log('axios baseURL:', this.$axios.defaults.baseURL);
          console.log('完整请求URL:', this.$axios.defaults.baseURL + '/user/login');
      this.$axios.post('/user/login', this.loginForm)
            .then(response => {
              console.log('登录响应:', response.data);
              const { token, id, username, email, role } = response.data;
              this.$store.dispatch('login', {
                user: {
                  id, username, email, role
                },
                token
              });
              Message.success('登录成功');
              // 根据角色跳转到对应页面
              if (role === 2) {
                // 管理员跳转到管理后台
                this.$router.push('/admin');
              } else {
                // 其他角色跳转到首页或之前的页面
                const redirect = this.$route.query.redirect || '/';
                this.$router.push(redirect);
              }
            })
            .catch(error => {
              this.$message.error('登录失败: ' + (error.response && error.response.data && error.response.data.message ? error.response.data.message : '用户名或密码错误'));
            });
        } else {
          return false;
        }
      });
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}
.login-card {
  width: 400px;
}
</style>