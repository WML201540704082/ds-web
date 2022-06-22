import httpRequest from '@/utils/httpRequest'
// 销售明细汇总
export const commoditySalesTotal = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/report/daySaleSku',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
//销售单导出
export const exportiRequestExcel = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/returnStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//盘点单列表
export const getInventoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/report/check',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//盘点单导出
export const addExportDownload = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/exportTask/addTask',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//入库单列表
export const getPutInStoageList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStockReport/reportList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


//入库单商品明细列表
export const getIncominGoodsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStockReport/reportItemList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


//退库单列表
export const getReturnStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnStockReport/reportList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//门店销售结算日报表
export const getdayStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/report/storeSteward/page',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//退库单商品明细列表
export const getReturnStockDetailList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnStockReport/reportItemList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//门店进销存报表
export const getStoreInventoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inventoryReport/inventoryReportList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//门店销售汇总
export const getStoreSalesSumList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/report/storeSaleSummary',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//财务销售结算
export const getFinanceList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statement/store/page',true),
    method:'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


// 删除财务结算
export const deleteFinanceList= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/store/${ids}`,true),
    method: 'delete',
    selfHandleError: true,
  })
}

//财务审核
export const auditView = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/store/check/${id}`,true),
    selfHandleError: true,
    method: 'put'
  })
}