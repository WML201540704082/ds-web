<template>
  <div class="site-wrapper site-page--page"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="login-main">
          <div class="login-img"><img src="static/img/login/login_logo.png" alt=""></div>
          <h3 class="login-title">新零售一站式营销平台</h3>
          <div class="">
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="6" v-if="commenInfo.storeAccess">
                <div class="grid-content bg-purple" @click="goPage('store')">
                  <div class="pos">
                    <img src="static/img/pagetwo/saas.png" alt="">
                  </div>
                  <div class="postext">SAAS</div>
                  <div class="posd">门店顾客管理</div>
                </div>
              </el-col>

              <el-col :span="6" v-if="commenInfo.companyAccess">
                <div class="grid-content bg-purple" @click="goPage('company')">
                  <div class="pos">
                    <img src="static/img/pagetwo/company.png" alt="">
                  </div>
                  <div class="postext">SAAS</div>
                  <div class="posd">企业顾客管理</div>
                </div>
              </el-col>

            </el-row>
          </div>
        </div>
      </div>
      <div class="copyright">Copyright © {{year}}.冠通新创</div>
    </div>
  </div>
</template>

<script>
import { getStore, setStore } from '@/utils/storage'
import { getCompanySetting } from '@/service/setting'
import { validatenull } from '@/utils/validate'
import { changeTheme } from '@/utils'
export default {
  name: 'page-change',
  data () {
    return {
      loading: false,
      settings: {viewSet: 'FALSE'},
      year: null,
      commenInfo: null,
      version: window.SITE_CONFIG['version'],
    }
  },
  async created () {
    console.log(window.location.href)
    var date = new Date()
    this.year = date.getFullYear()
    var fromPoshref = window.location.href
    var temp = fromPoshref.split('?')[1]
    if(temp){//从pos跳转
      var posObj = decodeURI(temp).split('&')
      var obj= {}
      for(var i in posObj){
        let item = posObj[i]
        item = item.split('=')
        obj[item[0]] = item[1]
      }
      var commenInfo = {
        ...obj,
        'companyAccess':obj.companyAccess=='true'?true:false,
        'storeAccess':obj.storeAccess=='true'?true:false,
        'theme': obj.systemThemeColor
      }
      console.log('1212121--'+commenInfo)
      console.log('23232323---'+JSON.stringify(commenInfo))
      console.log(commenInfo.storeRoleName)
      setStore({name:'commenInfo',content:commenInfo})
      this.commenInfo = getStore({name:'commenInfo'})
    }else{//正常登陆
      // commenInfo登录信息
      this.commenInfo = getStore({name:'commenInfo'})
    }

    // this.$cookie.set('company-token', this.commenInfo.companyToken ? this.commenInfo.companyToken : this.commenInfo.storeToken)
    const theme = this.commenInfo?this.commenInfo.theme:''
    changeTheme(theme)
  },
  methods: {
    // 获取企业基本信息设置
    async getCompanySettingApi() {
      const { data } = await getCompanySetting({
        token: this.commenInfo.companyToken || this.commenInfo.storeToken
      })
      if (data.code === 0) {
        this.settings = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    // 根据信息跳转
    async goPage(pageType){
      var commenInfo = this.commenInfo
      setStore({ name: 'theme', content: commenInfo.theme})//缓存主题

      // 企业信息
      this.$cookie.set('company-token', commenInfo.companyToken)
      this.$cookie.set('company-role', JSON.stringify({companyRoleName: commenInfo.companyRoleName}))//缓存token
      setStore({ name: 'company-info', content: commenInfo.companyIsAuthentication})
      // this.$store.commit('common/updateIsAuthentication', commenInfo.companyIsAuthentication)
      setStore({ name: 'company-userName', content: commenInfo.userName})
      setStore({ name: 'theme', content: commenInfo.theme})

      // 门店信息
      // 获取企业基本信息设置
      await this.getCompanySettingApi()
      this.$cookie.set('store-token', commenInfo.storeToken)//缓存token
      this.$cookie.set('store-info', JSON.stringify({companyId:commenInfo.companyId, storeId: commenInfo.storeId, storeName: commenInfo.storeName,
        storeRoleName: commenInfo.storeRoleName, theme: commenInfo.theme, storeType: commenInfo.storeType, newStore:commenInfo.newStore, hasAuthorization: this.settings.viewSet === 'TRUE'}))//缓存token
      setStore({ name: 'store-userName', content: commenInfo.userName})//缓存用户名
      var setStoreUrl = window.SITE_CONFIG['storeUrl']+'/#/desk-desk'
      if(pageType == 'store'){//门店
        this.loading = true

        window.location.replace(setStoreUrl)
      }else if(pageType == 'company'){//企业
        this.loading = true

        // 非正常营业-跳转到企业认证页面
        if (commenInfo.companyIsAuthentication === 0) {
          var setCompanyUrl = window.SITE_CONFIG['companyUrl']+'/#/settings-company'
          window.location.replace(setCompanyUrl)
        } else {
          var setCompanyUrl = window.SITE_CONFIG['companyUrl']+'/#/desk-desk'
          window.location.replace(setCompanyUrl)
        }
      }
      else{
        this.$message.success('敬请期待')
      }
    },
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/page/index.scss';
</style>
