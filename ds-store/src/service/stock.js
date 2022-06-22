import httpRequest from '@/utils/httpRequest'

// 库存管理列表
export const getStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 库存管理列表(带汇总)
export const getStockListAndSum = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/listAndSum',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 查询企业统管商品
export const getCompanyStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/listCompanyOwn',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取门店是否能自营商品入库的设置
export const getInStockFlag = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeInfo/inStockFlag',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 新增供应商
export const newSupplier = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/supplierManage/add',true),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}
// 供应商列表
export const relateSupplierList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/supplierManage/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 删除供应商
export const deleteSupplier = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/supplierManage/remove/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 查看库存管理
export const getStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/stock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 修改库存预警数量
export const getStockUpdate = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/stock/updateStockWarning/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 入库清单列表
export const getinStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
export const getinStockFinishList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/finishInStock',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
// 查看入库清单
export const getinStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}


// 删除相对应的入库清单列表-
export const deleteinStock= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/delete/${ids}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 确认入库操作-
export const sureinStock= id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/inStock/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

///确认收货
export const sureReceive= id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/confirmReceipt/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 编辑新增入库单-
export const addAndupdateInStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/${!data.id ? 'insert' : 'update'}`,true),
    method: 'post',
    selfHandleError: true,
    rt: union_id,
    data: httpRequest.adornData(data)
  })
}

// 入库单新增并入库
export const saveAndInStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/saveAndInStock`,true),
    method: 'post',
    selfHandleError: true,
    rt: union_id,
    data: httpRequest.adornData(data)
  })
}

// 编辑新增订货单
export const addAndupdateReqStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/${!data.id ? 'insert' : 'update'}`,true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除相对应的订货单列表-
export const deletereqStock= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/delete/${ids}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
// 订货单列表
export const getReqStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/reqStock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 请货单列表
export const getReqStockTagetList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/reqStock/targetList',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 订货单详情
export const getReqStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}
// 订货单订货确认
export const getConfirmStockDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/storeConfirm/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 确认收货
export const confirmReqStock = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/confirmReceipt/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 获取盘点列表
export const getInventoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/checkStock/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 导入调整单
export const importInventory = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/checkStock/import', true),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}

// 创建盘点单
export const createInventory = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/checkStock/insert', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
// 编辑盘点单
export const updateInventory = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/checkStock/update', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除盘点单
export const deleteInventory = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/checkStock/delete/${id}`, true),
    method: 'post',
    selfHandleError: true
  })
}

// 查询盘点单
export const getInventoryDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/checkStock/detail/${id}`, true),
    method: 'get',
    selfHandleError: true,
  })
}

// 生成调整单
export const generateJustify = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/checkStock/generateAdjust/${id}`, true),
    method: 'post',
    selfHandleError: true
  })
}

// 调整列表
export const getJustifyList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/adjustStock/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)

  })
}

// 获取调整单详情
export const getJustifyDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/adjustStock/detail/${id}`, true),
    method: 'get',
    selfHandleError: true,
  })
}

// 库存管理导出
export const exportStockExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 入库管理导出
export const exportWarehouseExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 出库管理导出
export const exportOutgoingExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 订货管理导出
export const exportRequiredExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/reqStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 盘点管理导出
export const exportInventoryExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/checkStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 退货管理导出
export const exportreturnStockExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 调整管理导出
export const exportJustifyExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/adjustStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//库存--入库单列表
export const InStockDetailList = stockId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/stock/inStockList/${stockId}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

//结算入库单
export const settleInStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/settle',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data, false)
  })
}

// 拒绝请货单
export const rejectReqStock = data => {
  const { id, item } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/reject/${id}`,true),
    method: 'post',
    selfHandleError: true,
    data: item
  })
}

// 审核订货单
export const checkReqStock = data => {
  const { id, item } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/check/${id}`,true),
    method: 'post',
    selfHandleError: true,
    data: item
  })
}

// 获取商品大类
export const getMainCategory = () => {
  return httpRequest({
    // url: httpRequest.adornUrl('/product/category/select'),
    url: httpRequest.adornUrl('/category/list?page=0&size=10000',true),
    method: 'get',
  })
}

// 获取商品小类
export const getSubCategory = parentId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/category/list?parentId=${parentId}&page=0&size=10000`, true),
    method: 'get',
  })
}

/**
 * 品牌列表（不分页）
 * */
export const brandsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brands/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
/**
 * 品牌列表（分页）
 * */
export const brandsPage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brands/page', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//查询门店库存详情
export const findStoreStock = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/stock/findSS/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 获取出库列表
export const getOutgoingList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取出库单详情
export const getOutgoingDetail = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/outStock/detail/${id}`, true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取寄存统计列表
export const getDepositList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/consign/storeStatistics', true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 获取寄存详情
export const getDepositDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/consign/storeDetailList', true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 商品出库
export const doOutgoing = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/outStock', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//新增出库单
export const newAddOutgoing = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/insert', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//出库单保存并出库
export const saveAndOutStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/saveAndOutStock', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除相对应的出库清单列表
export const deleteOutStock = ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/outStock/${ids}`,true),
    method: 'delete',
    selfHandleError: true,
  })
}

// 编辑出库单
export const editOutgoing = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/outStock/update', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取退货单列表
export const getReturnStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 新增退货单
export const newAddReturn = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/insert', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 更新退货单
export const updateReturn = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/update', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取退货单详情
export const getReturnStockDetail = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/detail/${id}`, true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 删除退货清单列表中的退货单
export const deleteReturnStock = ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/${ids}`,true),
    method: 'delete',
    selfHandleError: true,
  })
}

// 退货单--去退货
export const goReturnStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/returnStock', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 出入库记录详情
export const inOutDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/warehouse/inOut/getDetail',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
