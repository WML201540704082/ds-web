import Mock from 'mockjs'

const random = Mock.Random

// 商品列表
var goodsList = []

for( let i = 0; i < 20; i++) {
  goodsList.push(Mock.mock({
    'code': '@id',
    'name': '@name',
    'firstCategory': '@name',
    'category': '@name',
    'rule': '商品规格',
    'oriPrice|100-500': 1,
    'stock|100-300': 1,
    'inventory|100-300': 1,
    'justify|100-200': 1,
    'createDate': '@date'
  }))
}

// 出库列表
var outgoingList = []

for( let i = 0; i < Math.floor((Math.random() + 1) * 100); i++) {
  outgoingList.push(Mock.mock({
    'id': '@id',
    'outgoingTime': random.datetime(),
    'name': '@name',
    'status|0-2': 1,
    'person': '@name',
    'category|1-10': 1,
    'count|1-100':1,
    'store': '门店',
    'phone': /^1[0-9]{10}$/,
    'address': random.county(true),
    'createDate': '@date'
  }))
}

// 出库列表
var inventoryList = []

for( let i = 0; i < Math.floor((Math.random() + 1) * 100); i++) {
  inventoryList.push(Mock.mock({
    'id': '@id',
    'inventoryDate': random.datetime(),
    'name': '@name',
    'status|0-1': 1,
    'batchNumber': '@id',
    'person': '@name',
    'createDate': '@date'
  }))
}

// 调整单列表
var justifyList = []

for( let i = 0; i < Math.floor((Math.random() + 1) * 100); i++) {
  justifyList.push(Mock.mock({
    'id': '@id',
    'justifyDate': random.datetime(),
    'name': '@name',
    'status|0-1': 1,
    'batchNumber': '@id',
    'person': '@name',
    'createDate': '@date'
  }))
}

// 调整单详情
var justifyDetailList = []
for( let i = 0; i < Math.floor(Math.random() * 100); i++) {
  justifyDetailList.push(Mock.mock({
    'code': '@id',
    'name': '@name',
    'rule': '商品规则',
    'firstCategory': '@name',
    'category': '@name',
    'costPrice|0-1000.1-10': 1,
    'oriPrice|0-1000.1-10':1,
    'retailPrice|0-1000': 1,
    'stock|0-100':1,
    'inventory|0-100': 1,
    'justify': random.integer( -100, 100 ),
    'createDate': '@date'
  }))
}


// 获取出库单列表
export const outgoinglist = {
  url: '/stock/outgoing/list',
  type: 'post',
  callBack: (opts) => {
    const { currentPage = 1, pageSize = 10 } = opts
    const filterArr = outgoingList.slice((currentPage -1) * pageSize, currentPage * pageSize)
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': {
          records: filterArr,
          total: outgoingList.length
        }
      }
    }
  }
}

// 获取出库单详情
export const getOutgoingDetail = {
  url: '/stock/outgoing/detail/*',
  type: 'get',
  callBack: (opts, id) => {
    console.log('detail', id)
    const item = outgoingList.find(ele => {
      return ele.id == id
    })
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': item
      }
    }
  }
}

// 编辑出库单物流信息
export const editOutgoing = {
  url: '/stock/outgoing/edit/*',
  type: 'post',
  callBack: (opts, id) => {
    const {logisticsCompany, logisticsCode} = opts
    let flag = 0
    outgoingList.forEach((ele, index) => {
      if (ele.id == id ) {
        flag = index
      }
    })
    outgoingList[flag] = {
      ...outgoingList[flag],
      logisticsCompany,
      logisticsCode,
      status: 1 // 待确认收货
    }
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': outgoingList[flag]
      }
    }
  }
}

// 新建商品出库
export const doOutgoing = {
  url: '/stock/outgoing/create',
  type: 'post',
  callBack: (opts) => {
    return {
      data: {
        'msg': 'success',
        'code': 0,
      }
    }
  }
}

// 获取盘点单列表
export const inventorylist = {
  url: '/stock/inventory/list',
  type: 'post',
  callBack: (opts) => {
    const { currentPage = 1, pageSize = 10 } = opts
    const filterArr = inventoryList.slice((currentPage -1) * pageSize, currentPage * pageSize)
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': {
          records: filterArr,
          total: inventoryList.length
        }
      }
    }
  }
}

// 获取调整单列表
export const justifylist = {
  url: '/stock/justify/list',
  type: 'post',
  callBack: (opts) => {
    const { currentPage = 1, pageSize = 10 } = opts
    const filterArr = justifyList.slice((currentPage -1) * pageSize, currentPage * pageSize)
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': {
          records: filterArr,
          total: justifyList.length
        }
      }
    }
  }
}

// 获取调整单详情列表
export const justifydetaillist = {
  url: '/stock/justifyDetail/list',
  type: 'post',
  callBack: (opts) => {
    const { currentPage = 1, pageSize = 10 } = opts
    const filterArr = justifyDetailList.slice((currentPage -1) * pageSize, currentPage * pageSize)
    return {
      data: {
        'msg': 'success',
        'code': 0,
        'data': {
          records: filterArr,
          total: justifyDetailList.length
        }
      }
    }
  }
}


