//渣土管控路由
export default [{
  path: 'dregs/eventManage',
  name: 'dregsEventManage',
  component: () => import('@/bundles/dregsBundle/eventManage'),
  meta: {
    title: '渣土管控-事件台账'
  }
}, {
  path: 'dregs/questionProcess',
  name: 'dregsQuestionProcess',
  component: () => import('@/bundles/dregsBundle/questionProcess'),
  meta: {
    title: '渣土管控-问题处理'
  }
}, {
  path: 'dregs/questionSearch',
  name: 'dregsQuestionSearch',
  component: () => import('@/bundles/dregsBundle/questionSearch'),
  meta: {
    title: '渣土管控-问题查询'
  }
}, {
  path: 'dregs/waring',
  name: 'dregsWaring',
  component: () => import('@/bundles/dregsBundle/waring'),
  meta: {
    title: '渣土管控-告警台账'
  }
}]
