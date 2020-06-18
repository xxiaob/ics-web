import Vue from 'vue'
import Router from 'vue-router'
import { setTitle } from '@/libs/util'
//引入分类 router
import authRouter from './auth'
import systemRouter from './system'
import taskRouter from './task'
import projectRouter from './project'
import attendRouter from './attend'
import overseeRouter from './oversee'
import screenRouter from './screen' //大屏路由
import demoRouter from './demo' //demo 路由

// 解决两次访问相同路由地址报错
// const originalPush = Router.prototype.push

// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)

let routerOptions = {
  linkActiveClass: 'active',
  mode: 'history',
  routes: [{
    path: '*',
    redirect: '/'
  }, {
    path: '/',
    name: 'basePage',
    redirect: { name: 'index' },
    component: () => import('@/bundles/commonBundle/pageContent/basePage'),
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/bundles/indexBundle'),
      meta: {
        title: '首页'
      }
    }, ...systemRouter, ...taskRouter, ...projectRouter, ...attendRouter, ...overseeRouter]
  }, {
    path: '/',
    name: 'fullPage',
    component: () => import('@/bundles/commonBundle/pageContent/fullPage'),
    children: [...demoRouter, ...authRouter, ...screenRouter]
  }]
}

let router = new Router(routerOptions)

//处理菜单权限
import { getUser, getUserMenus } from '@/libs/storage'

let checkMenu = function (name, menus) {
  let menu = null

  for (let i = 0; i < menus.length; i++) {
    if (name == menus[i].index) {
      menu = menus[i]
    } else {
      menu = checkMenu(name, menus[i].children || [])
    }
    if (menu) {
      break
    }
  }
  return menu
}

/**
 * 排除需要登录，且不需要过滤的路由
 * 如果不需要登录就可以访问的，请在metia中设置 ignore 为true
 * meta: { title: '登录', ignore: true }
 */
let excludeRouters = ['index', 'commandProjectScreen', 'dataProjectScreen']

//设置router 跳转配置
router.beforeEach((to, from, next) => {
  console.log('router.beforeEach', to)
  if (to.meta.ignore) {
    setTitle(to.meta.title)
    next()
  } else {
    let user = getUser()

    let menus = getUserMenus()

    if (user && menus) {
      let menu = checkMenu(to.name, menus)

      if (menu || excludeRouters.indexOf(to.name) > -1) {
        setTitle(menu ? menu.name : to.meta.title)
        next()
      } else {
        next({ name: 'index' })
      }
    } else {
      next({ name: 'login' })
    }
  }
})

export default router
