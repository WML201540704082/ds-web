import httpRequest from '@/utils/httpRequest'
// 广告设置保存接口
export const advertisementSave = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/banners/update',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 二代店广告分页列表
export const getBannerPage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/banner/page', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 二代店广告新增
export const createSecondBanner = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/banner',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
// 二代店广告更新
export const updateSecondBanner = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/banner/${id}`,true),
    method:'put',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}
// 二代店广告详情
export const getBannerDetails = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/banner/${id}`,true),
    method:'get',
    selfHandleError: true
  })
}
// 二代店广告删除
export const deleteSecondBanner = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/banner/${id}`,true),
    method: 'delete',
    selfHandleError: true,
  })
}