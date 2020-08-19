/**
 * ws socket连接
 */
import API from './API'
import qs from 'qs'
import JcSocket from '@/libs/JcSocket'
import { getToken } from '@/libs/storage'

let baseUrl = process.env.apiHostConfig.ws /*eslint-disable-line*/

//如果地址不包含协议，则更具浏览器判断
if (baseUrl.indexOf('ws') < 0) {
  let protocol = window.location.protocol.indexOf('https') > -1 ? 'wss://' : 'ws://'

  baseUrl = protocol + window.location.host + baseUrl
}

/**
 * 实时事件问题推送
 * @param {*} data 参数
 * @param {String} data.token token
 * @param {String} data.subOrgId 组织id
 * @param {String} data.subProjectId 项目id
 * @returns {Object} JcSocket 对象
 */
export function screenMapSocket(data) {
  data.token = getToken() // 设置请求用户token
  return new JcSocket(baseUrl + API.screen.command.screenMap + '?' + qs.stringify(data))
}

/**
 * 指挥大屏和数据大屏通信
 * @param {*} data 参数
 * @param {String} data.token token
 * @param {String} data.subOrgId 组织id
 * @param {String} data.subProjectId 项目id
 * @param {String} data.type 类型标识
 * @returns {Object} JcSocket 对象
 */
export function screenMessageChannelSocket(data) {
  data.token = getToken() // 设置请求用户token
  return new JcSocket(baseUrl + API.screen.messageChannel + '?' + qs.stringify(data))
}
