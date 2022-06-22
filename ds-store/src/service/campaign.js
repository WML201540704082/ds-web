import httpRequest from '@/utils/httpRequest'

// 获取优惠券列表
export const getCouponList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 获取优惠券详情
export const getCouponDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/coupon/detail/${id}`,true),
    method: 'get',
  })
}

// 顾客优惠券列表
export const customerCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCoupon/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 优惠券下拉框
export const getCouponSelectOptions = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/selectOption',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 顾客发送优惠券
export const customerSendCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCoupon/add',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 积分详情
export const integralRules = () =>{
  return httpRequest({
    url: httpRequest.adornUrl('/integralRule/selectOne',true),
    selfHandleError: true,
    method: 'get',
  })
}

/**
 * 礼品卡
 */
// 获取礼品卡列表
export const getStatCardList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 创建礼品卡
export const createStatCard = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/create',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 更改礼品卡状态
export const changeStatCardStatus = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/changeStatus',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取礼品卡详情
export const getStatCardDetail = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/statCard/detail/${id}`,true),
    method: 'get',
    data: httpRequest.adornData(data)
  })
}
/**
 * 购物卡
 */
//获取购物卡列表
export const getshoppingCardList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/shoppingCard/page',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
/**
 * 短信营销
 */
// 获取短信模板列表
export const getShortmessageList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 新增短信模板
export const addShortmessage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 获取短信模板详情
export const getTemplateDetail = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/detail',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 修改短信模板状态
export const updateTemplate = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/stopTemplate',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 删除短信模板
export const deleteTemplate = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/delTemplate',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 发送短信-优惠券列表
export const getSmsCouponList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsMarketing/couponList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 发送短信-短信模板列表
export const getSmsTemplateList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsTemplate/selectTemplate',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 提交审核
export const doSendMessage = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsMarketing/submitCheck',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 短信发送记录
export const getSendList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsMarketing/sendRecord',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 重新审核短信
export const reMessageDetail = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/smsMarketing/resetCheck',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 重新提交审核
export const smsMarketing = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/smsMarketing/submitCheckAgain',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}


// 获取短信余量
export const getAccountDetail = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/details',true),
    method: 'get',
  })
}

// 优惠券列表导出
export const exportCouponExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 礼品卡列表导出
export const exportCountcardExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 活动匹配门店使用优惠券列表--大转盘
export const getactivityCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/activityCouponSelectOption',true,'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 下拉选择礼品卡（大转盘）
export const getstatCardSelectOption = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/statCardSelectOption',true,'isCompany'),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}