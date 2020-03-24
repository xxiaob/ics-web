import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import actions from './actions' //引入根actions
import mutations from './mutations'//引入根mutations

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user
  },
  actions: actions,
  mutations: mutations,
  strict: debug
})
