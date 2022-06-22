import httpRequest from '@/utils/httpRequest'

// 获取门店营业概况列表
export const getSurveyList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stat/salesDetail',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取门店营业概况统计数据
export const getSurveyInfo = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stat/salesInfo', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取门店交班记录
export const getExchangeList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/work/pos/list',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


// 获取寄存流水列表
export const getDataflow = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/consign/consignInPage',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
//获取提取流水列表
export const getDataExtractflow = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/consign/consignOutPage',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 导出寄存导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/consign/export/${data.consignType}`,true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    responseType: 'arraybuffer',
    params: httpRequest.adornParams(data)
  })
}

//出入库明细-列表
export const getInOutPageList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/warehouse/inOut/pageList', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 出入库明细导出
export const inOutExport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/warehouse/inOut/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 进销存流水-列表
export const getPurchasePageList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/purchase/sales/flow/getPageList', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
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

// 获取门店销售结算日报表
export const getSaleBalancList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inventoryReport/saleBalanceDayReportList',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}