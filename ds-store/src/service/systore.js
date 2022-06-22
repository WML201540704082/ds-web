import httpRequest from '@/utils/httpRequest'

// 获取门店下拉列表
export const getStoreList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/company/select'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 获取用户列表
export const getSysUserList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/store/sysUser/select'),
    selfHandleError: true,
    method: 'get',
  })
}
