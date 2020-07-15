<template>
  <div class="jc-map-warp jc-card" v-loading="loading" :class="{'jc-map-auto': type == 1, 'jc-map-custom': type == 2}">
    <div class="jc-title-warp">
      <div class="jc-title-sign">组织区域</div>
      <div class="jc-controll-warp" :class="{'jc-active': editShow}">
        <i class="jc-controll-item iconfont" :class="editShow ? 'iconchehui' : 'iconshezhi'" @click="changeWork(null)"></i>
        <i class="jc-controll-item iconfont iconkuaijieshezhi" title="快捷设置" @click="startArea(1)"></i>
        <i class="jc-controll-item iconfont iconSecondMenu-customize" title="自定义区域" @click="startArea(2)"></i>
      </div>
    </div>
    <div class="jc-map-space" ref="myMap"></div>
    <div class="jc-auto-area">
      <el-cascader v-model="editadcode" ref="myEditCascader" size="small" :show-all-levels="false" placeholder="请选择" :options="autoAreas" filterable :props="{ checkStrictly: true, emitPath: false }" @change="adCodeChange"></el-cascader>
    </div>
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-panel-area jc-panel-auto">
      <i class="jc-panel-item iconfont iconzu" title="保存设置" @click="manage"></i>
      <i class="jc-panel-item iconfont iconfuwei" title="重置" @click="autoAreaReset"></i>
    </div>
    <div class="jc-panel-area jc-panel-custom">
      <i class="jc-panel-item iconfont iconxinzengquyu" title="新增区域" @click="addArea"></i>
      <i class="jc-panel-item iconfont iconzu" title="保存设置" @click="manage"></i>
      <i class="jc-panel-item iconfont iconfuwei" title="重置" @click="customAreaReset"></i>
      <i class="jc-panel-item el-icon-view" title="查看父级" @click="showParentView"></i>
    </div>
  </div>
</template>
<script>
import { JcMap } from '@/map'
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import amapMixins from './modules/mixins/amapMixins'
import autoAreaMixins from './modules/mixins/autoAreaMixins'
import customAreaMixins from './modules/mixins/customAreaMixins'

let myJcMap //个人 map 对象

let noop = function () { } //空函数

export default {
  name: 'SystemOrganizationAreaManage',
  mixins: [amapMixins, autoAreaMixins, customAreaMixins],
  inject: ['registerManage', 'nodeChange'],
  components: {
    MapSearch: () => import('@/components/JcMap/MapSearch')
  },
  data() {
    return {
      loading: false,
      editShow: false,
      startEdit: false, //是否已经开始编辑
      areas: [], //基础区域数据
      editAreas: [], //编辑的区域数据
      type: '',
      orgId: '',
      orgPid: '', //记录组织父级id
      areaId: ''
    }
  },
  mounted() {
    myJcMap = new JcMap()
    this.registerManage(this.editCheck) //注册 编辑检查
  },
  methods: {
    async initData(data) {
      //设置组织id和父级组织id
      this.orgId = data.orgId
      this.orgPid = data.pid
      this.loading = true
      try {
        await myJcMap.init(this.$refs.myMap)//初始化地图
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索
        let res = await areaList({ orgId: this.orgId, orgSearchType: AREAS_TYPE.SAMELEVEL, searchType: AREAS_SEARCH_TYPE.ORG })

        this.adcode = ''
        this.areaId = ''
        this.drawSign(res, myJcMap) //去绘画边界
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    editCheck(cb = noop) {
      this.reset(() => {
        if (this.type == 1) {
          this.endAutoArea()
        } else {
          this.endCustomArea()
        }
        this.showActiveSign()
        myJcMap.fitView()
        this.type = ''
        this.editShow = false
        cb()
      })
    },
    changeWork(cb) {
      cb = cb || noop
      if (this.editShow) {
        this.editCheck(cb)
      } else {
        this.editShow = true
        cb()
      }
    },
    startArea(type) {
      if (type == this.type) {
        return
      }
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
    myJcMap = null
  }
}
</script>
<style src="./css/area.scss" lang="scss" scoped></style>
