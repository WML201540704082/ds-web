import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import qs from 'qs'
import merge from 'lodash/merge'
import store from '../store'
import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // const actionName = getActionName(config.url)
  // store.commit('loading/SHOW', actionName)
  store.commit('loading/SHOW')
  config.selfHandleError = config.selfHandleError ? true : false
  config.headers['X-Token'] = Vue.cookie.get('store-token') // 请求头带上token
  if (config.rt) {
    config.headers['rt'] = config.rt
  }
  return config
}, error => {
  // const actionName = getActionName(error.config.url)
  // store.commit('loading/HIDDEN', actionName)
  store.commit('loading/HIDDEN')
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
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
  if(errorRes.status == 400) {
    if(errorRes.data&&(errorRes.data.code == -2 || errorRes.data.code == -1)){
      Message.error('登录失效，请重新登陆')
      clearLoginInfo()
      // router.replace({ name: 'login' })
      window.location.replace(window.SITE_CONFIG['companyUrl']+'/#/login')
    }
  }else{
    Message.error('系统维护中，请稍后重试！')
  }
  // const actionName = getActionName(error.config.url)
  // store.commit('loading/HIDDEN', actionName)
  store.commit('loading/HIDDEN')
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName,self,isC) => {
  if (self) {
    if(isC=='isCompany'){
      return  window.SITE_CONFIG['baseUrl']+'/company' + actionName
    } else if (isC == 'mami') {
      return window.SITE_CONFIG['mmqzdUrl'] + '/gateondmp' + actionName
    }else if(self === 'gtdmp'){
      return window.SITE_CONFIG['gtDmpUrl'] + '/gateondmp'+actionName
    }  else{
      return  window.SITE_CONFIG['baseUrl']+'/store' + actionName
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
http.adornParams = (params = {}, selfHandleError = true, openDefultParams = true) => {
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

const getActionName = url => {
  const prefixLength = window.SITE_CONFIG.baseUrl.length
  return url.substr(prefixLength, url.length)
}

export default http
