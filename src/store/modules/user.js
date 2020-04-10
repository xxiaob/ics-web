import { setToken, setUser } from '@/libs/storage'

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
    if (!user) {
      //如果设置用户信息为空，则清空数据
      setToken('')
      setUser('')
    } else {
      setToken(user.token)
      setUser(user)
    }
    state.user = user
  },
  loginOut(state) {
    mutations.setUser(state, null)
  }
}

export default {
  namespaced: true,
  state: userState,
  getters,
  actions,
  mutations
}
