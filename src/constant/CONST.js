/**校验类型 枚举*/
export const CHECKTYPE = {
  TEL: /^1[3|4|5|7|8|9][0-9]\d{8}$/, //手机号
  EMAIL: /^(\w)+(\.\w)*@(\w)+((\.\w+)+)$/, //email
  INTC0: /^[+]{0,1}(\d+)$/, //正整数，包含0
  INT: /^[1-9]+\d*$/, //正整数，不包含0
  NUMBER: /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/ //匹配数字
}
/**支持国际化语言类型枚举 */
export const LANG = {
  ZHCN: 'zh-CH', //简体中文
  ENUS: 'en-US' //美式英语
}

/** 区域类型查询 type*/
export const AREAS_TYPE = {
  OWN: 1, //自己
  SAMELEVEL: 2, //同级
  OWN_AND_BRO: 3, //自己和自己下一级
  OWN_AND_CHILD: 4 //查询自己和所有
}

/** 地图类型 type*/
export const MAP_SIGN_TYPE = {
  Marker: 'marker', //点标记
  Polygon: 'polygon', //多边形
  Polyline: 'polyline', //线
  Circle: 'circle' //圆
}
/** 地图类型 type*/
export const MAP_EDIT_TYPE = {
  ADD: 'add', //添加
  EDIT: 'edit', //编辑
  DELETE: 'delete' //删除
}

/** 地图事件 字典 */
export const MAP_EVENT = {
  CLICK: 'click', //单击
  DBCLICK: 'dblclick', //双击
  ZOOMEND: 'zoomend' //缩放结束时触发
}
