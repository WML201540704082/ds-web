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
import { clearLoginInfo,showProgressSpeed } from '@/utils'
import { getStore } from '@/utils/storage'
import { Message } from 'element-ui'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
// const _import = require('./import-development')

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  { path: '/change', component: _import('common/change'), name: 'change', meta: { title: '萌百格' } },
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

    // 对账结算历史
    // { path: '/settlement-history', component: _import('modules/settings/settlement-history'), name: 'settlement-history', meta: { title: '对账结算历史', parentRouter: '/settlement-settlement', parentName: '对账结算', menuName: '通用设置'} },
    // 企业结算对应订单
    { path: '/settlement-order', component: _import('modules/settings/settlement-order'), name: 'settlement-order', meta: { title: '企业结算对应订单', parentRouter: '/settings-settlement-history', parentName: '企业结算', menuName: '结算中心'} },
    // 门店结算对应订单
    { path: '/settlement-order-store', component: _import('modules/settings/storeSettlement/settlement-order-store'), name: 'settlement-order-store', meta: { title: '门店结算对应订单', parentRouter: '/settings-storeSettlement-settlement-store', parentName: '门店结算', menuName: '结算中心'} },
    { path: '/settlement-cost-detail', component: _import('modules/settlement/costDocuments/detail'), name: 'settlement-cost-detail', meta: { title: '直调成本', parentRouter: '/settlement-costDocuments-list', parentName: '结算中心', menuName: '结算中心'} },

    // 新增/编辑门店
    { path: '/store-add-or-update', component: _import('modules/settings/storeManagement/store-add-or-update'), name: 'store-add-or-update', meta: { bread:true, title: '门店', parentRouter: '/settings-storeManagement-store', parentName: '门店管理', menuName: '通用设置' } },
    // 查看门店
    { path: '/store-view', component: _import('modules/settings/storeManagement/store-view'), name: 'store-view', meta: { title: '门店信息', parentRouter: '/settings-storeManagement-store', parentName: '门店管理', menuName: '通用设置' } },

    // 新增/编辑商品
    { path: '/goods-add-or-update', component: _import('modules/goods/goods-add-or-update'), name: 'goods-add-or-update', meta: { bread:true, title: '商品', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },
    // 查看商品
    { path: '/goods-view', component: _import('modules/goods/goods-view'), name: 'goods-view', meta: { title: '商品信息', parentRouter: '/goods-goods', parentName: '商品管理', menuName: '商品管理' } },
    // 查看门店详情
    { path: '/goods-store-view', component: _import('modules/goods/goods-store-view'), name: 'goods-store-view', meta: { title: '商品信息', parentRouter: '/goods-store-goods', parentName: '商品管理', menuName: '商品管理' } },
    //编辑茶饮
    { path: '/goods-tea-setting', component: _import('modules/goods/goods-tea-setting'), name: 'goods-tea-setting', meta: { title: '商品编辑/新增', parentRouter: '/goods-goods-tea', parentName: '商品管理', menuName: '商品管理' } },
    //查看茶饮详情
    { path: '/goods-tea-view', component: _import('modules/goods/goods-tea-view'), name: 'goods-tea-view', meta: { title: '商品详情', parentRouter: '/goods-goods-tea', parentName: '商品管理', menuName: '商品管理' } },
    //门店菜单
    { path: '/goods-storetea-view', component: _import('modules/goods/goods-storetea-view'), name: 'goods-storetea-view', meta: { title: '菜单详情', parentRouter: '/goods-goods-store-tea', parentName: '商品管理', menuName: '商品管理' } },
    //门店菜单详情
    { path: '/goods-tea-category-view', component: _import('modules/goods/goods-tea-category-view'), name: 'goods-tea-category-view', meta: { title: '分类管理详情', parentRouter: '/goods-goods-tea-category', parentName: '商品管理', menuName: '商品管理' } },
    
    //茶饮分类管理详情
    { path: '/goods-storetea-detail', component: _import('modules/goods/goods-storetea-detail'), name: 'goods-storetea-detail', meta: { title: '商品详情', parentRouter: '/goods-storetea-view', parentName: '商品管理', menuName: '商品管理' } },

    // 新增 营销活动
    { path: '/campaign-add', component: _import('modules/campaign/storePromotion/coupon/campaign-add'), name: 'campaign-add', meta: { title: '新增优惠券', parentRouter: '/campaign-storePromotion-coupon-campaign', parentName: '营销中心', menuName: '营销中心' } },
    // 查看 营销活动
    { path: '/campaign-view', component: _import('modules/campaign/storePromotion/coupon/campaign-view'), name: 'campaign-view', meta: { title: '优惠券详情', parentRouter: '/campaign-storePromotion-coupon-campaign', parentName: '营销中心', menuName: '营销中心'  } },

    // 新增 礼品卡
    { path: '/countCard-add', component: _import('modules/campaign/storePromotion/countCard/countCard-add'), name: 'countCard-add', meta: { title: '新增礼品卡', parentRouter: '/campaign-storePromotion-countCard-countCard', parentName: '礼品卡', menuName: '营销中心' } },
    // 查看 营销活动
    { path: '/countCard-view', component: _import('modules/campaign/storePromotion/countCard/countCard-view'), name: 'countCard-view', meta: { title: '礼品卡详情', parentRouter: '/campaign-storePromotion-countCard-countCard', parentName: '礼品卡', menuName: '营销中心'  } },
    // gift 营销活动
    { path: '/countCard-salesList', component: _import('modules/campaign/storePromotion/countCard/salesList'), name: 'countCard-salesList', meta: { title: '销售明细', parentRouter: '/campaign-storePromotion-countCard-countCard', parentName: '礼品卡', menuName: '营销中心'  } },
    // sales 营销活动
    { path: '/countCard-giftList', component: _import('modules/campaign/storePromotion/countCard/giftList'), name: 'countCard-giftList', meta: { title: '赠送明细', parentRouter: '/campaign-storePromotion-countCard-countCard', parentName: '礼品卡', menuName: '营销中心'  } },
    
    // 优惠券发放记录
    { path: '/coupon-sendList', component: _import('modules/campaign/storePromotion/coupon/sendList'), name: 'coupon-sendList', meta: { title: '优惠券发放记录', parentRouter: '/campaign-storePromotion-coupon-campaign', parentName: '优惠券', menuName: '营销中心'  } },
    
    // 新增or编辑组合搭售活动
    { path: '/sales-add-or-update', component: _import('modules/campaign/storePromotion/promote/sales/newSales'), name: 'sales-add-or-update', meta: {bread:true, title: '组合搭售活动', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心' } },
    // 新建or编辑第N件商品活动
    { path: '/discount-add-or-update', component: _import('modules/campaign/storePromotion/promote/discount/newDiscount'), name: 'discount-add-or-update', meta: {bread:true, title: '第N件商品活动', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心' } },
    // 查看组合搭售活动/第N件打折
    { path: '/promote-view', component: _import('modules/campaign/storePromotion/promote/sales/saleOrDiscountView'), name: 'promote-view', meta: { title: '促销活动详情', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心'  } },
    // 查看第N件打折
    { path: '/discount-view', component: _import('modules/campaign/storePromotion/promote/sales/saleOrDiscountView'), name: 'discount-view', meta: { title: '促销活动详情', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心'  } },
    
    // 新建or编辑满减商品活动
    { path: '/full-add-or-update', component: _import('modules/campaign/storePromotion/promote/fullReduction/newFull'), name: 'full-add-or-update', meta: {bread:true, title: '满减商品活动', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心' } },
    // 查看满减活动
    { path: '/full-view', component: _import('modules/campaign/storePromotion/promote/fullReduction/fullView'), name: 'full-view', meta: { title: '满减活动详情', parentRouter: '/campaign-storePromotion-promote-list', parentName: '促销政策', menuName: '营销中心'  } },
    
    // 编辑 员工
    // { path: '/staff-edit', component: _import('modules/staffManagement/staff-edit'), name: 'staff-edit', meta: { title: '编辑员工', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },
    
    // 新增/编辑员工
    { path: '/staff-add-or-edit', component: _import('modules/staffManagement/staff-add-or-edit'), name: 'staff-add-or-edit', meta: {bread:true, title: '员工', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },
    
    // 提成明细
    { path: '/staff-commission', component: _import('modules/staffManagement/commission'), name: 'staff-commission', meta: { title: '收入明细', parentRouter: '/staffManagement-performance', parentName: '员工业绩', menuName: '员工业绩' } },

	  // 新增/编辑我的顾客
    { path: '/mycustomer-add-or-update', component: _import('modules/mycustomer/mycustomer-add-or-update'), name: 'mycustomer-add-or-update', meta: { bread:true,  title: '顾客', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 查看我的顾客
    { path: '/mycustomer-view', component: _import('modules/mycustomer/mycustomer-view'), name: 'mycustomer-view', meta: { title: '顾客信息', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 资产
    { path: '/mycustomer-customerCard', component: _import('modules/mycustomer/components/customerCard'), name: 'mycustomer-customerCard', meta: { title: '资产', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 查看储值卡记录
    { path: '/mycustomer-storedValueCard', component: _import('modules/mycustomer/mycustomer-storedValueCard'), name: 'mycustomer-storedValueCard', meta: { title: '储值卡充值记录', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },
    // 佣金明细
    { path: '/mycustomer-commissionCard', component: _import('modules/mycustomer/components/commissionCard'), name: 'mycustomer-commissionCard', meta: { title: '佣金', parentRouter: '/mycustomer-mycustomer', parentName: '我的顾客', menuName: '我的顾客' } },

    // 新建、编辑新人礼
    { path: '/campaign-giftBag-newPeople', component: _import('modules/campaign/giftBag/newPeople'),name: 'campaign-giftBag-newPeople',meta: {bread:true, title: '新人礼', parentRouter: '/campaign-giftBag-giftBag', parentName: '发券礼包', menuName: '发券礼包' }  },
    // 查看新人礼
    { path: '/giftBag-view', component: _import('modules/campaign/giftBag/giftBag-view'), name: 'giftBag-view', meta: { title: '详情', parentRouter: '/campaign-giftBag-giftBag', parentName: '发券礼包', menuName: '发券礼包'  } },
    
    // 新建、编辑进店有礼
    { path: '/campaign-giftBag-newInstore', component: _import('modules/campaign/giftBag/newInstore'),name: 'campaign-giftBag-newInstore',meta: {bread:true, title: '进店有礼', parentRouter: '/campaign-giftBag-giftBag', parentName: '发券礼包', menuName: '发券礼包' }  },

    // 新增、编辑购物卡 
    { path: '/campaign-intergralExchange-shoppingCards-newShoppingCards', component: _import('modules/campaign/intergralExchange/shoppingCards/newShoppingCards'),name: 'campaign-intergralExchange-shoppingCards-newShoppingCards',meta: {bread:true, title: '购物卡', parentRouter: '/campaign-intergralExchange-shoppingCards-shoppingCardsList', parentName: '购物卡', menuName: '购物卡' }  },

    //查看购物卡详情
    { path: '/shoppingCards-view', component: _import('modules/campaign/intergralExchange/shoppingCards/shoppingCards-view'), name: 'shoppingCards-view', meta: { title: '详情', parentRouter: '/campaign-intergralExchange-shoppingCards-shoppingCardsList', parentName: '购物卡', menuName: '购物卡'} },

    // 零售订单
    { path: '/retailOrder-view', component: _import('modules/order/retailOrder/order-view'), name: 'retailOrder-view', meta: { title: '零售订单详情', parentRouter: '/order-retailOrder-order', parentName: '零售订单', menuName: '订单管理'  } },
    
    // 收入明细-零售订单详情
    { path: '/order-view', component: _import('modules/staffManagement/component/order-view'), name: 'order-view', meta: { title: '零售订单详情', parentRouter: '/staffManagement-performance', parentName: '员工业绩', menuName: '员工业绩'} },
    
    // 收入明细-礼品卡订单详情
    { path: '/lpkOrder-view', component: _import('modules/staffManagement/component/lpkOrder-view'), name: 'lpkOrder-view', meta: { title: '礼品卡订单详情', parentRouter: '/staffManagement-performance', parentName: '员工业绩', menuName: '员工业绩'} },

    // 收入明细-订单详情-退货单
    { path: '/return-view', component: _import('modules/staffManagement/component/return-view'), name: 'return-view', meta: { title: '退货单详情', parentRouter: '/staffManagement-performance', parentName: '员工业绩', menuName: '员工业绩'  } },

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

    // 查看员工管理
    { path: '/staff-view', component: _import('modules/staffManagement/staff-view'), name: 'staff-view', meta: { title: '员工详情', parentRouter: '/staffManagement-staffList', parentName: '员工管理', menuName: '员工管理' } },

    // 基础信息
    { path: '/accountsetting-baseInfo', component: _import('modules/accountsetting/baseInfo'), name: 'accountsetting-baseInfo', meta: { title: '基础信息', menuName: '账户设置'} },
    // 修改密码
    { path: '/accountsetting-changePassword', component: _import('modules/accountsetting/changePassword'), name: 'accountsetting-changePassword', meta: { title: '修改密码', menuName: '账户设置'} },
    // 我的下载
    { path: '/accountsetting-download', component: _import('modules/accountsetting/download'), name: 'accountsetting-download', meta: { title: '我的下载', menuName: '公共页面'} },

    // 新建采购单
    { path: '/stockManagement-shopping-shoppingAdd', component: _import('modules/stockManagement/shopping/shoppingAdd'),name: 'stockManagement-shopping-shoppingAdd',meta: {bread:true, title: '采购单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
    // 新建or编辑入库单
    { path: '/stockManagement-instock-inStockAdd', component: _import('modules/stockManagement/instock/inStockAdd'),name: 'stockManagement-instock-inStockAdd',meta: {bread:true, title: '入库单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
    // 新建or编辑出库单
    { path: '/stockManagement-outstock-outStockAdd', component: _import('modules/stockManagement/outstock/outStockAdd'),name: 'stockManagement-outstock-outStockAdd',meta: {bread:true, title: '出库单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
    // 新建退货单
    { path: '/stockManagement-returnStock-newReturnForm', component: _import('modules/stockManagement/returnStock/newReturnForm'),name: 'stockManagement-returnStock-newReturnForm',meta: {bread:true, title: '退货单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '库存管理' } },
    // 新建退货单(从入库清单里操作的)
    { path: '/stockManagement-returnStock-newReturnStock', component: _import('modules/stockManagement/returnStock/newReturnStock'),name: 'stockManagement-returnStock-newReturnStock',meta: {bread:true, title: '退货单', parentRouter: '/stockManagement-instock-inStockList', parentName: '入库清单', menuName: '入库清单' } },
    // 新建、编辑盘点单
    { path: '/stockManagement-inventoryStock-inventory-add', component: _import('modules/stockManagement/inventoryStock/inventory-add'),name: 'stockManagement-inventoryStock-inventory-add',meta: {bread:true, title: '盘点单', parentRouter: '/stockManagement-inventoryStock-inventoryManagement', parentName: '盘点管理', menuName: '库存管理' }  },
    // 新建or编辑订单
    { path: '/stockManagement-instock-orderAdd', component: _import('modules/stockManagement/orderAdd'),name: 'stockManagement-instock-orderAdd',meta: {bread:true, title: '订货单', parentRouter: '/stockManagement-stockManagement', parentName: '库存管理', menuName: '订单管理' } },
    
    // new group sales order
    { path: '/order-groupSales-newGroupSalesOrder', component: _import('modules/order/groupSales/newGroupSalesOrder'), name: 'order-groupSales-newGroupSalesOrder', meta: {bread:true, title: '批发团购销售单', parentRouter: '/order-groupSales-groupSalesList', parentName: '订单管理', menuName: '订单管理'} },
    
    //权益购买记录
    { path: '/buy-record', component: _import('modules/mycustomer/buy-record'), name: 'buy-record', meta: { title: '权益购买记录', parentRouter: '/mycustomer-mamiConfrere', parentName: '门店合伙人', menuName: '门店合伙人' } },
    // 新建or编辑财务
    { path: '/settings-financialSalesSettlement-financialadd', component: _import('modules/settings/financialSalesSettlement/financialadd'),name: 'settings-financialSalesSettlement-financialadd',meta: {bread:true, title: '财务销售结算单', parentRouter: '/settings-financialSalesSettlement-list', parentName: '财务销售结算', menuName: '财务销售结算' } },
    //查看财务
    { path: '/settings-financialSalesSettlement-financialview', component: _import('modules/settings/financialSalesSettlement/financialview'), name: 'settings-financialSalesSettlement-financialview', meta: { title: '财务销售结算单详情', parentRouter: '/settings-financialSalesSettlement-list', parentName: '财务销售结算', menuName: '财务销售结算' } },
    // 查看特卖审核
    { path: '/campaign-wechatMarketing-activeList-specailview', component: _import('modules/campaign/wechatMarketing/activeList/specailview'), name: 'campaign-wechatMarketing-activeList-specailaudit', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },
     // 查看大转盘审核
    { path: '/campaign-wechatMarketing-activeList-bigWheelview', component: _import('modules/campaign/wechatMarketing/activeList/bigWheelview'), name: 'campaign-wechatMarketing-activeList-bigWheelaudit', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },
    // 查看社拼审核
    { path: '/campaign-wechatMarketing-activeList-communityGroupview', component: _import('modules/campaign/wechatMarketing/activeList/communityGroupview'), name: 'campaign-wechatMarketing-activeList-communityGroupaudit', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },
    // 查看特卖
    { path: '/campaign-wechatMarketing-activeList-specailadd', component: _import('modules/campaign/wechatMarketing/activeList/specailadd'), name: 'campaign-wechatMarketing-activeList-specailaddview', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },
     // 查看大转盘
    { path: '/campaign-wechatMarketing-activeList-bigWheeladd', component: _import('modules/campaign/wechatMarketing/activeList/bigWheeladd'), name: 'campaign-wechatMarketing-activeList-bigWheeladdview', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },
    // 查看社拼
    { path: '/campaign-wechatMarketing-activeList-communityGroup', component: _import('modules/campaign/wechatMarketing/activeList/communityGroup'), name: 'campaign-wechatMarketing-activeList-communityGroupaddview', meta: { title: '审核详情', parentRouter: '/audit-activityAudit-list', parentName: '审核中心', menuName: '活动审核' } },

  ],
  beforeEnter (to, from, next) {//模块在跳转前，会有根据登录情况的判断进入的模块
    let token = Vue.cookie.get('company-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }else{
      next()
    }

  },
}


const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储

  // 百度统计追踪
  if (window._hmt) {
    if (to.path) {
      window._hmt.push(['_setAutoPageview', false])
      window._hmt.push(['_trackPageview', location.href.replace(location.origin + '/#','')])
    }
  }

  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    const isValidate = getStore({name: 'company-info'})
    if (isValidate === 0 && to.name !== 'login' && to.name !== 'change') {
      if (to.name === 'settings-company') {
        next()
      } else {
        Message.info('请先完成企业认证或耐心等待审核通过')
        next({name: 'settings-company'})
      }
    } else {
      next()
    }
  } else {
    let token = Vue.cookie.get('company-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
      return
    }
    http({
      url: http.adornUrl('/sys/company/sysMenu/nav'),
      method: 'get',
      selfHandleError: true,
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('company-menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('company-permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('company-menuList', '[]')
        sessionStorage.setItem('company-permissions', '[]')
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
    sessionStorage.setItem('company-dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

export default router
