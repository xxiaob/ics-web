/**
 * 运维管理相关
 */

export default [
  {
    path: 'operation/menus',
    name: 'operationMenus',
    component: () => import('@/bundles/operationBundle/menus'),
    meta: {
      title: '运维管理-菜单管理'
    }
  },
  {
    path: 'operation/deviceUpdate',
    name: 'operationDeviceUpdate',
    component: () => import('@/bundles/operationBundle/deviceUpdate'),
    meta: {
      title: '运维管理-设备升级'
    }
  }, {
    path: 'operation/thirdManage',
    name: 'operationThirdManage',
    component: () => import('@/bundles/operationBundle/thirdManage'),
    meta: {
      title: '运维管理-第三方管理'
    }
  }, {
    path: 'operation/name',
    name: 'operationName',
    component: () => import('@/bundles/operationBundle/systemName'),
    meta: {
      title: '运维管理-系统名称'
    }
  }
]
