/**
 * demo路由
 */
export default [{
  path: 'liveDemo',
  name: 'liveDemo',
  component: () => import('@/bundles/liveBundle/demo'),
  meta: {
    title: 'liveDemo'
  }
}]
