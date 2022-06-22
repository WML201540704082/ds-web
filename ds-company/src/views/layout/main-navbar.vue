<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="goChange">
        <img :src="'static/img/setting/'+temp+'/logo.png'" class="site-navbar__brand-lg" alt="图标"/>
        <img src="static/img/logo-mini.png" class="site-navbar__brand-mini" alt="图标"/>
        <!-- <a class="site-navbar__brand-mini" href="javascript:;">萌百格</a> -->
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
        <!-- 跑马灯 -->
        <div id="box" v-if="items.length>0">
          <ul style="color:red;cursor:pointer" id="con1" ref="con1" :class="{anim:animate==true}" @click="goOrderList()">
            <li v-for='item in items'>{{item.messageContent}}</li>
          </ul>
        </div>
      </el-menu>
      <el-menu
        default-active="3"
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <!-- <el-menu-item index="0" @click="lockScreen()">
          <icon-svg name="lock" class="el-icon-setting"></icon-svg>
        </el-menu-item> -->

        <el-menu-item index="1">
          <el-tooltip v-show="hasMessage" placement="top" effect="dark">
            <div slot="content">企业的短信余量不足50条，请尽快前往“营销中心-短信营销”或在<br/>“店务助手-物料商城”中进行短信充值。</div>
            <span>
              <img class="answer" src="static/img/desk/xiaoxi.png" />
              消息
            </span>
          </el-tooltip>
          <span v-show="!hasMessage">
            <img class="answer" src="static/img/desk/xiaoxi.png" />
            消息
          </span>
          <div v-show="hasMessage" class="red-dot"></div>
        </el-menu-item>
        <el-menu-item index="2">
          <el-tooltip placement="top" effect="dark" content="系统帮助，详细帮助文档">
            <span>
              <img class="answer" src="static/img/icon/answer.png" />
              帮助
            </span>
          </el-tooltip>

        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom-end" trigger="click">
             <!-- | phoneFormat  -->
            <span class="el-dropdown-link">
              {{companyName}} - {{companyRoleName}} - {{ userName }}
              <icon-svg name="18" class="theme-color" style="font-size: 16px;vertical-align: middle;"></icon-svg>
              <!-- <img class="xiala" src="static/img/desk/xiala.png" /> -->
            </span>
            <el-dropdown-menu  class="settings" slot="dropdown">
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
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 弹窗， 系统锁屏 -->
    <!-- <lock v-if="lockVisible" ref="lockDiaglog"></lock> -->
  </nav>
</template>

<script>
import { getStore } from '@/utils/storage'
// import Lock from './main-navbar-lock'
import { clearLoginInfo } from '@/utils'
import { phoneFormat } from '@/utils/filter'
import { getAccountDetail,orderRemindMessage } from '@/service/campaign'
export default {
  data () {
    return {
      updatePassowrdVisible: false,
      lockVisible: false,
      userName:'',
      companyRoleName: '',
      companyName: '',
      temp: 'orange',
      hasMessage: false,
      timeId: null,
      //跑马灯
      animate:false,
      items:[]
    }
  },
  components: {
    // Lock
  },
  filters: {phoneFormat},
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
    //跑马灯
    setInterval(this.scroll,2000)
    this.getOrderRemindMessage()

    this.userName = getStore({name: 'company-userName'})
    const { companyRoleName = '', companyName = '' } = getStore({name: 'commenInfo'})
    this.companyName = companyName
    this.companyRoleName = companyRoleName

    const theme = getStore({name: 'theme'})
    if (theme === 'ORANGEWHITE') {
      this.temp = 'orange'
    } else {
      this.temp = 'green'
    }
    this.getShortmessage()
    this.timeId = setInterval(() => {
      this.getShortmessage()
      this.getOrderRemindMessage()
    },60000)
  },



  destroyed () {
    clearInterval(this.timeId)
    this.timeId = null
  },
  methods: {
    //跑马灯
    scroll(){
      this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.items.push(this.items[0]);  // 将数组的第一个元素添加到数组的
        this.items.shift();               //删除数组的第一个元素
        this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      },1500)
    },
    // 企业订货提醒消息
    async getOrderRemindMessage(){
      const { data } = await orderRemindMessage()
      if (data.code === 0) {
        this.items = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    //跳转订单列表
    goOrderList(){
      this.$router.push({name:'stockManagement-requiredInventory'})
    },
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
    // lockScreen() {
    //   this.lockVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.lockDiaglog.init()
    //   })
    // },
    // 获取企业的短信条数
    async getShortmessage(){
      const { data } = await getAccountDetail()
      if (data.code === 0) {
        if (data.data.amount < 50) {
          this.hasMessage = true
        } else {
          this.hasMessage = false
        }
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
          url: this.$http.adornUrl('/sys/company/sysUser/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then((data) => {
          clearLoginInfo()
          this.$router.replace({ name: 'login' })
        })
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
  /* 跑马灯 */
  #box{
    width: 460px;
    height: 32px;
    overflow: hidden;
    /* padding-left: 30px; */
    border: 1px solid #ffffff;
    margin-top: 10px;
  }
  .anim{
    transition: all 2s;
    margin-top: -30px;
  }
  #con1 li{
    list-style: none;
    line-height: 30px;
    height: 30px;
  }

  .answer{
    width: 18px;
    margin: -2px 5px 0 0;
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

</style>
