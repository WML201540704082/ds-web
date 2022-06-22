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

// 优惠券发放记录
export const couponSendRecords = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon-send-record/page',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 新增优惠券
export const createCoupon = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/add',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

//编辑优惠券
export const editCoupon = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/updateInfo',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 优惠券失效
export const deleteCoupon = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/coupon/updateSendStatus/${id}`,true),
    selfHandleError: true,
    method: 'get'
  })
}

// 获取优惠券详情
export const getCouponDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/coupon/detail/${id}`,true),
    method: 'get',
    params: httpRequest.adornParams(id)
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


// 获取发放礼包活动列表
export const getGiftBagList = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/giftBag/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//新人礼可发放优惠券列表
export const newPeopleCoupon = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/giftBag/setCouponList',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 新增新人礼包
export const giftBagAdd = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/giftBag/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 新人礼详情
export const newPeopleDetails = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/giftBag/detail/${id}`,true),
    method: 'get',
  })
}

//使失效
export const getInvalidate = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/giftBag/invalidate/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}
// 顾客优惠券列表
export const customerCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCoupon/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 新增顾客优惠券
export const customerSendCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCoupon/add',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 顾客使用优惠券
export const customerUseCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCoupon/useCoupon',true),
    method: 'get',
    params: httpRequest.adornParams(data)
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

//积分保存
export const integralRuleUpdate = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/integralRule/update',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 启用积分规则开关
export const integralonOrOff = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/integralRule/onOrOff',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}


// 活动匹配门店使用优惠券列表--大转盘
export const getactivityCoupon = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/coupon/activityCouponSelectOption',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
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
    selfHandleError: true,
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
    params: httpRequest.adornParams(data)
  })
}

// 删除礼品卡
export const deleteStatCard = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/statCard/delete/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 删除优惠券
export const deleteCampain = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/coupon/delete/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}


// 编辑礼品卡
export const editStatCard = data =>{
  const {id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/statCard/update/${id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

/**
 * 购物卡
 */
//获取购物卡列表
export const getshoppingCardList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/shoppingCard/page',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
//新增购物卡
export const createShoppingCard = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/shoppingCard/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
//修改购物卡
export const editShoppingCard = data =>{
  return httpRequest({
    url: httpRequest.adornUrl(`/shoppingCard/update`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 购物卡详情
export const shoppingCardDetails = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/shoppingCard/detail/${id}`,true),
    method: 'get',
  })
}
//删除购物卡
export const deleteShoppingCard = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/shoppingCard/delete/${id}`,true),
    method: 'get',
    selfHandleError: true,
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
    selfHandleError: true,
    method: 'get',
  })
}

// 企业订货提醒消息
export const orderRemindMessage = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/systemMessage/orderMessage',true),
    selfHandleError: true,
    method: 'get',
  })
}

// 获取短信套餐列表
export const getMessageRechargeList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/packages',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 创建短信充值订单
export const createMessageRecharge = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/recharge',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 充值记录列表
export const rechargeListRecord = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/record',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}


// 保存门店合伙人
export const saveMami = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/mummyPartnerRule/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 编辑门店合伙人
export const editMami = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/mummyPartnerRule/update',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取门店合伙人详情
export const getMamiDetail = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/mummyPartnerRule/detail',true),
    method: 'get',
    selfHandleError: true
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

/**
 * 促销相关接口
 */

// 促销活动列表
export const getPromoteList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/promote/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 满减活动列表
export const getFullPromoteList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promotion/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 查看产品相关促销活动
export const getProductPromote = productId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/promote/product/${productId}`,true),
    method: 'get',
    selfHandleError: true
  })
}

// 保存搭售组合
export const saveCompose = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promote/saveCompose',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 保存满减商品
export const saveFull = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promotion/add',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 修改保存满减商品
export const updateFull = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/promotion/update/${id}`,true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 保存单品打折
export const saveDiscount = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promote/saveDiscount',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 删除满减活动
export const deleteFullPromote = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/promotion/delete/${id}`,true),
    method:'get',
    selfHandleError: true,
  })
}
// 删除促销活动
export const deletePromote = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/promote/${id}`,true),
    method:'delete',
    selfHandleError: true,
  })
}

// 获取促销详情
export const getPromoteDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/promote/${id}`,true),
    method:'get',
    selfHandleError: true
  })
}

// 获取满减详情
export const getfullDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/promotion/detail/${id}`,true),
    method:'get',
    selfHandleError: true
  })
}

// 检查促销政策(非满减)
export const checkProduct = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promote/checkPromoteProduct',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 检查促销政策(满减)
export const checkFullProduct = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/promotion/checkActivityProduct',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 检查商品列表
// export const checkProduct = data => {
//   return httpRequest({
//     url: httpRequest.adornUrl('/promote/product',true),
//     method:'post',
//     selfHandleError: true,
//     data:httpRequest.adornData(data)
//   })
// }


// 下拉选择礼品卡（大转盘）
export const getstatCardSelectOption = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/statCardSelectOption',true),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 顾客发放礼品卡
export const sendCustomerStatCard = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/sendCustomerStatCard',true),
    method:'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 顾客发放礼品卡记录
export const sendStatCardRecordPage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/sendStatCardRecordPage',true),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取套餐列表
export const getAccountPackagesList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/packages',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取营销短信发送列表
export const getCampaignSendList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/sms/page',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
