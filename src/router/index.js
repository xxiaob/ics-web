import Vue from 'vue'
import Router from 'vue-router'
import { setTitle } from '@/libs/util'
//引入分类 router
import authRouter from './auth' //我的相关路由

Vue.use(Router)

let routerOptions = {
  linkActiveClass: 'active',
  mode: 'history',
  routes: [{
    path: '*',
    redirect: '/'
  }, {
    path: '/',
    name: 'index',
    component: () => import('@/bundles/mainBundle'),
    meta: {
      title: '首页',
      options: {
        pullDown: true
      }
    },
    children: []
  }].concat(authRouter)
}

let router = new Router(routerOptions)

//设置router 跳转配置
router.beforeEach((to, from, next) => {
  setTitle(to.meta.title || 'PC')
  next()
})

export default router
