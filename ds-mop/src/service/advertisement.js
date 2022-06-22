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
