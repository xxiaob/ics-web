<template>
  <div class="jc-map-warp jc-card" v-loading="loading" :class="{'jc-map-auto': type == 1, 'jc-map-custom': type == 2}">
    <div class="jc-title-warp">
      <div class="jc-title-sign">组织区域</div>
      <div class="jc-controll-warp" :class="{'jc-active': editShow}">
        <i class="jc-controll-item iconfont" :class="editShow ? 'iconchehui' : 'iconshezhi'" @click="changeWork"></i>
        <i class="jc-controll-item iconfont iconkuaijieshezhi" title="快捷设置" @click="startArea(1)"></i>
        <i class="jc-controll-item iconfont iconSecondMenu-customize" title="自定义区域" @click="startArea(2)"></i>
      </div>
    </div>
    <div class="jc-map-space" ref="myMap"></div>
    <div class="jc-auto-area">
      <el-select v-model="editadcode" placeholder="请选择" size="mini" @change="adCodeChange">
        <el-option v-for="item in autoAreas" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
      </el-select>
    </div>
    <div class="jc-panel-area jc-panel-auto">
      <i class="jc-panel-item iconfont iconzu" title="保存设置" @click="manage"></i>
      <i class="jc-panel-item iconfont iconfuwei" title="重置" @click="reset"></i>
    </div>
    <div class="jc-panel-area jc-panel-custom">
      <i class="jc-panel-item iconfont iconxinzengquyu" title="新增区域" @click="addArea"></i>
      <i class="jc-panel-item iconfont iconzu" title="保存设置" @click="manage"></i>
      <i class="jc-panel-item iconfont iconfuwei" title="重置" @click="reset"></i>
    </div>
  </div>
</template>
<script>
import JcMap from '@/maps'
import { areaList } from '@/api/area'
import { AREAS_TYPE } from '@/constant/CONST'
import amapMixins from './modules/mixins/amapMixins'
import autoAreaMixins from './modules/mixins/autoAreaMixins'
import customAreaMixins from './modules/mixins/customAreaMixins'

let myJcMap //个人 map 对象

export default {
  name: 'SystemOrganizationAreaManage',
  mixins: [amapMixins, autoAreaMixins, customAreaMixins],
  inject: ['registerManage', 'nodeChange'],
  data() {
    return {
      loading: false,
      editShow: false,
      startEdit: false, //是否已经开始编辑
      areas: [], //基础区域数据
      editAreas: [], //编辑的区域数据
      type: '',
      orgId: '',
      areaId: ''
    }
  },
  created() {
    myJcMap = new JcMap()
    this.registerManage(this.editCheck) //注册 编辑检查
  },
  methods: {
    initData(data) {
      this.orgId = data.orgId
      this.loading = true
      myJcMap.init({ source: this.$refs.myMap }).then(() => {
        areaList({ orgId: this.orgId, type: AREAS_TYPE.SAMELEVEL }).then(res => {
          this.adcode = ''
          this.drawPolygon(res, myJcMap) //去绘画边界
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    editCheck(cb) {
      if (this.startEdit) {
        this.$confirm('您有新的编辑数据，确认取消编辑', '提示', { type: 'warning' }).then(() => {
          // this.clearEditPolygons()
          this.editCheck(cb)
        }).catch(() => {})
      } else {
        this.reset()
        this.type = ''
        this.editShow = false
        cb()
      }
    },
    changeWork() {
      if (this.editShow) {
        this.editCheck()
      } else {
        this.editShow = true
      }
    },
    startArea(type) {
      //开始区域设置
      this.type = type
      if (type == 1) {
        this.initAutoArea(myJcMap)//快捷设置
      } else if (type == 2) {
        this.initCustomArea(myJcMap) //自定义设置
      }
    }
  },
  beforeDestroy() {
    myJcMap.destroy() //销毁地图
  }
}
</script>
<style src="./css/area.scss" lang="scss" scoped></style>
