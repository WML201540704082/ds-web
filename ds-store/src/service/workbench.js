import httpRequest from '@/utils/httpRequest'

// 获取工作台信息
export const getWorkbench = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/workBench',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}


//企业工作台数据统计
export const getSalesdata = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/salesData',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 新版数据统计
export const getWorkData = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/stat/workbench',true),
    selfHandleError: true,
    method: 'post',
    params: httpRequest.adornParams(data)
    // data: httpRequest.adornData(data)
  })
}

// 重要提醒
export const getRemind = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/stat/remind',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}
