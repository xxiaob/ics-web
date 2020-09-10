<template>
  <transition-group name="jc-list" tag="div" class="jc-message-content">
    <div class="jc-task-item" v-for="item in list" :key="item.id" :class="style[item.type]" @click.stop="detail(item)">
      <div class="jc-info-title">
        <span v-text="item.title"></span>
        <span class="jc-right">
          <span>代办</span>
          <el-switch v-model="item.todo" @click.stop.native @change="changeTodo(item)"></el-switch>
        </span>
      </div>
      <div class="jc-info-item">组织：{{item.orgName}}</div>
      <template v-if="item.type == types.TEMPORARY">
        <div class="jc-info-item">下发人：{{item.userName}}</div>
        <div class="jc-info-item">任务来源：{{item.typeName}}</div>
      </template>
      <div class="jc-info-item" v-else>上报人：{{item.userName}}</div>
      <div class="jc-info-item" v-if="item.type == types.QUESTION">问题类型：{{item.typeName}}</div>
      <div class="jc-info-item" v-else-if="item.type == types.EVENT">事件类型：{{item.typeName}}</div>
      <div class="jc-info-item">{{item.time}}</div>
    </div>
    <view-empty v-if="list.length < 1" key="0"></view-empty>
  </transition-group>
</template>
<script>
import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessageList',
  props: {
    list: {
      type: Array,
      default: ()=>[]
    }
  },
  components: {
    ViewEmpty: () => import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      types: MESSAGE_TYPE,
      style: { [MESSAGE_TYPE.EVENT]: 'jc-event', [MESSAGE_TYPE.QUESTION]: 'jc-question', [MESSAGE_TYPE.TASK]: 'jc-task', [MESSAGE_TYPE.TEMPORARY]: 'jc-task' }
    }
  },
  methods: {
    detail(item) {
      this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: item }) //通知窗口改变
    },
    changeTodo(item) {
      this.$nextTick(()=>{
        this.$emit('todoChange', item)
      })
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

  .jc-right {
    float: right;
  }

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
