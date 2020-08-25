/**
 * 派驻监督相关子系统
 */

export default [
  {
    path: 'supervise/laws',
    name: 'superviseLawsAndRegulations',
    component: () => import('@/bundles/superviseBundle/lawsRegulations'),
    meta: {
      title: '派驻监督-法律法规'
    }
  },
  {
    path: 'supervise/lawsManage',
    name: 'superviseLawsAndRegulationsManage',
    component: () => import('@/bundles/superviseBundle/lawsRegulationsManage'),
    meta: {
      title: '派驻监督-法律法规管理'
    }
  },
  {
    path: 'supervise/regulations',
    name: 'superviseRegulationsInquiry',
    component: () => import('@/bundles/superviseBundle/RegulationsInquiry'),
    meta: {
      title: '派驻监督-权利清单'
    }
  },
  {
    path: 'supervise/regulationsManage',
    name: 'superviseRegulationsInquiryManage',
    component: () => import('@/bundles/superviseBundle/RegulationsInquiryManage'),
    meta: {
      title: '派驻监督-权利清单管理'
    }
  }
]
