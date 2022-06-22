import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import loading from './modules/loading'
import common from './modules/common'
import user from './modules/user'
import goods from './modules/goods'
import customer from './modules/customer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    common,
    user,
    goods,
    customer
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
