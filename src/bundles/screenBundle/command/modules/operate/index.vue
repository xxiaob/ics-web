<template>
  <div class="jc-screen-opreate no-select">
    <div class="jc-opreate-item">
      <router-link :to="{name: 'main'}" class="jc-main" tag="i" title="首页"></router-link>
    </div>
    <div class="jc-opreate-item jc-auto-show">
      <i class="jc-map-switch" title="地图切换"></i>
      <div class="jc-opera-work jc-flex-warp">
        <div class="jc-map-switch-item" v-for="item in maps" :key="item.key" :class="activeStyle == item.value ? `jc-active map-${item.value}` : `map-${item.value}`" @click="switchMap(item.value)"></div>
      </div>
    </div>
    <div class="jc-opreate-item" :class="{'jc-work-show': isSetting}">
      <i class="jc-show-area" title="信息过滤" @click="isSetting = true"></i>
      <div class="jc-opera-work">
        <div class="jc-flex-warp">
          <!-- 实体显示设置 -->
          <div class="jc-oprea-check-warp">
            <div class="jc-oprea-check-title">实体：</div>
            <el-checkbox class="jc-work-item" :indeterminate="signIndeterminate" v-model="signExtra.checkAll" @change="checkAllChange('sign')">全选</el-checkbox>
            <div class="jc-oprea-line"></div>
            <el-checkbox-group v-model="signType" @change="operaInfoChange('sign')">
              <el-checkbox class="jc-work-item" label="org">
                <div class="jc-work-content">组织</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" label="user">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconrenyuan-5"></i>人员</div>
              </el-checkbox>
              <el-checkbox class="jc-work-item" label="device">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconshexiangtou"></i>设备</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <!-- 新增事件与问题实体控件 -->
              <el-checkbox class="jc-work-item" label="event">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconshijian-2"></i>事件</div>
              </el-checkbox>
              <el-checkbox class="jc-work-item" label="problem">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconwenti"></i>问题</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
                <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- 区域显示设置 -->
          <div class="jc-oprea-check-warp">
            <div class="jc-oprea-check-title">区域：</div>
            <el-checkbox class="jc-work-item" :indeterminate="areaIndeterminate" v-model="areaExtra.checkAll" @change="checkAllChange('area')">全选</el-checkbox>
            <div class="jc-oprea-line"></div>
            <el-checkbox-group v-model="areaType" @change="operaInfoChange('area')">
              <el-checkbox class="jc-work-item" label="org">
                <div class="jc-work-content">组织</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
                <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- 文字显示设置 -->
          <div class="jc-oprea-check-warp">
            <div class="jc-oprea-check-title">标题：</div>
            <el-checkbox class="jc-work-item" :indeterminate="wordIndeterminate" v-model="wordExtra.checkAll" @change="checkAllChange('word')">全选</el-checkbox>
            <div class="jc-oprea-line"></div>
            <el-checkbox-group v-model="wordType" @change="operaInfoChange('word')">
              <el-checkbox class="jc-work-item" label="org">
                <div class="jc-work-content">组织</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" label="user">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconrenyuan-5"></i>人员</div>
              </el-checkbox>
              <el-checkbox class="jc-work-item" label="device">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconshexiangtou"></i>设备</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <!-- 新增事件与问题实体控件 -->
              <el-checkbox class="jc-work-item" label="event">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconshijian-2"></i>事件</div>
              </el-checkbox>
              <el-checkbox class="jc-work-item" label="problem">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconwenti"></i>问题</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <!-- 动态实体 -->
              <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
                <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- 聚合设置 -->
          <div class="jc-oprea-check-warp">
            <div class="jc-oprea-check-title">聚合：</div>
            <el-checkbox class="jc-work-item" :indeterminate="togetherIndeterminate" v-model="togetherExtra.checkAll" @change="checkAllChange('together')">全选</el-checkbox>
            <div class="jc-oprea-line"></div>
            <el-checkbox-group v-model="togetherType" @change="operaInfoChange('together')">
              <el-checkbox class="jc-work-item" label="user">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconrenyuan-5"></i>人员</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" label="event">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconshijian-2"></i>事件</div>
              </el-checkbox>
              <el-checkbox class="jc-work-item" label="problem">
                <div class="jc-work-content jc-work-nobg"><i class="iconfont iconwenti"></i>问题</div>
              </el-checkbox>
              <div class="jc-oprea-line"></div>
              <el-checkbox class="jc-work-item" v-for="item in controlAreaTypes" :label="item.id" :key="item.id">
                <div class="jc-work-content" :style="getIconStyle(item.icon)">{{item.name}}</div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="jc-work-space">
          <el-button size="small" title="恢复系统默认的设置" @click="operaInfoWork('reset')">重 置</el-button>
          <el-button type="info" size="small" title="取消已经进行的操作" @click="operaInfoWork('cancel')">取 消</el-button>
          <el-button type="primary" size="small" title="确认已经选择的信息" @click="operaInfoWork('submit')">确 定</el-button>
        </div>
      </div>
    </div>
    <div class="jc-opreate-item" :class="{'jc-active': isSelect}">
      <i class="jc-select" title="框选" @click="userSelect"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-temporary-tasks" title="任务下发" @click="sendTemporaryTasks"></i>
    </div>
    <div class="jc-opreate-item">
      <i class="jc-message" @click="messageChange('CommandMessage')" title="信息推送"></i>
      <span class="jc-num-tip" v-if="messageVal > 0" v-text="messageVal < 100 ? messageVal : '99'"></span>
    </div>
  </div>
