/**
 * 处理任务管理
 */
import axios from 'axios'
import API from './API'

/*-------------------------------任务管理------------------------------------ */
/**
 * 极光鉴权信息
 * @returns {Object} axios 对象
 */
export function getImAuth() {
  return axios.post(API.live.imAuth)
}
