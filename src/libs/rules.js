/**
 * 校验规则
 */

import { CHECKTYPE } from '@/constant/CONST'
import { check } from '@/libs/util'

/**
 * 默认不能为空
 */
export const NOT_NULL = [{ required: true, message: '输入不能为空' }]

/**
 * 选择默认不能为空
 */
export const SELECT_NOT_NULL = [{ required: true, message: '选择不能为空' }]

/**
 * 获取校验方法
 * @param {*} options 参数
 * @param {string} options.ignore 是否忽略校验值为空(是否为必填校验)
 * @param {string} options.checkReg 自定义校验类型
 * @param {string} options.checkReg 自定义校验类型
 * @returns {Object} 返回校验方法
 */
export function getValidator(options = {
  ignore: false,
  checkReg: null,
  tip: ''
}) {
  return {
    validator(rule, value, callback) {
      if (check({ val: value, ignore: options.ignore, checkReg: options.checkReg })) {
        callback()
      } else {
        callback(new Error(options.tip))
      }
    }
  }
}

/**
 * 校验手机号码
 * @param {Boolean} ignore 是否必填
 * @returns {Array} 返回校验数组
 */
export function getTelRule(ignore = false) {
  if (ignore) {
    return [getValidator({ ignore: ignore, checkReg: CHECKTYPE.TEL, tip: '请输入正确的手机号码' })]
  }
  return [...NOT_NULL, getValidator({ ignore: ignore, checkReg: CHECKTYPE.TEL, tip: '请输入正确的手机号码' })]
}

/**
 * 校验字符串
 * @param {Number} min 最小长度
 * @param {Number} max 最小长度
 * @returns {Array} 返回校验数组
 */
export function getStringRule(min = 1, max = 20) {
  if (min > 0) {
    return [...NOT_NULL, { max, message: `长度不超过${max}个字符` }]
  }
  return [{ max, message: `长度不超过${max}个字符` }]
}

/**
 * 校验数字
 * @param {Boolean} ignore 是否必填
 * @param { Number } max 最大值
 * @param { Number } min 最小值
 * @returns {Array} 返回校验数组
 */
export function getNumberRule(ignore = false, max, min) {
  let extraRules = []

  if (max) {
    extraRules.push({ type: 'number', max, message: `数字不大于${max}` })
  }
  if (min !== 'undefined') {
    extraRules.push({ type: 'number', min, message: `数字不小于${min}` })
  }
  if (ignore) {
    return [...NOT_NULL, { type: 'number', message: '请输入数字' }, ...extraRules]
  }
  return [{ type: 'number', message: '请输入数字' }, ...extraRules]
}

/**
 * 校验数字 为整数
 * @param {Boolean} ignore 是否必填
 * @param { Number } max 最大值
 * @param { Number } min 最小值
 * @returns {Array} 返回校验数组
 */
export function getIntegerRule(ignore = false, max, min) {
  let extraRules = []

  if (max) {
    extraRules.push({ max, message: `整数不大于${max}` })
  }
  if (min) {
    extraRules.push({ min, message: `整数不小于${min}` })
  }
  if (ignore) {
    return [{ type: 'integer', message: '请输入整数' }, ...extraRules]
  }
  return [...NOT_NULL, { type: 'integer', message: '请输入整数' }, ...extraRules]
}
