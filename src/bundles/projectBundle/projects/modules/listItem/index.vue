<template>
  <div class="jc-project-item" :class="getItemClass(item.projectType)">
    <div class="jc-title-warp">
      <div class="jc-title" v-text="item.projectName"></div>
      <i class="jc-setting el-icon-setting" @click="$emit('manage')"></i>
    </div>
    <div class="jc-project-screen">
      <div class="jc-screen jc-screen-command">指挥大屏</div>
      <div class="jc-screen jc-screen-data">数据大屏</div>
    </div>
    <div class="jc-project-footer">
      <div class="jc-project-info" :class="projectSC">
        <div class="jc-info-item"><i class="iconfont iconmingchengguanliqi"></i>{{item.orgName}}</div>
        <div class="jc-info-item"><i class="iconfont iconshijian1"></i>{{projectTime}}</div>
      </div>
      <div class="jc-project-opera">
        <div class="jc-opera-item first" @click="operaChange('resource-setting')"><i class="iconfont icontoufangziyuanshezhi"></i>资源设置</div>
        <div class="jc-opera-item second" @click="operaChange('grid-setting')"><i class="iconfont iconwanggeshezhi"></i>网格设置</div>
        <div class="jc-opera-item three"><i class="iconfont icontongjifenxi"></i>统计分析</div>
        <div class="jc-opera-item four" @click="del"><i class="iconfont iconlujing"></i>删除项目</div>
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
    }
  }
}
</script>
