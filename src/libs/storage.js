import STORAGE_KEY from '../constant/STORAGE_KEY'
import { localData } from './util'

//基础方法，设置和获取
let storageSet = function (key, info) {
  if (info) {
    if (typeof info === 'string') {
      localData.setData(key, info)
    } else {
      localData.setData(key, JSON.stringify(info))
    }
  } else {
    localData.removeData(key)
  }
}

let storageGet = function (key) {
  const data = localData.getData(key)

  if (data) {
    return JSON.parse(data)
  }
  return ''
}
/**
 * 保存token
 * @param {string} token 用户token
 */

export function setToken(token) {
  storageSet(STORAGE_KEY.ACCESS_TOKEN, token)
}

/**
 * 获取token
 * @returns {string} token 用户token
 */
export function getToken() {
  return localData.getData(STORAGE_KEY.ACCESS_TOKEN)
}

/**
 * 获取user
 * @returns {object} user 用户信息
 */
export function getUser() {
  return storageGet(STORAGE_KEY.USER)
}

/**
 * 保存user
 * @param {object} info 用户信息
 */
export function setUser(info) {
  storageSet(STORAGE_KEY.USER, info)
}

/**
 * 获取用户选择语言
 * @returns {String} lan 语言信息
 */
export function getUserLanguage() {
  return localData.getData(STORAGE_KEY.LANG)
}

/**
 * 保存用户选择语言
 * @param {object} info 语言信息
 */
export function setUserLanguage(info) {
  storageSet(STORAGE_KEY.LANG, info)
}

/**
 * 获取用户菜单
 * @returns {String} lan 语言信息
 */
export function getUserMenus() {
  return storageGet(STORAGE_KEY.USER_MENUS)
}

/**
 * 保存用户菜单
 * @param {object} info 语言信息
 */
export function setUserMenus(info) {
  storageSet(STORAGE_KEY.USER_MENUS, info)
}

/**
 * 获取系统配置
 * @returns {String} lan 语言信息
 */
export function getDomainLogoConfig() {
  return storageGet(STORAGE_KEY.DO_MAIN_LOGO_CONFIG)
}

/**
 * 保存系统菜单
 * @param {object} info 语言信息
 */
export function setDomainLogoConfig(info) {
  storageSet(STORAGE_KEY.DO_MAIN_LOGO_CONFIG, info)
}
