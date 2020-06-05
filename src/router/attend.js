//考勤相关路由
export default [{
  path: 'attend/myAttend',
  name: 'myAttend',
  component: () => import('@/bundles/attendBundle/myAttend'),
  meta: {
    title: '考勤管理-我的考勤'
  }
}, {
  path: 'attend/peopleAttend',
  name: 'peopleAttend',
  component: () => import('@/bundles/attendBundle/peopleAttend'),
  meta: {
    title: '考勤管理-人员考勤'
  }
}, {
  path: 'attend/postAttend',
  name: 'postAttend',
  component: () => import('@/bundles/attendBundle/postAttend'),
  meta: {
    title: '考勤管理-岗点考勤'
  }
}]
