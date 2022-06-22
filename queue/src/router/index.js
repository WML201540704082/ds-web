import Vue from 'vue'
import Router from 'vue-router'
 
Vue.use(Router)
const _import = require('./import-development')
// 公共页面
const globalRoutes = [
  { path: '/login', name: 'Login', component: _import('login/Login'),meta: { title: '登录' }},
  { path: '*', redirect: { name: 'Login' } }
]
// 主页面
const mainRouter={
  children:[{
    path: '/queue',
    name: 'queue',
    component: _import('main/queue'),
    meta: { title: '主页' }
  }],
}
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: globalRoutes.concat(mainRouter.children)
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('queue-token')
  if (!token || !/\S/.test(token)) {
    next({ name: 'Login' })
  }else{
    next()
  }
})
export default router