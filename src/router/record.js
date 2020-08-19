//记录留痕相关路由
export default [{
  path: 'record/videoMeeting',
  name: 'videoMeeting',
  component: () => import('@/bundles/recordBundle/videoMeeting'),
  meta: {
    title: '记录留痕-视频会议'
  }
}, {
  path: 'record/audioMeeting',
  name: 'audioMeeting',
  component: () => import('@/bundles/recordBundle/audioMeeting'),
  meta: {
    title: '记录留痕-音频会议'
  }
}, {
  path: 'record/collection',
  name: 'collection',
  component: () => import('@/bundles/recordBundle/collection'),
  meta: {
    title: '记录留痕-一键采集'
  }
}]
