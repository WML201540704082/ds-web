export default {
  namespaced: true,
  state: {
    global: false,
  },
  mutations: {
    SHOW (state) {
      state.global = true
    },
    HIDDEN (state) {
      state.global = false
    }
  }
}
