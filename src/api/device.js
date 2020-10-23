/**
 * 处理设备升级
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

/*-------------------------------设备管理------------------------------------ */
/**
 * 列表
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function deviceList(params) {
  return axios.get(API.device.list, { params })
}
/**
 * 查询设备详情
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function deviceDetail(params) {
  return axios.get(API.device.detail, { params })
}
/**
 * 设备绑定
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceBind(data) {
  return axios.post(API.device.bind, data)
}
/**
 * 清除设备绑定
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function bindRelease(data) {
  return axios.post(API.device.bindRelease, data)
}
/**
 * 获取回放流
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function getRelay(params) {
  return axios.get(API.device.relay, { params })
}

/**
 * 获取组织设备列表
 * @param {object} params
 * @returns {Object} axios 对象
 */
export function getDeviceList(params) {
  return axios.get(API.device.deviceList, { params })
}

/**
 * 获取实时流
 * @param {object} data 设备id数组
 * @returns {Object} axios 对象
 */
export function getLiveStreaming(data) {
  return axios.get(API.device.getLiveStreaming + '?' + qs.stringify(data, { indices: false }))
}

/**
 * 新增设备
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function addDevice(data) {
  return axios.post(API.device.addDevice, data)
}
/**
 * 删除设备
 * @param {String} deviceId
 * @returns {Object} axios 对象
 */
export function deleteDevice(deviceId) {
  return axios.post(API.device.deleteDevice + deviceId)
}
/**
 * 设备绑定项目
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function deviceBindProject(data) {
  return axios.post(API.device.deviceBindProject, data)
}
