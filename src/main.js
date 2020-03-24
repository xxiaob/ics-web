/**
 * 运行入口
 */
import Vue from 'vue'
import App from './App'
import router from './router' //引入路由
import i18nOptions from './lang' //引入语言包
import VueI18n from 'vue-i18n' //引入语言切换工具
import ElementUI from 'element-ui' //引入elementUI
import store from './store' //引入vuex
import './config/requestConfig' //axios 请求配置

/*使用Vue-I18n做语言切换配置*/
Vue.use(VueI18n)
/*设置默认语言类型，将我们项目中的语言包与Element的语言包进行合并*/
const i18n = new VueI18n(i18nOptions)

/*合并使用语言,使用 ElementUI*/
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n, //定义语言切换
  ...App
}).$mount('#app')
