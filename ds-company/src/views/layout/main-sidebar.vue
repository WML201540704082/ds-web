<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <GeminiScrollbar class="my-scroll-bar">
      <div class="site-sidebar__inner">
        <el-menu
          :default-active=" menuActiveName || 'desk-desk'"
          :collapse="sidebarFold"
          :collapseTransition="false"
          class="site-sidebar__menu">
          <el-menu-item index="desk-desk" @click="$router.push({ name: 'desk-desk' })">
            <icon-svg name="workspace" class="site-sidebar__menu-icon"></icon-svg>
            <span class="menu-title" slot="title">工作台</span>
          </el-menu-item>
          <el-menu-item
            v-for="menu in menuList"
            :key="menu.id"
            :index="menu.name + ''"
            @click="() => handleMenuClick(menu)"
          >
            <icon-svg :name="menu.icon" :class="menu.id === iconActiveId ? 'icon-selected': 'icon'"></icon-svg>
            <span class="menu-title" >{{ menu.name }}</span>
          </el-menu-item>
        </el-menu>
        <div v-show="!sidebarFold"  class="copyright">Copyright © {{year}}.冠通新创</div>
      </div>
    </GeminiScrollbar>
  </aside>
</template>

<script>
import { isURL } from '@/utils/validate'
import { mapMutations, mapState } from 'vuex'
import { getStore, setStore } from '@/utils/storage'
import _ from 'lodash'
export default {
  data() {
    return {
      iconActiveId: 0,
      isAuthentication: null,
      year: new Date().getFullYear()
    }
  },
  computed: {
    ...mapState({
      sidebarLayoutSkin: state => state.common.sidebarLayoutSkin,
      sidebarFold: state => state.common.sidebarFold,
      menuActiveName(state) {
        let activeMenu = null
        if (state.common.menu) {
          const { active = {} } = state.common.menu || {}
          activeMenu = active
        } else {
          const { active = {} } = getStore({name: 'company-menu'}) || {}
          activeMenu = active
        }
        if ( activeMenu.meta  && activeMenu.meta.menuName) {
          return activeMenu.meta.menuName
        } else {
          return activeMenu.name
        }
      }
    }),

  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('company-menuList') || '[]')
    //this.$route 当前路由
    this.isAuthentication = getStore({name: 'company-info'})
  },
  watch: {
    $route: function(n, o) {
      if (this.isAuthentication === 0) {
        this.$router.replace({name: 'settings-company'})
        this.$message('请先完成企业认证或耐心等待审核通过')
        return
      }
      if (!n.meta.id) {
        const { matched, ...menu } = n
        setStore({type: 'session', name: 'company-menu', content: {
          active: menu,
          main: null,
          sub: null,
        }})
        this.routeHandle({main: null, sub: null, active: menu})
        this.iconActiveId = 0
      } else {
        // 寻找id的主菜单和子菜单
        let mainMenu = null
        this.menuList.forEach(item => {
          item.list && item.list.forEach(subItem => {
            if(subItem.id === n.meta.id) {
              mainMenu = item
            }
          })
        })
        setStore({type: 'sessionn', name: 'company-menu', content: {
          active: mainMenu,
          main: mainMenu.id,
          sub: n.meta.id,
        }})
        this.routeHandle({main: mainMenu.id, sub: n.meta.id, active: mainMenu})
      }

    }
  },
  methods: {
    ...mapMutations({
      routeHandle: 'common/updateMenu',
    }),
    handleMenuClick(menu) {
      this.$router.push({name: menu.list[0].url.replace(/\//g, '-'),})
    },
  }
}
</script>

<style lang="scss" scope>
.my-scroll-bar {
  .gm-scrollbar {
    right: 0!important;
  }
  .gm-scrollbar.-horizontal {
    display: none;
  }
  .gm-scrollbar .thumb {
    background-color: rgba(0,0,0,.3);
  }
  .gm-scrollbar .thumb:hover {
    background-color: rgba(0,0,0,.5);
  }
  .gm-scrollbar-container .gm-scroll-view {
    overflow-x: hidden!important;
  }
  .site-sidebar__inner {
    overflow: visible;
    position: relative;
    min-height: 570px;
    .copyright{
      position: absolute;
      bottom: 15px;
      width: 100%;
      font-size: 10px;
      text-align: center;
      color: #8a979e;
    }

  }
}
</style>
