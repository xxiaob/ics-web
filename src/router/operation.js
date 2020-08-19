/**
 * 运维管理相关
 */

export default [
  {
    path: 'operation/menus',
    name: 'operationMenus',
    component: () => import('@/bundles/operationBundle/menus'),
    meta: {
      title: '系统设置-菜单管理'
    }
  },
  {
    path: 'operation/deviceUpdate',
    name: 'operationDeviceUpdate',
    component: () => import('@/bundles/operationBundle/deviceUpdate'),
    meta: {
      title: '系统设置-设备升级'
    }
  }
]
