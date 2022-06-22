import httpRequest from '@/utils/httpRequest'
// 获取零售订单列表
export const getOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取零售订单详情
export const getOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/detail',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}


// 获取礼品卡订单列表
export const getstatOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取礼品卡订单详情
export const getstatOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/detail',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 获取充值订单列表
export const getrechargeOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取充值订单详情
export const getrechargeOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/detail',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}


// 获取退货单列表
export const getreturnOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取退货单详情
export const getreturnOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/detail',true),
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
    url: httpRequest.adornUrl('/order/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 礼品卡订单列表导出
export const statOrderexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statOrder/export',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}
// 充值订单列表导出
export const rechargeexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/export',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}
// 退货单列表导出
export const returnOrderexport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnOrder/export',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}


// 获取兑换订单列表
export const getintegralOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralOrder/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取兑换订单详情
export const getintegralOrderDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralOrder/detail/'+data.id,true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取储值卡退款单列表
export const getRefundRechargeList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/refundRecharge/pageList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取储值卡退款单详情
export const getRefundRechargeDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/refundRecharge/detail/'+data.id,true),
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