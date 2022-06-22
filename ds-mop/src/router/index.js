/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import { getStore } from '@/utils/storage'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
// const _import = require('./import-development')

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  { path: '/lock', component: _import('common/lock'), name: 'lock', meta: { title: '锁屏' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('layout/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '总控制台' } },

    // 新增/编辑-企业
    { path: '/company-add-or-update', component: _import('modules/company/company-add-or-update'), name: 'company-add-or-update', meta: { bread:true, title: '企业', parentRouter: '/company-company', parentName: '企业列表', menuName: '企业列表' } },
    // 查看-企业
    { path: '/company-view', component: _import('modules/company/company-view'), name: 'company-view', meta: { title: '企业信息', parentRouter: '/company-company', parentName: '企业列表', menuName: '企业列表' } },
    // 企业-分账
    { path: '/company-distribute', component: _import('modules/company/company-distribute'), name: 'company-distribute', meta: { title: '分账开户', parentRouter: '/company-company', parentName: '企业列表', menuName: '企业列表' } },

    // 新增/编辑门店
    { path: '/store-add-or-update', component: _import('modules/store/store-add-or-update'), name: 'store-add-or-update', meta: { bread:true,title: '门店', parentRouter: '/store-store', parentName: '企业门店', menuName: '企业门店' } },
    // 查看门店
    { path: '/store-view', component: _import('modules/store/store-view'), name: 'store-view', meta: { title: '门店信息', parentRouter: '/store-store', parentName: '企业门店', menuName: '企业门店'  } },

    // 零售订单
    { path: '/retailOrder-view', component: _import('modules/order/retailOrder/order-view'), name: 'retailOrder-view', meta: { title: '零售订单详情', parentRouter: '/order-retailOrder-order', parentName: '零售订单', menuName: '订单中心'  } },
    // 礼品卡订单
    { path: '/countcardOrder-view', component: _import('modules/order/countcardOrder/order-view'), name: 'countcardOrder-view', meta: { title: '礼品卡订单详情', parentRouter: '/order-countcardOrder-order', parentName: '礼品卡订单', menuName: '订单中心'  } },
    // 充值订单
    { path: '/rechargeOrder-view', component: _import('modules/order/rechargeOrder/order-view'), name: 'rechargeOrder-view', meta: { title: '充值订单详情', parentRouter: '/order-rechargeOrder-order', parentName: '充值订单', menuName: '订单中心'  } },
    // 兑换订单
    { path: '/exchangeOrder-view', component: _import('modules/order/exchangeOrder/order-view'), name: 'exchangeOrder-view', meta: { title: '兑换订单详情', parentRouter: '/order-exchangeOrder-order', parentName: '兑换订单', menuName: '订单管理'  } },
    // 退货单
    { path: '/returnOrder-view', component: _import('modules/order/returnOrder/order-view'), name: 'returnOrder-view', meta: { title: '退货单详情', parentRouter: '/order-returnOrder-order', parentName: '退货单', menuName: '订单中心'  } },
    // 储值卡退款单
    { path: '/storedvalueCard-view', component: _import('modules/order/storedvalueCard/order-view'), name: 'storedvalueCard-view', meta: { title: '储值卡退款单详情', parentRouter: '/order-storedvalueCard-order', parentName: '储值卡退款单', menuName: '订单管理'  } },
    // // 储值卡退款单
    // { path: '/activityOrder-view', component: _import('modules/order/activityOrder/order-view'), name: 'activityOrder-view', meta: { title: '品牌方活动订单详情', parentRouter: '/order-activityOrder-order', parentName: '品牌方活动订单', menuName: '订单管理'  } },
    // 查看短信审核
    { path: '/shortmessage-view', component: _import('modules/audit/shortmessage-view'), name: 'shortmessage-view', meta: { title: '短信', parentRouter: '/audit-shortmessage', parentName: '短信审核', menuName: '审核中心'  } },

    // 结算-订单列表
    { path: '/settlement-order', component: _import('modules/settlement/order'), name: 'settlement-order', meta: { title: '结算详情', parentRouter: '/settlement-settlement', parentName: '结算中心', menuName: '结算中心'  } },


    // 特卖活动详情
    { path: '/specail-view', component: _import('modules/audit/activity/specail-view'), name: 'specail-view', meta: { title: '活动内容', parentRouter: '/audit-activity', parentName: '活动审核', menuName: '活动审核'  } },

    // 直播审核详情
    { path: '/live-view', component: _import('modules/audit/liveStreaming/live-view'), name: 'live-view', meta: { title: '直播内容', parentRouter: '/audit-liveStreaming-live', parentName: '直播审核', menuName: '直播审核'  } },

    // 大转盘详情
    { path: '/bigwheel-view', component: _import('modules/audit/activity/bigwheel-view'), name: 'bigwheel-view', meta: { title: '活动内容', parentRouter: '/audit-activity', parentName: '活动审核', menuName: '活动审核'  } },

    // 支付有礼详情
    { path: '/paygift-view', component: _import('modules/audit/activity/paygift-view'), name: 'paygift-view', meta: { title: '活动内容', parentRouter: '/audit-activity', parentName: '活动审核', menuName: '活动审核'  } },

    // 查看短信余量
    { path: '/message-view', component: _import('modules/company/message-view'), name: 'message-view', meta: { title: '短信余量信息', parentRouter: '/company-shortmessage', parentName: '短信余量', menuName: '短信余量'  } },

    // 充值短信
    { path: '/recharge', component: _import('modules/company/recharge'), name: 'recharge', meta: { title: '短信充值', parentRouter: '/company-shortmessage', parentName: '短信余量', menuName: '短信余量'  } },

    //合同查看/审核
    { path: '/contract-view-or-audit', component: _import('modules/contract/contract-view-or-audit'), name: 'contract-view-or-audit', meta: { title: '查看/审核合同', parentRouter: '/contract-contract', parentName: '合同管理', menuName: '查看/审核合同'  } },

    // 新增/编辑销售人员
    { path: '/sale-add-or-update', component: _import('modules/contract/sale-add-or-update'), name: 'sale-add-or-update', meta: { bread:true, title: '销售人员', parentRouter: '/contract-sale', parentName: '销售管理', menuName: '销售管理'  } },

    // 查看销售人员
    { path: '/sale-view', component: _import('modules/contract/sale-view'), name: 'sale-view', meta: { title: '查看销售人员信息', parentRouter: '/contract-sale', parentName: '销售管理', menuName: '查看销售人员信息'  } },
  ],
  beforeEnter (to, from, next) {//模块在跳转前，会有根据登录情况的判断进入的模块
    let token = Vue.cookie.get('mop-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    } else {
      next()
    }
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  if (window._hmt) {
    if (to.path) {
      window._hmt.push(['_setAutoPageview', false])
      window._hmt.push(['_trackPageview', location.href.replace(location.origin + '/#','')])
    }
  }
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    let token = Vue.cookie.get('mop-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
      return
    }
    http({
      url: http.adornUrl('/sys/mop/sysMenu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('mop-menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('mop-permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('mop-menuList', '[]')
        sessionStorage.setItem('mop-permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace(/\//g, '-'),
        component: null,
        name: menuList[i].url.replace(/\//g, '-'),
        meta: {
          id: menuList[i].id,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        },
        keepAlive: menuList[i].keepAlive
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].id}`
        route['name'] = `i-${menuList[i].id}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: 'login' } }
    ])
    sessionStorage.setItem('mop-dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
