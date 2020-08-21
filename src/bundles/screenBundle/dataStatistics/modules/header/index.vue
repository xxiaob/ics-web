<template>
  <div class="jc-screen-header">
    <div class="jc-screen-title" :class="{'jc-title-short': title.length < 16}" :text="title" v-text="title" @dblclick="changeWindowSize"></div>
  </div>
</template>
<script>
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { getUser } from '@/libs/storage'

export default {
  name: 'ScreenDataStatisticsHeader',
  data() {
    return {
      title: '--',
      project: null,
      autoSetSize: true
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-init-success', this.initData) //监听基础数据初始化完成
  },
  methods: {
    initData(project) {
      this.project = project
      //处理标题显示
      if (PROJECT_TYPES.SpecialControl == this.project.projectType) {
        this.title = `${this.project.projectName}数据大屏`
      } else {
        let user = getUser()

        if (user && user.userRespInnerDTO && user.userRespInnerDTO.dataScreenLogo) {
          this.title = user.userRespInnerDTO.dataScreenLogo
        } else {
          this.title = `${this.project.projectName}常态数据大屏`
        }
      }
    },
    changeWindowSize() {
      this.autoSetSize = !this.autoSetSize
      this.$emit('window-size-change', this.autoSetSize)
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('data-statistics-init-success', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-screen-header {
  position: relative;
  width: 100%;
  height: 160px;
  background: url(./assets/header-bg.png) no-repeat center;
  background-size: auto 100%;
}
.jc-screen-title {
  position: relative;
  text-align: center;
  color: $jc-color-white;
  font-weight: bold;
  line-height: 86px;
  font-size: 50px;
  letter-spacing: 2px;
  text-shadow: #007eff 0 0 12px;
  &.jc-title-short {
    letter-spacing: 10px;
    font-size: 52px;
  }
  &:before {
    content: attr(text);
    position: absolute;
    z-index: 10;
    color: #a4bfff;
    -webkit-mask: linear-gradient(transparent, transparent, #a4bfff);
  }
}
</style>
