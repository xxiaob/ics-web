<template>
  <div class="jc-map-warp jc-card" v-loading="loading">
    <div class="jc-title-warp">
      <div class="jc-title-sign">组织区域</div>
      <div class="jc-controll-warp" :class="{'jc-active': edit}">
        <i class="jc-controll-item iconfont" :class="edit ? 'iconchehui' : 'iconshezhi'" @click="changeWork"></i>
        <i class="jc-controll-item iconfont iconkuaijieshezhi" title="快捷设置" @click="startArea(1)"></i>
        <i class="jc-controll-item iconfont iconSecondMenu-customize" title="自定义区域" @click="startArea(2)"></i>
      </div>
    </div>
    <auto-area ref="autoArea" :visible="edit && type == 1"></auto-area>
    <custom-area ref="customArea" :visible="edit && type" :type="type"></custom-area>
    <div class="jc-map-space" ref="myMap"></div>
  </div>
</template>
<script>
import JcMapUtils from '@/libs/JcMapUtil'
import { MapOptions } from '@/config/JcMapConfig'
import { areaList } from '@/api/area'
import amapMixins from './modules/mixins/amapMixins'

export default {
  name: 'SystemOrganizationAreaManage',
  mixins: [amapMixins],
  components: {
    AutoArea: () => import('./modules/autoArea'),
    CustomArea: () => import('./modules/customArea')
  },
  data() {
    return {
      loading: false,
      edit: false,
      type: '',
      orgId: '',
      adcode: ''
    }
  },
  methods: {
    initData(data) {
      this.orgId = data.orgId
      this.loading = true
      if (JcMapUtils.map) {
        areaList({ orgId: this.orgId }).then(res => {
          this.adcode = ''
          this.drawPolygon(res, JcMapUtils) //去绘画边界
          this.loading = false
        })
      } else {
        JcMapUtils.init({ ...MapOptions, source: this.$refs.myMap }, () => {
          this.initData(data)
        })
      }
    },
    changeWork() {
      if (this.edit) {
        //编辑状态，则进行必要的关闭处理
        this.type = ''
      }
      this.edit = !this.edit
    },
    startArea(type) {
      //开始区域设置
      this.type = type
      if (type == 1) {
        //快捷设置
        this.$refs.autoArea.initData(JcMapUtils, this.adcode)
      } else if (type == 2) {
        //自定义设置
      }
    }
  },
  beforeDestroy() {
    JcMapUtils.destroy() //销毁地图
  }
}
</script>
<style lang="scss" scoped>
$jc-map-header-height: 40px; //map header高度
.jc-map-warp {
  position: relative;
  overflow: hidden;
}
.jc-title-warp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  height: $jc-map-header-height;
  line-height: $jc-map-header-height;
  padding-left: $jc-default-dis;
  background-color: $jc-color-white;
}
.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}
.jc-controll-warp {
  position: absolute;
  right: 0;
  top: 0;
  width: $jc-map-header-height;
  background-color: $jc-color-white;
  height: $jc-map-header-height;
  overflow: hidden;
  transition: height 0.3s;
  will-change: height;
  &.jc-active {
    height: $jc-map-header-height * 3;
  }
  .jc-controll-item {
    display: block;
    text-align: center;
    width: 100%;
    cursor: pointer;
    height: $jc-map-header-height;
    &:hover,
    &.jc-active {
      color: $jc-color-primary;
    }
  }
}
</style>
