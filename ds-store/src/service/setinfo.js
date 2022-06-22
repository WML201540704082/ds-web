import httpRequest from '@/utils/httpRequest'  

// 获取当前用户信息详情
export const getUserInfoData = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/store/sysUser/getBasicsDetail'),
    selfHandleError: true,
    method: 'get',
  })
}

// 修改当前用户信息详情
export const userInfoData = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/store/sysUser/updateDetail'),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
  