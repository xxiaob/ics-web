/**
 * 图标配置
 */

/**
  * 默认market icon
  */
export const defaultOrgMarkerIcon = '/static/areaicons/org-default.png'

/**
  * 图标icon
  */
export const JcIcons = {
  nmsc: { name: '农贸市场', icon: '/static/areaicons/nmsc.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/nmsc-abnormal.png' },
  shiguangang: { name: '市管岗', icon: '/static/areaicons/shiguangang.png', cluster: '/static/areaicons/cluster4.png', abnormal: '/static/areaicons/shiguangang-abnormal.png' },
  workspace: { name: '办公点', icon: '/static/areaicons/workspace.png', cluster: '/static/areaicons/cluster4.png', abnormal: '/static/areaicons/workspace-abnormal.png' },
  dhyjbz: { name: '灯会应急保障', icon: '/static/areaicons/dhyjbz.png', cluster: '/static/areaicons/cluster4.png', abnormal: '/static/areaicons/dhyjbz-abnormal.png' },
  fxd: { name: '防汛点', icon: '/static/areaicons/fxd.png', cluster: '/static/areaicons/cluster2.png', abnormal: '/static/areaicons/fxd-abnormal.png' },
  gongce: { name: '公厕', icon: '/static/areaicons/gongce.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/gongce-abnormal.png' },
  gongji: { name: '公祭', icon: '/static/areaicons/gongji.png', cluster: '/static/areaicons/cluster5.png', abnormal: '/static/areaicons/gongji-abnormal.png' },
  hxg: { name: '护学岗', icon: '/static/areaicons/hxg.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/hxg-abnormal.png' },
  zkhkg: { name: '中考护考岗', icon: '/static/areaicons/zkhkg.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/zkhkg-abnormal.png' },
  gkhkg: { name: '高考护考岗', icon: '/static/areaicons/gkhkg.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/gkhkg-abnormal.png' },
  jxd: { name: '积雪点', icon: '/static/areaicons/jxd.png', cluster: '/static/areaicons/cluster2.png', abnormal: '/static/areaicons/jxd-abnormal.png' },
  jxg: { name: '街巷岗', icon: '/static/areaicons/jxg.png', cluster: '/static/areaicons/cluster4.png', abnormal: '/static/areaicons/jxg-abnormal.png' },
  tcd: { name: '停车点', icon: '/static/areaicons/tcd.png', cluster: '/static/areaicons/cluster3.png', abnormal: '/static/areaicons/tcd-abnormal.png' },
  xnc: { name: '消纳场', icon: '/static/areaicons/xnc.png', cluster: '/static/areaicons/cluster1.png', abnormal: '/static/areaicons/xnc-abnormal.png' },
  xcd: { name: '巡查点', icon: '/static/areaicons/xcd.png', cluster: '/static/areaicons/cluster4.png', abnormal: '/static/areaicons/xcd-abnormal.png' },
  zjgd: { name: '在建工地', icon: '/static/areaicons/zjgd.png', cluster: '/static/areaicons/cluster1.png', abnormal: '/static/areaicons/zjgd-abnormal.png' },
  ztkd: { name: '渣土卡点', icon: '/static/areaicons/ztkd.png', cluster: '/static/areaicons/cluster1.png', abnormal: '/static/areaicons/ztkd-abnormal.png' },
  mls: { name: '马拉松岗点', icon: '/static/areaicons/mls.png', cluster: '/static/areaicons/cluster1.png', abnormal: '/static/areaicons/mls-abnormal.png' },
  other: { name: '自建岗点', icon: '/static/areaicons/other.png', cluster: '/static/areaicons/other.png', abnormal: '/static/areaicons/other-abnormal.png' }
}

/**
 * 用户图标
 */
export const JcUserIcons = {
  cluster: '/static/mapIcons/usercluster.png', //聚合图标
  online: '/static/mapIcons/useronline.png', //在线图标
  gather: '/static/mapIcons/usergather.png', //采集图标
  abnormal: '/static/mapIcons/userabnormal.png', //异常报警图标
  //用户其他图标
  icons: {
    baseicon: { name: '默认头像', icon: '/static/mapIcons/useronline.png' },
    usergrid: { name: '网格责任人', icon: '/static/mapIcons/usergrid.png' },
    usermj: { name: '民警', icon: '/static/mapIcons/usermj.png' }
  }
}

/**
 *  事件图标
 */
export const JcEventIcons = {
  cluster: '/static/mapIcons/eventcluster.png', // 事件的聚合图标
  plain: '/static/mapIcons/eventplain.png' // 事件简单图标
}

/**
 *  问题图标
 */
export const JcProblemIcons = {
  cluster: '/static/mapIcons/problemcluster.png', // 事件的聚合图标
  plain: '/static/mapIcons/problemplain.png' // 事件简单图标
}

/**
 *  临时任务图标
 */
export const JcTemporaryTaskIcons = {
  abnormal: '/static/mapIcons/temporarytaskswarn.png',
  plain: '/static/mapIcons/temporarytasks.png'
}

/**
 *  设备图标
 */
export const JcDeviceIcons = {
  uav: '/static/mapIcons/uavdevice.png', // 无人机图标
  camera: '/static/mapIcons/cameradevice.png', // 摄像头图标
  netpatrolcar: '/static/mapIcons/netpatrolcar.png' // 网巡车图标
}
