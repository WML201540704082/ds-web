<template>
  <div class="lock-container pull-height">
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{'shake':passwdError,'bounceOut':pass}">
        <el-input  placeholder="请输入登录密码" type="password" class="input-with-select animated" v-model="passwd" @keyup.enter.native="handleLogin">
           <el-button slot="append" @click="handleLogin" style="padding-right:20px;"><icon-svg name="unlock"/></el-button>
          <el-button slot="append" @click="handleLogout"><icon-svg name="logout"/></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { getStore, removeStore } from '@/utils/storage'
import { clearLoginInfo } from '@/utils'
export default {
  data() {
    return {
      passwd: '',
      passwdError: false,
      pass: false
    }
  },
  methods: {
    handleLogout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/company/sysUser/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(data => {
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        })
      }).catch(() => {
        return false
      })
    },
    handleLogin() {
      const lockPasswd = getStore({name: 'lock-password'})
      if (this.passwd !== lockPasswd) {
        this.passwd = ''
        this.$message({
          message: '解锁密码错误,请重新输入',
          type: 'error'
        })
        this.passwdError = true
        setTimeout(() => {
          this.passwdError = false
        }, 1000)
        return
      }
      this.pass = true
      setTimeout(() => {
        removeStore({name: 'lock-password'})
        this.$router.push('/desk-desk')
      }, 1000)
    }
  },
}
</script>

<style lang="scss">
.lock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // background-image: url("../../../static/img/login/login_bg.png");
  background-size: cover;
}
.lock-form {
  width: 300px;
}
</style>
