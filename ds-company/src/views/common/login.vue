<template>

     <!-- <img src="static/img/login/1.png" alt=""> -->
    <el-row type="flex" class="row-bg" justify="start" style="height: 100%">
      <el-col :span="24"  style="height: 100%">
        <div class="site-wrapper site-page--login">
        <div class="version">version: {{version}}</div>
        <div class="site-content__wrapper">
          <div class="site-content">
            <div class="login-main">
              <h4 class="login-title">登录 Sign in</h4>
              <p style="color: #aaa;font-size: 14px;margin-top: 25px;">在线管理您的营销平台....</p>
              <el-form class="loginForm" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                <el-form-item prop="userName">
                  <span class="span_">
                    <img class="users" src="static/img/login/user.png" alt="">
                    <el-input class="input_" v-model="dataForm.userName" maxlength="11" placeholder="请输入您的平台账号"></el-input>
                  </span>
                </el-form-item>
                <el-form-item prop="password">
                  <span class="span_">
                    <img class="users" src="static/img/login/password.png" alt="">
                    <el-input type="password" class="input_" v-model="dataForm.password" placeholder="请输入您的密码"></el-input>
                  </span>
                </el-form-item>
                <div class="findPass" @click="findpassword">忘记密码</div>
                <div>
                <gt-button size="large" :loading="loading" txt="安全登录" class="login-btn-submit" @click.native="dataFormSubmit()" /></div>

              </el-form>

            </div>
          </div>
        </div>

          <div><div class="copyright">Copyright © {{year}}.冠通新创</div></div>
        <!-- @refreshDataList="getDataList" -->
        <find-password v-if="findVisible" ref="findPass" />
      </div>
      </el-col>
    </el-row>
</template>

<script>
import { setStore } from '@/utils/storage'
import { mapState } from 'vuex'
import findPassword from './findPassword'
import { isphone } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      snCode: null,
      findVisible: false,
      year: null,
      version: window.SITE_CONFIG['version'],
      dataForm: {
        userName: '',
        password: '',
      },
      dataRule: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          {validator: isphone, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
    }
  },
  components: { findPassword },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  created () {
    clearLoginInfo()
    var date = new Date()
    this.year = date.getFullYear()
  },
  methods: {
    findpassword(){
      this.findVisible = true
      this.$nextTick(() => {
        this.$refs.findPass.init()
      })
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const {data} = await this.$http({
            url: this.$http.adornUrl('/sys/sysUser/login'),
            selfHandleError: true,
            method: 'post',
            data: this.$http.adornData({
              'userName': this.dataForm.userName,
              'passWord': this.dataForm.password,
            })
          })
          if(data&&data.code == 0){
            // 获取主题色
            var commenInfo = {
              'theme': data.data.systemThemeColor || '',
              'companyAccess':data.data.companyAccess || '',
              'companyIsAuthentication':data.data.companyIsAuthentication,
              'companyToken':data.data.companyToken || '',
              'companyRoleName': data.data.companyRoleName || '',
              'companyName': data.data.companyName || '',
              'companyId': data.data.companyId || '',
              'storeId': data.data.storeId || '',
              'storeAccess':data.data.storeAccess || '',
              'storeToken':data.data.storeToken || '',
              'storeRoleName': data.data.storeRoleName || '',
              'storeName': data.data.storeName || '',
              'userName':data.data.userName || '',
              'fuiouPos1SnNo': data.data.fuiouPos1SnNo || '',
              'fuiouPos2SnNo': data.data.fuiouPos2SnNo || '',
              "newStore": data.data.newStore ? 'true' : 'false' || '',
              'storeType': data.data.storeType || ''
            }
            setStore({name:'commenInfo',content:commenInfo})
            this.$router.replace({ name: 'change' })
          }else{
            this.$message.error(data.msg)
          }
        }
      })
    },
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/login/newLogin.scss';
  .version{
    color: #666;
    font-size: 14px;
    position: fixed;
    right: 15px;
    bottom: 15px;
  }

</style>
