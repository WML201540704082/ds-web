import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import qs from 'qs'
import merge from 'lodash/merge'
import store from '../store'
import { clearLoginInfo } from '@/utils'
import moment from 'moment'

const http = axios.create({
  timeout: 1000 * 300,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
// let pending = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let cancelToken = axios.CancelToken
// let removeRepeatUrl = (ever) => {
//   for(let p in pending){
//     if(pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
//       pending[p].f() //执行取消操作
//       pending.splice(p, 1) //把这条记录从数组中移除
//     }
//   }
// }
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // removeRepeatUrl(config)
  // config.cancelToken = new cancelToken((c)=>{
  //   pending.push({ u: config.url + '&' + config.method, f: c })
  // })
  // const actionName = getActionName(config.url)
  // store.commit('loading/SHOW', actionName)
  store.commit('loading/SHOW')
  config.selfHandleError = config.selfHandleError ? true : false
  config.headers['X-Token'] = config.noToken ? null : (config.token ? config.token : Vue.cookie.get('company-token') || config.XToken) // 请求头带上token
  if (config.rt) {
    config.headers['rt'] = config.rt
  }

  return config
}, error => {
  const actionName = getActionName(error.config.url)
  // store.commit('loading/HIDDEN', actionName)
  store.commit('loading/HIDDEN')
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  // removeRepeatUrl(response.config)
  // const actionName = getActionName(response.config.url)
  // store.commit('loading/HIDDEN', actionName)
  store.commit('loading/HIDDEN')
  if (response.config.selfHandleError) {
    return response
  } else {
    const { data } = response
    if (data.code === 0) {
      return data.data
    } else {
      Message.error(data.msg)
      return Promise.reject(data.msg)
    }
  }
}, error => {
  var errorRes = error.response
  if(errorRes.status&&errorRes.status == 400) {
    if(errorRes.data&&(errorRes.data.code == -2 || errorRes.data.code == -1)){
      Message.error('登录失效，请重新登陆')
      clearLoginInfo()
      router.replace({ name: 'login' })
    }
  }else{
    Message.error('系统维护中，请稍后重试！')
  }
  store.commit('loading/HIDDEN')
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName, self) => {
  if (self) {
    if (self === 'mami') {
      return window.SITE_CONFIG['mmqzdUrl'] + '/gateondmp' + actionName
    } else if (self === 'dmp'){
      return window.SITE_CONFIG['dmpUrl'] + actionName
    }else if(self === 'gtdmp'){
      return window.SITE_CONFIG['gtDmpUrl'] + '/gateondmp'+actionName
    } else if(self === 'tea'){
      return 'http://192.168.16.190:30041' + actionName
    }else {
      return window.SITE_CONFIG['baseUrl']+'/company' + actionName
    }
  }
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, flag) => {
  return params
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
    't': moment().valueOf()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

const getActionName = url => {
  const prefixLength = window.SITE_CONFIG.baseUrl.length
  return url.substr(prefixLength, url.length)
}

export default http

