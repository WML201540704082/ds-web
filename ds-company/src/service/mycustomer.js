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

// 新增/修改顾客
export const getCustomerUpdate = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/customer/${!data.id ? 'add' : `update/${data.id}`}`,true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取我的顾客详情
export const getCustomerDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/customer/detail/${id}`,true),
    method: 'get',
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


// 顾客导入
export const importCustomers = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customer/import',true),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}

// 充值记录
export const getMoney = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/recharge/list',true),
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

// 延期顾客礼品卡
export const statCardDelay = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/statCard/delayCustomerCard',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 顾客购物卡列表
export const customerCardList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/page',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 修改购物卡
export const shoppingCardModify = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/modify',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 顾客购物卡流水列表
export const customerCardRecordList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerCard/recordPage',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 员工下拉
export const employeeSelect = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/employee/select',true),
    method: 'get',
    selfHandleError: true,
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

// 佣金操作--佣金明细
export const myCommissionDetail = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCommission/commissionList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 提现明细
export const myCommissionList = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCommission/withdrawalList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


export const withdrawalTotal = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCommission/withdrawalTotal',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


export const commissionTotal = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/customerCommission/commissionTotal',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 门店合伙人列表
export const mamiConfree = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/mummyPartner/list',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 门店合伙人购买记录
export const buyRecords = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/mpBuyHistory/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 查看商品包明细
export const packageDetail = packageId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/mummyPartnerRule/productPackageItem/${packageId}`,true),
    method: 'get',
    selfHandleError: true
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


// ****************
// 是否开启会员等级
export const autoDetail = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/auto/findByCompanyId',true),
    method: 'get',
    selfHandleError: true,
  })
}

// 等级保存
export const autoSave = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/auto/save',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 会员信息汇总
export const memberTotal = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/findVipLevelSumListByCompanyId',true),
    method: 'get',
    selfHandleError: true,
  })
}
// 等级列表
export const levelList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/findListByCompanyId',true),
    method: 'get',
    selfHandleError: true,
  })
}
// 新增等级--编辑等级
export const addorupdateLevel = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/viplevel/${!data.id ? 'add' : 'update'}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//会员等级详情
export const levelDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/viplevel/view/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}
// 删除等级
export const deleteLevel = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/viplevel/deleteById/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 设置会员等级
export const setLevels = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/viplevel/updateCustVipLevel',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}


// 设置会员等级升级方式
export const setSaveType = data =>{
  return httpRequest({
    url: httpRequest.adornUrl(`/viplevel/auto/saveType/${data.id}`,true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
/**
 * 生命周期&任务管理相关
 */
// 获取顾客生命周期
export const lifeCycList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerLife/list',true),
    method: 'get',
    selfHandleError: true,
  })
}

// 编辑生命周期
export const editLifeCyc = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerLife/update',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 活跃客户等级分类
export const getLeveLCategory = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/liveCustomerLevel/detail',true),
    method: 'get',
    selfHandleError: true,
  })
}

// 编辑客户等级分类
export const editLevelCategory = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/liveCustomerLevel/update',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 任务列表
export const getTaskList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employeeTask/task/pageList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 员工任务
export const getStaffTaskList = taskId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/employeeTask/${taskId}/employee`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 客户任务列表
export const getCustomerTaskList = data => {
  const {taskId, employeeId} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/employeeTask/${taskId}/${employeeId}/customers`,true),
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
// 修改积分
export const integralModify = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integral/modify',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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

// 修改储值卡
export const cardRecordModify = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/cardRecord/modify',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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