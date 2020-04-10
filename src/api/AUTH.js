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
