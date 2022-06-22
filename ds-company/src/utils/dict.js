// 企业等级
export const companyLevel = [{
  label: 'VIP1',
  value: 1
}, {
  label: 'VIP2',
  value: 2
}, {
  label: 'VIP3',
  value: 3
}]

// 物流公司
export const logisticsComapny = [{
  label: '顺丰快递',
  value: 1
}, {
  label: '中通快递',
  value: 2
}, {
  label: '圆通快递',
  value: 3
}, {
  label: '韵达快递',
  value: 4
}, {
  label: '德邦物流',
  value: 5
},{
  label: '其它',
  value: 6
}]

// 企业实体类型
export const companyType = [{
  label: '个人',
  value: 0
}, {
  label: '企业',
  value: 1
}]

// 企业状态
export const companyStatus = [{
  label: '待认证',
  value: 0
}, {
  label: '待审核',
  value: 1
}, {
  label: '正常营业',
  value: 2
}, {
  label: '已过期',
  value: 3
}, {
  label: '强制停业',
  value: 4
}]

// 门店状态
export const storeStatus = [{
  label:'待审核',
  value:0
},{
  label:'正常营业',
  value:1
},{
  label:'已驳回',
  value:2
},{
  label:'已过期',
  value:3
},{
  label:'强制停业',
  value:4
},{
  label:'未提交',
  value:-1
}]

// 门店类别
export const storeB = [{
  label:'加盟',
  value:0
},{
  label:'直营',
  value:1
}]

// 性别
export const sex = [{
  label:'男',
  value:'MALE'
},{
  label:'女',
  value:'FEMALE'
}]

// 宝宝性别
export const babysex = [{
  label:'男',
  value:'BOY'
},{
  label:'女',
  value:'GIRL'
},{
  label:'怀孕中',
  value:'PREGNANT'
}]

// 银行卡类型
export const cardType = [{
  label: '个人账户',
  value: 1
}, {
  label: '企业账户',
  value: 2
}]

// 宝宝喂养方式
export const babyFeedMode = [{
  label:'母乳喂养',
  value:'BREAST'
},{
  label:'奶粉',
  value:'BOTTLE'
},{
  label:'混合喂养',
  value:'MIXED'
},{
  label:'其他',
  value:'OTHER'
}]
// 上次消费至今
export const customerBuy = [{
  label:'15天',
  value:'15'
},{
  label:'1个月',
  value:'30'
},{
  label:'2个月',
  value:'60'
},{
  label:'3个月',
  value:'90'
},{
  label:'6个月以上',
  value:'181'
}]
// 优惠券状态
export const couponStatus = [{
  label: '全部',
  value: -1
}, {
  label: '已使用',
  value: 1
}, {
  label: '未使用',
  value: 0
}, {
  label: '已过期',
  value:2
}]

//员工类型
export const staffType = [{
  label: '企业员工',
  value: 'COMPANY'
}, {
  label: '门店员工',
  value: 'STORE'
}]
//员工角色
export const staffRole = [{
  label: '管理员',
  value: 0
}, {
  label: '店长',
  value: 1
}, {
  label: '导购员',
  value: 2
}, {
  label: '收银员',
  value: 3
}]
// 优惠券类型
export const couponType = [{
  label: '代金券',
  value: 1
}, {
  label: '折扣券',
  value: 0
}, {
  label: '兑换券',
  value: 2
}, {
  label: '服务券',
  value: 3
}]
// 适用渠道
export const channelList = [{
  label: '线上销售',
  value: 1
}, {
  label: '线下销售',
  value: 2
}, {
  label: '线上+线下',
  value: 0
}]
//商品标记
export const remarkType = [{
  label: '无',
  value: 1
}, {
  label: 'HOT',
  value: 0
}, {
  label: 'NEW',
  value: 2
}]
// *****************订单********************
//系统版本
export const versionMode = [{
  label: '营销版',
  value: 'MARKETING'
}, {
  label: '专业版',
  value: 'PROFESSIONAL'
}]
//支付方式
export const paymentOfMode = [{
  label: '支付宝',
  value: 'ALIPAY'
}, {
  label: '微信',
  value: 'WECHAT'
}, {
  label: '个人支付宝',
  value: 'PALIPAY'
}, {
  label: '个人微信',
  value: 'PWECHAT'
}, {
  label: '刷卡',
  value: 'SWIPE'
}, {
  label: '现金',
  value: 'CASH'
}, {
  label: '储值卡',
  value: 'CARD'
}, {
  label: '礼品卡',
  value: 'STATCARD'
}, {
  label: '卡券',
  value: 'COUPON'
},{
  label: '购物卡',
  value: 'SHOPPINGCARD'
},{
  label: '组合支付',
  value: 'MIXED'
}, {
  label: '其他',
  value: 'OTHER'
}]

