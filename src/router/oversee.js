//督查相关路由
export default [{
  path: 'oversee/peopleOversee',
  name: 'peopleOversee',
  component: () => import('@/bundles/attendBundle/peopleOversee'),
  meta: {
    title: '考勤管理-人员督查'
  }
}, {
  path: 'oversee/postOversee',
  name: 'postOversee',
  component: () => import('@/bundles/attendBundle/postOversee'),
  meta: {
    title: '考勤管理-岗点督查'
  }
}]
