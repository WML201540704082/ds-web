import httpRequest from '@/utils/httpRequest'
// 获取门店地域归属--省份
export const getProvinceInfo = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeAnalysis/getProvinceInfo',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取门店增长数据
export const getStoreIncrease = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeAnalysis/store/increase',true),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}
// 获取门店地域归属--地区
export const getCityInfo = provinceId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeAnalysis/getDistrictInfo/${provinceId}`,true),
    selfHandleError: true,
    method: 'get',
  })
}