</template>
<script>
import { areaTypeList } from '@/api/areaType'
import { JcIcons } from '@/config/JcIconConfig'
import { mapStyle } from '@/map/mapConst'
import { getCommandOprea, setCommandOprea } from '@/libs/storage'

let saveOperaSetting = null //存储保存的配置

export default {
  name: 'ScreenCommandOperate',
  data() {
    return {
      messageVal: 0,
      activeStyle: mapStyle.BASE,
      maps: mapStyle.VALUES, //地图样式
      isSelect: false,
      areaTypes: [], //存储所有 网格类型数组
      isSetting: false, //是否在进行信息过滤
      signType: [], //存储 选择显示的实体
      signExtra: {
        baseTypes: ['user', 'org', 'event', 'problem', 'device'],
        showTypes: ['user'],
        checkAll: false
      },
      areaType: [], //选择显示区域范围的类型
      areaExtra: {
        baseTypes: ['org'],
        showTypes: ['org'],
        checkAll: false
      },
      wordType: [], //存储选择显示文字的网格类型
      wordExtra: {
        baseTypes: ['user', 'org', 'event', 'problem', 'device'],
        showTypes: ['user', 'org', 'event', 'problem', 'device'],
        checkAll: false
      },
      togetherType: [], //存储自动聚合的类型
      togetherExtra: {
        baseTypes: ['user', 'event', 'problem'],
        showTypes: ['user', 'event', 'problem'],
        checkAll: false
      },
      mapGridTypes: [] //地图存在的类型
    }
  },
  created() {
    this.initData() //初始化基础数据
    this.$EventBus.$on('message-num-change', this.messageNumChange) //监听通知消息
    this.$EventBus.$on('map-grid-types-change', this.mapGridTypesChange) //监听 地图存在类型
    this.$EventBus.$on('screen-opera-control', this.opreaControl) //操作按钮控制
  },
  computed: {
    controlAreaTypes() {
      return this.areaTypes.filter(item => {
        return this.mapGridTypes.includes(item.id)
      })
    },
    signIndeterminate() {
      return this.signType.length > 0 && this.signType.length < this.signExtra.baseTypes.length + this.mapGridTypes.length
    },
    areaIndeterminate() {
      return this.areaType.length > 0 && this.areaType.length < this.areaExtra.baseTypes.length + this.mapGridTypes.length
    },
    wordIndeterminate() {
      return this.wordType.length > 0 && this.wordType.length < this.wordExtra.baseTypes.length + this.mapGridTypes.length
    },
    togetherIndeterminate() {
      return this.togetherType.length > 0 && this.togetherType.length < this.togetherExtra.baseTypes.length + this.mapGridTypes.length
    }
  },
  methods: {
    async initData() {
      try {
        const areaResults = await areaTypeList({})

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
    opreaControl(data) {
      if (data.type == 'select') {
        //如果框选状态不同，则设置框选状态
        if (this.isSelect != data.isSelect) {
          this.userSelect()
        }
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
      saveOperaSetting = getCommandOprea(this.$route.params.projectId) //获取存储的数据
      if (saveOperaSetting) {
        this.operaInfoWork('cancel') //存在，则设置为存储的设置的内容
      } else {
        this.operaInfoWork('reset') //不存在，则设为系统默认
      }
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
      this.$EventBus.$emit('map-switch-change', style) //地图背景切换
    },
    /**
     * 全选控制
     *  @param {String} key 信息控制key sign-实体 area-区域 word-标题 together-聚合
     */
    checkAllChange(key) {
      let extraData = this[`${key}Extra`]

      if (extraData.checkAll) {
        this[`${key}Type`] = [...extraData.baseTypes, ...this.mapGridTypes]
      } else {
        this[`${key}Type`] = []
      }
    },
    /**
     * 信息改变控制
     *  @param {String} key 信息控制key sign-实体 area-区域 word-标题 together-聚合
     */
    operaInfoChange(key) {
      let extraData = this[`${key}Extra`]

      if (this[`${key}Type`].length == extraData.baseTypes.length + this.mapGridTypes.length) {
        extraData.checkAll = true
      } else {
        extraData.checkAll = false
      }
    },
    /**
     * 通知操作 过滤信息修改
     */
    emitOperaInfoShowChange() {
      saveOperaSetting = { signs: [...this.signType], areas: [...this.areaType], words: [...this.wordType], togethers: [...this.togetherType] } //重设确认的设置
      // this.$EventBus.$emit('show-sign-change', signs) //通知网格显示改变
      // this.$EventBus.$emit('show-area-change', areas) //通知网格显示改变
      // this.$EventBus.$emit('show-word-change', words) //通知实体显示改变
      // this.$EventBus.$emit('show-together-change', togethers) //通知聚合显示改变

      this.$EventBus.$emit('show-sign-change', saveOperaSetting) //通知信息过滤改变
      setCommandOprea(this.$route.params.projectId, saveOperaSetting) //最后保存设置
    },
    /**
     * 信息过滤处理类型
     * @param {String} type 处理类型 reset-重置 cancel-取消 submit-确认
     */
    operaInfoWork(type) {
      if (type === 'reset') {
        this.signType = [...this.signExtra.showTypes, ...this.mapGridTypes]
        this.areaType = [...this.areaExtra.showTypes]
        this.wordType = [...this.wordExtra.showTypes, ...this.mapGridTypes]
        this.togetherType = [...this.togetherExtra.showTypes, ...this.mapGridTypes]
      } if (type === 'cancel') {
        this.signType = [...saveOperaSetting.signs]
        this.areaType = [...saveOperaSetting.areas]
        this.wordType = [...saveOperaSetting.words]
        this.togetherType = [...saveOperaSetting.togethers]
      }
      if (type != 'submit') {
        this.operaInfoChange('sign')
        this.operaInfoChange('area')
        this.operaInfoChange('word')
        this.operaInfoChange('together')
      }
      this.emitOperaInfoShowChange()
      this.isSetting = false
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('message-num-change', this.messageNumChange)
    this.$EventBus.$off('map-grid-types-change', this.mapGridTypesChange)
    this.$EventBus.$off('screen-opera-control', this.opreaControl)
  }
}
</script>
