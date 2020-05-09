<template>
  <div class="jc-map-warp jc-card" v-loading="loading">
    <div class="jc-title-warp">
      <div class="jc-title-sign">组织区域</div>
    </div>
    <div class="jc-map-space" ref="myMap"></div>
  </div>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'SystemGridIndex',
  components: {
    MapSearch: () => import('@/components/JcMap/MapSearch')
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    myJcMap = new JcMap()
  },
  methods: {

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

$jc-item-width: 36px;

.jc-auto-area {
  position: absolute;
  top: 50px;
  left: $jc-default-dis;
  z-index: 8;
  opacity: 0.6;
  transform: translateY(-150%);
  transition: transform 0.4s, opacity 0.4s;

  .el-cascader {
    width: 120px;
  }
}

.jc-area-search {
  opacity: 0.6;
  transform: translateX(-80px);
  transition: transform 0.4s, opacity 0.4s;
}

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
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.jc-map-auto {
  .jc-auto-area {
    opacity: 1;
    transform: translateY(0);
  }

  .jc-panel-auto {
    z-index: 9;
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.jc-map-custom {
  .jc-panel-custom {
    z-index: 9;
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .jc-area-search {
    opacity: 1;
    transform: translateX(0);
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

  &:hover,
  &.jc-active {
    color: $jc-color-primary;
  }
}
</style>
