import httpRequest from '@/utils/httpRequest'

// 获取活动列表
export const getactivityList = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activity/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 特卖活动详情
export const getactivityDetail = (id) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}
// 等级规则
export const getheadRuleDetail = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/activity/headRule',true),
    method: 'get',
    selfHandleError: true,
  })
}
// 活动下拉
export const getactivitySelect = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activity/select',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 活动列表删除
export const deleteActivity = (id) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/delete/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
// 运行结果
export const getactivityResult = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activityResult/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 补发短信
export const remsg = (id) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activityResult/remsg/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 活动暂停
export const pauseActivity = (id) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/pause/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 活动下架
export const terminateActivity = (id) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/terminate/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
// 活动结果信息查询
export const getactivitycount = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activityResult/count',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 延期
export const renew = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activityResult/renew/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 活动运行结果下载
export const exportExcel = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl('/activityResult/exportExcel',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    responseType: 'arraybuffer',
    params: httpRequest.adornParams(data)
  })
}
// 新建--编辑特卖活动
export const saveSpecial = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/${!data.id ? 'saveSpecial' : `updateSpecial/${data.id}`}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 新建--编辑社区拼团
export const saveGroupBuy = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/${!data.id ? 'saveGroupBuy' : `updateGroupBuy/${data.id}`}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 检查社区拼团是否有删除的商品
export const checkGroupBuyPro = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/activity/checkGroupBuyProduct',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 新增大转盘
export const addTurntable = (data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/activity/${!data.id ? 'saveTurntable' : `updateTurntable/${data.id}`}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 选择图库
export const getBannerList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/banners/list',true,'isCompany'),
    method: 'get',
    selfHandleError: true,
  })
}