// 订单状态
export const orderStage = [{
  label: '待发货',
  value: 'NOSHIP'
}, {
  label: '待提货',
  value: 'NOTAKE'
}, {
  label: '已发货',
  value: 'SHIPED'
}, {
  label: '已完成',
  value: 'FINISH'
}, {
  label: '已退货',
  value: 'REFUNDED'
}]
//销售类型
export const salesTypeMode = [{
  label: '销售',
  value: 'SALES'
}, {
  label: '退单',
  value: 'REFUND'
}, {
  label: '赠送',
  value: 'GIVE'
}, {
  label: '礼品卡',
  value: 'GIFT'
}]
// 订单来源
export const orderType = [{
  label: 'POS',
  value: 'POS'
}, {
  label: '小程序',
  value: 'WESHOP'
}, {
  label: '移动开单',
  value: 'WESAAS'
}]

// 茶饮订单来源
export const teaOrderType = [{
  label: 'POS',
  value: 'POS'
}, {
  label: '小程序',
  value: 'WESHOP'
}]

// 茶饮支付状态
export const teaPayStatus = [{
  label: '未支付',
  value: 'UNPAID'
}, {
  label: '已支付',
  value: 'PAID'
}, {
  label: '已取消',
  value: 'CANCELLED'
}]

//销售类型
export const salesType = [{
  label: '销售',
  value: 'SALES'
}, {
  label: '退货',
  value: 'REFUND'
}, {
  label: '赠送',
  value: 'GIVE'
}, {
  label: '礼品卡',
  value: 'GIFT'
}]

// 订单状态
export const orderStatus = [{
  label: '未支付',
  value: 'UNPAID'
}, {
  label: '待发货',
  value: 'NOSHIP'
}, {
  label: '已发货',
  value: 'SHIPED'
}, {
  label: '待提货',
  value: 'NOTAKE'
}, {
  label: '已完成',
  value: 'FINISH'
}, {
  label: '已取消',
  value: 'CANCELED'
}, {
  label: '待退款',
  value: 'WAIT_REFUND'
}, {
  label: '已退款',
  value: 'REFUNDED'
}, {
  label: '退款失败',
  value: 'REFUND_FAIL'
}]

//订单优惠操作
export const orderOfMode = [{
  label: '赠品',
  value: 'GIFT'
},{
  label: '抹零',
  value: 'WIPE'
}, {
  label: '减免',
  value: 'RELIEF'
}, {
  label: '优惠券',
  value: 'COUPON'
}, {
  label: '打折',
  value: 'DISCOUNT'
}, {
  label: '组合购',
  value: 'COMPOSE'
}, {
  label: '第N件打折',
  value: 'MANY_DISCOUNT'
},{
  label: '积分',
  value: 'INTEGRAL'
}, {
  label: '活动',
  value: 'ACTIVITY'
}, {
  label: '会员优惠',
  value: 'VIP'
}]

// 零售订单
export const retailOrder = [{
  label: '未支付',
  value: 'UNPAID'
}, {
  label: '待发货',
  value: 'NOSHIP'
},{
  label: '待提货',
  value: 'NOTAKE'
}, {
  label: '已发货',
  value: 'SHIPED'
},{
  label: '已完成',
  value: 'FINISH'
}, {
  label: '已取消',
  value: 'CANCELED'
}, {
  label: '待退款',
  value: 'WAIT_REFUND'
}, {
  label: '退款失败',
  value: 'REFUND_FAIL'
}, {
  label: '已退货',
  value: 'REFUNDED'
}
]
// 礼品卡支付方式
export const countcardMode = [{
  label: '支付宝',
  value: 'ALIPAY'
}, {
  label: '微信',
  value: 'WECHAT'
},{
  label: '个人支付宝',
  value: 'PALIPAY'
}, {
  label: '个人微信',
  value: 'PWECHAT'
}, {
  label: '刷卡',
  value: 'SWIPE'
}, {
  label: '现金',
  value: 'CASH'
}, {
  label: '储值卡',
  value: 'CARD'
}]
//充值单-充值卡名称
export const rechargeProject = [{
  label: '储值卡',
  value: 'RECHARGE_CARD'
}, {
  label: '购物卡',
  value: 'SHOPPING_CARD'
}]
// 礼品卡订单
export const countcardOrder = [{
  label: '未支付',
  value: 'UNPAID'
},
{
  label: '已完成',
  value: 'FINISH'
}]

