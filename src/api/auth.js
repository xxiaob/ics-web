/**
 * 用户鉴权
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

/**
 * 登录
 * @param {*} data 登录参数
 * @param {String} data.userName 登录账号
 * @param {String} data.password 登录密码
 * @returns {Object} axios 对象
 */
export function login(data) {
  return axios.post(API.auth.login, data)
}
/**
 * 根据code登录
 * @param {object} data 参数
 * @returns {Object} axios 对象
 */
export function loginByCode(data) {
  return axios.post(API.auth.loginByCode + '?' + qs.stringify(data))
}
