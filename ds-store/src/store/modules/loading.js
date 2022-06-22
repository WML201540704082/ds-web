export default {
  namespaced: true,
  state: {
    global: false
  },
  mutations: {
    SHOW (state, name) {
      state.global = true
    },
    HIDDEN (state, name) {
      state.global = false
    }
  }
}
