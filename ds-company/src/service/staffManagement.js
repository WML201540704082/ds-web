import httpRequest from '@/utils/httpRequest'
// 创建员工
export const createStaff = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/add',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取员工列表
export const getStaffList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 修改员工信息
export const updateStaff = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/employee/update/${id}`,true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 删除员工
export const deleteStaff = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/employee/delete/${id}`,true),
    method: 'post',
    selfHandleError: true
  })
}

// 获取员工详情
export const getStaffDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/employee/details/${id}`,true),
    method: 'get',
  })
}

// 回访小计--列表查询
export const workRecords = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/workRecords/select',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 工作人员业绩
export const getStaffPerformanceList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/performance/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//工作人员业绩导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/performance/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//员工列表导出
export const exportStaffExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 获取企业员工角色
export const getRoleDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/company/sysRole/select'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取门店员工角色
export const getStoreRoleDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/store/sysRole/select'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取员工提成明细
export const getCommissionList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/orderRoyalDetail/getList', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取员工提成明细
export const exportCommissionList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/orderRoyalDetail/export', true),
    method: 'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取新客提成详情
export const getNewStaffCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/newcus/employeeCommissionPage', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取员工佣金详情
export const getEmployeeCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employeeCommission/pageList', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 变更手机号
export const updatePhone = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/employee/updatePhone/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 更改员工状态
export const updateStatus = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/employee/updateStatus/${data.id}?status=${data.status}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}