// 退款方式
export const returnMode = [{
  label: '支付宝',
  value: 'ALIPAY'
}, {
  label: '微信',
  value: 'WECHAT'
}, {
  label: '现金',
  value: 'CASH'
}, {
  label: '储值卡',
  value: 'CARD'
}, {
  label: '礼品卡',
  value: 'STATCARD'
},{
  label: '购物卡',
  value: 'SHOPPINGCARD'
},{
  label: '组合退款',
  value: 'MIXED'
}, {
  label: '其他',
  value: 'OTHER'
}]

// 退款订单
export const returnOrder = [{
  label: '待审核',
  value: 'WAIT_REFUND'
}
// ,{
//   label: '待退款',
//   value: 'APPROVE'
// }
, {
  label: '退款失败',
  value: 'REFUSE'
},{
  label: '退款成功',
  value: 'FINISH'
}
]

// 退款类型
export const returnType = [{
  label: '整单退',
  value: 'ALL'
},{
  label: '单品退',
  value: 'SINGLE'
}]
// 兑换订单
// 兑换类型
export const exchangeType = [{
  label: '积分',
  value: 'INTEGRAL'
}]
// 兑换订单状态
export const exchangeStatus = [{
  label: '已完成',
  value: 'FINISHED'
}]

export const storevalueStatus =  [{
  label: '待审核',
  value: 'CHECK'
}, {
  label: '退款失败',
  value: 'FAIL'
},{
  label: '退款成功',
  value: 'FINISH'
}]

//满减活动类型
export const promotionType =  [{
  label: '开业活动',
  value: 'OPENED'
}, {
  label: '主题活动',
  value: 'SUBJECT'
},{
  label: '月份活动',
  value: 'MONTHLY'
},{
  label: '新品活动',
  value: 'NEWS'
}]

//满减折扣类型
export const remitTypes =  [{
  label: '满减',
  value: 'REMIT'
}]

//满减折扣类型
export const remitType =  [{
  label: '打折',
  value: 'DISCOUNT'
}, {
  label: '满减',
  value: 'REMIT'
}]

//活动类型
export const activityType =  [{
  label: '新人礼',
  value: 'NEW_GIFT'
}, {
  label: '进店有礼',
  value: 'ON_STORE'
}]

//活动状态
export const giftActivityStatus =  [{
  label: '进行中',
  value: 'ACTIVITY'
}, {
  label: '已终止',
  value: 'STOP'
},{
  label: '未开始',
  value: 'STANDBY'
}]

// 余额变动明细--操作类型
export const operateType =  [{
  label: '充值',
  value: 'RECHARGE'
}, {
  label: '消费',
  value: 'CONSUME'
},{
  label: '退款',
  value: 'REFUND'
}, {
  label: '手动调整',
  value: 'ADJUST'
}, {
  label: '手动增加',
  value: 'INCREASE'
}, {
  label: '手动扣减',
  value: 'REDUCE'
},{
  label: '充值退款',
  value: 'REFUND_RECHARGE'
}]
// 活动订单
// 0 - 已取消 1 - 待支付 2 - 已支付（待提货） 3 - 已提货 4 - 待退款 5 - 已退款 6 - 退款失败
export const activityStatus =  [{
  label: '已取消',
  value: 0
}, {
  label: '待支付',
  value: 1
},{
  label: '待提货',
  value: 2
},{
  label: '已提货',
  value: 3
}
// ,{
//   label: '待退款',
//   value: 4
// }
,{
  label: '已退款',
  value: 5
}
// ,{
//   label: '退款失败',
//   value: 6
// }
]
// ****************订单end*******************

//员工岗位
export const staffQuarters = [{
  label: '店长',
  value: '店长'
}, {
  label: '收银员',
  value: '收银员'
}, {
  label: '导购员',
  value: '导购员'
}, {
  label: '技师',
  value: '技师'
}, {
  label: '管理员',
  value: '管理员'
}, {
  label: '客服',
  value: '客服'
}, {
  label: '财务',
  value: '财务'
}, {
  label: '保洁',
  value: '保洁'
}]

//员工状态
export const staffState = [{
  label: '停用',
  value: 'LEAVE'
}, {
  label: '正常',
  value: 'ENABLE'
}]
// 结算状态
export const settlementStatus = [{
  label: '已完成',
  value: 0
}, {
  label: '已拒绝',
  value: 1
}]

