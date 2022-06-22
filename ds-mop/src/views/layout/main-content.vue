<template>
  <main class="site-content inner__wrapper">
    <!-- 右侧顶部导航栏 -->
    <div class="sub-menu-content" v-show="subMenuList.length > 0">
      <sub-menu v-for="menu in subMenuList" @changeSubview="changeItem" :key="menu.id" :menu="menu"/>
    </div>
    <div class="bread-crumbs" v-show="menuActiveInfo && menuActiveInfo.parentName">
      <router-link :to="menuActiveInfo.parentRouter || '/home'">{{menuActiveInfo.parentName}}</router-link> >>
      {{menuActiveInfo.bread? (($route.query&&$route.query.id)?'编辑'+menuActiveInfo.title:'新增'+menuActiveInfo.title) : menuActiveInfo.title}}
    </div>
    <keep-alive v-if="isRouteAlive" :include="includeList">
      <router-view :key="$route.fullPath"/>
    </keep-alive>
    <main-info :isDesk="$route.name === 'home'"/>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
import subMenu from './main-sub-menu'
import { mapState, mapMutations } from 'vuex'
import MainInfo from './main-info'
import { getStore, setStore } from '@/utils/storage'
export default {
  data () {
    return {
      rightWidth:'',
      menuList: [],
      isRouteAlive: true,
      dynamicMenuRoutes: []
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
          return getStore({name: 'mop-menu'}) || {}
        }
      }
    }),
    currentSubItemId() {
      const { sub } = this.menu
      return sub
    },

    includeList(){
      let list = this.dynamicMenuRoutes.filter(main => {
        return main.keepAlive
      }).map(item => item.name)
      console.log('includeList:' + list)
      return list
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
  },
  provide() {
    return {
      reload: this.reload
    }
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
    // 触发 subMenu这个组件的单个菜单
    changeItem(menu) {
      setStore({type: 'session', name: 'mop-menu', content: {
        ...this.menu,
        sub: menu.id
      }})
      this.routeHandle({...this.menu, sub: menu.id})
      this.goTo(menu)
    },
    // 过滤出动态组件id与当前点击的id一致的route
    goTo() {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.id === this.currentSubItemId)
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  },
  mounted(){
    this.widthAuto()
  },
  created() {
    // 通过接口获取的菜单
    this.menuList = JSON.parse(sessionStorage.getItem('mop-menuList') || '[]')
    // 动态组件菜单
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('mop-dynamicMenuRoutes') || '[]')
  },
  watch: {
    currentMainItem: function(n, o) {
      this.currentSubItemId = ''
    }
  }
}
</script>
<style lang="scss" scope>
  // .right-fixed {
  //   position: fixed;
  //   right: 5px;
  // }
  .sub-menu-content{
    overflow: hidden;
    padding: 0 15px;
    margin-bottom: 15px;
    background-color: #fff;
  }
  .bread-crumbs{
    padding-bottom: 10px;
    font-size: 16px;
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
    }
    .content{
      background-color: #F8F8F8;
      .content-news{
        padding: 10px;
      }
    }
  }
</style>

