import httpRequest from '@/utils/httpRequest'

// 零售订单列表
export const getOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 零售订单详情
export const getOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/detail',true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 订单提货
export const orderSelf = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl('/order/take',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 订单发货
export const orderShipment = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl('/order/ship',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取礼品卡订单列表
export const getstatOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取礼品卡订单详情
export const getstatOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/detail',true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 获取充值订单列表
export const getrechargeOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取充值订单详情
export const getrechargeOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/detail',true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}


// 获取退货单列表
export const getreturnOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取退货单详情
export const getreturnOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/detail',true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
//零售訂單導出
export const exportRetailExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 订单列表导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/mwOrder/export','gtdmp'),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
//品牌方活动订单导出
export const exportBrandExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/distributionActivityOrder/export','gtdmp'),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 礼品卡订单列表导出
export const statOrderexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/export',true,'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}
// 充值订单列表导出
export const rechargeexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/export',true,'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}
// 退货单列表导出
export const returnOrderexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/export',true,'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 获取妈咪全知道订单列表
export const getMamiOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/mwOrder/mbgList', true, 'mami'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取妈咪全知道订单详情
export const getMamiOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/mwOrder/mbgDetail', true,  'mami'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}


// 获取兑换订单列表
export const getintegralOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralOrder/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取兑换订单详情
export const getintegralOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralOrder/detail/'+data.id,true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取储值卡退款单列表
export const getRefundRechargeList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/refundRecharge/pageList',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取储值卡退款单详情
export const getRefundRechargeDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/refundRecharge/detail/'+data.id,true,'isCompany'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 储值卡退款单列表导出
export const refundRechargeexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/refundRecharge/export',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 总金额
export const getTotalAmount = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/distributionActivityOrder/turnover', 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取品牌活动订单列表
export const getDmpOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/distributionActivityOrder/list', 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取品牌活动订单详情
export const getDmpOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/order/distributionActivityOrder/${data.orderId}`, 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取品牌活动订单列表
export const getGtStoreIds = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeInfo/getGtStoreIds', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 品牌分销活动列表
export const getGtActivityList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/marketing/distributionActivityInfo/storeActivityList', 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 品牌方退款
export const getGtAudit = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/distributionActivityOrderRefund/audit', 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 品牌方提货
export const getGtExtract = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/distributionActivityOrder/extract', 'gtdmp'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}