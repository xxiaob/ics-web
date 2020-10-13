<template>
  <div class="jc-project-item" :class="getItemClass(item.projectType)">
    <div class="jc-title-warp">
      <div class="jc-title" v-text="item.projectName"></div>
      <i class="iconfont iconlujing jc-del" @click="del"></i>
      <i class="jc-setting el-icon-setting" @click="$emit('manage')"></i>
      <i class="jc-play el-icon-video-play" title="立即开始" @click="start" v-show="projectSC=='jc-not-start'"></i>
      <i class="jc-play el-icon-video-pause" title="立即关闭" @click="stop" v-show="projectSC=='jc-running'"></i>
      <i class="jc-play el-icon-finished" title="已结束" v-show="projectSC=='jc-finished'"></i>
    </div>
    <div class="jc-project-screen">
      <router-link :to="{name: 'commandProjectScreen', params: {projectId: this.item.projectId}}" class="jc-screen jc-screen-command" target="_blank">指挥大屏</router-link>
      <router-link :to="{name: 'dataProjectScreen', params: {projectId: this.item.projectId}}" class="jc-screen jc-screen-data" target="_blank">数据大屏</router-link>
    </div>
    <div class="jc-project-footer">
      <div class="jc-project-info" :class="projectSC">
        <div class="jc-info-item"><i class="iconfont iconmingchengguanliqi"></i>{{item.orgName}}</div>
        <div class="jc-info-item"><i class="iconfont iconshijian1"></i>{{projectTime}}</div>
      </div>
      <div class="jc-project-opera">
        <div class="jc-opera-item first" :class="projectSC" @click="operaChange('resource-setting')"><i class="iconfont icontoufangziyuanshezhi"></i>资源设置</div>
        <div class="jc-opera-item second" :class="projectSC" @click="operaChange('daily-task')"><i class="iconfont iconrichangrenwushezhi"></i>日常任务设置</div>
        <div class="jc-opera-item three" :class="projectSC" @click="operaChange('grid-setting')"><i class="iconfont iconwanggeshezhi"></i>网格设置</div>
        <router-link :to="{name: 'taskSearch', query: {projectId: item.projectId,type:'1'}}" class="jc-opera-item four" :class="projectSC" target="_blank"><i class="iconfont iconrichangrenwuchaxun"></i>日常任务查询</router-link>
        <!-- <div class="jc-opera-item three"><i class="iconfont icontongjifenxi"></i>统计分析</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { projectsDel } from '@/api/projects'
import { formatDate } from '@/libs/util'

export default {
  name: 'ProjectProjectsListItem',
  props: ['item'],
  computed: {
    projectTime() {
      return formatDate(this.item.beginTime, true) + ' ~ ' + formatDate(this.item.endTime, true)
    },
    projectSC() {
      let startTime = new Date(this.item.beginTime).getTime()

      let nowTime = new Date().getTime()

      if (startTime > nowTime) {
        return 'jc-not-start'
      }
      let endTime = new Date(this.item.endTime).getTime()

      if (nowTime > endTime) {
        return 'jc-finished'
      }
      return 'jc-running'
    }
  },
  methods: {
    getItemClass(projectType) {
      let types = new Map([[PROJECT_TYPES.EmergencySupport, 'jc-project-es'], [PROJECT_TYPES.SpecialControl, 'jc-project-sc']])

      return types.get(projectType + '') || ''
    },
    operaChange(opera) {
      this.$emit('opera-change', { opera, data: this.item })
    },
    async del() {
      try {
        await this.$confirm('确认删除该项目', '提示', { type: 'warning' })
        await projectsDel(this.item.projectId)
        this.$message.success('删除成功')
        this.operaChange('delete-success')
      } catch (error) {
        console.log(error)
      }
    },
    async start() {
      try {
        await this.$confirm('确认立即开始该项目', '提示', { type: 'warning' })
        console.log('start')
      } catch (error) {
        console.log(error)
      }
    },
    async stop() {
      try {
        await this.$confirm('确认立即关闭该项目', '提示', { type: 'warning' })
        console.log('stop')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
