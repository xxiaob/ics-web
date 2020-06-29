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

/** 区域查询 方式 type*/
export const AREAS_TYPE = {
  OWN: 1, //查本机构
  SAMELEVEL: 2, //查本机构和所有同级机构
  OWN_AND_BRO: 3, //查本机构和所有的下级机构
  OWN_AND_CHILD: 4 //查本机构和所有下一级的机构
}

/** 区域查询 类型 type*/
export const AREAS_SEARCH_TYPE = {
  ORG: 1, //组织
  GRID: 2, //网格
  SCREEN: 3 //指挥大屏
}

/** 地图类型 type*/
export const MAP_SIGN_TYPE = {
  Polygon: 'polygon', //多边形
  Polyline: 'polyline', //线
  Circle: 'circle' //圆
}
/** 地图类型 操作 type*/
export const MAP_EDIT_TYPE = {
  ADD: 'add', //添加
  EDIT: 'edit', //编辑
  DELETE: 'delete' //删除
}

/** 地图事件 字典 */
export const MAP_EVENT = {
  CLICK: 'click', //单击
  RIGHTCLICK: 'rightclick', //右键点击
  DBCLICK: 'dblclick', //双击
  ZOOMEND: 'zoomend', //缩放结束时触发
  MOURSEOVER: 'mouseover', //鼠标经过
  MOURSEOUT: 'mouseout', //鼠标移出
  DRAGEND: 'dragend' //移动结束
}
