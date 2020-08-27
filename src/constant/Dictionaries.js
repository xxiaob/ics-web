/**
 * 系统使用字典定义
 */
import JcEnum from '@/libs/JcEnum'

/**
  * 允许登录终端
  */
export const LOGIN_DEVICE_TYPES = new JcEnum([
  { key: 'PC', value: '1', label: '电脑端' },
  { key: 'MOBILE', value: '2', label: '移动端' },
  { key: 'LAW', value: '3', label: '行政执法仪' }
])

/**
 * 项目类型
 */
export const PROJECT_TYPES = new JcEnum([
  { key: 'NORMAL', value: '0', label: '常态管控' },
  { key: 'EmergencySupport', value: '1', label: '应急保障' },
  { key: 'SpecialControl', value: '2', label: '专项管控' }
])

/**
 * 项目状态
 */
export const PROJECT_STATUS = new JcEnum([
  { key: 'NOTSTART', value: '1', label: '未开始' },
  { key: 'RUNNING', value: '2', label: '进行中' },
  { key: 'FINISHED', value: '3', label: '已结束' }
])


/**
 * 问题处理 - 处理状态（个人）
 */
export const QUESTION_TYPES = new JcEnum([
  { key: 'PENDING', value: '0', label: '待处理' },
  { key: 'PROCESSED', value: '1', label: '已处理' },
  { key: 'FEEDBACK', value: '2', label: '已反馈' },
  { key: 'DEAFT', value: '3', label: '草稿箱' }
])

/**
 * 问题处理 - 状态（问题）
 */
export const QUESTION_STATES = new JcEnum([
  { key: 'NOTREPORTED', value: '0', label: '未上报' },
  { key: 'INPROGRESS', value: '1', label: '进行中' },
  { key: 'CLOSED', value: '2', label: '已关闭' }
  // { key: 'TASK', value: '3', label: '转任务' },
])

/**
 * 任务处理 - 任务类型
 */
export const TASK_TYPES = new JcEnum([
  { key: 'TEMPORARY', value: '0', label: '临时任务' },
  { key: 'DAILY', value: '1', label: '日常任务' }
])

/**
 * 任务处理 - 处理状态（个人）
 */
export const TASK_SELECT_TYPES = new JcEnum([
  { key: 'PENDING', value: '0', label: '待办' },
  { key: 'DONE', value: '1', label: '已办' },
  { key: 'ISSUED', value: '2', label: '已发' },
  { key: 'DEAFT', value: '3', label: '草稿' }
])

/**
 * 任务处理 - 处理状态（任务）
 */
export const TASK_STATES = new JcEnum([
  { key: 'NOTISSUED', value: '0', label: '未下发' },
  { key: 'ISSUED', value: '1', label: '已下发' },
  { key: 'PROCESSING', value: '2', label: '处理中' },
  { key: 'FINISHED', value: '3', label: '已完成' },
  { key: 'OVERTIME', value: '4', label: '已超时' }
])

/**
 * 任务处理 - 问题来源
 */
export const TASK_SOURCES = new JcEnum([
  { key: 'government', value: '0', label: '12345' },
  { key: 'CITYBUILD', value: '1', label: '12319' },
  { key: 'OTHER', value: '2', label: '其他来源' },
  { key: 'SELFCREATION', value: '3', label: '自主创建' },
  { key: 'PROBLEMFEEDBACK', value: '4', label: '问题反馈' },
  { key: 'WORKORDER', value: '5', label: '工单' }
])

/**
 * 任务处理 - 流转行为
 */
export const TASK_REPEATS = new JcEnum([
  { key: 'ESTABLISH', value: '0', label: '创建任务' },
  { key: 'HAIRDOWN', value: '1', label: '下发任务' },
  { key: 'FORWARD', value: '2', label: '转发任务' },
  { key: 'FINISHED', value: '3', label: '结束任务' },
  { key: 'REMARK', value: '4', label: '添加备注' },
  { key: 'UPDATE', value: '5', label: '修改任务' }
])

/**
 * 任务处理 - 日常任务 - 区域类型
 */
export const TASK_AREA_TYPES = new JcEnum([
  { key: 'ORG', value: '0', label: '组织区域' },
  { key: 'GRID', value: '1', label: '网格区域' }
])

/**
 * 任务处理 - 任务人员类型
 */
export const TASK_PEOPLE_TYPES = new JcEnum([
  { key: 'PEOPLE', value: '1', label: '人员' },
  { key: 'ORG', value: '0', label: '组织' }
])

/**
 * 任务处理 - 日常任务 - 任务频率
 */
