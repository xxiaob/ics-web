<template>
  <div class="jc-view-content">
    <div class="jc-task-item jc-task">
      <div class="jc-task-name">这里是任务名称</div>
    </div>
    <view-empty v-if="list.length < 1"></view-empty>
  </div>
</template>
<script>
import { getScreenData } from '@/api/screen'

export default {
  name: 'ScreenCommandGridDetailTask',
  props: ['options', 'project'],
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
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
<style lang="scss" scoped>
$jc-task-icon-width: 40px;
.jc-task-item {
  position: relative;
  background-color: #f7fbfe;
  margin: $jc-default-dis $jc-default-dis 0 $jc-default-dis;
  background-repeat: no-repeat;
  background-position: 10px 10px;
  background-size: $jc-task-icon-width auto;
  padding: $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis +
    $jc-task-icon-width;
  color: $jc-color-text-regular;
  @include jc-text-warp;
  &.jc-question {
    background-image: url(./assets/question.png);
  }
  &.jc-event {
    background-image: url(./assets/event.png);
  }
  &.jc-task {
    background-image: url(./assets/task.png);
  }
}
</style>
