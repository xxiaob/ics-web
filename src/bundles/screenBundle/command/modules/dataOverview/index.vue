<template>
  <div class="jc-overview" :class="{'jc-active': viewShow}">
    <i class="jc-overview-icon" @click="changeViewShow"></i>
    <div class="jc-overview-contant" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="jc-overview-header">指挥层级概览
        <div class="jc-close el-icon-close" @click.stop="viewShow = false"></div>
      </div>
      <div class="jc-content">
        <div class="jc-content-item">组织名称</div>
        <div class="jc-content-item">在线人数</div>
        <div class="jc-content-item">巡逻里程</div>
        <div class="jc-content-item">事件数量</div>
        <div class="jc-content-item">问题数量</div>
      </div>
      <div class="jc-content-warp">
        <div class="jc-content" v-for="item in list" :key="item.orgId">
          <div class="jc-content-item" v-text="item.orgName" :title="item.orgName"></div>
          <div class="jc-content-item jc-num">{{item.online || 0}}<span class="jc-unit">人</span></div>
          <div class="jc-content-item jc-num">{{item.patrolMileage || 0}}<span class="jc-unit">KM</span></div>
          <div class="jc-content-item jc-num">{{item.eventNbr}}<span class="jc-unit">件</span></div>
          <div class="jc-content-item jc-num">{{item.problemNbr}}<span class="jc-unit">件</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCommandScreenData } from '@/api/screen'

export default {
  name: 'ScreenCommandDataOverview',
  props: ['project'],
  data() {
    return {
      viewShow: true,
      loading: false,
      list: [],
      org: null,
      interval: null
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.initData) //监听行级别切换
    this.interval = setInterval(this.initData, 1000 * 60 * 0.5) //定时进行数据轮询
    this.$EventBus.$on('close-overview', this.closeViewShow) //监听当前弹框关闭
  },
  methods: {
    closeViewShow() {
      this.viewShow = false
    },
    changeViewShow() {
      this.viewShow = !this.viewShow
      this.$EventBus.$emit('view-component-close') //通知右侧弹框关闭
    },
    async initData(org) {
      if (org) {
        this.org = org
        this.loading = true
      }
      if (!this.org) {
        return
      }

      try {
        let result = await getCommandScreenData({ orgId: this.org.orgId, projectId: this.project.projectId || this.$route.params.projectId || '' })

        let list = []

        if (result && result.length) {
          result.forEach(item => {
            if (item.orgId == this.org.orgId) {
              list.splice(0, 0, item)
            } else {
              list.push(item)
            }
          })
        }
        this.list = list
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
    //去除事件监听
    this.$EventBus.$off('org-change', this.initData)
    this.$EventBus.$off('close-overview', this.closeViewShow)
  }
}
</script>
<style lang="scss" scoped>
$jc-screen-color: #142c79; //大屏颜色
$jc-overview-color: #3783fb;
.jc-overview {
  position: absolute;
  width: 40px;
  height: 40px;
  right: $jc-default-dis;
  bottom: $jc-default-dis;
  z-index: 8;
  cursor: pointer;
  overflow: hidden;
  transform: translateZ(0);
  transition: width 0.3s, height 0.3s;

  .jc-overview-icon {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 0;
    bottom: 0;
    background: url(./assets/bg.png) no-repeat left bottom;
    background-size: 100% 100%;
    z-index: 5;
    opacity: 1;
    transition: opacity 0.4s;
  }
  .jc-overview-contant {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 640px;
    height: 320px;
    opacity: 0;
    // padding: $jc-default-dis/2;
    background-color: $jc-color-white;
    transition: opacity 0.4s;
  }
  &.jc-active {
    width: 640px;
    height: 320px;
    .jc-overview-contant {
      opacity: 1;
    }
    .jc-overview-icon {
      opacity: 0.2;
    }
  }
  .jc-overview-header {
    position: relative;
    height: 30px;
    line-height: 30px;
    color: $jc-color-white;
    background-color: $jc-screen-color;
    padding-left: $jc-default-dis;
    .jc-close {
      position: absolute;
      top: 2px;
      right: 0;
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      overflow: hidden;
      border-radius: 50%;
      text-indent: 0;
      // color: $jc-color-white;
      font-size: $jc-font-size-smaller;
      @include jc-close-animation;
    }
  }
}
.jc-content-warp {
  height: 250px;
  overflow: auto;
  padding: 0 $jc-default-dis/2;
}
.jc-content {
  display: flex;
  height: 30px;
  line-height: 30px;
  padding: 0 $jc-default-dis/2;
  &:nth-child(odd) {
    background-color: rgba($color: #6879f2, $alpha: 0.05);
  }
}
.jc-content-item {
  text-align: center;
  flex: 1;
  width: 0;
  @include jc-text-warp;
  font-size: $jc-font-size-smaller;
  color: $jc-color-text-secondary;
}
.jc-num {
  font-size: $jc-font-size-base;
  color: $jc-overview-color;
  .jc-unit {
    font-size: $jc-font-size-smaller;
  }
}
</style>
