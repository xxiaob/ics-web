<template>
  <div class="jc-view-content">
    <div class="jc-task-item"></div>
  </div>
</template>
<script>
import { getScreenData } from '@/api/screen'

export default {
  name: 'ScreenCommandGridDetailTask',
  props: ['options', 'project'],
  data() {
    return {
      loading: false,
      list: []
    }
  },
  watch: {
    options() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      this.list = []
      try {
        let result = await getScreenData({ areaId: this.options.areaId, projectId: this.project.projectId })

        if (result.tasks && result.tasks.length) {
          //处理任务
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
