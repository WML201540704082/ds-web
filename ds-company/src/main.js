import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import VueCookie from 'vue-cookie'
import '@/element-ui'
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest'
import { isAuth,priceNum, isAuthMenu } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import myConfirm from './plugin/confirm'
import gtButton from '@/components/gt-button'
import '@/plugin/jquery'
import '@/plugin/table-height'

import  '@/plugin/awardRotate'

import gtShowPic from '@/components/gt-show-pic'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import gtBorderButton from '@/components/gt-border-button'
import VueClipboard from 'vue-clipboard2' //复制插件

//引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入

Vue.use(VueClipboard)
Vue.use(GeminiScrollbar)


Vue.component('gt-button', gtButton)
Vue.component('gt-border-button', gtBorderButton)
Vue.component('gt-show-pic',gtShowPic)

Vue.use(VueCookie)
Vue.use(myConfirm)
Vue.config.productionTip = false
Vue.config.errorHandler = (error, vm) => {
  console.log('页面错误:', error)
}

// 非生产环境, 适配mockjs模拟数据
// if (process.env.NODE_ENV !== 'production') {
//   require('@/mock')
// }

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.isAuthMenu = isAuthMenu     // 菜单权限方法
Vue.prototype.priceNum = priceNum
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to,from,next) => {
  NProgress.start() 
  next()
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
