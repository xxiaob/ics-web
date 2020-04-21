/**
 * 处理区域类型
 */
import axios from 'axios'
import API from './API'

/*-------------------------------区域类型管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaTypeList(data) {
  return axios.post(API.areaType.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaTypeAdd(data) {
  return axios.post(API.areaType.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaTypeUpdate(data) {
  return axios.post(API.areaType.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function areaTypeSave(data) {
  return data.areaTypeId ? areaTypeUpdate(data) : areaTypeAdd(data)
}
/**
 * 根据用户获取菜单
 * @returns {Object} axios 对象
 */
export function areaTypeGet() {
  return axios.post(API.areaType.get)
}
/**
 * 删除
 * @param { Array } areaTypeIds
 * @returns { Object } axios 对象
 */
export function areaTypeDel(areaTypeIds) {
  return axios.post(API.areaType.del, { areaTypeIds })
}
