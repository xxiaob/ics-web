//任务相关路由
export default [{
  path: 'task/eventManage',
  name: 'taskEventManage',
  component: () => import('@/bundles/taskBundle/eventManage'),
  meta: {
    title: '事件管理'
  }
}, {
  path: 'task/questionProcess',
  name: 'questionProcess',
  component: () => import('@/bundles/taskBundle/questionProcess'),
  meta: {
    title: '问题管理-问题处理'
  }
}, {
  path: 'task/questionSearch',
  name: 'questionSearch',
  component: () => import('@/bundles/taskBundle/questionSearch'),
  meta: {
    title: '问题管理-问题查询'
  }
}, {
  path: 'task/taskProcess',
  name: 'taskProcess',
  component: () => import('@/bundles/taskBundle/taskProcess'),
  meta: {
    title: '任务管理-任务处理'
  }
}, {
  path: 'task/taskSearch',
  name: 'taskSearch',
  component: () => import('@/bundles/taskBundle/taskSearch'),
  meta: {
    title: '任务管理-任务查询'
  }
}]
