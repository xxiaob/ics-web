// 智慧控违路由
export default [{
  path: 'control/alarmManage',
  name: 'controlAlarmManage',
  component: () => import('@/bundles/controlBundle/alarmManage'),
  meta: {
    title: '智慧控违-告警台账'
  }
}
]
