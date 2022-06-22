import Mock from 'mockjs'

const random = Mock.Random

// 生成数据列表
var dataList = []

for( let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'companyId': '@id',
    'companyName': '@name',
    'level': 1,
    'count|22-30': 1,
    'person': '@name',
    'phone': /^1[0-9]{10}$/,
    'address': random.county(true),
    'serviceTime': '@time',
    'status|0-4': 1,
    'createDate': '@date'
  }))
}

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/company/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 200,
      'list': dataList
    }
  }
}

// 获取用户信息
export function info () {
  return {
    // isOpen: false,
    url: '/company/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'user': dataList[0]
    }
  }
}

// 添加用户
export function add () {
  return {
    // isOpen: false,
    url: '/company/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改企业
export function update () {
  return {
    // isOpen: false,
    url: '/company/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
