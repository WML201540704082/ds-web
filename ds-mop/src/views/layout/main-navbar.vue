<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <img src="static/img/logo.png" class="site-navbar__brand-lg" alt="图标"/>
        <img src="static/img/logo-mini.png" class="site-navbar__brand-mini" alt="图标"/>
        <!-- <a class="site-navbar__brand-mini" href="javascript:;">萌</a> -->
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
      <el-menu default-active="3" class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <!-- <el-menu-item index="0" @click="lockScreen()">
          <icon-svg name="lock" class="el-icon-setting"></icon-svg>
        </el-menu-item> -->
        <!-- <el-menu-item index="0">
          <ThemePicker />

        </el-menu-item> -->
        <el-menu-item index="1">
          <el-tooltip placement="top" effect="dark">
            <div slot="content" class="warning-message-content">
              <div :key="news.id" v-for="news in messageList">{{news.messageType}}:{{news.messageContent}}</div>
            </div>
            <span>
              <img class="answer" src="static/img/desk/xiaoxi.png" />
              消息
            </span>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item index="2">
          <el-tooltip placement="top" effect="dark" content="系统帮助，详细帮助文档">
            <div>
              <img class="answer" src="static/img/desk/answer.png" />
              帮助
            </div>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom-end">
            <span class="el-dropdown-link">
              {{mopRoleName}} - {{ userName | phoneFormat }}<img class="xiala" src="static/img/desk/xiala.png" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 弹窗， 系统锁屏 -->
    <lock v-if="lockVisible" ref="lockDiaglog"></lock>
  </nav>
</template>

<script>
import Vue from 'vue'
import { getStore } from '@/utils/storage'
import UpdatePassword from './main-navbar-update-password'
import { getSystemMsg } from '@/service/settings'
import Lock from './main-navbar-lock'
import { clearLoginInfo } from '@/utils'
import { phoneFormat } from '@/utils/filter'
// import ThemePicker from '@/components/gt-theme'
export default {
  data () {
    return {
      updatePassowrdVisible: false,
      lockVisible: false,
      userName:'',
      mopRoleName: '',
      phoneFormat,
      messageList: [],
      // timeId: null
    }
  },
  components: {
    // ThemePicker,
    UpdatePassword,
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
    // userName: {
    //   get () { return this.$store.state.user.name }
    // }
  },
  created() {
    this.userName = getStore({name: 'mop-userName'})
    this.mopRoleName = this.$cookie.get('mop-roleName')
    this.getShortmessage()
    // this.timeId = setInterval(() => {
    //   this.getShortmessage()
    // },60000)
  },
  // destroyed () {
  //   clearInterval(this.timeId)
  //   this.timeId = null
  // },
  methods: {
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    lockScreen() {
      this.lockVisible = true
      this.$nextTick(() => {
        this.$refs.lockDiaglog.init()
      })
    },
    // 获取消息
    async getShortmessage(){
      const { data } = await getSystemMsg()
      if (data.code === 0) {
        this.messageList = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 退出
    logoutHandle () {
      this.$confirm('确定进行[退出]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/mop/sysUser/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code === 0) {
            clearLoginInfo()
            this.$router.replace({ name: 'login' })
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.answer{
  float: left;
  width: 18px;
  margin: 15px 5px 0 0;
}
  .xiala {
    margin-left: 5px;
    width: 18px!important;
    height: 11px!important
  }

  .red-dot{
    width: 6px;
    height: 6px;
    background-color: red;
    border-radius: 3px;
    position: relative;
    top: -40px;
    left: 60px;
  }
  .warning-message-content{
    max-height: 200px;
    overflow-y: scroll;
  }
</style>
