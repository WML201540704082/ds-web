import httpRequest from '@/utils/httpRequest'

// 上传通用接口
export const upload = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/oss/upload'),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}