// 打款来源
export const settlementOrigin = [{
  label: '银监持照支付平台',
  value: 0
}, {
  label: '银监持照支付平台',
  value: 1
}, {
  label: '银监持照支付平台',
  value: 2
}, {
  label: '银监持照支付平台',
  value: 3
}]

// 出库状态
// export const outGoingType = [{
//   label: '待审核',
//   value: 'CHECK_PENDING'
// }, {
//   label: '待出库',
//   value: 'CHECK_FINISH'
// }, {
//   label: '待确认收货',
//   value: 'TAKE_PENDING'
// }, {
//   label: '出库完成',
//   value: 'FINISH'
// }]
export const outGoingType = [{
  label: '待出库',
  value: 'OUT_PENDING'
}, {
  label: '待确认收货',
  value: 'TAKE_PENDING'
}, {
  label: '出库完成',
  value: 'FINISH'
}]
// 盘点总状态
export const inventoryMainType = [{
  label: '异常',
  value: 'ANOMALY'
}, {
  label: '正常',
  value: 'NORMAL'
}]
// 商品判断状态
export const inventorySubType = [{
  label: '正常',
  value: 0
}, {
  label: '盘亏',
  value: 1
}, {
  label: '盘盈',
  value: 2
}]
// 入库状态
export const inStockstatus = [{
  label: '待入库',
  value: 'PENDING'
}, {
  label: '已入库',
  value: 'FINISH'
}, {
  label: '已退货',
  value: 'REFUNDED'
}]
//入库类型
export const inStockType = [{
  label: '采购入库',
  value: 'PURCHASE'
}, {
  label: '配送退货',
  value: 'REFUND'
}]
//结算状态
export const setStatus = [{
  label: '结算完成',
  value: 'FINISH'
}, {
  label: '部分结算',
  value: 'DEBT'
}, {
  label: '未结算',
  value: 'NOT'
}]
// 订货审核状态
export const stockStatus = [{
  label: '待确认',
  value: 'STORE_PENDING'
},{
  label: '(销管)待审核',
  value: 'CHECK_PENDING'
},{
  label: '(财务)待审核',
  value: 'FINANCE_CHECK_PENDING'
}, {
  label: '待出库',
  value: 'CHECK_FINISH'
}, {
  label: '待确认收货',
  value: 'TAKE_PENDING'
}, {
  label: '已入库',
  value: 'FINISH'
}, {
  label: '已拒绝',
  value: 'REJECT'
}]


//退货状态
export const returnStatus = [{
  label: '已完成',
  value: 'FINISH'
}]
// 促销类型
export const promoteType = [{
  label: '组合搭售',
  value: 'COMPOSE'
}, {
  label: '第N件打折',
  value: 'DISCOUNT'
}]

// 促销状态
export const promoteStatus = [{
  label: '未开始',
  value: 'UNSATRTING'
}, {
  label: '进行中',
  value: 'PROCESSING'
}, {
  label: '已结束',
  value: 'ENDED'
}]

// 满减促销状态
export const fullStatus = [{
  label: '未开始',
  value: 'STANDBY'
}, {
  label: '进行中',
  value: 'ACTIVITY'
}, {
  label: '已结束',
  value: 'STOP'
}]

// 顾客--等级
export const customerLevel = [{
  label: '普通',
  value: 'GENERAL'
},{
  label: 'VIP',
  value: 'VIP'
}]
// 生命周期
export const life = [{
  label: '潜在顾客',
  value: 'QZ'
},{
  label: '新客',
  value: 'XK'
},{
  label: '活跃顾客',
  value: 'HY'
},{
  label: '休眠顾客',
  value: 'XM'
},{
  label: '流失顾客',
  value: 'LS'
}]
// 顾客--归属
export const customerBind = [{
  label: '无归属',
  value: false
},{
  label: '有归属',
  value: true
},{
  label: '根据员工查',
  value: 'none'
}]

// 顾客--生日
export const customerBirthday = [{
  label: '3天内生日',
  value: '3'
},{
  label: '15天内生日',
  value: '15'
},{
  label: '一个月内生日',
  value: '30'
},{
  label: '三个月内生日',
  value: '90'
}]
// 宝宝--生日
export const babyAges = [{
  label: '0-6个月龄',
  value: '0'
},{
  label: '6-12个月龄',
  value: '6'
},{
  label: '12-24个月龄',
  value: '12'
},{
  label: '2-3岁',
  value: '24'
},{
  label: '3岁以上',
  value: '36'
}]
export const customerBirType = [{
  label: '顾客本月生日',
  value: '0'
}, {
  label: '宝宝本月生日',
  value: '1'
}]

