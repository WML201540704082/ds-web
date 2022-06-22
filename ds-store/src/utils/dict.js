// 企业等级
export const companyLevel = [{
  label: '新母婴计划',
  value: 1
}, {
  label: '新零售计划',
  value: 2
}, {
  label: '新冠军计划',
  value: 3
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

//员工类型
export const staffType = [{
  label: '企业员工',
  value: 'COMPANY '
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
  label: '离职',
  value: 'LEAVE'
}, {
  label: '激活',
  value: 'ENABLE'
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
// *****************订单********************
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



// 订货审核状态
export const stockStatus = [{
  label: '待确认',
  value: 'STORE_PENDING'
},{
  label: '(销管)待审核',
  value: 'CHECK_PENDING'
}, {
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

//请货状态
export const requestStatus = [{
  label: '待确认',
  value: 'STORE_PENDING'
},{
  label: '待审核',
  value: 'CHECK_PENDING'
}, {
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

// 物流公司
export const logisticsCompany = [{
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
},{
  label: '德邦物流',
  value: 6
},{
  label: '其他',
  value: 5
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

// 顾客--分类
export const customerLevel = [{
  label: '普通',
  value: 'GENERAL'
},{
  label: 'VIP',
  value: 'VIP'
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
}, {
  label: '手动调整',
  value: 'MODIFY'
},{
  label: '充值退款',
  value: 'REFUND_RECHARGE'
}]


// 商品类型
export const productType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}]

// 商品类型(没有服务类商品)
export const productNoServiceType = [{
  label: '零售类商品',
  value: 'ENTITY'
}]

// 商品类型(有散称类商品)
export const productHaveBulkType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}, {
  label: '散称类商品',
  value: 'BULK'
}]

//预约时间间隔
export const timeInterval = [{
  label: '15分钟',
  value: '15'
}, {
  label: '30分钟',
  value: '30'
}, {
  label: '60分钟',
  value: '60'
}, {
  label: '其他',
  value: 'other'
}]

// 销售渠道
export const saleChannel = [{
  label: '线上销售',
  value: -1
}, {
  label: '线下销售',
  value: 1
}]

export const isShowMarketing = [{
  label: '是',
  value: 'true'
}, {
  label: '否',
  value: 'false'
}]

// 销售渠道(仅线下)
export const saleOnlyOneChannel = [{
  label: '线下销售',
  value: 1
}]

// 营销活动状态
export const activeStatus =  [{
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
}, {
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
  label: '已支付',
  value: 'PAID'
}, {
  label: '已核销',
  value: 'USED'
}, {
  label: '未核销',
  value: 'NO_USE'
}, {
  label: '自动核销',
  value: 'AUTO_TAKE'
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

// 礼品卡状态
export const statcardStatus = [{
  label: '正常销售',
  value: 'SALE'
}, {
  label: '停止销售',
  value: 'STOP'
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
  id: 'storeName',
  name: '门店名称'
}]

export const customerBirType = [{
  label: '顾客本月生日',
  value: '0'
}, {
  label: '宝宝本月生日',
  value: '1'
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

// copy商品选择
export const goodSelect = [{
  label: '企业商品',
  value: 'COMPANY'
},
// {
//   label: '门店商品',
//   value: 'STORE'
// }
]

// 商品归属
export const goodsBelonging = [{
  label: '总部统管',
  value: 'COMPANY'
}, {
  label: '门店自营',
  value: 'STORE'
}]

// 商品归属(只有企业统管)
export const NoStoreGoodsBelonging = [{
  label: '总部统管',
  value: 'COMPANY'
}]
// 入库状态
export const inStockstatus = [{
  label: '待入库',
  value: 'PENDING'
}, {
  label: '待确认收货',
  value: 'TAKE_PENDING'
},{
  label: '已入库',
  value: 'FINISH'
},
{
  label: '已退库',
  value: 'RETURN'
}]
//入库类型
export const inStockType = [{
  label: '采购入库',
  value: 'PURCHASE'
}, {
  label: '调拨入库',
  value: 'ALLOCATE'
},{
  label: '配送入库',
  value: 'DISTRIBUTION'
}]
//结算状态
export const setStatus = [{
  label: '已结算',
  value: 'FINISH'
}, {
  label: '有欠款',
  value: 'DEBT'
}, {
  label: '未结算',
  value: 'NOT'
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
  value: 'LX'
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
  label: '其他',
  value: 5
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

// 出库类型（新建出库单下拉选择列表用）
export const outType = [{
  label: '调拨出库',
  value: 'ALLOT'
},{
  label: '其他出库',
  value: 'OTHER'
}]

//出库类型1（出库清单列表用）
export const outType1 = [{
  label: '调拨出库',
  value: 'ALLOT'
},{
  label: '配送退货',
  value: 'REFUND'
},{
  label: '其他出库',
  value: 'OTHER'
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

//退货状态
export const returnStatus = [{
  label: '待审核',
  value: 'CHECK_PENDING'
},{
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

//出入库类型
export const outInType =[{
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

export const productSaleStatus = [{
  label: '启用',
  value: 'ON'
}, {
  label: '禁用',
  value: 'OFF'
}]

export const productPriceType = [{
  label: '成本价',
  value: 'COST'
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

export const incomeStatus = [{
  label: '收入',
  value: 'false'
}, {
  label: '支出',
  value: 'true'
}]