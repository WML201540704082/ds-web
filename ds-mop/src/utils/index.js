import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { removeStore } from '@/utils/storage'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return true
  // return JSON.parse(sessionStorage.getItem('mop-permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuthMenu (key) {
  return JSON.parse(sessionStorage.getItem('mop-permissions') || '[]').indexOf(key) !== -1 || false
}

/*大于等于零的整数，保留两位小数点*/
export function number(num){
  var re = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/
  var re1 = /^[1-9]\d*|0$/
  if(re.test(parseFloat(num)) || re1.test(parseFloat(num))){
    return parseFloat(num).toFixed(2)
  }else{
    return 0.00
  }
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('mop-token')
  Vue.cookie.delete('mop-roleName')
  store.commit('resetStore')
  removeStore({name: 'lock-password'})

  removeStore({name: 'mop-userName'})
  removeStore({name: 'mop-dynamicMenuRoutes'})
  removeStore({name: 'mop-menuList'})
  removeStore({name: 'mop-permissions'})
  removeStore({name: 'mop-menu'})
  router.options.isAddDynamicMenuRoutes = false
}

/*
  新旧数据对比
  TODO：比较表单数据是否有变化
*/
export function ndData(newData,oldData) {
  if(!newData || !oldData){
    return !newData && !oldData ? false : true
  }
  if(newData.constructor != oldData.constructor) return true
  var type = typeof(newData)
  if(type == 'number' || type == 'string' || type == 'boolean') return newData != oldData
  //日期的对比
  if(newData.constructor ==  Date) return newData.getTime() != oldData.getTime()
  // 对象对比
  if(newData.constructor == Object) {
    var data1 = newData,
      data2 = oldData
    if(Object.keys(newData).length < Object.keys(oldData).length){
      data1 = oldData
      data2 = newData
    }
    for (var key in data1) {
      if(this.compareData(data1[key], data2[key])) return true
    }
  }
  //数组对比
  if(newData.constructor == Array) {
    if(newData.length != oldData.length) return true
    for (var i = 0; i < newData.length; i++) {
      if(this.compareData(newData[i], oldData[i])) return true
    }
  }
  return false
}

export const filterStatus = (value, arr, key = { keyLabel: 'label', keyValue: 'value'}) => {
  const filterItem = arr.filter(item => {
    return item[key.keyValue] == value
  })
  return filterItem && filterItem.length > 0 ? filterItem[0][key.keyLabel] : ''
}

export const filterColor = value => {
  let color = ''
  switch (value) {
  case '已过期':
  case '直营':
  case '待认证':
    color = 'gray'
    break
  case '正常营业':
  case '加盟':
  case '已完成':
  case '已发送':
  case '发送成功':
  case '已完成':
  case '激活':
  case '已发布':
  case '正常':
  case '提交':
    color = 'green'
    break
  case '待审核':
  case '草稿':
  case '已处理':
    color = 'blue'
    break
  case '强制停业':
  case '已驳回':
  case '已拒绝':
  case '未支付':
  case '离职':
  case '已取消':
  case '异常':
  case '提现失败':
    color = 'red'
    break
  default:
    break
  }
  return color
}

// 省市区
export function locations(obj = {}, id = 'id', name = 'name'){
  if(obj.province) {
    var province = obj.province
    var provinceId = province[id]
    var provinceName = province[name]
  }
  if(obj.city) {
    var city = obj.city
    var cityId = city[id]
    var cityName = city[name]
  }
  if(obj.district) {
    var district = obj.district
    var districtId = district[id]
    var districtName = district[name]
  }
  var detailAddress = {
    provinceId: provinceId || null,
    province: provinceName || null,
    cityId: cityId || null,
    city: cityName || null,
    districtId: districtId || null,
    district: districtName || null,
  }
  return detailAddress
}

export function priceNum(num, type = 'in'){
  if(typeof(num) == 'number'){
    return type === 'in' ? num/100 : num *100
  }else{
    return type === 'in' ? Number(num)/100 : Number(num)*100
  }
}

export function getFileType(fileName) {
  var reg = /\.(\w+)$/
  let suffix = reg.exec(fileName)[1]
  let type = null
  switch (suffix.toLocaleLowerCase()) {
  case 'png':
  case 'jpg':
  case 'jpeg':
  case 'gif':
    type = 'pic'
    break
  case 'doc':
  case 'docx':
    type = 'word'
    break
  case 'xlsx':
  case 'xls':
    type = 'excel'
    break
  case 'ppt':
  case 'pptx':
    type = 'ppt'
    break
  case 'pdf':
    type = 'pdf'
    break
  default:
    type = 'default'
    break
  }
  return type
}

export function humanFileSize(size) {
  if (size / 1024 < 1) {
    return `${size} B`
  } else if ((size/ 1024 / 1024) < 1) {
    return `${(size / 1024).toFixed(2)} K`
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} M`
  }
}

// 导出excel
export function fileDownload (data, fileName){
  const blob = new Blob([data], {
    type: 'application/vnd.ms-excel'
  })
  const filename = fileName || 'filename.xlsx'
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    var blobURL = window.URL.createObjectURL(blob)
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