// 顾客--生日
export const customerReturn = [{
  label: '15天未回访',
  value: '15'
},{
  label: '一个月未回访',
  value: '30'
},{
  label: '三个月未回访',
  value: '90'
}]

// 顾客标签来源
export const sourceStatus = [{
  label: '订单',
  value: 'ORDER'
},{
  label: '员工',
  value: 'STAFF'
}]

// 顾客标签类型
export const typeStatus = [{
  label: '自然特征',
  value: 'NATURE'
},{
  label: '兴趣爱好',
  value: 'HOBBY'
},{
  label: '消费偏好',
  value: 'CONSUMPTION'
},{
  label: '宝宝特征',
  value: 'BABY'
}]


// 顾客--充值记录类型
export const recordType = [{
  label: '充值',
  value: 'RECHARGE'
},{
  label: '消费',
  value: 'CONSUME'
},{
  label: '退款',
  value: 'REFUND'
},{
  label: '手动调整',
  value: 'MODIFY'
},{
  label: '充值退款',
  value: 'REFUND_RECHARGE'
}]


// 顾客--团长级别
export const commanderLevel = [{
  label: '无',
  value: 'NONE'
},{
  label: '普通',
  value: 'NORMAL'
},{
  label: '黑金',
  value: 'BLACK'
},{
  label: '黄金',
  value: 'GOLD'
}]

// 顾客--佣金结算状态
export const commanderStatus = [{
  label: '已结算',
  value: 'SETTLED'
},{
  label: '待结算',
  value: 'SETTLEMENT'
},{
  label: '已取消',
  value: 'CANCELED'
}]
// 佣金操作
export const commander= [{
  label: '已结算',
  value: 'SETTLE_AMOUNT'
},{
  label: '待结算',
  value: 'AMOUNT_TO_BE_SETTLE'
},{
  label: '已取消',
  value: 'CANCEL_AMOUNT'
}]

// 顾客--订单状态
export const orderS = [{
  label: '已收货',
  value: 'RECHARGE'
},{
  label: '待收货',
  value: 'CONSUME'
},{
  label: '已取消',
  value: 'REFUND'
}]

// 短信发送状态
export const shortMessageStatus = [{
  label: '发送成功',
  value: 'SUCCESS'
}, {
  label: '发送中',
  value: 'SENDING'
}, {
  label: '发送失败',
  value: 'FAIL'
}, {
  label: '待审核',
  value: 'CHECK'
}, {
  label: '已驳回',
  value: 'REJECT'
}]

export const originalMessageStatus = [{
  label: '发送成功',
  value: 'SUCCESS'
}, {
  label: '发送失败',
  value: 'FAILED'
}]

// 审核活动状态
export const activeauditStatus = [{
  label: '进行中',
  value: 'PROCESSING'
}, {
  label: '暂停',
  value: 'PAUSE'
}, {
  label: '已下架',
  value: 'CLOSED'
}, {
  label: '待审核',
  value: 'NOCHECK'
},{
  label: '驳回',
  value: 'REJECT'
}]
// 营销活动状态
export const activeStatus = [{
  label: '进行中',
  value: 'PROCESSING'
}, {
  label: '暂停',
  value: 'PAUSE'
}, {
  label: '已下架',
  value: 'CLOSED'
}, {
  label: '待审核',
  value: 'NOCHECK'
},{
  label: '草稿',
  value: 'DARFT'
}, {
  label: '驳回',
  value: 'REJECT'
}]

// 营销活动类型
export const activeType = [{
  label: '特卖',
  value: 'SPECIAL'
}, {
  label: '支付有礼',
  value: 'PAIDGIFT'
}, {
  label: '大转盘',
  value: 'TURN'
}, {
  label: '社区拼团',
  value: 'GROUP'
}
// , {
//   label: '拼团',
//   value: 'MESSAGE'
// }
]

// 活动运行结果订单状态
export const resultStatus = [{
  label: '已核销',
  value: 'USED'
}, {
  label: '未核销',
  value: 'NO_USE'
}, {
  label: '自动核销',
  value: 'AUTO_TAKE'
}, {
  label: '已支付',
  value: 'PAID'
}]


// 活动运行结果类型
export const zsType = [{
  label: '赠送',
  value: 'GIFT'
}, {
  label: '购买',
  value: 'BUY'
}]

