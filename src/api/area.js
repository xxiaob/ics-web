/**
 * 处理区域
 */
import axios from 'axios'
import API from './API'

/*-------------------------------区域管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @param { String } data.orgId 组织id
 * @param { String } data.type 查询类型，见CONST AREAS_TYPE 字典
 * @returns {Object} axios 对象
 */
export function areaList(data) {
  return axios.post(API.area.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaAdd(data) {
  return axios.post(API.area.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaUpdate(data) {
  return axios.post(API.area.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaSave(data) {
  return data.areaId ? areaUpdate(data) : areaAdd(data)
}
/**
 * 获取区域详细
 * @param {Object} data 参数
 * @returns {Object} axios 对象
 */
export function areaGet(data) {
  return axios.post(API.area.get, data)
}
/**
 * 删除
 * @param { Array } areaIds
 * @returns { Object } axios 对象
 */
export function areaDel(areaIds) {
  return axios.post(API.area.del, { areaIds })
}

/**
 * 详情
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function getOrgInfo(orgId) {
  return axios.post(API.area.getOrgInfo, { orgId })
}
