import httpRequest from '@/utils/httpRequest'

// const baseUrl="http://192.168.16.190:30041";
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

// 添加二级分类
export const addSubCategory = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/category/add', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 删除二级分类
export const deleteSubCategory = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/category/delete/${id}`, true),
    method: 'post',
    selfHandleError: true,
  })
}

// 编辑二级分类
export const updataSubCategory = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/category/update/${id}`, true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取商品列表
export const getGoodsList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取企业下门店自营商品
export const getStoreProductList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/storeList', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 商品下架
export const deleteGoods = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/product/delete/${id}`,true),
    method: 'post',
    selfHandleError: true
  })
}

// 获取商品详情
export const getGoodsDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/detail',true),
    method: 'get',
    params: httpRequest.adornParams({id: `${id}`})
  })
}

// 创建商品
export const createGoods = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/add',true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 修改商品
export const updateGoods = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/product/update/${id}`,true),
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

// 采纳门店自营商品
export const changeOwner = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/changeOwnerShip', true),
    method: 'post',
    data: httpRequest.adornData(data),
    selfHandleError: true
  })
}

// 获取企业下的规格参数列表
export const getSpecKeyList = data => {
  return httpRequest({
    // url: httpRequest.adornUrl('/attributeKey/list', true),
    url: httpRequest.adornUrl('/specKey/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 获取企业下的规格参数列表
export const getSpecValueList = id => {
  return httpRequest({
    url: httpRequest.adornUrl('/specValue/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams({
      specKeyId: id,
      page: 0,
      size: 10000
    })
  })
}

// 新增规格参数
export const addSpecKey = data => {
  return httpRequest({
    // url: httpRequest.adornUrl('/attributeKey/add', true),
    url: httpRequest.adornUrl('/specKey/add', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 修改规格参数
export const updateSpecKey = data => {
  const { id } = data
  return httpRequest({
    // url: httpRequest.adornUrl(`/attributeKey/update/${id}`, true),
    url: httpRequest.adornUrl(`/specKey/update/${id}`, true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 添加规格值
export const addSpecValue = data => {
  return httpRequest({
    // url: httpRequest.adornUrl('/attributeValue/add', true),
    url: httpRequest.adornUrl('/specValue/add', true),
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

// 大转盘查询商品列表
export const getlistTurnable = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/listTurntable', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 商品分类提成设置
export const setPercent = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/category/setCommission', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 商品列表导出
export const exportExcel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/export',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 批量设置销售渠道
export const changeSaleChannel = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/changeSaleChannel', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

/**
 * 品牌列表（不分页）
 * */
export const brandsList = () => {
  return httpRequest({
    url: httpRequest.adornUrl('/brand/select', true),
    method: 'get',
    selfHandleError: true,
    // params: httpRequest.adornParams(data)
  })
}

/**
 * 品牌列表（分页）
 * */
export const brandsPage = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brand/page', true),
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
    url: httpRequest.adornUrl('/brand/add',true),
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
    url: httpRequest.adornUrl(`/brand/update/${id}`,true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

/**
 * 删除品牌
 */
export const deleteRow =data => {
  const { id } = data
}
/**
 * 下载错误文件
 */
export const downErrorFile = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/downLoad',true),
    method:'get',
    responseType: 'arraybuffer',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

// 新增品牌提成
export const addBrandPercent = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brandCommission/add',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 删除品牌提成
export const deleteBrandPercent = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/brand/delete/${id}`, true),
    method: 'post',
    selfHandleError: true,
  })
}

// 删除分类+品牌提成
export const deletebrandCommission = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/brandCommission/delete/${id}`, true),
    method: 'post',
    selfHandleError: true,
  })
}

// 编辑品牌提成
export const editBrandPercent = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/brandCommission/update/${id}`,true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

// 品牌提成列表
export const brandPercentList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/brandCommission/list',true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 获取企业下门店自营商品
export const getSalesAnalysisList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/salesAnalysis/list', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 寄存统计接口
export const depositList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/consign/companyStatistics', true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

// 寄存统计详情
export const depositDetail = data => {
  return httpRequest({
    url: httpRequest.adornUrl(`/consign/companyDetailList/${data.skuId}`, true),
    method:'get',
    selfHandleError: true,
  })
}

// 设置积分规则
export const setGoodesIntegral = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/setIntegralPlan', true),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

//支持多家 门店过滤
export const selectPro = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/select', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data,true)
  })
}

// 根据分类和品牌获取商品默认提成
export const getCommission = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/commissionSettlement/getPercent', true),
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
    url: httpRequest.adornUrl('/product/getBarcode', true),
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
    url: httpRequest.adornUrl('/product/batchUpdate',true),
    method:'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 批量禁用
export const batchStatus = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/product/batchStatus',true),
    method:'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}

// 获取茶饮商品列表
export const getGoodsTeaList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drink/page',true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}
// 获取茶饮分类商品列表
export const getTeaCategory = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drinkClass/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

export const getTeaFeeds = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/feedTable/list',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

export const getTeaFeedsdetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/feedTable/${id}`,true),
    method: 'get',
    selfHandleError: true,
  })
}

//茶饮分类管理
export const getTeaManager = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drinkClass/page',true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}


//获取茶饮门店商品详情
export const getStoreteaDetail = datas => {
  const { id } = datas
  const { storeId } = datas
  return httpRequest({
    url: httpRequest.adornUrl(`/storeDrink/${id}`,true),
    method: 'get',
    params: { storeId: storeId }
  })
}

//应用到门店
export const applyToStore = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drink/applyToStore',true),
    method:'post',
    selfHandleError: true,
    // data:{ids:data}
    data:data
  })
}

//编辑茶饮分类
export const updateTea = data => {
  const { id } = data
  return httpRequest({
    url: httpRequest.adornUrl(`/drinkClass/${id}`,true),
    method:'put',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//新增茶饮分类
export const addTea = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drinkClass',true),
    method:'post',
    selfHandleError: true,
    data:httpRequest.adornData(data)
  })
}

//茶饮分类管理详情
export const getCategoryList = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/drinkClass/${id}`,true),
    method: 'get',
    params: httpRequest.adornParams(id)
  })
}

//编辑茶饮商品
export const editTea = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/drink/${id}`,true),
    selfHandleError: true,
    method: 'put',
    data: httpRequest.adornData(data)
  })
}

