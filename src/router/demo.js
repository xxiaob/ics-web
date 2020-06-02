/**
 * demo路由
 */
export default [{
  path: 'hwLive',
  name: 'hwLive',
  component: () => import('@/bundles/liveBundle/hwLive'),
  meta: {
    title: 'hwLive'
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
