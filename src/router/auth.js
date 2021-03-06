//认证相关路由
export default [{
  path: 'login',
  name: 'login',
  component: () => import('@/bundles/authBundle/login'),
  meta: {
    title: '登录',
    ignore: true
  }
}, {
  path: 'fastlogin',
  name: 'fastLogin',
  component: () => import('@/bundles/authBundle/fastAuth'),
  meta: {
    title: '快速登录',
    ignore: true
  }
}]
