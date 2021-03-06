/**
 * 音视频相关
 */
import axios from 'axios'
import API from './API'

/*-------------------------------音视频相关------------------------------------ */
/**
 * 极光鉴权信息
 * @returns {Object} axios 对象
 */
export function getImAuth() {
  return axios.post(API.live.imAuth)
}
/**
 * 获取声网token
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function getAgoraToken(data) {
  return axios.post(API.live.agoraToken, data)
}
/**
 * 开始录制
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function startRecord(data) {
  return axios.post(API.live.record, data)
}
/**
 * 结束录制
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function endRecord(data) {
  return axios.post(API.live.endRecord, data)
}
/**
 * 获取频道
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function getChannelByUserId(data) {
  return axios.post(API.live.getChannelByUserId, data)
}
/**
 * 获取录像视频
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function getRecording(data) {
  return axios.post(API.live.getRecording, data)
}
