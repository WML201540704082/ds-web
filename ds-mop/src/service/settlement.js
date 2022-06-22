import httpRequest from '@/utils/httpRequest'

// 获取系统消息列表
export const getConfigBussWithdrawSet = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/config/bussWithdrawSet',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取系统消息 
export const getConfigView = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/config/view',true),
    selfHandleError: true,
    method: 'get',
  })
}
