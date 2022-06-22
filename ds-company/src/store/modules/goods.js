export default {
  namespaced: true,
  state: {
    info: null,
  },
  mutations: {
    SAVE (state, info) {
      state.info = info
    },
    CLEAR (state) {
      state.info = null
    }
  }
}
