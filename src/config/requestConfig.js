import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import RESPONSE_CODE from '@/constant/RESPONSE_CODE'
import { getToken } from '@/libs/storage'

//设置默认值 defaults
axios.defaults.timeout = 1000 * 15 //设置请求超时时长
//设置默认请求域
axios.defaults.baseURL = process.env.apiHostConfig.base /*eslint-disable-line*/

//设置全局http请求
let errorRun = () => {
  //这里处理请求出错的场景
  Message({ message: '网络请求失败', type: 'error', offset: 20 })
}

//拦截request请求，配置请求参数
axios.interceptors.request.use(function (config) {
  // 这里统一处理请求头配置
  config.headers.token = getToken() // 设置请求用户token
  config.headers['Content-Security-Policy'] = 'upgrade-insecure-requests'
  config.headers.deviceType = 1
  return config
}, function (error) {
  errorRun()
  return Promise.reject(error)
})

// 拦截 response 处理返回问题
axios.interceptors.response.use(function (res) {
  if (res.status === 200) {
    if (res.data.resCode === RESPONSE_CODE.SUCCESS) {
      return res.data.resData
    } else {
      if (res.data.resMsg.msgCode === RESPONSE_CODE.AUTH_ERROR || res.data.resMsg.msgCode === RESPONSE_CODE.AUTH_EXPIRE) {
        Message({ message: '您未登录或登录已失效', type: 'error', offset: 20 })
        router.push({ name: 'login' })
      } else {
        Message.error(res.data.resMsg.msgText)
      }
    }
  } else {
    errorRun()
    return Promise.reject(res)
  }
}, function (error) {
  errorRun()
  return Promise.reject(error)
})
