//用户鉴权
import axios from 'axios'
import API from './API'

/**
 * 登录
 * @param {object} data 登录参数
 * @param {String} data.account 登录账号
 * @param {String} data.pwd 登录密码
 * @returns {Object} axios 对象
 */
export function login(data) {
  return axios.post(API.AUTH.login, data)
}

/**
 * 校验登录
 * @returns {Object} axios 对象
 */
export function checkLogin() {
  return axios.post(API.AUTH.checkLogin)
}
/**
 * 发送验证码
 * @param {object} phone 手机号码
 * @returns {Object} axios 对象
 */
export function sendMsg(phone) {
  return axios.post(API.AUTH.sendMsg, { phone })
}

/**
 * 忘记密码
 * @param {object} data 参数
 * @param {String} data.phoneNumber 手机号码
 * @param {String} data.verifyCode 短信验证码
 * @param {String} data.passWord 密码
 * @param {String} data.passWordComfirm 确认密码
 * @returns {Object} axios 对象
 */
export function recovery(data) {
  return axios.post(API.AUTH.recovery, data)
}

/**
 * 修改密码
 * @param {object} data 参数
 * @param {String} data.phoneNumber 手机号码
 * @param {String} data.verifyCode 短信验证码
 * @param {String} data.passWord 密码
 * @param {String} data.passWordComfirm 确认密码
 * @returns {Object} axios 对象
 */
export function pwdChange(data) {
  return axios.post(API.AUTH.pwdChange, data)
}

/**
 * 获取品牌信息
 * @returns {Object} axios 对象
 */
export function getBrand() {
  return axios.post(API.AUTH.getBrand)
}
/**
 * 获取店铺信息
 * @returns {Object} axios 对象
 */
export function getShop() {
  return axios.post(API.AUTH.getShop)
}
/**
 * 绑定推送设备
 * @param {object} data 参数
 * @param {String} data.terminalType 设备类型 1 Andriod 2 IOS
 * @param {String} data.deviceId 设备id
 * @param {String} data.alias UserId
 * @param {String} data.appVersion app版本
 * @param {String} data.objId app版本
 * @param {String} data.bindType 绑定推送类型 1-ali 2-iot
 * @returns {Object} axios 对象
 */
export function bind(data) {
  return axios.post(API.AUTH.bind, { bindType: 1, ...data })
}
/**
 * 解绑推送设备
 * @param {String } alias UserId
 * @returns {Object} axios 对象
 */
export function unbind(alias) {
  return axios.post(API.AUTH.unbind, { bindType: 1, alias })
}
/**
 * 登录成功之后的调用聚合
 * @param { Object } data 参数
 * @returns {Object} axios 对象
 */
export function afterLogin(data) {
  if (data.isBrand) {
    return axios.all([getBrand(), bind(data.bindData)]).then(axios.spread(data.then))
  } else {
    return axios.all([getShop(), bind(data.bindData)]).then(axios.spread(data.then))
  }
}
