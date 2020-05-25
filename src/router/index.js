import Vue from 'vue'
import Router from 'vue-router'
import { setTitle } from '@/libs/util'
//引入分类 router
import authRouter from './auth'
import systemRouter from './system'
import taskRouter from './task'
import projectRouter from './project'
import attendRouter from './attend'

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
    }, ...systemRouter, ...taskRouter, ...projectRouter, ...attendRouter]
  }, {
    path: '/map',
    name: 'map',
    redirect: { name: 'mapDemo' },
    component: () => import('@/bundles/commonBundle/pageContent/fullPage'),
    children: [{
      path: 'demo',
      name: 'mapDemo',
      component: () => import('@/bundles/mapBundle/demo'),
      meta: {
        title: '地图Demo'
      }
    }]
  }, authRouter]
}

let router = new Router(routerOptions)

//设置router 跳转配置
router.beforeEach((to, from, next) => {
  setTitle(to.meta.title || 'PC')
  next()
})

export default router
