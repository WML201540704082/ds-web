import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import loading from './modules/loading'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    common,
    user
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      console.log('重置vuex本地储存状态')
      console.log(state)
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
