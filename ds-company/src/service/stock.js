import httpRequest from '@/utils/httpRequest'

// 库存管理列表--企业
export const getStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 库存管理列表--企业(带汇总)
export const getStockListAndSum = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/listAndSum',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//库存管理列表--门店
export const getStockStoreList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeStock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//库存管理列表--门店(带汇总)
export const getStockStoreListAndSum = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeStock/listAndSum',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//
export const getStockListCompanyOwn = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/listCompanyOwn',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
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

export const getStoreStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/listSku',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
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

// 查看入库清单
export const getinStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 删除相对应的入库清单列表
export const deleteinStock= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/delete/${ids}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
//财务更新
export const updateFinance = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/store/${id}`,true),
    selfHandleError: true,
    method: 'put',
    data: httpRequest.adornData(data)
  })
}

//财务查看
export const  viewFinance = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/store/${id}`,true),
    method:'get',
    selfHandleError: true,
  })
}

//财务销售编辑
export const getQureyList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/statement/store/sale',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}
//订单审核数据删除
export const reqStockDelete= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/delete/item/${ids}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
// 确认入库操作
export const sureinStock= id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/inStock/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 编辑新增入库单
export const addAndupdateInStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/${!data.id ? 'insert' : 'update'}`,true),
    method: 'post',
    selfHandleError: true,
    rt:union_id,
    data: httpRequest.adornData(data)
  })
}
// 编辑新增订单
export const addAndupdateOrder = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/insert`,true),
    method: 'post',
    selfHandleError: true,
    rt:union_id,
    data: httpRequest.adornData(data)
  })
}
// 入库单新增并入库
export const saveAndInStock = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/saveAndInStock',true),
    method: 'post',
    rt:union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
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

// 订货单详情
export const getReqStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 退货单列表
export const getReturnStockList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/returnStock/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 退货单详情
export const getReturnStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/returnStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 审核订货单
export const checkReqStock = data => {
  // const {id, item} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/check/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    // data: item
    data: httpRequest.adornData(data)
  })
}

// 拒绝订货单
export const rejectReqStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/reject/${data.id}`,true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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

//新增退货单
export const newAddReturn = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl('/returnStock/insert', true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
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

// 审核出库信息
export const auditOutgoing = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/outStock/check/${id}`, true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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
export const generateJustify = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/checkStock/generateAdjust/${id}`, true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
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
// 订货单删除
export const deleteinOrder= ids => {
  return httpRequest({
    url: httpRequest.adornUrl(`/reqStock/delete/${ids}`,true),
    method: 'post',
    selfHandleError: true,
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

//退货管理导出
export const exportiRequestExcel = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/returnStock/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

export const exportRequestExcel = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/export',true),
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

//部分结算入库单
export const settleInStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/settle',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data, false)
  })
}

//全部结算入库单
export const fullSettleInStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/fullSettle',true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data, false)
  })
}

// 查看结算历史
export const getSettlementRecords = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/inStock/settlementRecords/${id}`,true),
    method: 'get',
    selfHandleError: true,
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

//查询门店库存详情
export const findStoreStock = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/stock/findSS/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 查询企业入库单原进货价和原配送价
export const inStockFindItem = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/inStock/findItem', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)

  })
}

//查询门店库存或企业库存详情
export const getStoreOrCompanyStockDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/stock/findSSBySSP',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取供应商下拉列表
export const getSupplierList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerInfo/mbgList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 关联供应商列表
export const relateSupplierList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerInfo/relationList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 品牌供应商接口
export const getBrandSupplierList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brandDealer/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//关联选择供应商列表
export const relateChoiceList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerInfo/choiceList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

//关联选择供应商保存接口
export const relateChoiceSave = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/companyInfo/relateMbgStore','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 新增供应商
export const newSupplier = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerInfo/mbgAdd','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 供应商列表
export const relateCustomerInfoList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerInfo/mbgList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 获取采购单供应商下拉列表
export const getShoppingSupplierList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/dealer/select',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 新增采购单--获取商品列表
export const getShoppingGoodsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/common/customerSku/mbgList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 获取供应商sku列表
export const getCustomerSkuList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/customerSku/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取订单号
export const AddShoppingOrderNo = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/purchaseOrder/getOrderNo',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 新增采购单--保存
export const AddShoppingSave = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/company/storeOrder/mbgAdd','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 采购单订单列表
export const ShoppingOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/order/company/storeOrder/mbgList','mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
    data: httpRequest.adornData(data)
  })
}

// 采购单订单详情
export const getShoppingDetail = orderId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/purchaseOrder/detail/${orderId}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 采购单订单确认收货
export const ShoppingConfirm = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/order/company/storeOrder/mbgConfirmReceipt`,'mami'),
    selfHandleError: true,
    method: 'post',
    noToken: true,
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

// 获取门店退货列表
export const getStoreReturnList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeReturnStock/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 审核门店退货单
export const checkReturnStock = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/check/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}
// 拒绝门店退货单
export const rejectReturnStock = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/reject/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 退货单详情
export const getStoreReturnStockDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/detail/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

// 门店退货清单确认收货
export const sureReturnStock= id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/storeReturnStock/confirmReceipt/${id}`,true),
    method: 'post',
    selfHandleError: true,
  })
}

// 采购单新增
export const purchaseOrderAadd = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/purchaseOrder/add`,true),
    method: 'post',
    rt: union_id,
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除相对应的出库清单列表
export const deleteShoppingStock = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/purchaseOrder/delete`,true),
    method: 'delete',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 采购单列表
export const purchaseOrderList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/purchaseOrder/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 采购单确认收货
export const purchaseOrderConfirm = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/purchaseOrder/update`,true),
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

// 编辑新增财务
export const addAndupdateFinance = data => {
  const {union_id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/statement/store`,true),
    method: 'post',
    selfHandleError: true,
    rt:union_id,
    data: httpRequest.adornData(data)
  })
}