/**
 * demo路由
 */
export default [{
  path: 'imLive',
  name: 'imLive',
  component: () => import('@/bundles/liveBundle'),
  meta: {
    title: 'imLive',
    ignore: true
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
}, {
  path: 'datascreendemo',
  name: 'DataScreenDemo',
  component: () => import('@/bundles/demoBundle/dataScreenDemo'),
  meta: {
    title: '数据大屏',
    ignore: true
  }
}]
