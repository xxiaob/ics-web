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
}]
