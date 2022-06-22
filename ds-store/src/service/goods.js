import httpRequest from '@/utils/httpRequest'


// 获取商品大类
export const getMainCategory = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/category/list?page=0&size=10000', true, 'isCompany'),
    method: 'get',
  })
}

// 获取商品小类
export const getSubCategory = parentId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/category/list?parentId=${parentId}&page=0&size=10000`, true, 'isCompany'),
    method: 'get',
  })
}

// 获取商品列表
export const getGoodsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/list',true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//支持多家 门店过滤
export const selectPro = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/select', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 获取商品详情
export const getGoodsDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/detail',true, 'isCompany'),
    method: 'get',
    params: httpRequest.adornParams({id})
  })
}

// 下架商品
export const deleteGoods = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/product/delete/${id}`,true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData({id})
  })
}

// 创建商品
export const createGoods = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/add',true, 'isCompany'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 修改商品
export const updateGoods = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/product/update/${id}`,true, 'isCompany'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 获取门店是否新增商品
export const getSelfBusiness = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeInfo/selfBusinessFlag', true),
    method: 'get',
    selfHandleError: true,
  })
}

// 获取企业下的规格参数列表
export const getSpecKeyList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/specKey/list', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取企业下的规格参数列表
export const getSpecValueList = attrId => {
  return httpRequest({
    url: httpRequest.adornUrl('/specValue/list', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams({
      specKeyId: attrId,
      page: 0,
      size: 10000
    })
  })
}

// 新增规格参数
export const addSpecKey = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/specKey/add', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 修改规格参数
export const updateSpecKey = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/specKey/update/${id}`, true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 添加规格值
export const addSpecValue = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/specValue/add', true, 'isCompany'),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 导入商品清单
export const uploadGoods = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/import',true),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}

// 商品列表导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/export',true, 'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 一键复制
export const copyGoods = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/copyToStore', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
  })
}

// 克隆门店商品
export const copyStoreGoods = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/batchCopyStore', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 修改门店自营商品价格
export const updateStorePrice = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/setStorePrice', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 门店列表
export const getStoreList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/storeList', true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 回显
export const getSettingsDetail = productId => {
  return httpRequest({
    url: httpRequest.adornUrl(`/apmtSettings/detail/${productId}`,true),
    method: 'get',
    selfHandleError: true
  })
}

//设置
export const getSettingsSet = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/apmtSettings/set', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取技师
export const getAdjustmentList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/employee/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 批量设置销售渠道
export const changeSaleChannel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/changeSaleChannel', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

/**
 * 品牌列表（不分页）
 * */
export const brandsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brand/select', true, 'isCompany'),
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
    url: httpRequest.adornUrl('/brand/page', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

/**
 * 增加品牌设置
 */
export const addBrand = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brand/add',true, 'isCompany'),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

/**
 * 编辑品牌
 */
export const updateBrand = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/brand/update/${id}`,true, 'isCompany'),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

/**
 * 下载错误文件
 */
export const downErrorFile = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/downLoad',true, 'isCompany'),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 商品销售分析
export const getSalesAnalysisList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesAnalysis/list', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 设置积分规则
export const setGoodesIntegral = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/setIntegralPlan', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 导入错误报告
export const taskErrorList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/report', true , 'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 添加导入任务
export const addImportTask = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/add', true, 'isCompany'),
    selfHandleError: true,
    method: 'post',
    data: data
  })
}

// 当前进行中的导入任务
export const currentTask = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/current', true, 'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 当前导入列表
export const historyTaskList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/importTask/list', true, 'isCompany'),
    selfHandleError: true,
    method: 'get',
    params: httpRequest.adornParams(data)
  })
}

// 根据分类和品牌获取商品默认提成
export const getCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/commissionSettlement/getPercent', true, 'isCompany'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//商品流水列表
export const getSaleRecordList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/saleRecord/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 商品销售分析列表导出
export const salesAnalysisExport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesAnalysis/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 商品销售流水导出
export const salesRecordExport = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/saleRecord/export',true),
    method:'post',
    responseType: 'arraybuffer',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取条形码
export const getBarcode = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/getBarcode', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 判断条形码是否重复
export const checkRepeat = code => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/existsBarcode', true, 'isCompany'),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams({barcode: code})
  })
}

// 批量编辑
export const batchUpdate = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/batchUpdate',true, 'isCompany'),
    method:'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 批量禁用
export const batchStatus = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/batchStatus',true, 'isCompany'),
    method:'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取 猜你喜欢 商品列表
export const getGuessGoodsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/guess/page', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 批量保存猜你喜欢  /guess-like/batchSave
export const guessLikeSave = data =>{
  return httpRequest({
    url: httpRequest.adornUrl('/guess/add', true),
    method: 'post',
    selfHandleError: true,
    data: data
  })
}
// 删除猜你喜欢
export const deleteGuessGoods = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/guess/delete/${id}`, true),
    method: 'post',
    selfHandleError: true,
  })
}

// 修改猜你喜欢排序
export const editrank = (id,data) => {
  return httpRequest({
    url: httpRequest.adornUrl(`/guess/update/${id}`, true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}