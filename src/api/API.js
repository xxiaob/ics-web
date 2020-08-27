/**返回接口api */
export default {
  auth: {
    //用户鉴权域
    login: 'user-service/login'
    // login: 'user-service/login'
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
    del: 'user-service/org/del',
    getOrgLogo: 'user-service/org/getOrgLogoByOrgId',
    getPOrgIdWithSameLevelAuth: 'user-service/org/getPOrgIdWithSameLevelAuth' //根据同级查看获取组织信息或者上级组织信息
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
    getOrgUserList: 'user-service/user/getOrgUserList',
    getOrgUserListByProject: 'user-service/user/getOrgUserListByProject',
    updPwd: 'user-service/user/updPwd',
    getUsersByPosition: 'message-srv/message/getUsersByPosition'
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
    getAreaInfoById: 'area-service/area/getAreaInfoById', //根据id查询区域信息
    getOrgInfo: 'area-service/area/getOrgInfo',
    getUsableAdCodeList: 'area-service/area/getUsableAdCodeList',
    gridList: 'area-service/area/getAreaListByOrgId',
    getAreaCodeByOrgId: 'area-service/area/getAreaCodeByOrgId'
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
    list: 'device-service/hikDevice/deviceList',
    detail: 'device-service/hikDevice/deviceDetail', // 获取设备详情数据
    bind: 'device-service/hikDevice/deviceBind',
    deviceList: 'device-service/hikDevice/deviceAndOrgList', // 组织设备列表
    relay: 'device-service/hikDevice/getRelayStreaming',
    getLiveStreaming: 'device-service/hikDevice/getLiveStreaming' //获取实时流
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
    listByTask: 'task-service/eventBind/getEvents',
    exportList: 'task-service/event/listExport',
    exportDetail: 'task-service/event/detailExport',
    fileDownload: 'task-service/event/fileDownload'
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
    listRecord: 'task-service/task/getTaskRecord',
    postArea: 'task-service/task/getTaskPostArea',
    listByProblemId: 'task-service/task/getTaskByProblemId',
    getTaskAuth: 'task-service/task/getTaskAuth',
    exportList: 'task-service/task/listExport',
    exportTemporaryDetail: 'task-service/task/temporaryDetailExport',
    exportDailyDetailExport: 'task-service/task/dailyDetailExport',
    fileDownload: 'task-service/task/fileDownload'
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
    typeList: 'task-service/problem/getProblemTypes',
    getProblemAuth: 'task-service/problem/getProblemAuth',
    exportList: 'task-service/problem/listExport',
    exportDetail: 'task-service/problem/detailExport',
    fileDownload: 'task-service/problem/fileDownload'
  },
  pttGroup: {
    //PTT群组
    add: 'user-service/userGroup/addGroup',
    list: 'user-service/userGroup/selectGroup',
    update: 'user-service/userGroup/updateGroup',
    del: 'user-service/userGroup/deleteGroup',
    userList: 'user-service/userGroup/getGroupUser',
    userDel: 'user-service/userGroup/delGroupUser',
    userAdd: 'user-service/userGroup/addGroupUser',
    userCode: 'user-service/userGroup/getUserCode'
  },
  projects: {
    //项目管理
    add: 'user-service/project',
    get: 'user-service/project/detail/',
    listByPage: 'user-service/project/listByPage',
    list: 'user-service/project/list',
    tree: 'user-service/project/tree',
    update: 'user-service/project',
    del: 'user-service/project/',
    projectUserRef: {
      //项目关联人员
      save: 'user-service/projectUserRef',
      list: 'user-service/projectUserRef/list'
    }
  },
  live: {
    //直播相关
    imAuth: 'user-service/getAuthToken',
    agoraToken: 'device-service/recording/getChannelKey',
    record: 'device-service/recording/startRecording',
    endRecord: 'device-service/recording/endRecording',
    getRecording: 'device-service/recording/getRecording', //获取录像视频
    getChannelByUserId: 'device-service/recording/getChannelByUserId'
  },
  attend: {
    //考勤管理
    myAttendList: 'task-service/taskAttendance/getPersonal',
    userAttendList: 'task-service/taskAttendance/getUser',
    postAttendList: 'task-service/taskAttendance/getPost',
    inPostList: 'task-service/taskAttendance/getInPost',
    userOverseeList: 'task-service/taskSupervise/getUser',
    postOverseeList: 'task-service/taskSupervise/getPost',
    exportMyAttend: 'task-service/taskDataExport/getPersonalAttendance',
    exportPeopleAttend: 'task-service/taskDataExport/getUserAttendance',
    exportPostAttend: 'task-service/taskDataExport/getPostAttendance',
    exportInPostAttend: 'task-service/taskDataExport/getInPostSupervise',
    exportUserOversee: 'task-service/taskDataExport/getUserSupervise',
    exportPostOversee: 'task-service/taskDataExport/getPostSupervise',
    addUserOversee: 'task-service/taskSupervise/addUserSupervise',
    addPostOversee: 'task-service/taskSupervise/addPostSupervise',
    cfgAdd: 'task-service/userAttendanceCfg/add',
    cfgUpdate: 'task-service/userAttendanceCfg/upt',
    cfgList: 'task-service/userAttendanceCfg/select',
    cfgGet: 'task-service/userAttendanceCfg/getConfigDetail',
    cfgDel: 'task-service/userAttendanceCfg/del',
    uptStatus: 'task-service/userAttendanceCfg/uptStatus'
  },
  screen: {
    messageChannel: 'message-service/icsServer/command',
    //大屏接口
    command: {
      getCommandScreenData: 'data-service/largeScreen/getCommandScreenData',
      screenMap: 'message-service/icsServer/screenMap', //大屏推送接口
      getScreenData: 'task-service/taskScreen/getScreenData',
      getScreenTask: 'task-service/task/getScreenTask', //最近两天未完成的临时任务
      getTaskPostLine: 'task-service/taskAttendance/getTaskPostLine', //岗点考勤事件流水
      getTaskPersonalLine: 'task-service/taskAttendance/getTaskPersonalLine', //个人考勤事件流水
      getUserHistoryPosition: 'message-srv/message/getUserHistoryPosition', //获取用户历史定位
      getScreenOverallData: 'task-service/taskScreen/getScreenOverallData', //根据用户和网格查询综合数据
      getScreenEventData: 'task-service/event/screenSelect', // 指挥大屏的事件数据
      getScreenProblemData: 'task-service/problem/selectScreenTask', // 指挥大屏问题数据
      getScreenDeviceData: 'device-service/hikDevice/screenDataDevice' // 指挥大屏设备数据
    },
    dataStatistics: {
      accumulateInfo: 'data-service/largeScreen/accumulateInfo',
      transactionType: 'data-service/largeScreen/transactionType',
      getAreaService: 'data-service/largeScreen/getAreaServiceStatistics', // 数据大屏区域出勤
      getOverallAttendance: 'data-service/largeScreen/getOverallAttendanceStatistics', // 数据大屏总体出勤
      getEventGroupByEventType: 'data-service/intelligentAnalysis/getEventGroupByEventType', // AI智能分析数据
      getAreaDataStatistics: 'data-service/largeScreen/getAreaDataStatistics', //数据大屏地图各区域数据统计
      eventHeatMap: 'data-service/largeScreen/eventHeatMap', //事件热力图
      getEventAggregation: 'data-service/eventAggregation/getEventAggregation '//查询事件聚合
    }
  },
  domainLogo: {
    //域名logo配置
    list: 'user-service/domainLogo/getSystemDomainLogo',
    listByPage: 'user-service/domainLogo/getSystemDomainLogoByPage',
    add: 'user-service/domainLogo/addSystemDomainLogo',
    del: 'user-service/domainLogo/delSystemDomainLogo',
    upd: 'user-service/domainLogo/updSystemDomainLogo',
    updEnableRolling: 'user-service/domainLogo/updEnableRollingMessage' // 滚动开关
  },
  systemIndex: {
    //首页设置 配置欢迎页图标
    add: 'user-service/orgLinkLogo/add',
    delete: 'user-service/orgLinkLogo/delete',
    get: 'user-service/orgLinkLogo/getDetail',
    getByOrgId: 'user-service/orgLinkLogo/getDetailByOrgId',
    list: 'user-service/orgLinkLogo/getList',
    update: 'user-service/orgLinkLogo/update'
  },
  record: {
    //记录留痕
    list: 'device-service/video/getVideoByPage'
  },
  operation: {
    // 运维管理
    list: 'open-service/thirdPartyAuth/getList', // 第三方管理信息列表
    add: 'open-service/thirdPartyAuth/add', // 第三方管理信息新增
    update: 'open-service/thirdPartyAuth/update', // 第三方管理更新数据
    delete: 'open-service/thirdPartyAuth/delete/'

  },
  supervise: {
    // 法律法规和权利清单
    getByType: 'user-service/systemConfig/getByType', // 获取法规类型
    add: 'user-service/statute/add', // 法规新增
    import: 'user-service/statute/import', // 导入法规地址
    list: 'user-service/statute/select', // 查询法规列表
    del: 'user-service/statute/delete', // 删除法规
    update: 'user-service/statute/update'
  }
}
