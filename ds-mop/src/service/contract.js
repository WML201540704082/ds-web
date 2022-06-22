import httpRequest from '@/utils/httpRequest'
// 获取合同列表 
export const getContractList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/cm/contract/list',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 通过合同iD获取唯一合同
export const getOnlyContract = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/cm/contract/getById/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}
// 合同审核
export const getContractUpdate = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/cm/contract/update',true),
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
//获取企业下拉列表
export const getCompanyList = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/mop/company/select'),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}