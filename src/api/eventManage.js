/**
 * 处理事件上报
 */
import axios from 'axios'
import API from './API'
import { download } from '@/libs/download'

/*-------------------------------事件上报------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageList(data) {
  return axios.post(API.eventManage.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageAdd(data) {
  return axios.post(API.eventManage.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageUpdate(data) {
  return axios.post(API.eventManage.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function eventManageSave(data) {
  return data.id ? eventManageUpdate(data) : eventManageAdd(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function eventManageDel(id) {
  return axios.post(API.eventManage.del + '?id=' + id)
}
/**
 * 根据id获取详情
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function eventManageGet(id) {
  return axios.post(API.eventManage.get + '?id=' + id)
}
/**
 * 事件类型列表
 * @param {String} name
 * @returns {Object} axios 对象
 */
export function eventManageTypeList(name) {
  return axios.post(API.eventManage.typeList + '?name=' + name)
}
/**
 * 事件列表查询 根据title
 * @param {String} title
 * @returns {Object} axios 对象
 */
export function eventManageSelectList(title) {
  return axios.post(API.eventManage.selectList + '?title=' + title)
}
/**
 * 事件列表查询 根据taskId
 * @param {String} taskId
 * @returns {Object} axios 对象
 */
export function eventManageListByTask(taskId) {
  return axios.post(API.eventManage.listByTask + '?taskId=' + taskId)
}

/**
 * 导出列表
 * @param {object} data
 */
export function exportList(data) {
  download('事件列表.xlsx', API.eventManage.exportList, data)
}
/**
 * 导出详情
 * @param {String} id
 */
export function exportDetail(id) {
  download(`事件详情${id}.xlsx`, API.eventManage.exportDetail + '?id=' + id)
}
/**
 * 导出文件
 * @param {String} id
 */
export function fileDownload(id) {
  download(`事件文件${id}.zip`, API.eventManage.fileDownload + '?id=' + id)
}
