/**
 * 处理任务管理
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'

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
 * 岗点列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function postArea(data) {
  return axios.post(API.task.postArea, data)
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
  return axios.post(API.task.getDaily + '?businessKey=' + id)
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
/**
 * 添加备注 - 日常任务
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskAddRemark(data) {
  return axios.post(API.task.addRemark, data)
}
/**
 * 日常任务 备注列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function taskListRemark(data) {
  return axios.post(API.task.listRemark, data)
}
/**
 * 列表流转记录
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function taskListRecord(id) {
  return axios.post(API.task.listRecord + '?businessKey=' + id)
}
/**
 * 根据问题id查询任务
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function listByProblemId(id) {
  return axios.post(API.task.listByProblemId + '?problemId=' + id)
}
/**
 * 用户是否具有任务处理权限
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function getTaskAuth(id) {
  return axios.post(API.task.getTaskAuth + '?businessKey=' + id)
}

/**
 * 导出
 * @param {object} data
 */
export function exportList(data) {
  window.open(process.env.apiHostConfig.base + API.task.exportList + '?' + qs.stringify(data))
}
