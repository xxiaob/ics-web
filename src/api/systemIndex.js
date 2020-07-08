/**
 * 处理首页设置
 */
import axios from 'axios'
import API from './API'

/*-------------------------------首页设置------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function list(data) {
  return axios.post(API.systemIndex.list, data)
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function add(data) {
  return axios.post(API.systemIndex.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function update(data) {
  return axios.post(API.systemIndex.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function save(data) {
  return data.recordId ? update(data) : add(data)
}
/**
 * 删除
 * @param {String} id
 * @returns {Object} axios 对象
 */
export function del(id) {
  return axios.post(API.systemIndex.delete + '?id=' + id)
}

import { getUser } from '@/libs/storage'

/**
 * 查询组织关联链接logo根据orgId
 * @returns {Object} axios 对象
 */
export function getByOrgId() {
  let user = getUser()

  return axios.post(API.systemIndex.getByOrgId + '?orgId=' + user.orgId)
}
