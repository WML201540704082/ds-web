export default {
  namespaced: true,
  state: {
    global: false,
    // '/sys/sysUser/login': false,
    // '/product/company/product/update': false,
    // '/product/company/product/add': false
  },
  mutations: {
    SHOW (state, name) {
      state.global = true
      // state[name] = true
    },
    HIDDEN (state, name) {
      state.global = false
      // state[name] = false
    }
  }
}
