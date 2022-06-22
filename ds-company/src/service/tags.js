import httpRequest from '@/utils/httpRequest'

// 获取我的顾客列表
export const getTagList = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/tag/topList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 获取我的顾客列表
export const getTagDetail = (customerId) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/tag/customer/${customerId}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 获取我的顾客列表
export const getTagsList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/tag/list',true),
    method: 'get',
    selfHandleError: true,
  })
}
// 某个顾客的标签
export const getCustomerTag = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/tag/customer/'+data.customerId,true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 获取我的顾客列表
export const getTagadd = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/tag/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}