import httpRequest from '@/utils/httpRequest'

// 新增优惠券
export const workRecords = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/workRecords/select',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}