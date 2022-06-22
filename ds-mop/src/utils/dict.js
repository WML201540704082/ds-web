// 企业等级
export const companyLevel = [{
  label: 'vip1',
  value: 1
}, {
  label: 'vip2',
  value: 2
}, {
  label: 'vip3',
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

export const industryType = [{
  label: '母婴',
  value: 0
}, {
  label: '非母婴',
  value: 1
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
}]

// 是否关联
export const hasBindStatus = [{
  label:'否',
  value:0
},{
  label:'是',
  value:1
}]

// 门店类别
export const storeB = [{
  label:'加盟',
  value:0
},{
  label:'直营',
  value:1
}]

//加盟品牌
export const brandType = [{
  label:'妈咪全知道',
  value:0
}]
//门店状态-活跃类型
export const activityStatus = [{
  label: '未启用',
  value: 'OFF'
}, {
  label: '启用',
  value: 'ON'
}, {
  label: '活跃',
  value: 'ACTIVITY'
}, {
  label: '沉寂',
  value: 'STILL'
}, {
  label: '流失',
  value: 'LOSE'
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


// ****************订单*******************
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
  label: '购物卡',
  value: 'SHOPPINGCARD'
},{
  label: '礼品卡',
  value: 'STATCARD'
}, {
  label: '卡券',
  value: 'COUPON'
},{
  label: '组合支付',
  value: 'MIXED'
}, {
  label: '其他',
  value: 'OTHER'
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

// 订单类型
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
  label: '购物卡',
  value: 'SHOPPINGCARD'
}, {
  label: '礼品卡',
  value: 'STATCARD'
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
// ****************订单end*******************
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
// 性别
export const sex = [{
  label:'男',
  value:0
},{
  label:'女',
  value:1
}]
// 短信审核状态
export const shortmessageStatus = [{
  label: '待审核',
  value: 'UNAUDIT'
}, {
  label: '已发送',
  value: 'SENDED'
}, {
  label: '已驳回',
  value: 'REFUSED'
}]


// 营销活动状态 PROCESSING
export const activeStatus = [{
  label: '进行中',
  value: 'PROCESSING'
}, {
  label: '已完成',
  value: 'COMPLETED'
}, {
  label: '已下架',
  value: 'CLOSED'
}, {
  label: '待审核',
  value: 'NOCHECK'
}, {
  label: '暂停',
  value: 'PAUSE'
}, {
  label: '驳回',
  value: 'REJECT'
}]

//审核状态
export const auditStatus = [{
  label: '待审核',
  value: 'UNAUDIT'
}, {
  label: '审核中',
  value: 'AUDITING'
}, {
  label: '审核通过',
  value: 'FINISHED'
}, {
  label: '拒绝',
  value: 'REFUSED'
}]

// 直播状态
export const liveStatus = [{
  label: '直播中',
  value: '0'
}, {
  label: '未开始',
  value: '1'
}, {
  label: '已结束',
  value: '2'
}, {
  label: '禁播',
  value: '3'
}, {
  label: '暂停中',
  value: '4'
}, {
  label: '异常',
  value: '5'
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


// 审核结果
export const audio = [{
  label:'通过',
  value:'APPROVED'
},{
  label:'拒绝',
  value:'REFUSED'
}]

//直播审核结果
export const auditResults = [{
  label:'审核',
  value:'UNAUDIT'
},{
  label:'拒绝',
  value:'REFUSED'
}]

//在bm直播计划显示运营数据
export const hasDataType = [{
  label:'是',
  value: true
},{
  label:'否',
  value: false
}]

//萌百小店显示直播回放
export const hasReplayType = [{
  label:'是',
  value: true
},{
  label:'否',
  value: false
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

// 商品类型
export const productType = [{
  label: '零售类商品',
  value: 'ENTITY'
}, {
  label: '服务类商品',
  value: 'SERVICE'
}]

// 广告优先类型
export const priorityType = [{
  label: '门店广告优先显示',
  value: 'STORE'
}, {
  label: 'MOP广告优先显示',
  value: 'MOP'
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
//合同状态
export const contractStatusList = [{
  label: '草稿',
  value: 'DRAFT'
}, {
  label: '未审核',
  value: 'UN_AUDIT'
}, {
  label: '审核通过',
  value: 'APPROVAL'
}, {
  label: '驳回',
  value: 'REJECTED'
}]

//
export const contractOriginList = [{
  label: '线下销售',
  value: '0'
}, {
  label: '线上订阅',
  value: '1'
}]

// 短信审核状态
export const workStatusType = [{
  label: '在职',
  value: 'ONWORK'
}, {
  label: '离职',
  value: 'LEAVE'
}]
// 企业实体类型
export const saleRoleType = [{
  label: '销售',
  value: 'SALESMAN'
}]

// 系统消息状态
export const sysMessageType = [{
  label: '短信余量',
  value: 'SMS'
}, {
  label: '服务到期',
  value: 'SERVER'
}, {
  label: '商户号关闭',
  value: 'MCH'
}]

// 系统配色
export const systemThemeColor = [{
  label: '橘白',
  value: 'ORANGEWHITE'
}, {
  label: '蒂芙尼白',
  value: 'TIFFANYWHITE'
}]


// pos登录状态
export const posLoginUnusual = [{
  label: '正常',
  value: false
}, {
  label: '异常',
  value: true
}]

// 佣金提现状态
export const commissionWithdrawStatus = [{
  label: '提交',
  value: 'SUBMITTED'
}, {
  label: '已处理',
  value: 'PROCESSED'
}, {
  label: '提现失败',
  value: 'FAIL'
}]

export const companyOrderStatus = [{
  label: '待支付',
  value: 'WAIT'
}, {
  label: '已支付',
  value: 'PAID'
}, {
  label: '支付失败',
  value: 'FAILURE'
}]
export const shipTypedate  = [{
  label: '到店自提',
  value: 'SELF'
}, {
  label: '快递配送',
  value: 'EXPRESS'
}]
export const companyVersion = [
//   {
//   label: '主播版',
//   value: 'ANCHOR'
// },
  {
    label: '营销版',
    value: 'MARKETING'
  }, {
    label: '专业版',
    value: 'PROFESSIONAL'
  }
// , {
//   label: '旗舰版',
//   value: 'ULTIMATE'
// }
]

export const companyStarlevel = [
    {
      label: '一级',
      value: 'ONE'
    }, {
      label: '二级',
      value: 'TWO'
    }, {
      label: '三级',
      value: 'THERE'
    }, {
      label: '四级',
      value: 'FOUR'
    }, {
      label: '五级',
      value: 'FIVE'
    }
  ]

