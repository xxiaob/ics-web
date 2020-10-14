/**
 * 组织信息
 */

export default [
  {
    path: 'organize/business',
    name: 'organizeBusiness',
    component: () => import('@/bundles/organizeBundle/business'),
    meta: {
      title: '组织信息-组织业务'
    }
  }, {
    path: 'organize/attendance',
    name: 'organizeAttendance',
    component: () => import('@/bundles/organizeBundle/attendance'),
    meta: {
      title: '组织信息-组织勤务'
    }
  },
  {
    path: 'organize/userInfo',
    name: 'organizeUserInfo',
    component: () => import('@/bundles/organizeBundle/userInfo'),
    meta: {
      title: '组织信息-人员信息库'
    }
  }
]
