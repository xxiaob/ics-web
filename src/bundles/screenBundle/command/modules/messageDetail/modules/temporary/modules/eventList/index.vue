<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">

    <div class="jc-event-item" v-for="item in list" :key="item.id" @click="detail(item)">
      <div class="jc-info-title" v-text="item.eventTitle"></div>
      <div class="jc-info-item">组织：{{item.orgName}}</div>
      <div class="jc-info-item">上报人：{{item.reportUserName}}</div>
      <div class="jc-info-item">位置：{{item.positionName}}</div>
      <div class="jc-info-item">事件类型：{{item.typeName}}</div>
      <div class="jc-info-item">{{item.createTime}}</div>
    </div>

    <view-empty v-if="list.length === 0"></view-empty>

  </div>
</template>

<script>
import { eventManageListByTask } from '@/api/eventManage'
import { formatDate } from '@/libs/util'
import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessageDetailTemporaryEvent',
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      list: [],
      loading: false
    }
  },
  watch: {
    taskId(newValue) {
      if (newValue) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    async initData() {
      if (!this.loading && this.taskId) {
        this.loading = true
        try {
          const resultList = await eventManageListByTask(this.taskId)
          const list = []

          if (resultList && resultList.length > 0) {
            resultList.forEach(item=>{
              list.push({
                createTime: formatDate(item.createTime),
                eventTitle: item.eventTitle,
                typeName: item.typeName,
                id: item.id,
                orgName: item.orgName,
                positionName: item.positionName,
                reportUserName: item.reportUserName
              })
            })
          }
          this.list = list
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    detail(item) {
      this.$EventBus.$emit('view-component-change', {
        component: 'MessageDetail',
        options: { ...item, type: MESSAGE_TYPE.EVENT }
      }) //通知窗口改变
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-task-icon-width: 40px;
.jc-event-item {
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
  background-image: url(./assets/event.png);

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
