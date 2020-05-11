/**
 * 处理设备升级
 */
import axios from 'axios'
import API from './API'

/*-------------------------------设备升级------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskList(data) {
  return axios.post(API.task.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskAdd(data) {
  return axios.post(API.task.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskUpdate(data) {
  return axios.post(API.task.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskSave(data) {
  return data.id ? taskUpdate(data) : taskAdd(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskDel(id) {
  return axios.post(API.task.del + '?taskId=' + id)
}
