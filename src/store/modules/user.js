const userState = {
  user: null
}

// getters
const getters = {
  isLogin(state) {
    return !!state.user
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export default {
  namespaced: true,
  state: userState,
  getters,
  actions,
  mutations
}
