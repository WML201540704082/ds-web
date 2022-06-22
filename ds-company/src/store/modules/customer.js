export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    updateCustomerList (state, list) {
      state.list = list
    }
  }
}
