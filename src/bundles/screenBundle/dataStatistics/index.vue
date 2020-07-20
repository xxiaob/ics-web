<template>
  <section class="jc-screen-warp">
    <screen-header></screen-header>
    <div class="jc-screen-content">

    </div>
  </section>
</template>
<script>
import { projectGet } from '@/api/projects'
import ScreenHeader from './modules/header' //顶部header

export default {
  name: 'ScreenDataStatistics',
  components: { ScreenHeader },
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
    }
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>