// 活动运行结果价值
export const worth = [{
  label: '代金券的价值',
  value: '0'
}, {
  label: '折扣券的价值',
  value: '1'
}, {
  label: '兑换券的价值',
  value: '2'
}]

// 商品类型
export const productType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}]

// 商品类型(有散称类商品)
export const productHaveBulkType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '散称类商品',
  value: 'BULK'
}]
// 商品类型(全部的)
export const productAllType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}, {
  label: '散称类商品',
  value: 'BULK'
}]

// 商品归属
export const goodsBelonging = [{
  label: '总部统管',
  value: 'COMPANY'
}, {
  label: '门店自营',
  value: 'STORE'
}]

export const isShowMarketing = [{
  label: '是',
  value: true
}, {
  label: '否',
  value: false
}]

// 销售渠道
export const saleChannel = [{
  label: '线上销售',
  value: -1
}, {
  label: '线下销售',
  value: 1
}]

// 销售渠道(仅线下)
export const saleOnlyOneChannel = [{
  label: '线下销售',
  value: 1
}]

//销售状态
export const saleStatus = [{
  label: '在售',
  value: -1
}, {
  label: '停售',
  value: 1
}]
// 短信营销发送场景
export const shortmessageScenes = [{
  label: '生日关怀',
  value: 'BIRTHDAY'
}, {
  label: '复购邀请',
  value: 'INVITATION'
}, {
  label: '节日问候',
  value: 'FESTIVAL'
}, {
  label: '活动宣传',
  value: 'ACTIVITY'
}, {
  label: '到期提醒',
  value: 'EXPIRATION'
}]

// 短信参数
export const shortmessageParams = [{
  id: 'customerName',
  name: '顾客姓名'
}, {
  id: 'companyName',
  name: '企业名称'
}]

// 礼品卡状态
export const statcardStatus = [{
  label: '正常销售',
  value: 'SALE'
}, {
  label: '停止销售',
  value: 'STOP'
}]


// 工作项目
export const workProject = [{
  label: '电话回访',
  value: 'PHONE'
}, {
  label: '赠送优惠券',
  value: 'COUPON'
}, {
  label: '短信回访',
  value: 'SMS'
}, {
  label: '活动邀请',
  value: 'ACTIVITY'
}, {
  label: '完善顾客信息',
  value: 'FILLINFO'
}, {
  label: '完善顾客标签',
  value: 'FILLTAG'
}]

export const productOwner = [{
  label: '企业统管',
  value: 'COMPANY'
}, {
  label: '门店自营',
  value: 'STORE'
}]
// 佣金提现状态
export const commissionStatus = [{
  label: '已处理',
  value: 'PROCESSED'
},{
  label: '已提交',
  value: 'SUBMITTED'
},{
  label: '提现失败',
  value: 'FAIL'
},{
  label: '提现成功',
  value: 'SUCCESSED'
}]

// 佣金提现方式
export const commissionType = [{
  label: '微信零钱',
  value: 'WECHAT_COIN'
},{
  label: '银行卡',
  value: 'BANK_CARD'
}]

export const offerType = [{
  label: 'DISCOUNT',
  value: '打折'
}, {
  label: 'RELIEF',
  value: '减免'
}, {
  label: 'GIFT',
  value: '赠品'
}]

// 团长等级
export const headerLevel = [{
  label: '黑金',
  value: 'BLACK'
}, {
  label: '黄金',
  value: 'GOLD'
}, {
  label: '普通',
  value: 'NORMAL'
}]
//审核结果
export const auditResults = [{
  label: '通过',
  value: 'Agree'
},{
  label: '拒绝',
  value: 'Refuse'
}]
//销管、财务审核结果
export const reviewStatus = [{
  label: '通过',
  value: 'Agree'
},{
  label: '拒绝',
  value: 'Refuse'
}]
// 行业类型
export const industryType = [{
  label: '母婴',
  value: 0
}, {
  label: '非母婴',
  value: 1
}]

export const refundReason = [{
  label: '多拍/错拍/不想要',
  value: 'MISTAKE'
}, {
  label: '发货时间太长',
  value: 'LONG_TIME'
}, {
  label: '未按约定时间发货',
  value: 'SHIP_TIME'
}, {
  label: '其他',
  value: 'OTHER'
}]

// 系统配色
export const systemThemeColor = [{
  label: '橘白',
  value: 'ORANGEWHITE',
  colors: ['#F48442', '#FFF2EA']
}, {
  label: '蒂芙尼白',
  value: 'TIFFANYWHITE',
  colors: ['#4cbbb4', '#eefff0']
}]

