/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 身份证号
 * @param {*} s
 */
export function isIdentify (s) {
  return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}


// 密码
export function isPassword(s){
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

// 去除空格
export function Trim(str,is_global){//除空格
  var result
  result = str.replace(/(^\s+)|(\s+$)/g,'')
  if(is_global.toLowerCase()=='g')
  {
    result = result.replace(/\s/g,'')
  }
  return result
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

export function isphone(rule,value,callback) {
  if(!isMobile(value)){
    return callback(new Error('手机号格式不正确!'))
  } else {
    return callback()
  }
}

export function password(rule,value,callback){
  if(!isPassword(value)){
    return callback(new Error('请输入正确的密码格式'))
  }else{
    return callback()
  }
}

/*大于等于零的整数，保留两位小数点*/
export function number(num){
  var re = /^(-)?[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/
  var re1 = /^(-)?[1-9]\d*|0$/
  if(re.test(parseFloat(num)) || re1.test(parseFloat(num))){
    return parseFloat(num).toFixed(2)
  }else{
    return 0.00
  }
}

// 价格
export function priceFormat(val){
  var value = val / 100
	 var format = this.number(value)
	 return format
}

export function dateFormat(time) {
  var date = new Date(time)
  var year = date.getFullYear()
  /* 在日期格式中，月份是从0开始的，因此要加0
   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
   * */
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  // 拼接
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}

//书写用户名称--限制
/**
 * value 文本上所输入的值
 * limit 限制字数的数量
 */
export function limitInputName (value, limit) {
  if (validatenull(value)) return value
  limit = limit||10
  var len = 0
  var valString = ''
  for (var i = 0; i < value.length; i++) { //限制字数
    if (len < limit) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
        len += 2
        valString += value[i]
      } else {
        len++
        valString += value[i]
      }
    } else {
      return 1
    }

  }

  var CS = /[^\u4e00-\u9fa5a-zA-Z]/  //非中文非英文
  if (CS.test(valString)) {
    return 2
  }
  // valString.replace(CS, '')
  return 3
}

// 大于等于零的2位小数
export function twoDecimal(value) {
  var reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/
  if (reg.test(value)) {
    return true
  } else {
    return false
  }
}

export function priceRange(price, range = 99999.99, min = 0.01) {
  var re = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
  if (!isNaN(price) && re.test(price)) {
    if (Number(price) >= Number(min) && Number(price) <= Number(range)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

