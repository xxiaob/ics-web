/**
 * 记录留痕
 */
import axios from 'axios'
import API from './API'

/*-------------------------------记录留痕------------------------------------ */
/**
 * 视频会议
 * @param {object} data
 * @returns {Object} axios 对象
 */
export function videoList(data) {
  return axios.post(API.record.list, data)
}
