import httpRequest from '@/utils/httpRequest'


// 获取门店管理列表
export const getStoresList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/store/list'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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
// 详情
export const getCostDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/detail/'+data.id,true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 新增
export const getCostAdd = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/expenseBill/${!data.id ? 'add' : 'modify'}`,true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 审核
export const getauditBill = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/auditBill/'+data.id,true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 客户列表
export const getStoreCustomerList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/customerStoreList',true),
    selfHandleError: true,
    method: 'get',
  })
}

// 单据删除
export const getCostDelete = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/delete/'+data.id,true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 生成单据编号
export const getBillCode = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/expenseBill/getBillCode',true),
    selfHandleError: true,
    method: 'get',
  })
}

// 新增导出任务
export const addExportDownload = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/exportTask/addTask',true, 'isCompany'),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 导出任务列表
export const exportDownloadList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/exportTask/list',true, 'isCompany'),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 下载导出任务
export const downloadExport = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/exportTask/download/${id}`,true, 'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    // params: httpRequest.adornParams(data)
  })
}
