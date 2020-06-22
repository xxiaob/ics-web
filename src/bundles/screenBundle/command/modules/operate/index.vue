<template>
  <div class="jc-screen-opreate no-select">
    <div class="jc-opreate-item">
      <router-link :to="{name: 'index'}" class="jc-main" tag="i" title="首页"></router-link>
    </div>
    <div class="jc-opreate-item" :class="{'jc-active': isSelect}">
      <i class="jc-select" title="框选" @click="userSelect"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-area" title="显示区域"></i>
      <div class="jc-opera-work">
        <el-checkbox-group v-model="areaType" @change="areaChange">
          <el-checkbox class="jc-work-item" label="org">
            <div class="jc-work-content">组织</div>
          </el-checkbox>
          <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
            <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-show-word" title="显示文字"></i>
      <div class="jc-opera-work">
        <el-checkbox-group v-model="wordType" @change="wordChange">
          <el-checkbox class="jc-work-item" label="user">
            <div class="jc-work-content">人员</div>
          </el-checkbox>
          <el-checkbox class="jc-work-item" label="org">
            <div class="jc-work-content">组织</div>
          </el-checkbox>
          <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
            <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-together" title="自动聚合"></i>
      <div class="jc-opera-work">
        <el-checkbox-group v-model="togetherType" @change="togetherChange">
          <el-checkbox class="jc-work-item" label="user">
            <div class="jc-work-content">人员</div>
          </el-checkbox>
          <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
            <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-temporary-tasks" title="任务下发" @click="sendTemporaryTasks"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-map-switch" title="地图切换"></i>
      <div class="jc-opera-work jc-oprea-flex">
        <div class="jc-map-switch-item" v-for="item in maps" :key="item.key" :class="activeStyle == item.value ? `jc-active map-${item.value}` : `map-${item.value}`" @click="switchMap(item.value)"></div>
      </div>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-message" @click="messageChange('CommandMessage')" title="任务&问题&事件"></i>
      <span class="jc-num-tip" v-if="messageVal > 0" v-text="messageVal < 100 ? messageVal : '99'"></span>
    </div>
    <!-- <div class="jc-opreate-item">
      <i class="jc-talk" @click="messageChange('ImTalk')" title="聊天消息"></i>
      <span class="jc-num-tip" v-if="talkVal > 0" v-text="talkVal < 100 ? talkVal : '99'"></span>
    </div> -->
  </div>
</template>
<script>
import { areaTypeList } from '@/api/areaType'
import { JcIcons } from '@/config/JcIconConfig'
import { mapStyle } from '@/map/mapConst'

export default {
  name: 'ScreenCommandOperate',
  data() {
    return {
      messageVal: 0,
      activeStyle: mapStyle.BASE,
      maps: mapStyle.VALUES, //地图样式
      talkVal: 0,
      isSelect: false,
      areaTypes: [], //存储所有 网格类型数组
      areaType: ['org'], //选择显示区域范围的类型
      wordType: [], //存储选择显示文字的网格类型
      togetherType: [], //存储自动聚合的类型
      mapGridTypes: [] //地图存在的类型
    }
  },
  created() {
    this.initData() //初始化基础数据
    this.$EventBus.$on('message-num-change', this.messageNumChange) //监听通知消息
    this.$EventBus.$on('map-grid-types-change', this.mapGridTypesChange) //监听 地图存在类型
  },
  computed: {
    controlAreaTypes() {
      return this.areaTypes.filter(item => {
        return this.mapGridTypes.includes(item.id)
      })
    }
  },
  methods: {
    async initData() {
      try {
        const areaResults = await areaTypeList({})

        let areaTypes = []

        let allCheckIds = ['user']

        if (areaResults && areaResults.length) {
          areaResults.forEach(item => {
            areaTypes.push({ id: item.areaTypeId, name: item.areaTypeName, icon: item.icon })
            allCheckIds.push(item.areaTypeId)
          })
        }
        this.areaTypes = areaTypes
        this.wordType = allCheckIds
        this.togetherType = allCheckIds
      } catch (error) {
        console.log(error)
      }
    },
    userSelect() {
      //框选控制
      this.isSelect = !this.isSelect
      this.$EventBus.$emit('screen-use-select', { isSelect: this.isSelect }) //通知开始或停止框选
    },
    messageNumChange(data) {
      //消息数据变化
      if (data.type == 1) {
        this.messageVal = data.num
      } else if (data.type == 2) {
        this.messageChange('CommandMessage')
      }
    },
    mapGridTypesChange(data) {
      this.mapGridTypes = [...data]//地图存在网格类型变化
    },
    getIconStyle(icon) {
      let useIcon = JcIcons[icon] || {}

      return `background-image: url(${useIcon.icon || ''});`
    },
    messageChange(name) {
      if (name == 'CommandMessage') {
        this.messageVal = 0
      }
      this.$EventBus.$emit('message-component-change', { component: name, options: null }) //通知窗口改变
    },
    sendTemporaryTasks() {
      this.$EventBus.$emit('send-temporary-tasks') //通知窗口发送临时任务
    },
    switchMap(style) {
      this.activeStyle = style
      console.log('operate地图背景切换', style)
      this.$EventBus.$emit('map-switch-change', style) //地图背景切换
    },
    areaChange(areas) {
      console.log('operate区域切换', areas)
      this.$EventBus.$emit('show-area-change', areas) //通知网格显示改变
    },
    wordChange(words) {
      console.log('operate文字显示切换', words)
      this.$EventBus.$emit('show-word-change', words) //通知文字显示改变
    },
    togetherChange(togethers) {
      //聚合显示切换
      this.$EventBus.$emit('show-together-change', togethers) //通知聚合显示改变
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('message-num-change', this.messageNumChange)
    this.$EventBus.$off('map-grid-types-change', this.mapGridTypesChange)
  }
}
</script>
