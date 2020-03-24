/**返回接口api */
export default {
  //用户鉴权域
  AUTH: {
    login: 'sys/app/login', //登录接口
    checkLogin: 'rbacUser/checkLogin', //校验登录
    getBrand: 'reportManageCtr/getAllBrandInfoByUserId', //获取品牌
    getShop: 'reportManageCtr/getAllShopInfoByUserId', //获取店铺
    bind: 'notice/bind', //用户和设备绑定
    unbind: 'notice/unbind', //用户设备解绑
    recovery: 'rbacUser/pwd/recovery', //忘记密码
    sendMsg: 'rbacUser/sendMsg', //发送短信
    pwdChange: 'rbacUser/pwd/change' //修改密码
  }
}
