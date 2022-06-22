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
  // { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  // { path: '/lock', component: _import('common/lock'), name: 'lock', meta: { title: '锁屏' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('layout/main'),
  name: 'main',
  redirect: { name: 'desk-desk' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/desk-desk', component: _import('modules/desk/desk'), name: 'desk-desk', meta: { title: '工作台' } },

    // 查看商品
    { path: '/goods-view', component: _import('modules/goods/goods-view'), name: 'goods-view', meta: { title: '商品信息', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },
    // 编辑商品
    { path: '/goods-add-or-update', component: _import('modules/goods/goods-add-or-update'), name: 'goods-add-or-update', meta: { bread:true, title: '商品', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },
    //克隆商品
    // { path: '/goods-copy', component: _import('modules/goods/goods-copy'), name: 'goods-copy', meta: { title: '商品克隆', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },
    // 预约设置
    { path: '/reservation', component: _import('modules/goods/reservation'), name: 'reservation', meta: { title: '预约设置', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },

    // 结算中心
    { path: '/settlement-cost-detail', component: _import('modules/settlement/costDocuments/detail'), name: 'settlement-cost-detail', meta: { title: '直调成本', parentRouter: '/settlement-costDocuments-list', parentName: '结算中心', menuName: '结算中心'} },
    { path: '/settlement-cost-add', component: _import('modules/settlement/costDocuments/add-or-update'), name: 'settlement-cost-add', meta: { bread:true,title: '直调成本', parentRouter: '/settlement-costDocuments-list', parentName: '结算中心', menuName: '结算中心'} },

    // 查看 营销活动
    { path: '/campaign-view', component: _import('modules/campaign/storePromotion/coupon/campaign-view'), name: 'campaign-view', meta: { title: '优惠券详情', parentRouter: '/campaign-storePromotion-coupon-campaign', parentName: '优惠券', menuName: '营销中心'  } },
    // 查看 特卖活动
    { path: '/campaign-wechatMarketing-activeList-specail', component: _import('modules/campaign/wechatMarketing/activeList/specail'), name: 'campaign-wechatMarketing-activeList-specail', meta: { title: '特卖活动', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
    // 查看 大转盘
    { path: '/campaign-wechatMarketing-activeList-bigWheel', component: _import('modules/campaign/wechatMarketing/activeList/bigWheel'), name: 'campaign-wechatMarketing-activeList-bigWheel', meta: { title: '大转盘', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
    // 查看 社区拼团
    { path: '/campaign-wechatMarketing-activeList-communityGroup', component: _import('modules/campaign/wechatMarketing/activeList/communityGroup'), name: 'campaign-wechatMarketing-activeList-communityGroup', meta: { title: '社区拼团', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
    // 查看 礼品卡
    { path: '/countCard-view', component: _import('modules/campaign/storePromotion/countCard/countCard-view'), name: 'countCard-view', meta: { title: '礼品卡详情', parentRouter: '/campaign-storePromotion-countCard-countCard', parentName: '礼品卡', menuName: '营销中心'  } },
    // 查看 特卖活动
    { path: '/campaign-wechatMarketing-activeList-specailadd', component: _import('modules/campaign/wechatMarketing/activeList/specailadd'), name: 'campaign-wechatMarketing-activeList-upspecailadd', meta: { title: '特卖活动', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
    // 查看 大转盘
    { path: '/campaign-wechatMarketing-activeList-bigWheeladd', component: _import('modules/campaign/wechatMarketing/activeList/bigWheeladd'), name: 'campaign-wechatMarketing-activeList-upbigWheeladd', meta: { title: '大转盘', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
    // 查看 社区拼团
    { path: '/campaign-wechatMarketing-activeList-communityGroupadd', component: _import('modules/campaign/wechatMarketing/activeList/communityGroupadd'), name: 'campaign-wechatMarketing-activeList-upcommunityGroupadd', meta: { title: '社区拼团', parentRouter: '/campaign-wechatMarketing-activeList-activeList', parentName: '活动列表', menuName: '营销中心'  } },
 
    // 编辑 员工
    { path: '/staff-edit', component: _import('modules/staffManagement/staff-edit'), name: 'staff-edit', meta: { title: '编辑员工', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },
    // 查看员工详情
    { path: '/staff-view', component: _import('modules/staffManagement/staff-view'), name: 'staff-view', meta: { title: '员工详情', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },

    // 新增/编辑我的顾客
    { path: '/mycustomer-add-or-update', component: _import('modules/mycustomer/mycustomer-add-or-update'), name: 'mycustomer-add-or-update', meta: { bread:true,  title: '顾客', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
	  // 查看我的顾客
    { path: '/mycustomer-view', component: _import('modules/mycustomer/mycustomer-view'), name: 'mycustomer-view', meta: { title: '顾客详情', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 资产
    { path: '/mycustomer-customerCard', component: _import('modules/mycustomer/components/customerCard'), name: 'mycustomer-customerCard', meta: { title: '资产', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 查看储值卡记录
    { path: '/mycustomer-storedValueCard', component: _import('modules/mycustomer/mycustomer-storedValueCard'), name: 'mycustomer-storedValueCard', meta: { title: '储值卡充值记录', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },

    // 零售订单
    { path: '/retailOrder-view', component: _import('modules/order/retailOrder/order-view'), name: 'retailOrder-view', meta: { title: '零售订单详情', parentRouter: '/order-retailOrder-order', parentName: '零售订单', menuName: '订单管理'  } },
    // 礼品卡订单
    { path: '/countcardOrder-view', component: _import('modules/order/countcardOrder/order-view'), name: 'countcardOrder-view', meta: { title: '礼品卡订单详情', parentRouter: '/order-countcardOrder-order', parentName: '礼品卡订单', menuName: '订单管理'  } },
    // 充值订单
    { path: '/rechargeOrder-view', component: _import('modules/order/rechargeOrder/order-view'), name: 'rechargeOrder-view', meta: { title: '充值订单详情', parentRouter: '/order-rechargeOrder-order', parentName: '充值订单', menuName: '订单管理'  } },
    // 退货单
    { path: '/returnOrder-view', component: _import('modules/order/returnOrder/order-view'), name: 'returnOrder-view', meta: { title: '退货单详情', parentRouter: '/order-returnOrder-order', parentName: '退货单', menuName: '订单管理'  } },
    // 兑换订单
    { path: '/exchangeOrder-view', component: _import('modules/order/exchangeOrder/order-view'), name: 'exchangeOrder-view', meta: { title: '兑换订单详情', parentRouter: '/order-exchangeOrder-order', parentName: '兑换订单', menuName: '订单管理'  } },
    // 芝麻合伙人订单
    { path: '/mamiOrder-view', component: _import('modules/order/mamiOrder/order-view'), name: 'mamiOrder-view', meta: { title: '芝麻合伙人订单详情', parentRouter: '/order-mamiOrder-order', parentName: '芝麻合伙人订单', menuName: '订单管理'  } },
    // 储值卡退款单
    { path: '/storedvalueCard-view', component: _import('modules/order/storedvalueCard/order-view'), name: 'storedvalueCard-view', meta: { title: '储值卡退款单详情', parentRouter: '/order-storedvalueCard-order', parentName: '储值卡退款单', menuName: '订单管理'  } },
    // 品牌方订单
    { path: '/activityOrder-view', component: _import('modules/order/activityOrder/order-view'), name: 'activityOrder-view', meta: { title: '品牌方活动订单详情', parentRouter: '/order-activityOrder-order', parentName: '品牌方活动订单', menuName: '订单管理'  } },

    // 基础信息
    { path: '/accountsetting-baseInfo', component: _import('modules/accountsetting/baseInfo'), name: 'accountsetting-baseInfo', meta: { title: '基础信息', menuName: '账户设置'} },
    // 修改密码
    { path: '/accountsetting-changePassword', component: _import('modules/accountsetting/changePassword'), name: 'accountsetting-changePassword', meta: { title: '修改密码', menuName: '账户设置'} },
    // 我的下载
    { path: '/accountsetting-download', component: _import('modules/accountsetting/download'), name: 'accountsetting-download', meta: { title: '我的下载', menuName: '公共页面'} },

    // 新建入库单
    { path: '/stockManagement-instock-interStockAdd', component: _import('modules/stockManagement/instock/interStockAdd'),name: 'stockManagement-instock-interStockAdd',meta: {bread:true, title: '入库单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
	  // 新建出库单
    { path: '/stockManagement-outstock-outStockAdd', component: _import('modules/stockManagement/outstock/outStockAdd'),name: 'stockManagement-outstock-outStockAdd',meta: {bread:true, title: '出库单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
	  // 新建退货单
    { path: '/stockManagement-returnStock-returnStockAdd', component: _import('modules/stockManagement/returnStock/returnStockAdd'),name: 'stockManagement-returnStock-returnStockAdd',meta: {bread:true, title: '退货单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
    // 新建、编辑盘点单
    { path: '/stockManagement-inventory-add', component: _import('modules/stockManagement/inventory-add'),name: 'stockManagement-inventory-add',meta: { bread:true, title: '盘点单', parentRouter: '/stockManagement-inventoryManagement', parentName: '盘点管理', menuName: '库存管理' }  },
    // 新建订货单
    { path: '/stockManagement-requiredAdd', component: _import('modules/stockManagement/requiredAdd'),name: 'stockManagement-requiredAdd',meta: { bread:true, title: '订货单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },

    // 新增 员工
    { path: '/staff-add', component: _import('modules/staffManagement/staff-add'), name: 'staff-add', meta: { title: '新增员工', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },
  ],
  beforeEnter (to, from, next) {//模块在跳转前，会有根据登录情况的判断进入的模块
    let token = Vue.cookie.get('store-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/login')
      // next({ name: 'login' })
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
      window._hmt.push(['_trackPageview', location.href.replace(location.origin + '/store/#','/store')])
    }
  }
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    let token = Vue.cookie.get('store-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/login')
      // next({ name: 'login' })
      return
    }
    http({
      url: http.adornUrl('/sys/store/sysMenu/nav'),
      method: 'get',
      selfHandleError: true,
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('store-menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('store-permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('store-menuList', '[]')
        sessionStorage.setItem('store-permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/login')
      // router.push({ name: 'login' })
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
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('store-dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
