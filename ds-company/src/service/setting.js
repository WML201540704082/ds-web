import httpRequest from '@/utils/httpRequest'

//通用设置-门店管理
// 获取门店管理列表
export const getStoresList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/store/list'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 提交-待审核
export const getStoresSubmit = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/baseinfo/company/store/submit/${id}`),
    method: 'post',
    data: httpRequest.adornData()
  })
}

// 获取门店管理详情
export const getStoresDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/baseinfo/company/store/detail/${id}`),
    method: 'get',
  })
}

// 新增/修改
export const getStoresData = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/baseinfo/company/store/${!data.id ? 'add' : 'update'}`),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 编辑卡片信息
export const updateCard = card => {
  return httpRequest({
    url: httpRequest.adornUrl('/settings/company/card'),
    method: 'post',
    data: httpRequest.adornData(card)
  })
}

// 获取结算历史列表
export const getSettlementHistoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/pay/company/fuiouAccountStatement/sumList'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 门店获取结算历史列表
export const getSettlementStoreHistoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/company/statement/storesSumPage'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 企业结算信息
export const settleAccounts = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/storesSum?liquidationDate=${id}`,true),
    method:'get',
    selfHandleError: true,
  })
}

// 获取结算订单列表
export const getSettlementOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/pay/company/fuiouAccountStatement/list'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 佣金结算列表
export const getCommissionList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/commissionSettlement/list',true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true,

  })
}

// 处理佣金结算
export const handleCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/commissionSettlement/applyFor',true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true
  })
}

// 获取提现总金额
export const getCommissionTotal = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/commissionSettlement/withdrawalTotal',true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true
  })
}

// 获取佣金金额
export const getCommissionSetting = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/withdrawalAmountSet/detail',true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true
  })
}

// 编辑佣金金额
export const editCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/withdrawalAmountSet/update' ,true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true
  })
}

// 设置分级提成
export const getStaffCommission = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/orpPrivder/list' ,true),
    method: 'get',
    selfHandleError: true
  })
}

// 更新分级提成
export const updateStaffCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/orpPrivder/update' ,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 结算中心列表导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/pay/company/fuiouAccountStatement/export'),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 门店结算中心列表导出
export const storeexportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/company/statement/export'),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 获取优惠券列表
export const getCouponList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/newcus/couponList',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

//新客开发奖励--保存
export const createNewStaff = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/newcus/setupUpdate',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//获取企业新客开发详情
export const getNewStaffDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/newcus/setupDetail',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 结算中心--直调成本
export const getCostlist = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/list',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 添加导入任务
export const addImportTask = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/add', true),
    selfHandleError: true,
    method: 'post',
    data: data
  })
}

// 当前进行中的导入任务
export const currentTask = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/current', true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 当前导入列表
export const historyTaskList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/list', true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
export const getCostDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/detail/'+data.id,true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 导入错误报告
export const taskErrorList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/report', true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 企业系统基本设置
export const getCompanySetting = config => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/view', true),
    selfHandleError: true,
    token: config.token,
    method: 'get'
  })
}

// 企业系统基本设置
export const setCompanySetting = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/baseinfo', true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 企业结算单列表
export const getSettleBillList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/settleBill/list',true),
    method: 'get',
    params: httpRequest.adornParams(data),
    selfHandleError: true
  })
}

// 企业结算单查看详情
export const getSettleBillDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/settleBill/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 采购结算列表导出
export const procurementExport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/settleBill/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 新增导出任务
export const addExportDownload = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/exportTask/addTask',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 导出任务列表
export const exportDownloadList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/exportTask/list',true),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 下载导出任务
export const downloadExport = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/exportTask/download/${id}`,true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    // params: httpRequest.adornParams(data)
  })
}


