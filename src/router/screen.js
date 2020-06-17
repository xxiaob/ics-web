/**
 * 大屏能力
 */
export default [{
  path: 'screen/command',
  name: 'commandScreen',
  component: () => import('@/bundles/screenBundle/command'),
  meta: {
    title: '信息指挥大屏'
  }
}, {
  path: 'screen/datastatistics',
  name: 'dataScreen',
  component: () => import('@/bundles/screenBundle/dataStatistics'),
  meta: {
    title: '数据联动大屏'
  }
}, {
  path: 'screen/command/:projectId',
  name: 'commandProjectScreen',
  component: () => import('@/bundles/screenBundle/command'),
  meta: {
    title: '信息指挥大屏',
    ignore: true
  }
}, {
  path: 'screen/datastatistics/:projectId',
  name: 'dataProjectScreen',
  component: () => import('@/bundles/screenBundle/dataStatistics'),
  meta: {
    title: '数据联动大屏',
    ignore: true
  }
}]
