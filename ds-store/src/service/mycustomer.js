
import httpRequest from '@/utils/httpRequest'

// 获取我的顾客列表
export const getCustomerList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customer/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取我的顾客详情
export const getCustomerDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/customer/detail/${id}`,true),
    method: 'get',
  })
}

// 新增/修改顾客
export const getCustomerUpdate = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/customer/${!data.id ? 'add' : `update/${data.id}`}`,true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 充值记录
export const getMoney = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/rechargeRecord/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 查询顾客的储值卡记录单
export const cardRecord = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/cardRecord/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 查看顾客礼品卡列表
export const statCardList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl(`/statCard/customer/${data.customerId}`,true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 查看顾客礼品卡详情
export const statCardDetail = id =>{
  return httpRequest({
    url: httpRequest.adornUrl(`/statCard/record/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}

// 顾客购物卡列表
export const customerCardList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/page',true,'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 修改购物卡
export const shoppingCardModify = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/modify',true,'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 顾客购物卡流水列表
export const customerCardRecordList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/recordPage',true,'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 查看顾客寄存列表
export const depositList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/pos/consign/consignInRecord'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 查看顾客寄存详情-提货列表
export const depositDetail = id =>{
  return httpRequest({
    url: httpRequest.adornUrl(`/pos/consign/consignOutRecord//${id}`),
    selfHandleError: true,
    method: 'get',
  })
}

// 员工下拉
export const employeeSelect = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/employee/select',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 绑定员工
export const getCustomerbind = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/customer/bind',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 微信
export const getCustomerwechat = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activity/sendMsg',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 顾客列表导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customer/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 等级列表
export const levelList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/findListByCompanyId',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
  })
}


// 设置会员等级
export const setLevels = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/updateCustVipLevel',true, 'isCompany'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}


// 活跃客户等级分类
export const getLeveLCategory = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/liveCustomerLevel/detail',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
  })
}

// 顾客积分相关
export const integralRecords = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integral/integralRecords',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 查询积分
export const integralSearch = customerId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/integral/findCustomerById/${customerId}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 查询储值卡余额
export const cardRecordSearch = customerId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/cardRecord/findCustomerById/${customerId}`,true),
    method: 'get',
    selfHandleError: true,
  })
}
