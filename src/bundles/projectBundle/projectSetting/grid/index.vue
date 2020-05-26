<template>
  <div class="jc-map-warp jc-card" :class="{'jc-map-show': visible}">
    <div class="jc-title-warp">
      <div class="jc-title-sign">
        {{options.projectName}} - 网格设置
        <i class="jc-back iconfont iconchehui" @click="goBack" title="返回"></i>
        <div class="jc-edit-tip" v-if="areaId">正在编辑：<span class="jc-link" v-text="areaName"></span></div>
      </div>
    </div>
    <map-search ref="mapSearch"></map-search>
    <div class="jc-map-space" ref="myMap"></div>
    <manage-trees class="jc-trees-warp" ref="myManageTree" @grid-change="gridChange"></manage-trees>
    <div class="jc-panel-area" :class="{'jc-area-show': editShow}">
      <i class="jc-panel-item iconfont iconduobianxing" title="多边形" @click="addArea(1)"></i>
      <i class="jc-panel-item iconfont iconhuayuan" title="圆" @click="addArea(2)"></i>
      <i class="jc-panel-item iconfont iconhuaxian" title="线路" @click="addArea(3)"></i>
      <i class="jc-panel-item iconfont iconzu" title="保存设置" @click="areaSave"></i>
      <i class="jc-panel-item iconfont iconfuwei" title="重置" @click="reset"></i>
      <i class="jc-panel-item iconfont iconchehui1" title="取消" @click="cancel"></i>
    </div>
  </div>
</template>
<script>
import { JcMap } from '@/map'
import MapSearch from '@/components/JcMap/MapSearch'
import GridChangeMixins from './modules/minxins/gridChangeMixins'
import AreaManageMinxins from './modules/minxins/areaManageMinxins'

let myJcMap //个人 map 对象

export default {
  name: 'ProjectsProjectSettingGridIndex',
  mixins: [GridChangeMixins, AreaManageMinxins],
  props: ['options', 'visible'],
  components: {
    MapSearch,
    ManageTrees: () => import('./modules/manageTrees')
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initData()
      }
    }
  },
  methods: {
    initData() {
      this.$refs.myManageTree.initData(this.options)
      if (!myJcMap) {
        myJcMap = new JcMap()
      }
      myJcMap.init(this.$refs.myMap).then(() => {
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
      })
    },
    gridChange(options) {
      if (options.type == 'view') {
        //处理区域显示隐藏，如果当前区域正在编辑，则不处理
        if (this.editShow && this.areaId == options.data.id) {
          this.$message.error('该网格您正在编辑中')
        } else {
          this.viewControl(myJcMap, options).then(() => {
            myJcMap.fitView()
          })
        }
      } else if (options.type == 'fitview') {
        this.fitView(options.data.id) //定位显示区域
      } else if (options.type == 'refreshsign') {
        //在区域编辑保存后刷新区域显示
        this.getSign(myJcMap, options.data.id, true).then(sign => {
          if (options.data.view) {
            sign.show()
          }
        })
      } else if (options.type == 'deletesign') {
        this.deleteSign(options.data) //删除标记
      } else if (options.type == 'areaedit') {
        if (this.editShow) {
          //如果需要编辑的区域是当前正在编辑的区域，则取消编辑
          if (this.areaId == options.data.id) {
            this.cancel() //取消区域编辑
          } else {
            this.$message.error('有网格正在编辑中，请先取消编辑')
          }
        } else {
          options.data.view = true
          this.initMapEditor(myJcMap, options.data)
        }
      }
    },
    goBack() {
      this.statusCheck(() => {
        this.$emit('update:visible', false)
      })
    }
  },
  beforeDestroy() {
    if (myJcMap) {
      myJcMap.destroy() //销毁地图
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-map-header-height: 40px; //map header高度

.jc-map-warp {
  position: absolute;
  top: $jc-default-dis;
  left: $jc-default-dis;
  right: $jc-default-dis;
  bottom: $jc-default-dis;
  min-width: $jc-min-width;
  min-height: $jc-min-height;
  overflow: hidden;
  opacity: 0;
  z-index: 1;
  transform: scale(0.01);
  transition: all 0.4s;
  &.jc-map-show {
    opacity: 1;
    z-index: 8;
    transform: scale(1);
  }
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
  .jc-edit-tip {
    display: block;
    padding-right: $jc-default-dis;
    float: right;
  }
  .jc-back {
    display: block;
    float: right;
    width: $jc-map-header-height;
    background-color: $jc-color-white;
    height: $jc-map-header-height;
    cursor: pointer;

    &:hover,
    &.jc-active {
      color: $jc-color-primary;
    }
  }
}

.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}

$jc-item-width: 36px;

.jc-panel-area {
  position: absolute;
  bottom: 0;
  left: 50%;
  margin: 0 auto;
  z-index: 8;
  padding: 0 6px;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  text-align: center;
  transform: translate(-50%, 100%);
  opacity: 0;
  transition: transform 0.4s, opacity 0.4s;

  &.jc-area-show {
    z-index: 9;
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.jc-panel-item {
  display: inline-block;
  vertical-align: middle;
  width: $jc-item-width;
  height: $jc-item-width;
  line-height: $jc-item-width;
  color: $jc-color-white;
  cursor: pointer;
  font-size: $jc-font-size-base;
  transition: font-size 0.3s;
  will-change: font-size;

  &:hover,
  &.jc-active {
    font-size: $jc-font-size-larger;
  }
}
.jc-trees-warp {
  top: $jc-map-header-height + $jc-default-dis;
}
</style>
