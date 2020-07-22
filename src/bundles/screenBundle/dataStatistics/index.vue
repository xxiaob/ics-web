<template>
  <section class="jc-screen-warp">
    <screen-header></screen-header>
    <div class="jc-screen-content">
      <data-docking class="jc-flex-con" :project="project"></data-docking>
      <chart-statistics class="jc-flex-con"></chart-statistics>
      <div class="jc-flex-con-2"></div>
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

export default {
  name: 'ScreenDataStatistics',
  components: { ScreenHeader, DataDocking, ChartStatistics },
  data() {
    return {
      project: { projectId: '', projectName: '', orgId: '', projectType: '' }
    }
  },
  mounted() {
    this.initData() //初始化基本内容
  },
  methods: {
    async initData() {
      
      if (this.$route.params.projectId) {
        //处理项目，如果项目id存在则获取项目详情
        let { projectId, projectName, orgId, projectType } = await projectGet(this.$route.params.projectId)

        this.project = { projectId, projectName, orgId, projectType }
      }

      console.log('emit-data-statistics-init-success')
      this.$EventBus.$emit('data-statistics-init-success', this.project) //通知基础数据初始化完成
    }
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>
<style lang="scss" scoped>
.jc-flex-con,
.jc-flex-con-2,
.jc-flex-con-3 {
  margin: 0 $jc-default-dis/2;
}
</style>
