import axios from 'axios'
import { getToken } from '@/libs/storage'
import { Message } from 'element-ui'

const downloadAxios = axios.create({
  baseURL: process.env.apiHostConfig.base,
  headers: { token: getToken() },
  responseType: 'blob'
})

function downloadBlob(content) {
  const blob = new Blob([content])
  const a = document.createElement('a')

  a.href = URL.createObjectURL(blob)
  a.download = '事件列表.xlsx'
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove()
}

//文件下载
export async function download(url, data = {}) {
  const res = await downloadAxios.post(url, data)

  console.log(res)
  if (res.status === 200) {
    downloadBlob(res.data)
  } else {
    Message({ message: '网络请求失败', type: 'error', offset: 20 })
  }
}
