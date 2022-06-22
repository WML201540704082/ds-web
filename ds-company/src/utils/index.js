import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { removeStore } from '@/utils/storage'
// import { number } from './validate'
import NP from 'number-precision'
import { systemThemeColor } from '@/utils/dict'

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
  // return JSON.parse(sessionStorage.getItem('company-permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuthMenu (key) {
  return JSON.parse(sessionStorage.getItem('company-permissions') || '[]').indexOf(key) !== -1 || false
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
  Vue.cookie.delete('company-token')
  store.commit('resetStore')

  removeStore({name:'commenInfo'})
  removeStore({name: 'company-userName'})
  removeStore({name: 'company-info'})
  removeStore({name: 'company-dynamicMenuRoutes'})
  removeStore({name: 'company-menuList'})
  removeStore({name: 'company-permissions'})
  removeStore({name: 'company-menu'})
  router.options.isAddDynamicMenuRoutes = false
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
  case '待确认收货':
  case '已结束':
    color = 'gray'
    break
  case '正常营业':
  case '加盟':
  case '出库完成':
  case '正常':
  case '已入库':
  case '发送成功':
  case '启用':
  case '已完成':
  case '有效':
  case '激活':
    color = 'green'
    break
  case '待审核':
  case '待出库':
  case '进行中':
    color = 'blue'
    break
  case '强制停业':
  case '已驳回':
  case '异常':
  case '已拒绝':
  case '停用':
  case '未支付':
  case '离职':
  case '已取消':
    color = 'red'
    break
  default:
    break
  }
  return color
}

// 省市区
export function locations(obj = {}){
  if(obj.province) {
    var province = obj.province
    var provinceId = province.id
    var provinceName = province.name
  }
  if(obj.city) {
    var city = obj.city
    var cityId = city.id
    var cityName = city.name
  }
  if(obj.district) {
    var district = obj.district
    var districtId = district.id
    var districtName = district.name
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

export function priceNum(num, type = 'in'){
  if(typeof(num) == 'number'){
    return type === 'in' ? NP.divide(num,100) : NP.times(num,100)
  }else{
    return type === 'in' ? NP.divide(Number(num),100) : NP.times(Number(num),100)
  }
}

// 判断数组中是否有重复的元素
export function isRepeat(arr){
  let hash = {}
  for(var i in arr) {
    if(hash[arr[i]]) //hash 哈希
      return true
    hash[arr[i]] = true
  }
  return false

}


// 更改主题色
export function changeTheme(baseTheme) {
  // function getThemeCluster(theme) {
  //   const tintColor = (color, tint) => {
  //     let red = parseInt(color.slice(0, 2), 16)
  //     let green = parseInt(color.slice(2, 4), 16)
  //     let blue = parseInt(color.slice(4, 6), 16)
  //     if (tint === 0) { // when primary color is in its rgb space
  //       return [red, green, blue].join(',')
  //     } else {
  //       red += Math.round(tint * (255 - red))
  //       green += Math.round(tint * (255 - green))
  //       blue += Math.round(tint * (255 - blue))
  //       red = red.toString(16)
  //       green = green.toString(16)
  //       blue = blue.toString(16)
  //       return `#${red}${green}${blue}`
  //     }
  //   }
  //   const shadeColor = (color, shade) => {
  //     let red = parseInt(color.slice(0, 2), 16)
  //     let green = parseInt(color.slice(2, 4), 16)
  //     let blue = parseInt(color.slice(4, 6), 16)
  //     red = Math.round((1 - shade) * red)
  //     green = Math.round((1 - shade) * green)
  //     blue = Math.round((1 - shade) * blue)
  //     red = red.toString(16)
  //     green = green.toString(16)
  //     blue = blue.toString(16)
  //     return `#${red}${green}${blue}`
  //   }
  //   const clusters = [`#${theme}`]
  //   for (let i = 0; i <= 9; i++) {
  //     clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  //   }
  //   clusters.push(shadeColor(theme, 0.1))
  //   return clusters
  // }

  function getThemeCluster(theme) {
    let themeCluster = null
    let originalCluster = null
    if (theme === 'ORANGEWHITE') {
      themeCluster = systemThemeColor[0].colors
      originalCluster  = systemThemeColor[1].colors
    } else {
      themeCluster = systemThemeColor[1].colors
      originalCluster  = systemThemeColor[0].colors
    }
    return {
      themeCluster,
      originalCluster
    }
  }

  function updateStyle(style, oldCluster, newCluster) {
    let newStyle = style
    oldCluster.forEach((color, index) => {
      newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
    })
    return newStyle
  }

  // const themeCluster = getThemeCluster(val.replace('#', ''))
  // const originalCluster = getThemeCluster(oldVal.replace('#', ''))
  const {themeCluster, originalCluster} = getThemeCluster(baseTheme)

  const styles = [].slice.call(document.querySelectorAll('style'))
  styles.forEach(style => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
}

export function showProgressSpeed(state){
  let Progress = document.getElementById('comShowLoading')
  if(!Progress)return false
  if(state=='open'){
    Progress.style.display='block'
  }else{
    Progress.style.display='none'
  }
}

// 数字转化中文
export function chineseParse(num) {
  let char = ''
  switch (num) {
  case 1:
    char = '一'
    break
  case 2:
    char = '二'
    break
  case 3:
    char = '三'
    break
  case 4:
    char = '四'
    break
  case 5:
    char = '五'
    break
  case 6:
    char = '六'
    break
  case 7:
    char = '七'
    break
  case 8:
    char = '八'
    break
  case 9:
    char = '九'
    break
  case 10:
    char = '十'
    break
  default:
    break
  }
  return char
}
