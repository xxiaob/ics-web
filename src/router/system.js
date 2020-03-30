//认证相关路由
export default [{
  path: 'system/organization',
  name: 'systemOrganization',
  component: () => import('@/bundles/systemBundle/organization'),
  meta: {
    title: '系统设置-组织管理'
  }
}, {
  path: 'system/role',
  name: 'systemRole',
  component: () => import('@/bundles/systemBundle/role'),
  meta: {
    title: '系统设置-角色管理'
  }
}]
