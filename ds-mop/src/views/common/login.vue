<template>
  <div class="site-wrapper site-page--login">
    <div class="version">version: {{version}}</div>
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="login-main">
          <div class="login-img"><img src="static/img/login/login_logo.png" alt=""></div>
          <h3 class="login-title">新零售一站式营销平台</h3>
          <el-form class="loginForm" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <span class="span_">
                <img class="users" src="static/img/login/user.png" alt="">
                <el-input class="input_" v-model="dataForm.userName" placeholder="请输入您的登录账号"></el-input>
              </span>
            </el-form-item>
            <el-form-item prop="password">
              <span class="span_">
                <img class="users" src="static/img/login/password.png" alt="">
                <el-input type="password" class="input_" v-model="dataForm.password" placeholder="请输入您的密码"></el-input>
              </span>
            </el-form-item>
              <gt-button size="large" txt="安全登录" class="login-btn-submit" @click.native="dataFormSubmit()" />
          </el-form>
        </div>
        <div class="login_right">
          <img src="static/img/login/right_.png" alt="">
        </div>
      </div>
      <div class="copyright">Copyright © {{year}}.冠通新创</div>
    </div>
  </div>
</template>

<script>
import { setStore } from '@/utils/storage'
import { isphone } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      year: null,
      dataForm: {
        userName: '',
        password: '',
      },
      version: window.SITE_CONFIG['version'],
      dataRule: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    clearLoginInfo()
    var date = new Date()
    this.year = date.getFullYear()
  },
  methods: {
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/mop/sysUser/login'),
            method: 'post',
            data: this.$http.adornData({
              'loginType': 0,
              'userName': this.dataForm.userName,
              'passWord': this.dataForm.password,
              'verificationCode': ''
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$cookie.set('mop-token', data.data.token)
              this.$cookie.set('mop-roleName', data.data.roleName)
              setStore({
                name: 'mop-userName',
                content: data.data.userName,
              })
              this.$router.replace({ name: 'home' })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/login/login.scss';
  .copyright {
    position: fixed;
    bottom: 28px;
    margin: auto;
    left: 0;
    right: 0;
    text-align: center;
  }
  .version{
    color: #656565;
    font-size: 14px;
    position: fixed;
    right: 15px;
    bottom: 15px;
  }
</style>
