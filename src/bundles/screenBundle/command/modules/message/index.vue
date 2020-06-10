<template>
  <div class="jc-screen-message">
    <transition-group name="jc-list" tag="div" class="jc-message-content">
      <div class="jc-message-item" v-for="(item,index) in list" :key="item.id" @click="manage(index,item)">
        <div class="jc-message-title jc-event">今天那里特别堵，我今天也在路边等了</div>
        <div class="jc-message-user">杨超</div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { getRandomNum } from '@/libs/util'
export default {
  name: 'ScreenCommandMessage',
  props: ['options'],
  data() {
    return {
      visible: true,
      index: 3,
      list: [{ id: 1, type: '1' }, { id: 2, type: '2' }]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {

    },
    manage(index, item) {
      if (index % 2) {
        this.list.splice(index, 1)
      } else {
        let addList = []

        for (let i = 1; i < getRandomNum(2, 6); i++) {
          addList.splice(0, 0, { id: this.index++, type: i % 3 })
        }
        this.list = [...addList, ...this.list]
      }
    }
  },
  activated() {
    //设置该窗口显示
    this.visible = true
    console.log('ScreenCommandMessage activated')
  },
  deactivated() {
    //设置该窗口隐藏,然后开始新消息数量通知
    this.visible = false
    console.log('ScreenCommandMessage deactivated')
  }
}
</script>
