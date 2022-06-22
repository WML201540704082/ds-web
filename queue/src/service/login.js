// 获取排队列表
import httpRequest from '../utils/httpRequest'

export const login = data => {
    return httpRequest({
      url: httpRequest.adornUrl('/login'),
      method: 'post',
      data: httpRequest.adornData(data)
    })
  }