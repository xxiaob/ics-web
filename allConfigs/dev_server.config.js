/**
 * 开发环境服务器配置
 */
module.exports = {
  //接口地址配置
  apiHostConfig: {
    base: '"https://192.168.0.150/gwy-api/"',
    ws: '"wss://192.168.0.150/gwy-api/"'
  },
  //高德地图参数配置
  aMapConfig: {
    accessKey: '"c3282c235dc7d1aa55244c9be6de81ce"' //高德地图key
  },
  //声网配置
  agoraConfig: {
    appID: '"2923891558a04fa8a5c30514e06cfac8"'
  }
}
