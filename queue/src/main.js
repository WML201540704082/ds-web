import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/index.js'
//自己写的样式
import './style/theme.css'
import './style/characters.css'

//引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入

Vue.use(ElementUI)
Vue.config.productionTip = false

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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
