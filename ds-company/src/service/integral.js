import httpRequest from '@/utils/httpRequest'


// 新建积分规则
export const addIntegralPlan = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralPlan/add',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 积分规则下拉框
export const integralPlanSelect = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralPlan/select',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 编辑积分规则
export const updateIntegralPlan = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/integralPlan/update/${id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除积分规则
export const deleteIntegralPlan = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/integralPlan/delete/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 获取积分规则详情
export const integralPlanDetail = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralSetup/detail',true),
    method: 'get',
    selfHandleError: true,
  })
}

// 设置积分规则
export const setIntegralPlan = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralSetup/modify',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取会员等级多倍积分
export const getVipIntegral = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralSetup/vipIntegral/detail',true),
    method: 'get',
    selfHandleError: true,
  })
}

// 设置会员等级多倍积分
export const setVipIntegral = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/integralSetup/vipIntegral/modify',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
