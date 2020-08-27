/**
 * 处理问题管理
 */
import axios from 'axios'
import API from './API'
import { download } from '@/libs/download'

/*-------------------------------问题管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function questionList(data) {
  return axios.post(API.question.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function questionAdd(data) {
  return axios.post(API.question.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function questionUpdate(data) {
  return axios.post(API.question.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function questionSave(data) {
  return data.id ? questionUpdate(data) : questionAdd(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function questionDel(id) {
  return axios.post(API.question.del + '?businessKey=' + id)
}
/**
 * 根据businessKey获取问题详情
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function questionGet(id) {
  return axios.post(API.question.get + '?businessKey=' + id)
}
/**
 * 问题反馈
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function questionStart(id) {
  return axios.post(API.question.start + '?businessKey=' + id)
}
/**
 * 处理问题
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function questionReport(data) {
  return axios.post(API.question.report, data)
}
/**
 * 问题类型列表
 * @returns {Object} axios 对象
 */
export function questionTypeList() {
  return axios.post(API.question.typeList)
}
/**
 * 用户是否具有问题处理权限
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function getProblemAuth(id) {
  return axios.post(API.question.getProblemAuth + '?businessKey=' + id)
}

/**
 * 导出列表
 * @param {object} data
 */
export function exportList(data) {
  download('问题列表.xlsx', API.question.exportList, data)
}
/**
 * 导出详情
 * @param {String} id
 */
export function exportDetail(id) {
  download('问题详情.xlsx', API.question.exportDetail + '?businessKey=' + id)
}
/**
 * 导出文件
 * @param {String} id
 */
export function fileDownload(id) {
  download('问题文件.zip', API.question.fileDownload + '?businessKey=' + id)
}
