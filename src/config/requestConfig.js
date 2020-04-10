import axios from 'axios'
import router from '@/router'
import RESPONSE_CODE from '@/constant/RESPONSE_CODE'
import { getToken } from '@/libs/storage'

//设置默认值 defaults
axios.defaults.timeout = 1000 * 10 //设置请求超时时长
//设置默认请求域
axios.defaults.baseURL = process.env.API_HOST.base /*eslint-disable-line*/

//设置全局http请求
let errorRun = () => {
  //这里处理请求出错的场景
  window.mvJsBridge.Alert('网络请求失败')
}

//拦截request请求，配置请求参数
axios.interceptors.request.use(function (config) {
  // 这里统一处理请求头配置
  config.headers.token = getToken() // 设置请求用户token
  config.headers.deviceType = 'web'
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
    } else if (res.data.resCode === RESPONSE_CODE.FAILED) {
      let errorMsg = res.data.resMsg[0] || { msgCode: RESPONSE_CODE.FAILED, msgText: '' }

      if (errorMsg.msgCode === RESPONSE_CODE.SEND_FAIL) {//短信验证码发送失败
        return res.data
      }
      if (errorMsg.msgCode === RESPONSE_CODE.NOT_LOGIN) {
        window.mvJsBridge.Alert('您未登录或账号已过期')
        router.push({ name: 'login' })
      } else {
        window.mvJsBridge.Alert(errorMsg.msgText)
      }
    }
  } else {
    errorRun()
  }
  return Promise.reject(res)
}, function (error) {
  errorRun()
  return Promise.reject(error)
})
