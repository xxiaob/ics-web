<template>
  <div class="jc-screen-opreate no-select">
    <div class="jc-opreate-item">
      <i class="jc-select" title="框选"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-area"></i>
      <div class="jc-opera-work">
        <el-checkbox-group v-model="areaType" @change="areaChange">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-word"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-together"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-temporary-tasks"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-map-switch"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-message" @click="messageChange('CommandMessage')"></i>
      <span class="jc-num-tip" v-if="messageVal > 0" v-text="messageVal < 100 ? messageVal : '99'"></span>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-talk" @click="messageChange('ImTalk')"></i>
      <span class="jc-num-tip" v-if="talkVal > 0" v-text="talkVal < 100 ? talkVal : '99'"></span>
    </div>
  </div>
</template>
<script>
import { areaTypeList } from '@/api/areaType'
import { JcIcons } from '@/config/JcIconConfig'

export default {
  name: 'ScreenCommandOperate',
  data() {
    return {
      messageVal: 99,
      talkVal: 99,
      areaTypes: [], //存储所有 网格类型数组
      areaType: [], //选择显示区域范围的类型
      wordType: [] //存储选择显示文字的网格类型
    }
  },
  created() {
    this.initData() //初始化基础数据
  },
  methods: {
    async initData() {
      try {
        let areaResults = await areaTypeList({})

        let areaTypes = []

        if (areaResults && areaResults.length) {
          areaResults.forEach(item => {
            areaTypes.push({ id: item.areaTypeId, name: item.areaTypeName, icon: item.icon })
          })
        }
        this.areaTypes = areaTypes
      } catch (error) {
        console.log(error)
      }
    },
    getIconStyle(icon) {
      let useIcon = JcIcons[icon] || {}

      return `background-image: url(${useIcon.icon || ''});`
    },
    messageChange(name) {
      this.$EventBus.$emit('message-component-change', { component: name, options: null }) //通知窗口改变
    },
    areaChange() {
      //网格显示切换
    },
    wordChange() {
      //文字显示切换
    }
  }
}
</script>
