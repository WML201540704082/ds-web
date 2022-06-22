import httpRequest from '@/utils/httpRequest'
// 获取pos登录历史
export const getPosLoginList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeAnalysis/login/history/select',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取pos登录情况（省级）
export const getPosLoginProvince = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeAnalysis/province/login/history',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取pos登录情况（市级）
export const getPosLoginCity = provinceId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeAnalysis/district/login/history/${provinceId}`,true),
    selfHandleError: true,
    method: 'get',
  })
}
