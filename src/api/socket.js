/**
 * ws socket连接
 */
const baseUrl = process.env.API_HOST.ws /*eslint-disable-line*/
import mySocket from '@/libs/mySocket'

/**
 * 实时价格更新
 * @returns {Object} Client 对象
 */
export function realpriceClient() {
  return mySocket.client(baseUrl + 'realprice')
}

/**
 * 回测策略更新
 * @param { Long } strategyId 回测策略id
 * @returns {Object} Client 对象
 */
export function backTestClient(strategyId) {
  return mySocket.client(baseUrl + 'backtest/' + strategyId)
}
