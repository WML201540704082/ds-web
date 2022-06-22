import Mock from 'mockjs'

const random = Mock.Random

// 生成数据列表
var dataList = []

for( let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'storeId': '@id',
    'storeName': '@name',
    'email': '@email',
    'type|0-4': 1,
    'status|1': true,
    'contactPerson': '@name',
    'phone': /^1[0-9]{10}$/,
    'address': random.county(true),
    'createDate': '@date'
  }))
}

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/settings/store/list',
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
    url: '/sys/user/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'user': dataList[0]
    }
  }
}

// 修改密码
export function updatePassword () {
  return {
    // isOpen: false,
    url: '/sys/user/password',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 添加用户
export function add () {
  return {
    // isOpen: false,
    url: '/sys/user/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改用户
export function update () {
  return {
    // isOpen: false,
    url: '/sys/user/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除用户
export function del () {
  return {
    // isOpen: false,
    url: '/sys/user/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
