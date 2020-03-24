/*全局语言配置*/
import { LANG } from '@/constant/CONST'

export default {
  locale: LANG.ZHCN,
  messages: {
    [LANG.ZHCN]: () => import('./zh/index'),
    [LANG.ENUS]: () => import('./en/index')
  }
}
