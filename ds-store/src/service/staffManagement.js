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

// 获取员工角色
export const getRoleDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/store/sysRole/select'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}