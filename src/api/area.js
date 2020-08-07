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
 * @param { String } areaId
 * @returns { Object } axios 对象
 */
export function areaDel(areaId) {
  return axios.post(API.area.del, { areaId })
}

/**
 * 详情
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function getOrgInfo(orgId) {
  return axios.post(API.area.getOrgInfo, { orgId })
}

/**
 * 区域功能页面获取可用的省市区结构
 * @returns {Object} axios 对象
 */
export function getUsableAdCodeList() {
  return axios.post(API.area.getUsableAdCodeList)
}

/**
 * 网格列表
 * @param {String} projectId
 * @returns {Object} axios 对象
 */
export function areaGridList(projectId) {
  return axios.post(API.area.gridList + '?projectId=' + projectId)
}

/**
 * 根据组织获取绑定区域的areacode,返回的至少是区级areaCode
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function getAreaCodeByOrgId(orgId) {
  return axios.post(API.area.getAreaCodeByOrgId, { orgId })
}

/**
 * 根据id查询区域信息
 * @param {String} areaId
 * @returns {Object} axios 对象
 */
export function getAreaInfoById(areaId) {
  return axios.post(API.area.getAreaInfoById + '?areaId=' + areaId)
}
