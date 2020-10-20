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
  path: 'system/optposition',
  name: 'operationsPosition',
  component: () => import('@/bundles/systemBundle/position'),
  meta: {
    title: '运维管理-职位运维'
  },
  props: { opera: true }
}, {
  path: 'system/areatype',
  name: 'systemAreaType',
  component: () => import('@/bundles/systemBundle/areaType'),
  meta: {
    title: '系统设置-区域类型'
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
  path: 'system/base',
  name: 'systemBase',
  component: () => import('@/bundles/systemBundle/base'),
  meta: {
    title: '系统设置-基础配置'
  }
}]
