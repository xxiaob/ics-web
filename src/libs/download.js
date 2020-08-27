import axios from 'axios'
import { getToken } from '@/libs/storage'
import { Message, Loading } from 'element-ui'

const downloadAxios = axios.create({
  baseURL: process.env.apiHostConfig.base,
  headers: { token: getToken() },
  responseType: 'blob'
})

/**
 *
 * @param {*} content 文件流
 * @param {String} fileName 文件名
 */
function downloadBlob(content, fileName) {
  const blob = new Blob([content])
  const a = document.createElement('a')

  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove()
}

/**
 * 文件下载
 * @param {String} fileName 文件名
 * @param {String} url  下载url
 * @param {Object} data 参数
 */
export async function download(fileName, url, data = {}) {
  const loading = Loading.service({ fullscreen: true })

  try {
    const res = await downloadAxios.post(url, data)

    console.log(res)
    if (res.status === 200) {
      downloadBlob(res.data, fileName)
    } else {
      Message({ message: '网络请求失败', type: 'error', offset: 20 })
    }
    loading.close()
  } catch (error) {
    console.error(error)
    loading.close()
  }
}
