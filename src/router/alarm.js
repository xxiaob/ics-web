//告警台账路由
export default [{
  path: 'alarmManage',
  name: 'alarmManage',
  component: () => import('@/bundles/alarmBundle/alarmManage'),
  meta: {
    title: '告警台账'
  }
}
]
