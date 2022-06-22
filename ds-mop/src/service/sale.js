import httpRequest from '@/utils/httpRequest'
// 获取销售人员列表 
export const getSaleList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesman/list',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 添加销售人员列表
export const AddSalesman = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesman/save',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 获取销售人员详情列表
export const getSalesmanDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/salesman/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}
// 编辑销售人员
export const updateSalesman = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesman/update',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 删除销售
export const deleteSale = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/salesman/${id}`,true),
    method: 'delete',
    selfHandleError: true
  })
}
