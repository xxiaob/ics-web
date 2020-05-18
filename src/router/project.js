/**
 * 项目管理
 */
export default [{
  path: 'project/emergencySupport',
  name: 'emergencySupport',
  component: () => import('@/bundles/projectBundle/emergencySupport'),
  meta: {
    title: '项目管理-应急保障'
  }
}, {
  path: 'project/specialControl',
  name: 'specialControl',
  component: () => import('@/bundles/projectBundle/specialControl'),
  meta: {
    title: '项目管理-专项管控'
  }
}]
