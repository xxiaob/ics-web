/**
 * ws socket连接
 */
import API from './API'

const baseUrl = process.env.API_HOST.ws /*eslint-disable-line*/
import JcSocket from '@/libs/JcSocket'

/**
 * 实时价格更新
 * @returns {Object} JcSocket 对象
 */
export function screenMapSocket() {
  return new JcSocket(baseUrl + API.screen.command.screenMap)
}

