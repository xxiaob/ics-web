/*全局语言配置*/
import { LANG } from '@/constant/CONST'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import { getUserLanguage } from '@/libs/storage'
import myZh from './zh/index'
import myEn from './en/index'

let localLang = getUserLanguage()

if (!localLang) {
  localLang = navigator.language || navigator.browserLanguage || LANG.ZHCN
}

//查看是否有支持该语言，不支持则默认英文
let hasLang = false

for (let key in LANG) {
  if (LANG[key] == localLang) {
    hasLang = true
  }
}
if (!hasLang) {
  localLang = LANG.ZHCN
}

export default {
  locale: localLang,
  messages: {
    [LANG.ZHCN]: { ...myZh, ...zhLocale },
    [LANG.ENUS]: { ...myEn, ...enLocale }
  }
}