export const TASK_FREQUENCYS = new JcEnum([
  { key: 'DAT', value: 1, label: '日' },
  { key: 'WEEK', value: 7, label: '周' },
  { key: 'MONTH', value: 30, label: '月' },
  { key: 'CUSTOM', value: 0, label: '自定义 / 天' }
])

/**
 * 考勤 - 考勤周期
 */
export const ATTEND_PERIODS = new JcEnum([
  { key: 'DAY', value: '0', label: '日数据' },
  { key: 'WEEK', value: '1', label: '周数据' },
  { key: 'MONTH', value: '2', label: '月数据' }
])
/**
 * 考勤 - 范围状态
 */
export const ATTEND_RANGE_STATUSES = new JcEnum([
  { key: 'INTO', value: '0', label: '进圈' },
  { key: 'OUT', value: '1', label: '出圈' },
  { key: 'ON', value: '2', label: '在岗' },
  { key: 'LEAVE', value: '3', label: '离岗' }
])
/**
 * 考勤 - 督查结果
 */
export const ATTEND_OVERSEE_STATUSES = new JcEnum([
  { key: 'NO', value: '0', label: '未督查' },
  { key: 'NORMAL', value: '1', label: '正常' },
  { key: 'ABNORMAL', value: '2', label: '异常' }
])
/**
 * 考勤 - 岗点考核
 */
export const POST_OVERSEE_RESULTS = new JcEnum([
  { key: 'NOTSTANDARD', value: '0', label: '未达标' },
  { key: 'STANDARD', value: '1', label: '达标' }
])
/**
 * 考勤配置 - 考勤状态
 */
export const ATTEND_CONFIGURE_STATUSES = new JcEnum([
  { key: 'NOTENABLED', value: 0, label: '未启用' },
  { key: 'ENABLED', value: 1, label: '启用' }
])

/**
 * 事件推送类型 字典
 */
export const MESSAGE_TYPE = new JcEnum([
  { key: 'TASK', value: '0', label: '日常任务' },
  { key: 'QUESTION', value: '1', label: '问题' },
  { key: 'EVENT', value: '2', label: '事件' },
  { key: 'TEMPORARY', value: '4', label: '临时任务' }
])

/** 用户在岗 考勤状态 */
export const USER_GRID_STATUS = new JcEnum([
  { key: 'INCIRCLE', value: '0', label: '进圈' },
  { key: 'OUTCIRCLE', value: '1', label: '出圈' },
  { key: 'INGUARD', value: '2', label: '进岗' },
  { key: 'OUTGUARD', value: '3', label: '离岗' }
])

/**
 * 音视频 - 类型
 */
export const VIDEO_INVITE_TYPES = new JcEnum([
  { key: 'MEETAUDIO', value: '0', label: '多人语音' },
  { key: 'MEETVIDEO', value: '1', label: '多人视频' },
  { key: 'FORCEOBSERVE', value: '2', label: '强制观摩' },
  { key: 'OBSERVE', value: '3', label: '观摩' },
  { key: 'DOUBLEAUDIO', value: '4', label: '双人语音' },
  { key: 'DOUBLEVIDEO', value: '5', label: '双人视频' }
])

/**
 * 推送类型 字典
 */
export const SOCKET_MESSAGE_TYPES = new JcEnum([
  { key: 'COMMAND', value: 'command', label: '指挥大屏' },
  { key: 'DATA_STATISTICS', value: 'datastatistics', label: '数据大屏' }
])

/**
 * 推送数据 类型字典
 */
export const MESSAGE_DATA_TYPES = new JcEnum([
  { key: 'TASK', value: 'task', label: '日常任务' },
  { key: 'QUESTION', value: 'question', label: '问题' },
  { key: 'EVENT', value: 'event', label: '事件' },
  { key: 'TEMPORARY', value: 'temporary', label: '临时任务' },
  { key: 'LIVE', value: 'live', label: '音视频' },
  { key: 'CLOSR', value: 'close', label: '关闭投屏' }
])

/**
 * 登陆页 窗口位置字典
 */
export const LOGIN_WINDOWS_POSITION = new JcEnum([
  { key: 'LEFT', value: 1, label: '左' },
  { key: 'CENTER', value: 2, label: '中' },
  { key: 'RIGHT', value: 3, label: '右' }
])

/**
 * 设备管理 设备类型
 */
export const DEVICE_TYPES = new JcEnum([
  { key: 'CAMERA', value: 1, label: '摄像头' },
  { key: 'UAV', value: 2, label: '无人机' },
  { key: 'NETPATROLCAR', value: 3, label: '网巡车' }
])

/**
 * 法律法规和渣土告警类型
 */
export const LAWS_TYPES = new JcEnum([
  { key: 'STATUTE', value: 'statuteType', label: '法律法规类型' }
])
