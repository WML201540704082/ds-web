import httpRequest from '@/utils/httpRequest'

// 获取企业信息
export const getCompany = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/company/approve'),
    method: 'get',
  })
}

// 企业认证
export const approveCompany = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/company/approve'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
