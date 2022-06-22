import httpRequest from '@/utils/httpRequest'
// 获取短信余量列表
export const getAccountList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/list',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 下载短信余量
export const exportAccountList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/export',true),
    selfHandleError: true,
    responseType: 'arraybuffer',
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取充值记录列表
export const getAccountRecordList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/record',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
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

// 短信充值(确定)
export const getAccountRecharge = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/account/recharge',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}


//获取企业下拉列表
export const getCompanyList = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/mop/company/select'),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取企业详情列表
export const getCompanyDetail = data => {
  const { companyId = '' } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/baseinfo/mop/company/detail/${companyId}`),
    selfHandleError: true,
    method: 'get',
  })
}

// 获取自动结算验证码
export const getuserValidval = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/mop/company/userAccount/validval'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 萌百格入驻品牌
export const mbgEnter = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/brandCompany/mbgList', false, 'mami'),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 一键清空数据
export const clearCompanyInfo = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/clearJob/clear', true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 清空记录
export const clearCompanyList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/clearJob/list', true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
