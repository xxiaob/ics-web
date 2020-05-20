/**
 * 处理任务管理
 */
import axios from 'axios'
import API from './API'

/*-------------------------------任务管理------------------------------------ */
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
  return data.taskPO.businessKey ? taskUpdate(data) : taskAdd(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskDel(id) {
  return axios.post(API.task.del + '?businessKey=' + id)
}
/**
 * 根据businessKey获取任务详情 临时任务
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskGet(id) {
  return axios.post(API.task.get + '?businessKey=' + id)
}
/**
 * 根据businessKey获取任务详情 日常任务
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskGetDaily(id) {
  return axios.post(API.task.get + '?businessKey=' + id)
}
/**
 * 启动任务流程
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskStart(id) {
  return axios.post(API.task.start + '?businessKey=' + id)
}
/**
 * 修改任务状态为处理中
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskUpdStatus(id) {
  return axios.post(API.task.updTaskStatus + '?businessKey=' + id)
}
/**
 * 完成任务
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskFinish(data) {
  return axios.post(API.task.finish, data)
}
