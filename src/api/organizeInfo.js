/**
 * 组织信息
 */
import axios from 'axios'
import API from './API'
import { download } from '@/libs/download'

/*------------------------------- 组织勤务------------------------------------ */
/**
 *  组织勤务列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getAttendanceList(data = {}) {
  return axios.post(API.organizeInfo.attendance.list, data)
}

/*-------------------------------人员信息库------------------------------------ */
/**
 *  人员信息库列表
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function getUserInfoList(data = {}) {
  return axios.post(API.organizeInfo.userInfo.list, data)
}

/**
 *  人员信息库单个信息导出
 * @param {object} data
 */
export function exportUserInfo(data = {}) {
  download('人员信息列表.xlsx', API.organizeInfo.userInfo.userExport, data)
}


/**
 *  人员信息库列表信息导出
 * @param {object} data
 */
export function exportUserList(data = {}) {
  download('人员信息列表.xlsx', API.organizeInfo.userInfo.listExport, data)
}


