<template>
  <section class="jc-screen-warp no-select" :class="{'jc-no-docking': project.projectId}" :style="{'transform': calcWindow}">
    <!-- 大屏头部 -->
    <screen-header @window-size-change="changeWindowSize"></screen-header>
    <div class="jc-screen-content">
      <!-- 最右侧数据显示，如果是常态则显示，应急和专项则不显示 -->
      <data-docking class="jc-flex-con" v-if="!project.projectId"></data-docking>
      <chart-statistics class="jc-flex-con"></chart-statistics>

      <!-- 中间区域内容 -->
      <center-content class="jc-flex-con-2"></center-content>

      <!-- 右二区域 -->
      <realtime-content class="jc-flex-con"></realtime-content>
      <other-info class="jc-flex-con"></other-info>
    </div>
  </section>
</template>
<script>
import { projectGet } from '@/api/projects'
import { getScreenData } from '@/api/dataScreen' // 获取模拟数据
import { screenMessageChannelSocket } from '@/api/socket'
import { SOCKET_MESSAGE_TYPES } from '@/constant/Dictionaries'

import ScreenHeader from './modules/header' //顶部header
import DataDocking from './modules/dataDocking' //最左侧，数据对接，在应急和专项大屏不显示
import ChartStatistics from './modules/chartStatistics' //信息累计、下辖区域占比、事务类型占比
import CenterContent from './modules/centerContent' //中间展示和交互区域
import RealtimeContent from './modules/realtimeContent' //右二, 实时数据展示, 监控视频, 实时事件
import OtherInfo from './modules/otherInfo' //右一, 其他信息展示, 气象,出勤,智能分析

export default {
  name: 'ScreenDataStatistics',
  components: { ScreenHeader, DataDocking, CenterContent, ChartStatistics, RealtimeContent, OtherInfo },
  data() {
    return {
      project: { projectId: this.$route.params.projectId || '', projectName: '', orgId: '', projectType: '' },
      screenMessageChannelSocket: null,
      autoSetSize: false
    }
  },
  computed: {
    baseWidth() {
      return this.project.projectId ? 2800 : 3200
    },
    calcWindow() {
      let wScale = this.autoSetSize && window.innerWidth <= this.baseWidth ? window.innerWidth / this.baseWidth : 1

      return `scale3d(${wScale}, 1, 1)`
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-message-channel', this.sendScreenMessageChannelSocket) //监听消息发送
    this.$EventBus.$on('data-statistics-amap-success', this.initScreenMessageChannelSocket) //通知地图加载完成
  },
  mounted() {
    this.initData() //初始化基本内容
    this.initMockData() // 获取数据大屏模拟数据
  },
  methods: {
    async initMockData() {
      // 获取数据大屏mock数据
      try {
        let mockdata = await getScreenData() || {}

        let { caseSummary, urbanManagement, illegalConstruction, residueControl, deviceData, videoSurveillance } = mockdata

        console.log('mockdata', mockdata)

        // 案件概要数据处理
        if (!caseSummary) {
          //  如果数据不存在则使用默认值
          caseSummary = {
            caseTotal: 0,
            datas: []
          }
        }


        // 数字城管数据处理
        if (!urbanManagement) {
          //  如果数据不存在则使用默认值
          urbanManagement = []
        }


        // 违法建筑数据处理
        if (!illegalConstruction) {
          //  如果数据不存在则使用默认值
          illegalConstruction = []
        }


        // 渣土管控数据处理
        if (!residueControl) {
          //  如果数据不存在则使用默认值
          residueControl = []
        }

        // 设备数据处理
        if (deviceData) {
          // 数据存在则遍历处理数据
          for (let key in deviceData) {
            deviceData[key] = deviceData[key] ? +deviceData[key] : 0
          }
        } else {
          //  如果数据不存在则使用默认值
          deviceData = {
            netPatrolCar: 0,
            videoSurveillance: 0,
            uav: 0
          }
        }


        // 监控视频数据处理
        if (!videoSurveillance) {
          //  如果数据不存在则使用默认值
          videoSurveillance = []
        }

        this.$EventBus.$emit('data-statistics-case-summay', caseSummary) // 案件概要
        this.$EventBus.$emit('data-statistics-urban-management', urbanManagement) //数字城管
        this.$EventBus.$emit('data-statistics-illegal-construction', illegalConstruction) //违法建筑
        this.$EventBus.$emit('data-statistics-residue-control', residueControl) // 渣土管控
        this.$EventBus.$emit('data-statistics-device-data', deviceData) //设备数据
        this.$EventBus.$emit('data-statistics-video-surveillance', videoSurveillance) //监控视频
      } catch (error) {
        console.log(error)
      }
    },
    async initData() {
      if (this.project.projectId) {
        //处理项目，如果项目id存在则获取项目详情
        let { projectId, projectName, orgId, projectType } = await projectGet(this.project.projectId)

        this.project = { projectId, projectName, orgId, projectType }
      }

      // console.log('emit-data-statistics-init-success')
      this.$EventBus.$emit('data-statistics-init-success', this.project) //通知基础数据初始化完成
      this.changeWindowSize(true)
    },
    initScreenMessageChannelSocket(orgId) {
      this.screenMessageChannelSocket = screenMessageChannelSocket({ subOrgId: orgId, subProjectId: this.project.projectId, type: SOCKET_MESSAGE_TYPES.DATA_STATISTICS })
      this.screenMessageChannelSocket.connect((data) => {
        console.log('数据大屏，收到推送操作消息', data)
        this.$EventBus.$emit('data-statistics-screen-projection', data)
      })
    },
    sendScreenMessageChannelSocket(message) {
      if (this.screenMessageChannelSocket && message) {
        //如果消息存在，则去发送消息
        this.screenMessageChannelSocket.send(JSON.stringify({ sendType: SOCKET_MESSAGE_TYPES.COMMAND, data: message }))
      }
    },
    changeWindowSize(autoSetSize) {
      this.autoSetSize = autoSetSize
    }
  },
  beforeDestroy() {
    if (this.screenMessageChannelSocket) {
      this.screenMessageChannelSocket.disconnect() //如果已经存在，则断开连接
      this.screenMessageChannelSocket = null
    }
    this.$EventBus.$off('data-statistics-message-channel', this.sendScreenMessageChannelSocket)
    this.$EventBus.$off('data-statistics-amap-success', this.initScreenMessageChannelSocket)
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>

