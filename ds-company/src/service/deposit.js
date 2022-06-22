import httpRequest from '@/utils/httpRequest'

// 导入寄存
export const importDeposit = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/depstract/import', true),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}
