//认证相关路由
export default {
  path: '/auth',
  name: 'Auth',
  redirect: { name: 'login' },
  component: () => import('@/bundles/commonBundle/pageContent/fullPage'),
  children: [{
    path: 'login',
    name: 'login',
    component: () => import('@/bundles/authBundle/login'),
    meta: {
      title: '登录'
    }
  }]
}
