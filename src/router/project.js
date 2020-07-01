/**
 * 项目管理
 */
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default [{
  path: 'project/emergencySupport',
  name: 'emergencySupport',
  component: () => import('@/bundles/projectBundle/projects'),
  meta: {
    title: '项目管理-应急保障'
  },
  props: { projectType: PROJECT_TYPES.EmergencySupport }
}, {
  path: 'project/specialControl',
  name: 'specialControl',
  component: () => import('@/bundles/projectBundle/projects'),
  meta: {
    title: '项目管理-专项管控'
  },
  props: { projectType: PROJECT_TYPES.SpecialControl }
}, {
  path: 'project/intelligenceControl',
  name: 'intelligenceControl',
  component: () => import('@/bundles/projectBundle/intelligenceControl'),
  meta: {
    title: '项目管理-智慧控围',
    ignore: true
  }
}]
