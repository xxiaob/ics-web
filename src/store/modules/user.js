import { getUser, setToken, setUser, getUserMenus, setUserMenus } from '@/libs/storage'

const userState = {
  user: getUser(),
  menus: getUserMenus()
}

// getters
const getters = {
  isLogin(state) {
    return !!state.user
  }
}

// actions
const actions = {}

//处理菜单转换
let formatMenus = function (child) {
  let menus = []

  if (child && child.length) {
    child.forEach(menu => {
      menus.push({ id: menu.resId, name: menu.resName, index: menu.url, icon: menu.icon, ...(menu.children && menu.children.length ? { children: formatMenus(menu.children) } : {}) })
    })
  }
  return menus
}

// mutations
const mutations = {
  setUser(state, user) {
    if (user) {
      setToken(user.token)
      setUser(user)
      //处理菜单
      state.menus = formatMenus(user.resources)
      setUserMenus(state.menus)
      delete user.resources
    } else {
      //如果设置用户信息为空，则清空数据
      setToken('')
      setUser('')
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
