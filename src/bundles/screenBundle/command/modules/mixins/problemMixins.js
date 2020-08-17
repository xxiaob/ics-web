import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcProblemIcons } from '@/config/JcIconConfig'

import { getScreenProblemData } from '@/api/screen'
import { getUser } from '@/libs/storage'
import moment from 'moment'

let problemData = { markerCluster: null, problems: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      today: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime() // 初始时间
    }
  },
  created() {
    // 利用用户来模拟事件
    // this.$EventBus.$on('map-user-change', this.problemMap)
    //  初始化数据
    this.initProblemData()

    this.$EventBus.$on('show-word-change', this.problemShowWordChange) //监听文字显示切换
    this.$EventBus.$on('show-together-change', this.problemTogetherChange) // 监听是否聚合
  },
  methods: {
    async initProblemData() {
      let beginTime = new Date(this.today) // 开始时间

      let endTime = new Date(this.today + 24 * 60 * 60 * 1000) // 结束时间

      let { orgId } = await getUser() // 获取用户orgId

      let { projectId } = this.project // 获取projectId

      console.log(beginTime, endTime, orgId, projectId)


      // 发送请求获取数据
      let ScreenProblemData = await getScreenProblemData({ orgId, projectId })

      console.log('ScreenProblemData', ScreenProblemData)

      MarkerCluster = await getMarkerCluster()

      this.clearProblems() // 清除之前的记录


      // 处理用户信息
      if (ScreenProblemData && ScreenProblemData.length) {
        ScreenProblemData.forEach(item => {
          // 过滤没有坐标的事件
          if (!item.position) {
            return
          }

          let position = item.position.split(',') // 切割坐标

          item.lng = position[0] // 获取精度
          item.lat = position[1] // 获取维度

          // 计算事件的中心点坐标和key, 处理坐标相同的情况
          let { center, key } = this.getProblemCenterAndKey(item.lng, item.lat, item.businessKey)

          let lnglat = problemData.lnglats.find(problem => problem.problemId == item.businessKey)

          if (lnglat) {
            delete problemData.users[lnglat.key]
          } else {
            problemData.lnglats.push({ lnglat: center, key, problemId: item.businessKey })
          }
          console.log('problemData', problemData)
          problemData.problems[key] = { ...item, center }
        })
      }

      if (problemData.markerCluster) {
        //如果已经存在，则去调整数据显示
        problemData.markerCluster.setData(problemData.lnglats)
      } else {
        problemData.markerCluster = new MarkerCluster(null, problemData.lnglats, {
          gridSize: 120,
          renderClusterMarker: this.renderProblemClusterMarker,
          renderMarker: this.renderProblemMarker
        })
        problemData.markerCluster.on('click', this.markerProblemClusterClick)
      }
      this.fitProblems() //控制用户显示
    },
    renderProblemClusterMarker(context) {
      console.log('绘制用户-聚合绘制', context)
      context.marker.setAnchor('center')
      context.marker.setzIndex(20)
      context.marker.setContent(`<div class="jc-cluster-content" style="background-image: url(${JcProblemIcons.cluster});">${context.count}</div>`)
    },
    renderProblemMarker(context) {
      console.log('绘制问题-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let problemItem = problemData.problems[key]

      //过滤掉用户信息为空的场景
      if (!problemItem) {
        return
      }

      let content = '<div class="jc-marker-content jc-market-center">'

      if (this.problemTipVisible) {
        content += `<div class="jc-marker-title">${problemItem.problemTypeName}</div>`
      }
      //处理用户图标显示

      content += `<img src=${JcProblemIcons.plain} class="jc-marker-icon"/></div>`


      context.marker.setPosition(problemItem.center)
      context.marker.setContent(content)
    },

    //  点击弹窗
    markerProblemClusterClick(context) {
      console.log('绘制用户-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

        let problemItem = problemData.problems[key]


        this.$EventBus.$emit('view-component-change', {
          component: 'MessageDetail', options: {
            id: problemItem.businessKey,
            type: MESSAGE_TYPE.QUESTION
          }
        })
      }
    },
    getProblemCenterAndKey(lng, lat, problemId) {
      // 处理坐标
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有事件和当前事件位置完全相同，如果相同则进行处理偏差处理
      let problem = problemData.problems[key]

      if (problem && problem.businessKey != problemId) {
        //如果该坐标用户存在，且不是当前用户，则将该用户位置进行偏差，再次进行处理
        return this.getProblemCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, problemId)
      }

      return { center, key }
    },
    fitProblems() {
      if (!problemData.markerCluster) {
        return
      }
      let myJcMap = this.getMyJcMap() //获取地图对象


      //处理问题是否显示
      if (this.problemTipVisible) {
        problemData.markerCluster.setMap(myJcMap.map)

        //处理是否进行聚合
        if (this.problemTogetherVisible) {
          problemData.markerCluster.setMaxZoom(18)
        } else {
          problemData.markerCluster.setMaxZoom(0)
        }
        //处理是否显示标题，以及状态
        problemData.markerCluster.setGridSize(120)
      } else {
        problemData.markerCluster.setMap(null)
      }
    },
    clearProblems() {
      //清除所有数据
      if (problemData && problemData.markerCluster) {
        problemData.markerCluster.setMap(null)
      }
      this.gatherUserIds = [] //重置用户聚合id数组
      this.abnormalUserIds = [] //重置用户异常id数组

      problemData = { markerCluster: null, problems: {}, lnglats: [] }
    },
    problemShowWordChange(words) {
      this.problemTipVisible = words.includes('problem') //如果存在用户显示，则显示用户，否则不显示
      this.fitProblems()
    },
    problemTogetherChange(togethers) {
      this.problemTogetherVisible = togethers.includes('problem') //如果存在用户聚合，则聚合用户，否则不显示
      this.fitProblems()
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('show-word-change', this.problemShowWordChange)
    this.$EventBus.$off('show-together-change', this.problemTogetherChange) // 监听是否聚合
  }
}
