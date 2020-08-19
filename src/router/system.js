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
}, {
  path: 'system/user',
  name: 'systemUser',
  component: () => import('@/bundles/systemBundle/user'),
  meta: {
    title: '系统设置-用户管理'
  }
}, {
  path: 'system/position',
  name: 'systemPosition',
  component: () => import('@/bundles/systemBundle/position'),
  meta: {
    title: '系统设置-职位管理'
  }
}, {
  path: 'system/areatype',
  name: 'systemAreaType',
  component: () => import('@/bundles/systemBundle/areaType'),
  meta: {
    title: '系统设置-区域类型'
  }
}, {
  path: 'system/device',
  name: 'systemDevice',
  component: () => import('@/bundles/systemBundle/device'),
  meta: {
    title: '系统设置-设备管理'
  }
}, {
  path: 'system/grid',
  name: 'systemGrid',
  component: () => import('@/bundles/systemBundle/grid'),
  meta: {
    title: '系统设置-网格设置'
  }
}, {
  path: 'system/pttGroup',
  name: 'systemPttGroup',
  component: () => import('@/bundles/systemBundle/pttGroup'),
  meta: {
    title: '系统设置-PTT群组'
  }
}, {
  path: 'system/name',
  name: 'systemName',
  component: () => import('@/bundles/systemBundle/systemName'),
  meta: {
    title: '系统设置-系统名称'
  }
}, {
  path: 'system/index',
  name: 'systemIndex',
  component: () => import('@/bundles/systemBundle/systemIndex'),
  meta: {
    title: '系统设置-首页设置'
  }
}]
