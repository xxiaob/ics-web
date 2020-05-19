/**
 * 系统使用字典定义
 */
/**
 * 定义字典枚举
 */
class JcEnum {
  /**
   * 构造
   * @param {Array} values 基础数据
   */
  constructor(values) {
    this.VALUES = values
    this.map = new Map()

    values.forEach(item => {
      this[item.key] = item.value
      this.map.set(item.value, item.label)
    })
  }

  /**
   * 转显示字符串
   * @param {String | Array} keys 转换对象
   * @returns {String} 处理的字符串
   */
  toString(keys) {
    if (keys) {
      if (keys instanceof Array) {
        let result = []

        keys.forEach(key => {
          let label = this.map.get(key)

          if (label) {
            result.push(label)
          }
        })
        return result.join(',')
      } else {
        return this.map.get(keys) || ''
      }
    }
    let result = []

    for (const [value, label] of this.map) {
      result.push(label)
    }
    return result.join('，')
  }

  get [Symbol.toStringTag]() {
    return 'JcEnum'
  }
}

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
