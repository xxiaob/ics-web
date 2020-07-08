/**
 * 处理组织
 */
import axios from 'axios'
import API from './API'
import { getUser } from '@/libs/storage'

/*-------------------------------组织管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function organizationList(data = {}) {
  let user = getUser()

  return axios.post(API.organization.list, { orgId: user ? user.orgId : '', ...data })
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function organizationAdd(data) {
  return axios.post(API.organization.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function organizationUpdate(data) {
  return axios.post(API.organization.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function organizationSave(data) {
  return data.orgId ? organizationUpdate(data) : organizationAdd(data)
}
/**
 * 详情
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function organizationGet(orgId) {
  return axios.post(API.organization.get, { orgId })
}
/**
 * logo详情
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function getOrgLogo(orgId) {
  return axios.post(API.organization.getOrgLogo + '?orgId=' + orgId)
}
/**
 * 删除
 * @param {String} orgId
 * @returns {Object} axios 对象
 */
export function organizationDel(orgId) {
  return axios.post(API.organization.del, { orgId })
}
