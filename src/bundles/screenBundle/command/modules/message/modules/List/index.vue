<template>
  <transition-group name="jc-list" tag="div" class="jc-message-content">
    <div class="jc-task-item" v-for="item in list" :key="item.id" :class="style[item.type]" @click.stop="detail(item)">
      <div class="jc-info-title">
        <span v-text="item.title"></span>
        <span class="jc-right">
          <span v-if="item.todo" class="jc-right-todo" @click.stop="changeTodo(item,false)" title="从待办信息中移除">非待办</span>
          <span v-else class="jc-right-notodo" @click.stop="changeTodo(item,true)" title="添加到待办信息">+ 待办</span>
          <!-- <el-switch v-model="item.todo" @click.stop.native @change="changeTodo(item)"></el-switch> -->
        </span>
      </div>
      <div class="jc-info-item">组织：{{item.orgName}}</div>
      <template v-if="item.type == types.TEMPORARY">
        <div class="jc-info-item">下发人：{{item.userName}}</div>
        <div class="jc-info-item">任务来源：{{item.typeName}}</div>
      </template>
      <template v-else-if="item.type == types.ALARM">
        <div class="jc-info-item">车牌号：{{item.userName}}</div>
        <div class="jc-info-item">告警类型：{{item.typeName}}</div>
      </template>
      <div class="jc-info-item" v-else-if="item.type == types.SELFALARM">地点：{{item.position}}</div>
      <div class="jc-info-item" v-else>上报人：{{item.userName}}</div>
      <div class="jc-info-item" v-if="item.type == types.QUESTION">问题类型：{{item.typeName}}</div>
      <div class="jc-info-item" v-else-if="item.type == types.EVENT">事件类型：{{item.typeName}}</div>
      <div class="jc-info-item">时间：{{item.time}}</div>
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
      style: {
        [MESSAGE_TYPE.EVENT]: 'jc-event',
        [MESSAGE_TYPE.QUESTION]: 'jc-question',
        [MESSAGE_TYPE.ALARM]: 'jc-question',
        [MESSAGE_TYPE.TASK]: 'jc-task',
        [MESSAGE_TYPE.TEMPORARY]: 'jc-task'
      }
    }
  },
  methods: {
    detail(item) {
      this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: item }) //通知窗口改变
      if (item.type == MESSAGE_TYPE.SELFALARM) {
        console.log('在地图上定位告警位置')
        // 告警类型
        if (item.warnType == 'grid') {
          // 岗点
          this.$emit('screen-grid-location', { id: '', areaTypeId: '' })
        } else if (item.warnType == 'user') {
          //用户
          this.$emit('screen-user-location', { id: '' })
        }
      }
    },
    changeTodo(item, todo) {
      item.todo = todo
      this.$nextTick(()=>{
        this.$emit('todoChange', item)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-task-icon-width: 60px;
.jc-task-item {
  position: relative;
  // background-color: #e4f3fe;
  border-bottom: 1px solid #eeeeee;
  margin: $jc-default-dis/2 $jc-default-dis/2 0 $jc-default-dis/2;
  background-repeat: no-repeat;
  background-position: 10px 10px;
  background-size: $jc-task-icon-width auto;
  padding: $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis +
    $jc-task-icon-width+10px;
  color: $jc-color-info;
  font-size: 12px;

  .jc-right {
    float: right;

    .jc-right-todo,.jc-right-notodo{
      display: inline-block;
      text-align: center;
      width: 60px;
      height: 26px;
      line-height: 24px;
      cursor: pointer;
      border: 1px solid #DADDE4;
      border-radius: 1px;
    }
    .jc-right-notodo{
      background: #409EFF;
      color: white;
    }
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
    color: #333333;
    font-size: 14px;
    margin-bottom: 5px;
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
