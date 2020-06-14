<template>
  <el-dialog title="地图" :visible.sync="visible" width="800px" :close-on-click-modal="false" :append-to-body="true">
    <div class="jc-task-map">
      <map-user-marker v-model="position"></map-user-marker>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'ScreenCommandTemporaryTasks',
  components: {
    MapUserMarker: () => import('@/components/JcMap/MapUserMarker')
  },
  data() {
    return {
      visible: false,
      position: ''
    }
  },
  created() {
    this.$EventBus.$on('send-temporary-tasks', this.sendTemporaryTasks) //通知窗口发送临时任务
  },
  methods: {
    sendTemporaryTasks() {
      this.visible = true //发送临时任务
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('send-temporary-tasks', this.sendTemporaryTasks)
  }
}
</script>
<style lang="scss" scoped>
.jc-task-map {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
