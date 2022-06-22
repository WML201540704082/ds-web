import { getStore, setStore } from '@/utils/storage'
export default {
  namespaced: true,
  state: {
    // width
    documentWidth: 300,
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    // menuActive: getStore({name: 'company-menu'}),
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 当前选中的菜单项
    menu: null,
    needRefreshFlag: false
  },
  mutations: {
    updateDocumentWidth (state, right) {
      state.documentWidth = right
    },
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateMenu(state, item) {
      state.menu = item
    },
    updateIsAuthentication(state){
      state.needRefreshFlag = !state.needRefreshFlag
    }
  }
}
