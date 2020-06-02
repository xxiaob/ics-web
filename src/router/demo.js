/**
 * demo路由
 */
export default [{
  path: 'imLive',
  name: 'imLive',
  component: () => import('@/bundles/liveBundle/imLive'),
  meta: {
    title: 'imLive'
  }
}, {
  path: 'jim',
  name: 'jim',
  component: () => import('@/bundles/liveBundle/jim'),
  meta: {
    title: 'jim'
  }
}, {
  path: 'agoraLive',
  name: 'agoraLive',
  component: () => import('@/bundles/liveBundle/agoraLive'),
  meta: {
    title: 'agoraLive'
  }
}]
