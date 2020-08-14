/**
 * 事件热力混入
 */
let myJcMap, AMap //个人 map 对象,存储Amap对象,存储3D图层，存储点标记

export default {
  data() {
    return {

    }
  },
  methods: {
    initEventHotMap() {
      myJcMap = this.getMyJcMap()
      AMap = this.getAMap()
    },
    hideEventHotMap() {

    }
  }
}
