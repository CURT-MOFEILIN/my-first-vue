<template>
  <el-form :model="loginFrom" :rules="loginRule" ref="loginFrom" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginFrom.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginFrom.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Login } from '@/api/api'
export default {
  data () {
    return {
      loading: false,
      loginFrom: {
        account: 'admin',
        password: ''
      },
      loginRule: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: true
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          this.loading = true
          let postData = this.$qs.stringify({
            username: this.loginFrom.account,
            password: this.loginFrom.password
          })
          Login(postData).then(result => {
            this.loading = false
            let data2 = result.data
            if (data2 === 'success') {
              this.$router.push({path: '/index'})
              sessionStorage.setItem('user', 'admin')
            } else {
              this.$message({
                message: data2,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
