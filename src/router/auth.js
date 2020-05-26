//认证相关路由
export default [{
  path: 'login',
  name: 'login',
  component: () => import('@/bundles/authBundle/login'),
  meta: {
    title: '登录'
  }
}]