// 妈咪
export const MomType = [{
  label: '门店合伙人',
  value: 'PARTNER',
}, {
  label: '社区拼团',
  value: 'GROUP',
}]

//员工新客开发提成
export const commissionCondition = [{
  label: '推荐新客成功注册',
  value: 0,
}, {
  label: '推荐新客成功注册并下单',
  value: 1,
}]

// 时效性
export const levelValid = [{
  label: '永久',
  value: 'MAX',
}, {
  label: '1年',
  value: 'ONEY',
}, {
  label: '月份',
  value: 'MONTH',
}]
//商品类型
export const goodsType = [{
  label: '零售类商品',
  value: 'RETAIL'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}]
// 商品会员价类型
export const memberPriceType = [{
  label: '会员无优惠',
  value: 'NONE'
}, {
  label: '统一会员价',
  value: 'UNIFIED'
}, {
  label: '等级优惠折扣',
  value: 'LEVEL'
}]
// 妈咪全知道订单类型
export const mamiType = [{
  label: '自购',
  value: '自购'
}, {
  label: '大礼包',
  value: '大礼包'
}]

export const mamiOrderStatus = [{
  label: '已取消',
  value: -1
}, {
  label: '待支付',
  value: 0
}, {
  label: '已支付（待提货）',
  value: 1
}, {
  label: '已完成',
  value: 2
}]

// 积分操作类型枚举
export const intergralczType= [{
  label: '签到',
  value: 'SIGNIN'
},{
  label: '充值退款',
  value: 'REFUND_RECHARGE'
},{
  label: '消费',
  value: 'CONSUME'
}, {
  label: '兑换',
  value: 'EXCHANGE'
}, {
  label: '退款',
  value: 'REFUND'
}, {
  label: '手动调整',
  value: 'MODIFY'
}, {
  label: '充值',
  value: 'RECHARGE'
}, {
  label: '老带新',
  value: 'NEW_CUSTOMER'
}, {
  label: '老带新额外奖励',
  value: 'NEW_CUSTOMER_EXTRA'
}, {
  label: '评价',
  value: 'COMMENT'
},{
  label: '礼品卡',
  value: 'GIFTCARD'
}]

export const weekConstant = [{
  label: '星期一',
  value: 1
}, {
  label: '星期二',
  value: 2
}, {
  label: '星期三',
  value: 3
}, {
  label: '星期四',
  value: 4
}, {
  label: '星期五',
  value: 5
}, {
  label: '星期六',
  value: 6
}, {
  label: '星期日',
  value: 7
}]

export const importType = [{
  label: '商品导入',
  value: 'PRODUCT'
}, {
  label: '顾客导入',
  value: 'CUSTOMER'
}, {
  label: '寄存导入',
  value: 'DEPOSIT'
}, {
  label: '门店库存导入',
  value: 'STORE_STOCK'
}]

export const newimportType = [ {
  label: '顾客导入',
  value: 'CUSTOMER'
}, {
  label: '寄存导入',
  value: 'DEPOSIT'
}, {
  label: '门店库存导入',
  value: 'STORE_STOCK'
}]

export const importHasOrderType = [{
  label: '商品导入',
  value: 'PRODUCT'
}, {
  label: '顾客导入',
  value: 'CUSTOMER'
}, {
  label: '寄存导入',
  value: 'DEPOSIT'
}, {
  label: '门店库存导入',
  value: 'STORE_STOCK'
}, {
  label: '首铺货订货单导入',
  value: 'STORE_REQ_STOCK'
}, {
  label: '订货单套餐导入',
  value: 'STORE_REQ_ALL_STOCK'
}]

export const newimportHasOrderType = [ {
  label: '顾客导入',
  value: 'CUSTOMER'
}, {
  label: '寄存导入',
  value: 'DEPOSIT'
}, {
  label: '门店库存导入',
  value: 'STORE_STOCK'
}, {
  label: '首铺货订货单导入',
  value: 'STORE_REQ_STOCK'
}, {
  label: '订货单套餐导入',
  value: 'STORE_REQ_ALL_STOCK'
}]
export const costType = [{
  label: '订货成本',
  value: 'COST'
}]

export const costStatus = [{
  label: '待审核',
  value: 'PENDING'
}, {
  label: '已拒绝',
  value: 'REFUSE'
}, {
  label: '已通过',
  value: 'PASS'
}]



