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
    listByOrg: 'user-service/user/getUserByOrg',
    update: 'user-service/user/upd',
    del: 'user-service/user/del',
    resetUserPwd: 'user-service/user/resetUserPwd',
    updateOrgReceiver: 'user-service/user/updOrgReceiver',
    getOrgUserList: 'user-service/user/getOrgUserList'
  },
  areaType: {
    //区域类型管理
    add: 'area-service/areaType/add',
    get: 'area-service/areaType/detail',
    listByPage: 'area-service/areaType/listByPage',
    list: 'area-service/areaType/list',
    update: 'area-service/areaType/update',
    del: 'area-service/areaType/delete'
  },
  area: {
    //区域管理
    add: 'area-service/area/add',
    get: 'area-service/area/detail',
    list: 'area-service/area/list',
    update: 'area-service/area/update',
    del: 'area-service/area/delete',
    getOrgInfo: 'area-service/area/getOrgInfo',
    getUsableAdCodeList: 'area-service/area/getUsableAdCodeList'
  },
  deviceUpdate: {
    //设备升级
    add: 'device-service/deviceUpgPkg/add',
    list: 'device-service/deviceUpgPkg/listByPage',
    update: 'device-service/deviceUpgPkg/upd',
    del: 'device-service/deviceUpgPkg/del',
    publish: 'device-service/deviceUpgPkg/publishedPkg'
  },
  upload: 'file-server-service/upload/upload',
  device: {
    //设备管理
    add: 'device-service/deviceUpgPkg/add',
    list: 'device-service/deviceUpgPkg/listByPage',
    update: 'device-service/deviceUpgPkg/upd',
    del: 'device-service/deviceUpgPkg/del'
  },
  eventManage: {
    //事件管理
    add: 'task-service/event/add',
    get: 'task-service/event/getById',
    list: 'task-service/event/list',
    selectList: 'task-service/event/selectList',
    update: 'task-service/event/upd',
    del: 'task-service/event/del',
    typeList: 'task-service/event/typeList',
    listByTask: 'task-service/eventBind/getEvents'
  },
  task: {
    //任务管理
    add: 'task-service/task/addTask',
    list: 'task-service/task/select',
    update: 'task-service/task/updTask',
    del: 'task-service/task/delTask',
    start: 'task-service/task/start',
    updTaskStatus: 'task-service/task/updTaskStatus',
    finish: 'task-service/task/finish',
    get: 'task-service/task/getTemporaryTask',
    getDaily: 'task-service/task/getDailyTask',
    addRemark: 'task-service/task/addTaskRemark',
    listRemark: 'task-service/task/remarkSelect',
    listRecord: 'task-service/task/getTaskRecord'
  },
  question: {
    //问题管理
    add: 'task-service/problem/add',
    list: 'task-service/problem/select',
    update: 'task-service/problem/upd',
    del: 'task-service/problem/del',
    start: 'task-service/problem/start',
    report: 'task-service/problem/report',
    get: 'task-service/problem/getProblemTask',
    typeList: 'task-service/problem/getProblemTypes'
  },
  pttGroup: {
    //PTT群组
    add: 'user-service/userGroup/addGroup',
    list: 'user-service/userGroup/selectGroupByPage',
    update: 'user-service/userGroup/updateGroup',
    del: 'user-service/userGroup/deleteGroup'
  },
  projects: {
    //项目管理
    add: 'user-service/project',
    listByPage: 'user-service/project/listByPage',
    list: 'user-service/project/list',
    update: 'user-service/project/update',
    del: 'user-service/project/delete',
    projectUserRef: {
      //项目关联人员
      save: 'user-service/projectUserRef/save',
      list: 'user-service/projectUserRef/list'
    }
  },
  live: {
    //直播相关
    imAuth: 'user-service/getAuthToken'
  }
}
