<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-task-item" v-for="item in list" :key="item.id" :class="style[item.type]" @click="detail(item)">
      <div class="jc-info-title" v-text="item.title"></div>
      <div class="jc-info-item">组织：{{item.orgName}}</div>
      <template v-if="item.type == types.TASK">
        <div class="jc-info-item">任务类型：{{item.taskTypeName}}</div>
        <div class="jc-info-item">下发人：{{item.userName}}</div>
      </template>
      <div class="jc-info-item" v-else>上报人：{{item.userName}}</div>
      <div class="jc-info-item" v-if="item.type == types.EVENT">位置：{{item.positionName}}</div>
      <div class="jc-info-item" v-if="item.type == types.QUESTION">问题类型：{{item.problemTypeName}}</div>
      <div class="jc-info-item">{{item.time}}</div>
    </div>
    <view-empty v-if="list.length < 1"></view-empty>
  </div>
</template>
<script>
import { getScreenData } from '@/api/screen'
import { MESSAGE_TYPE } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'

export default {
  name: 'ScreenCommandUserDetailTask',
  props: ['options', 'project'],
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      loading: false,
      list: [],
      types: MESSAGE_TYPE,
      style: { [MESSAGE_TYPE.EVENT]: 'jc-event', [MESSAGE_TYPE.QUESTION]: 'jc-question', [MESSAGE_TYPE.TASK]: 'jc-task', [MESSAGE_TYPE.TEMPORARY]: 'jc-task' }
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
        let list = []

        let result = await getScreenData({ userId: this.options.userId, projectId: this.project.projectId })

        if (result.tasks && result.tasks.length) {
          //处理任务
          result.tasks.forEach(item => {
            list.push({ id: item.businessKey, type: MESSAGE_TYPE.TASK, title: item.taskName, taskTypeName: item.taskTypeName,
              userName: item.startUser, orgName: item.startOrg, time: formatDate(item.createTime) })
          })
        }
        if (result.events && result.events.length) {
          //处理事件
          result.events.forEach(item => {
            list.push({ id: item.id, type: MESSAGE_TYPE.EVENT, title: item.eventTitle, positionName: item.positionName,
              userName: item.reportUserName, orgName: item.orgName, time: formatDate(item.createTime) })
          })
        }
        if (result.problems && result.problems.length) {
          //处理问题
          result.problems.forEach(item => {
            list.push({ id: item.businessKey, type: MESSAGE_TYPE.QUESTION, title: item.problemTitle, problemTypeName: item.problemTypeName,
              userName: item.userName, orgName: item.orgName, time: formatDate(item.createTime) })
          })
        }
        this.list = list
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    detail(item) {
      this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: item }) //通知窗口改变
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-task-icon-width: 40px;
.jc-task-item {
  position: relative;
  background-color: #e4f3fe;
  margin: $jc-default-dis/2 $jc-default-dis/2 0 $jc-default-dis/2;
  background-repeat: no-repeat;
  background-position: 10px 10px;
  background-size: $jc-task-icon-width auto;
  padding: $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis +
    $jc-task-icon-width;
  color: $jc-color-info;
  font-size: $jc-font-size-small;

  &.jc-question {
    background-image: url(./assets/question.png);
  }
  &.jc-event {
    background-image: url(./assets/event.png);
  }
  &.jc-task {
    background-image: url(./assets/task.png);
  }
  .jc-info-title {
    color: $jc-color-text-regular;
    @include jc-text-warp;
  }
  .jc-flex-item {
    display: flex;
  }
  .jc-flex-info {
    flex: 1;
    @include jc-text-warp;
  }
  .jc-info-item {
    @include jc-text-warp;
  }
}
</style>