// 单据状态
export const documentStatus = [{
  label: '待审核',
  value: 'TODO'
},{
  label: '待支付',
  value: 'WAIT_PAY'
},{
  label: '待发货',
  value: 'WAIT_DELIVER'
}, {
  label: '待收货',
  value: 'BE_RECEIVED'
},{
  label: '已入库',
  value: 'RECEIVED'
},{
  label: '待财务审核',
  value: 'FINANCE_AUDIT'
}]

// 出库类型
export const outType = [{
  label: '配送出库',
  value: 'WHOLESALE'
}, {
  label: '配送出库(订货)',
  value: 'WHOLESALES'
},{
  label: '其他出库',
  value: 'OTHER'
}]

//payStatus
export const payStatus = [{
  label: '已支付',
  value: 'PAID'
}, {
  label: '未支付',
  value: 'UNPAY'
}]

// pay type
export const payType = [{
  label: '现金',
  value: 'MONEY'
}, {
  label: '微信',
  value: 'WECHAT'
},{
  label: '支付宝',
  value: 'ALIPAY'
},{
  label: '刷卡',
  value: 'CARD'
},{
  label: '其他',
  value: 'OTHER'
}]

//退货清单我收到的状态
export const requestMeStatus = [{
  label: '待审核',
  value: 'CHECK_PENDING'
}, {
  label: '待退货',
  value: 'CHECK_FINISH'
},{
  label: '待确认收货',
  value: 'TAKE_PENDING'
},{
  label: '已完成',
  value: 'FINISH'
},{
  label: '已拒绝',
  value: 'REJECT'
}]

//出入库类型(企业)
export const outInType =[{
  label: '采购入库',
  value: 'COMPANY_PURCHASE'
}, {
  label: '配送退货',
  value: 'COMPANY_IN_REFUND'
},{
  label: '采购退货',
  value: 'COMPANY_OUT_REFUND'
},{
  label: '配送出库',
  value: 'COMPANY_WHOLESALE'
},{
  label: '其他出库',
  value: 'COMPANY_OTHER'
},{
  label: '批发团购销售',
  value: 'COMPANY_GROUP'
},{
  label: '初始化库存',
  value: 'COMPANY_INIT'
},{
  label: '盘盈入库',
  value: 'COMPANY_INVENTORY_PROFIT'
},{
  label: '盘亏出库',
  value: 'COMPANY_INVENTORY_LOSSES'
}]
//出入库类型(门店)
export const storeOutInType =[{
  label: '配送入库',
  value: 'STORE_DISTRIBUTION'
}, {
  label: '采购入库',
  value: 'STORE_PURCHASE'
},{
  label: '调拨入库',
  value: 'STORE_ALLOCATE'
},{
  label: '配送退货',
  value: 'STORE_REFUND'
},{
  label: '调拨出库',
  value: 'STORE_ALLOT'
},{
  label: '其他出库',
  value: 'STORE_OTHER'
},{
  label: '销售兑换',
  value: 'STORE_ORDER_SALE'
},{
  label: '销售退货',
  value: 'STORE_ORDER_RETURN'
},{
  label: '寄存提取',
  value: 'STORE_EXTRACT'
},{
  label: '商品寄存',
  value: 'STORE_DEPOSIT'
},{
  label: '门店库存导入',
  value: 'STORE_STOCK_IMPORT'
},{
  label: '初始化库存',
  value: 'STORE_INIT'
},{
  label: '盘盈入库',
  value: 'STORE_INVENTORY_PROFIT'
},{
  label: '盘亏出库',
  value: 'STORE_INVENTORY_LOSSES'
}]
// dmp 0 - 待结算  1 - 已结算 2 - 受理中 3 - 退款取消"
export const dmpCommission = [{
  label: '待结算',
  value: 0
}, {
  label: '已结算',
  value: 1
},{
  label: '受理中',
  value: 2
},{
  label: '退款取消',
  value: 3
}]

export const productPriceType = [{
  label: '成本价',
  value: 'COST'
}, {
  label: '配送价',
  value: 'WHOLESALE'
}, {
  label: '零售价',
  value: 'RETAIL'
}]

export const downloadStatus = [{
  label: '已完成',
  value: 'FINISHED'
}, {
  label: '已取消',
  value: 'CANCELLED'
}, {
  label: '进行中',
  value: 'PROCESSING'
}]

export const productSaleStatus = [{
  label: '启用',
  value: 'ON'
}, {
  label: '禁用',
  value: 'OFF'
}]

export const incomeStatus = [{
  label: '支出',
  value: 'true'
}, {
  label: '收入',
  value: 'false'
}]
