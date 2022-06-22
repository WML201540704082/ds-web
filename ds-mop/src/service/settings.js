import httpRequest from '@/utils/httpRequest'

// 获取系统消息列表
export const getMessageList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/systemMsg/page',true),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 获取系统消息
export const getMessageDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/messages/getById/${id}`,true),
    selfHandleError: true,
    method: 'get'
  })
}

// 新增消息
export const createMessage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/messages/save',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 修改消息
export const updateMessage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/messages/update',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取消息汇总
export const getSystemMsg = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/systemMsg/listSystemMessageTol',true),
    selfHandleError: true,
    method: 'get',
  })
}
