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
    path: 'supervise/regulations',
    name: 'superviseRegulationsInquiry',
    component: () => import('@/bundles/superviseBundle/RegulationsInquiry'),
    meta: {
      title: '派驻监督-权利清单'
    }
  }
]
