<template>
  <section class="jc-screen-warp no-select">
    <!-- 大屏头部 -->
    <screen-header></screen-header>
    <div class="jc-screen-content">
      <!-- 最右侧数据显示，如果是常态则显示，应急和专项则不显示 -->
      <data-docking class="jc-flex-con" v-if="!project.projectId"></data-docking>
      <chart-statistics class="jc-flex-con"></chart-statistics>
      <!-- 中间区域内容 -->
      <center-content class="jc-flex-con-2"></center-content>
      <div class="jc-flex-con"></div>
      <div class="jc-flex-con"></div>
    </div>
  </section>
</template>
<script>
import { projectGet } from '@/api/projects'
import ScreenHeader from './modules/header' //顶部header
import DataDocking from './modules/dataDocking' //最左侧，数据对接，在应急和专项大屏不显示
import ChartStatistics from './modules/chartStatistics' //信息累计、下辖区域占比、事务类型占比
import CenterContent from './modules/centerContent' //中间展示和交互区域

export default {
  name: 'ScreenDataStatistics',
  components: { ScreenHeader, DataDocking, CenterContent, ChartStatistics },
  data() {
    return {
      project: { projectId: this.$route.params.projectId || '', projectName: '', orgId: '', projectType: '' }
    }
  },
  mounted() {
    this.initData() //初始化基本内容
  },
  methods: {
    async initData() {
      if (this.project.projectId) {

        //处理项目，如果项目id存在则获取项目详情
        let { projectId, projectName, orgId, projectType } = await projectGet(this.project.projectId)

        this.project = { projectId, projectName, orgId, projectType }
      }

      console.log('emit-data-statistics-init-success')
      this.$EventBus.$emit('data-statistics-init-success', this.project) //通知基础数据初始化完成
    }
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>
