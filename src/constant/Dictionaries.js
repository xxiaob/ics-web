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
 * 项目操作
 */
export const PROJECT_OPERATES = new JcEnum([
  { key: 'START', value: 0, label: '立即开始' },
  { key: 'STOP', value: 1, label: '立即关闭' }
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
  { key: 'INPROGRESS', value: '1', label: '问题进行中' },
  { key: 'CLOSED', value: '2', label: '已关闭' }
  // { key: 'TASK', value: '3', label: '转任务' },
])

/**
 * 问题处理 - 问题来源
 */
export const QUESTION_SOURCES = new JcEnum([
  { key: 'GOVERNMENT', value: '0', label: '12345' },
  { key: 'CITYBUILD', value: '1', label: '12319' },
  { key: 'OTHER', value: '2', label: '其他来源' },
  { key: 'SELFCREATION', value: '3', label: '自主创建' },
  { key: 'PROBLEMFEEDBACK', value: '4', label: '网巡问题' },
  { key: 'DATAMANAGE', value: '5', label: '数字城管' },
  { key: 'ASSIGNEBYLEADER', value: '6', label: '领导交办' },
  { key: 'AIINTELLECT', value: '7', label: 'AI诊断异常' }
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
  { key: 'PENDING', value: '0', label: '待办理' },
  { key: 'DONE', value: '1', label: '已办理' },
  { key: 'ISSUED', value: '2', label: '已下发' },
  { key: 'DEAFT', value: '3', label: '草稿箱' }
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
 * 任务处理 - 任务来源
 */
export const TASK_SOURCES = new JcEnum([
  { key: 'GOVERNMENT', value: '0', label: '12345' },
  { key: 'CITYBUILD', value: '1', label: '12319' },
  { key: 'OTHER', value: '2', label: '其他来源' },
  { key: 'SELFCREATION', value: '3', label: '自主创建' },
  { key: 'PROBLEMFEEDBACK', value: '4', label: '网巡问题' },
  { key: 'DATAMANAGE', value: '5', label: '数字城管' },
  { key: 'ASSIGNEBYLEADER', value: '6', label: '领导交办' },
  { key: 'AIINTELLECT', value: '7', label: 'AI智能分析' },
  { key: 'RESIDUEWARING', value: '8', label: '渣土告警' },
  { key: 'RESIDUEPROBLEM', value: '9', label: '渣土问题' }
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
  { key: 'UPDATE', value: '5', label: '修改任务' },
  { key: 'OVERTIME', value: '6', label: '任务超时' }
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
export const SYSTEM_MESSAGE_TYPE = new JcEnum([
  { key: 'SELF', value: '0', label: '本系统' },
  { key: 'DREGS', value: '1', label: '溧水渣土' },
  { key: 'PROSECUTION', value: '2', label: '溧水控违' }
])
export const MESSAGE_TYPE = new JcEnum([
  { key: 'TASK', value: '0', label: '日常任务' },
  { key: 'QUESTION', value: '1', label: '问题' },
  { key: 'EVENT', value: '2', label: '事件' },
  { key: 'TEMPORARY', value: '4', label: '临时任务' },
  { key: 'ALARM', value: '5', label: '告警' }
])
export const WARNING_TYPE = new JcEnum([//告警类型
  { key: 'USER_ABNORMAL', value: '0', label: '人员考勤-脱离区域' },
  { key: 'GRID_ARRIVE_ABNORMAL', value: '1', label: '岗点日常-未准点到达' },
  { key: 'GRID_TIME_ABNORMAL', value: '2', label: '岗点日常-时长不足' },
  { key: 'GRID_USER_ABNORMAL', value: '3', label: '岗点日常-人员不足' },
  { key: 'TEMPORARY_ABNORMAL', value: '4', label: '临时任务-任务超时' }
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
 * 设备管理 设备来源
 */
export const DEVICE_SOURCES = new JcEnum([
  { key: 'HANKER', value: 1, label: '海康摄像头' },
  { key: 'LAW', value: 2, label: '绑定执法仪' },
  { key: 'FIXEDFLOW', value: 3, label: '固定流播放' }
])

/**
 * 法律法规和渣土告警类型
 */
export const LAWS_TYPES = new JcEnum([
  { key: 'STATUTE', value: 'statuteType', label: '法律法规类型' },
  { key: 'POWER', value: 'powerListType', label: '条例类型' },
  { key: 'ALARM', value: 'alarm', label: '告警类型' }
])


/**
 * 渣土告警状态
 */
export const ALARM_STATUS = new JcEnum([
  { key: 'NO_RESOLVE', value: '1', label: '未解除' },
  { key: 'RESOLVE', value: '2', label: '已解除' },
  { key: 'TASK_ING', value: '3', label: '任务处理中' }
])

/**
 * 系统告警状态
 */
export const SYSTEM_ALARM_STATUS = new JcEnum([
  { key: 'OPEN', value: 0, label: '开启' },
  { key: 'CLOSE', value: 1, label: '关闭' }
])


