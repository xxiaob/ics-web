/**
 * 处理用户
 */
import axios from 'axios'
import API from './API'
import qs from 'qs'
import { getUser } from '@/libs/storage'

/*-------------------------------用户管理------------------------------------ */
/**
 * 列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userList(data = {}) {
  return axios.post(API.user.list, data)
}
/**
 * 根据组织ID查询列表
 * @param {Array} orgIds
 * @returns {Object} axios 对象
 */
export function userListByOrg(orgIds) {
  return axios({
    url: API.user.listByOrg,
    method: 'post',
    params: { orgIds },
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
/**
 * 添加
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userAdd(data) {
  return axios.post(API.user.add, data)
}
/**
 * 更新
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userUpdate(data) {
  return axios.post(API.user.update, data)
}

/**
 * 保存
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function userSave(data) {
  return data.userId ? userUpdate(data) : userAdd(data)
}
/**
 * 详情
 * @param {String} data
 * @returns {Object} axios 对象
 */
export function userGet(data) {
  return axios.post(API.user.get, data)
}
/**
 * 删除
 * @param {String} delIdS
 * @returns {Object} axios 对象
 */
export function userDel(delIdS) {
  return axios.post(API.user.del, delIdS)
}
/**
 * 重置密码
 * @param {String} userId
 * @returns {Object} axios 对象
 */
export function resetUserPwd(userId) {
  return axios.post(API.user.resetUserPwd + `?userId=${userId}`)
}
/**
 * 更新密码
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function updPwd(data) {
  return axios.post(API.user.updPwd, data)
}
/**
 * 更新是否为默认接收人
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function updateOrgReceiver(data) {
  return axios.post(API.user.updateOrgReceiver, data)
}
/**
 * 根据组织id查询所有组织和用户
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getOrgUserList(data) {
  let user = getUser()

  return axios.post(API.user.getOrgUserList, { orgId: user ? user.orgId : '', ...data })
}

/**
 * 根据项目id查询所有组织和用户
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getOrgUserListByProject(data) {
  return axios.post(API.user.getOrgUserListByProject, data)
}

/**
 * 根据距离坐标获取附近的人员
 * @param {object} data 参数
 * @returns {Object} axios 对象
 */
export function getUsersByPosition(data) {
  return axios.post(API.user.getUsersByPosition, data)
}
/**
 * 导入人员
 * @param {object} data 参数
 * @returns {Object} axios 对象
 */
export function importUsers(data) {
  const { orgId, roleIds, positionIds, file } = data
  const formData = new FormData()

  formData.append('file', file)

  return axios({
    url: API.user.importUsers,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { orgId, roleIds, positionIds },
    data: formData,
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

/**
 * 根据项目id查询所有组织和设备
 * @param {String} projectId
 * @returns {Object} axios 对象
 */
export function getOrgDeviceTree(projectId) {
  return axios.get(API.user.getOrgDeviceTree, {
    params: { projectId }
  })
}
