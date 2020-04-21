/**返回接口api */
export default {
  auth: {
    //用户鉴权域
    login: 'user-service/login'
  },
  menus: {
    //菜单管理
    add: 'user-service/res/add',
    get: 'user-service/res/getResourceById',
    list: 'user-service/res/getAllResource',
    update: 'user-service/res/upd',
    del: 'user-service/res/del'
  },
  position: {
    //职位管理
    add: 'user-service/position/add',
    get: 'user-service/position/byId',
    list: 'user-service/position/listByPage',
    listAll: 'user-service/position/list',
    update: 'user-service/position/upd',
    del: 'user-service/position/del'
  },
  organization: {
    //组织管理
    add: 'user-service/org/add',
    get: 'user-service/org/byId',
    list: 'user-service/org/list',
    update: 'user-service/org/upd',
    del: 'user-service/org/del'
  },
  role: {
    //角色管理
    add: 'user-service/role/add',
    get: 'user-service/role/byId',
    list: 'user-service/role/select',
    listAll: 'user-service/role/list',
    update: 'user-service/role/upd',
    del: 'user-service/role/del'
  },
  user: {
    //用户管理
    add: 'user-service/user/add',
    get: 'user-service/user/byId',
    list: 'user-service/user/list',
    update: 'user-service/user/upd',
    del: 'user-service/user/del',
    resetUserPwd: 'user-service/user/resetUserPwd',
    updateOrgReceiver: 'user-service/user/updOrgReceiver'
  },
  areaType: {
    //区域类型管理
    add: 'area-service/areaType/add',
    get: 'area-service/areaType/detail',
    list: 'area-service/areaType/listByPage',
    update: 'area-service/areaType/update',
    del: 'area-service/areaType/delete'
  }
}
