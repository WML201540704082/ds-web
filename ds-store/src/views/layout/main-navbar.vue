<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="goChange">
        <img :src="'static/img/setting/'+temp+'/logo.png'" class="site-navbar__brand-lg" alt="图标"/>
        <img src="static/img/logo-mini.png" class="site-navbar__brand-mini" alt="图标"/>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
	default-active="0"
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        default-active="3"
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <!-- <el-menu-item index="0" @click="lockScreen()">
          <icon-svg name="lock" class="el-icon-setting"></icon-svg>
        </el-menu-item> -->
        <el-menu-item index="1">
          <img class="answer" src="static/img/desk/xiaoxi.png" />
          消息
        </el-menu-item>
        <el-menu-item index="2">
          <el-tooltip placement="top" effect="dark" content="系统帮助，详细帮助文档">
            <img class="answer" src="static/img/icon/answer.png" />
          </el-tooltip>
          帮助
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom-end">
            <span class="el-dropdown-link">
              {{storeName}} - {{storeRoleName}} - {{ userName }}
              <icon-svg name="18" class="theme-color" style="font-size: 16px;vertical-align: middle;"></icon-svg>
            </span>
            <el-dropdown-menu class="settings" slot="dropdown">
              <el-dropdown-item @click.native="updatebaseinfo()">基础信息</el-dropdown-item>
              <el-dropdown-item @click.native="updatePass()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="myDownload()">我的下载</el-dropdown-item>
              <el-dropdown-item @click.native="goChange()">切换</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗， 系统锁屏 -->
    <lock v-if="lockVisible" ref="lockDiaglog"></lock>
  </nav>
</template>

<script>
import { getStore } from '@/utils/storage'
import Lock from './main-navbar-lock'
import { getUserInfoData } from '@/service/setinfo'
import { clearLoginInfo } from '@/utils'
import { phoneFormat } from '@/utils/filter'
export default {
  data () {
    return {
      lockVisible: false,
      userName:'',
      temp: 'orange'
    }
  },
  components: {
    Lock
  },
  filters: { phoneFormat },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
  },
  created() {
    this.detail()
    // this.userName = getStore({name: 'store-userName'})
    // const { storeName = '', storeRoleName = '' } = getStore({name: 'commonInfo'})
    var res = this.$cookie.get('store-info')
    const { storeName = '', storeRoleName = '',theme = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeName = storeName
    this.storeRoleName = storeRoleName
    if (theme === 'ORANGEWHITE') {
      this.temp = 'orange'
    } else {
      this.temp = 'green'
    }
  },
  methods: {
    // 跳转change 页面
    goChange(){
      this.$router.push({name:'desk-desk'})
      setTimeout(function(){
        window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/change')
      },100)
    },
    // 我的下载
    myDownload() {
      this.$router.push({name:'accountsetting-download'})
    },
    updatePass(){
      this.$router.push({name:'accountsetting-changePassword'})
    },
    updatebaseinfo(){
      this.$router.push({name:'accountsetting-baseInfo'})
    },
    async detail(){
      const { data } = await getUserInfoData()
      if(data&&data.code == 0){
        this.userName = data.data.userName
      }
    },
    lockScreen() {
      this.lockVisible = true
      this.$nextTick(() => {
        this.$refs.lockDiaglog.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm('确定进行[退出]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/store/sysUser/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then((data) => {
          clearLoginInfo()
          window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/login')
        })
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
  .answer{
    width: 18px;
    margin: -2px 5px 0 0;
  }
  .xiala {
    margin-left: 5px;
    width: 18px!important;
    height: 11px!important
  }
</style>
