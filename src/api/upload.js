/**
 * 文件上传
 */
import axios from 'axios'
import API from './API'

/**
 * 文件上传
 * @param {Object} data
 * @returns {Object} axios 对象
 */
export function uploadFile(data) {
  let param = new FormData() //创建form对象

  param.append('file', data.file || data.raw)//通过append向form对象添加数据
  return axios.post(API.upload, param, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
