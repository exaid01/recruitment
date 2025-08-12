<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="clearfix">
        <span>注册</span>
      </div>
      <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="role">
          <el-radio-group v-model="registerForm.role">
            <el-radio :label="0">求职者</el-radio>
            <el-radio :label="1">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="agreeTerms">
          <el-checkbox v-model="registerForm.agreeTerms">
            我已阅读并同意<a href="/terms" target="_blank">用户协议</a>和<a href="/privacy" target="_blank">隐私政策</a>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('registerForm')" style="width: 100%">注册</el-button>
        </el-form-item>
        <el-form-item>
          <span>已有账号？</span>
          <el-button type="text" @click="goToLogin">立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        role: 0,
        agreeTerms: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        agreeTerms: [
          { required: true, validator: this.validateAgreeTerms, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    validateAgreeTerms(rule, value, callback) {
      if (!value) {
        callback(new Error('请阅读并同意用户协议和隐私政策'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/register', this.registerForm)
            .then(() => {
              this.$message.success('注册成功，请登录');
              this.$router.push('/login');
            })
            .catch(error => {
              const errorMessage = error.response?.data?.message || '注册信息有误';
              this.$message.error('注册失败: ' + errorMessage);
            });
        } else {
          return false;
        }
      });
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}
.register-card {
  width: 500px;
}
</style>