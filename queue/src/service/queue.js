// 获取排队列表
import httpRequest from '../utils/httpRequest'
export const queueList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/queue/serve/pos'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 评价列表
export const unCommentList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/queue/serve/pos/unCommentList'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 评价信息
export const getEmployeeInfoById = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/comment/getEmployeeInfoById'),
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 评价提交
export const commentSubmit = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/comment/submit'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}