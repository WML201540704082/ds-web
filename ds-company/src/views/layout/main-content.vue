<template>
  <main class="site-content inner__wrapper">
    <div class="sub-menu-content" v-if="isAuthentication" v-show="subMenuList.length > 0">
      <sub-menu v-for="menu in subMenuList" @changeSubview="changeItem" :key="menu.id" :menu="menu"/>
    </div>
    <div class="bread-crumbs" v-if="isAuthentication" v-show="menuActiveInfo && menuActiveInfo.parentName">
      <router-link :to="menuActiveInfo.parentRouter || '/desk-desk'">{{menuActiveInfo.parentName}}</router-link> >>
      {{menuActiveInfo.bread? (($route.query&&$route.query.id)?'编辑'+menuActiveInfo.title:'新增'+menuActiveInfo.title) : menuActiveInfo.title}}
    </div>
    <keep-alive v-if="isRouteAlive" :include="includeList">
      <router-view  />
    </keep-alive>
    <main-info :isDesk="$route.name === 'desk-desk'"/>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
import subMenu from './main-sub-menu'
import { mapState, mapMutations } from 'vuex'
import MainInfo from './main-info'
import { getStore, setStore } from '@/utils/storage'
import { addExportDownload } from '@/service/setting'
export default {
  data () {
    return {
      rightWidth:'',
      menuList: [],
      dynamicMenuRoutes: [],
      isRouteAlive: true
    }
  },
  provide() {
    return {
      reload: this.reload,
      exportList: this.exportList
    }
  },
  components: { subMenu, MainInfo },
  computed: {
    ...mapState({
      documentClientHeight: state => state.common.documentClientHeight,
      menu(state) {
        if (state.common.menu) {
          return state.common.menu
        } else {
          return getStore({name: 'company-menu'}) || {}
        }
      },
      isAuthentication(state) {
        const commonInfo = getStore({name: 'commonInfo'})
        if (commonInfo) {
          if (state.common.needRefreshFlag) {
            return commonInfo.companyIsAuthentication == 1
          } else  {
            return commonInfo.companyIsAuthentication == 1
          }
        } else {
          return true
        }
      }
    }),
    includeList(){
      let list = this.dynamicMenuRoutes.filter(main => {
        return main.keepAlive
      }).map(item => item.name)
      console.log('includeList:' + list)
      return list
    },

    currentSubItemId() {
      const { sub } = this.menu
      return sub
    },
    menuActiveInfo() {
      const { active } = this.menu
      const { meta = {} } = active || {}
      return meta
    },
    subMenuList() {
      if (this.menu) {
        const { main, sub, active } = this.menu
        const mainMenu = this.menuList.find(item => {
          return item.id === main
        })
        const list = (mainMenu && mainMenu.list) ? mainMenu.list : []
        let newList = []
        if ( list && list.length > 0) {
          newList = list.map(item => {
            if (item.id === sub) {
              return {
                ...item,
                isActive: true
              }
            } else {
              return {
                ...item,
                isActive: false
              }
            }
          })
        }
        return newList
      } else {
        return []
      }
    },
    siteContentViewHeight () {
      var height = this.documentClientHeight - 50 - 30 - 2
      return this.subMenuList && this.subMenuList.length > 0? {minHeight: height-50 + 'px'} : {minHeight: height + 'px'}
    },

  },
  methods: {
    ...mapMutations({
      routeHandle: 'common/updateMenu',
    }),
    reload() {
      this.isRouteAlive = false
      this.$nextTick(() => {
        this.isRouteAlive = true
      })
    },
    async exportList(length, filename, type, query, cb) {
      // if (length > 1000) {
        const { data } = await addExportDownload({
          name: filename,
          param: JSON.stringify(query),
          type
        })
        if (data.code === 0) {
          // 调用导出任务接口
          this.$easyAlert.show({
            title: '提示',
            content: `<div>申请导出成功，约${length}条记录，请稍后到【我的下载】下载。请耐心等待导出，切勿重复提交任务。</div>`,
            confirm: () => {
              this.$easyAlert.hide()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      // } else {
      //   if (cb) {
      //     cb()
      //   }
      // }
    },
    widthAuto(){
      var width = document.documentElement['clientWidth']
      var centerL = $('.left-fixed').width()+10+15
      var rightWidth = width-188-centerL
      this.rightWidth = rightWidth
      window.onresize = () => {
        var width = document.documentElement['clientWidth']
        var centerL = $('.left-fixed').width()+10+15
        var rightWidth = width-188-centerL
        this.rightWidth = rightWidth
      }
    },
    changeItem(menu) {
      setStore({type: 'session', name: 'company-menu', content: {
        ...this.menu,
        sub: menu.id
      }})
      this.routeHandle({...this.menu, sub: menu.id})
      this.goTo()
    },
    goTo() {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.id === this.currentSubItemId)
      if (route && route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem('company-menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('company-dynamicMenuRoutes') || '[]')
  },
  watch: {
    currentMainItem: function(n, o) {
      this.currentSubItemId = ''
    },
  }
}
</script>
<style lang="scss" scope>
@import '~@/assets/scss/_variables.scss';
  // .right-fixed {
  //   position: fixed;
  //   right: 5px;
  // }
  .sub-menu-content{
    overflow: hidden;
    padding: 0 15px;
    margin-bottom: 12px;
    background-color: #fff;
  }
  .bread-crumbs{
    padding-bottom: 10px;
    font-size: 16px;
  }
  .background-none {
    background: none;
    box-shadow: none!important;
    border: none;
  }
  .background-none .el-card__body {
    padding: 0;
  }
  .info{
    padding: 10px;
    .el-card__body{
      padding: 0!important;
    }
    .title{
      background-color: #F8F8F8;
      padding: 10px;
      color: #4C4E58;
      font-size: 16px;
      margin-bottom: 5px;
      overflow: hidden;
      .more{
        float:right;
        color: $info--sub-font-color;
        font-size: 14px;
        img{
          margin-left: 5px;
          height: 12px;
        }
      }
    }
    .content{
      background-color: #F8F8F8;
      margin-bottom: 15px;
      .content-news{
        padding: 10px;
      }
    }
  }
  .help-item{
    background-color: #F8F8F8;
    margin-bottom: 5px;
    overflow: hidden;
    color: $info--sub-font-color;
    padding: 10px;
    cursor: pointer;
    img{
      width: 24px;
      margin-right: 20px
    }
  }
  .platform{
    background-color: #F8F8F8;
    padding: 15px;
    overflow: hidden;
    margin-bottom: 10px;
    .platform-icon{
      width: 38px;
      height: 38px;
      float: left;
    }
    .platform-info{
      float: left;
      margin-left: 15px;
      .text{
        font-size: 18px;
        color: $info--main-font-color;
        margin-bottom: 5px;
      }
      .tip {
        font-size: 12px;
        color: $info--sub-font-color;
      }
    }
  }

</style>