//查看茶饮商品
export const detailTea = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/drink/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}


//新增茶饮商品
export const createTea = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/drink',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

//获取门店菜单管理
export const getStoresTeaList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/storeDrink/page', true),
    method: 'get',
    selfHandleError: true,
    params: httpRequest.adornParams(data)
  })
}

//获取门店列表
export const getStoresList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/store/list'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
//门店列表下拉
export const getStoreList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/baseinfo/company/company/select'),
    method: 'get',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
}
//改变销售状态
export const changeSale = row => {
  const { id } = row
  return httpRequest({
    url: httpRequest.adornUrl(`/drink/changeSale/${id}`,true),
    method: 'put',
    selfHandleError: true,
    params: { isSale: !row.sale }
  })
}

// 加料模板管理列表
export const materialTemplateList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/feedTable/list',true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

//加料模板详情
export const materialTemplateView = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/feedTable/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}

//新增加料模板
export const newMaterialTemplate = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/feedTable',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

//编辑加料模板
export const editMaterialTemplate = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/feedTable/${id}`,true),
    selfHandleError: true,
    method: 'put',
    data: httpRequest.adornData(data)
  })
}

//删除加料模板
export const deleteMaterialTemplate = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/feedTable/${id}`, true),
    method: 'delete',
    selfHandleError: true,
  })
}

//加料列表
export const materialList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/feed/page',true),
    method:'get',
    selfHandleError: true,
    params:httpRequest.adornParams(data)
  })
}

//加料详情
export const materialDetail = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/feed/${id}`,true),
    selfHandleError: true,
    method: 'get',
  })
}

//新增加料
export const newMaterial = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/feed',true),
    selfHandleError: true,
    method: 'post',
    data: httpRequest.adornData(data)
  })
}

//编辑加料
export const editMaterial = data => {
  const {id} = data
  return httpRequest({
    url: httpRequest.adornUrl(`/feed/${id}`,true),
    selfHandleError: true,
    method: 'put',
    data: httpRequest.adornData(data)
  })
}

//删除加料
export const deleteMaterial = id => {
  return httpRequest({
    url: httpRequest.adornUrl(`/feed/${id}`, true),
    method: 'delete',
    selfHandleError: true,
  })
}