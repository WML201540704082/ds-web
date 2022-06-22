import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'
// let baseUrl = 'https://dstest.gateon.cn/app'
let baseUrl = 'https://ds.gateon.cn/app'
//预发布
// let baseUrl = 'https://preds.mengbaige.com/app'
// 生产
// let baseUrl = 'https://ds.mengbaige.com/app'
const http = axios.create({
  // timeout: 1000 * 30,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['X-Token'] =localStorage.getItem('queue-token') // 请求头带上token X-Token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if(response.data&&response.data.code == -1&&response.data.msg=='token:null 解析失败'){
    window.location.replace(location.origin + '/#/')
  }
  return response
}, (error) => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  return baseUrl+ actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
