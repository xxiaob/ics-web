import { getMarkerCluster } from '@/map/aMap/aMapUtil'
import { JcProblemIcons } from '@/config/JcIconConfig'
import { getScreenProblemData } from '@/api/screen'
import { JcMapMarker } from '@/map'
import { MAP_EVENT, MAP_SIGN_ZINDEX } from '@/constant/CONST'
import moment from 'moment'
import { mapPositionFormatter } from '@/libs/dataFormatter'

let problemData = { markerCluster: null, problems: {}, lnglats: [] }

let MarkerCluster //存储 MarkerCluster

import { MESSAGE_TYPE } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      problemOrgId: '',
      problemSignVisible: false, //问题是否显示
      problemTipVisible: false, //问题名称是否显示
      problemTogetherVisible: false, //问题是否聚合
      problemToday: new Date(moment().format('YYYY-MM-DD')).getTime() //初始时间
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.problemOrgChange) //监听组织级别切换
    this.$EventBus.$on('show-sign-change', this.problemShowSignChange) //过滤信息显示
  },
  methods: {
    problemOrgChange(org) {
      // 获取ordID
      this.problemOrgId = org.orgId
      //  初始化数据
      this.initProblemData()
    },
    async initProblemData() {
      this.clearProblems() // 清除之前的记录
      if (!this.problemSignVisible) {
        return
      }
      let beginTime = new Date(this.problemToday) // 开始时间

      let endTime = new Date(this.problemToday + 24 * 60 * 60 * 1000) // 结束时间

      try {
        // 发送请求获取数据
        let ScreenProblemData = await getScreenProblemData({ orgId: this.problemOrgId, projectId: this.project.projectId, beginTime, endTime })

        MarkerCluster = await getMarkerCluster()

        // 处理问题信息
        if (ScreenProblemData && ScreenProblemData.length) {
          ScreenProblemData.forEach(item => {
            // 过滤没有坐标的问题
            let { legal, lng, lat } = mapPositionFormatter(item.position)

            if (!legal) {
              return
            }

            item.lng = lng // 获取精度
            item.lat = lat // 获取维度

            // 计算问题的中心点坐标和key, 处理坐标相同的情况
            let { center, key } = this.getProblemCenterAndKey(item.lng, item.lat, item.businessKey)

            let lnglat = problemData.lnglats.find(problem => problem.problemId == item.businessKey)

            if (lnglat) {
              if (problemData.problems[lnglat.key] && problemData.problems[lnglat.key].labelMarker) {
                problemData.problems[lnglat.key].labelMarker.hide()
              }
              delete problemData.problems[lnglat.key]
            } else {
              problemData.lnglats.push({ lnglat: center, key, problemId: item.businessKey })
            }

            problemData.problems[key] = { ...item, center }
          })
        }

        this.fitProblems() //控制问题显示
      } catch (error) {
        console.log(error)
      }
    },
    renderProblemClusterMarker(context) {
      console.log('绘制问题-聚合绘制', context)
      this.setMarkerAndListener(context.marker, true) //设置marker和添加监听
      context.marker.setContent(`<div class="jc-marker-content jc-marker-cluster" style="background-image: url(${JcProblemIcons.cluster});">${context.count}</div>`)
    },
    renderProblemMarker(context) {
      console.log('绘制问题-单点绘制', context)
      let key = this.getKeyByLngLat(context.data[0].lnglat.lng, context.data[0].lnglat.lat)

      let problemItem = problemData.problems[key]

      //过滤掉问题信息为空的场景
      if (!problemItem) {
        return
      }

      let content = `<div class="jc-marker-content" style="background-image: url(${JcProblemIcons.plain});">`

      if (this.problemTipVisible) {
        content += `<div class="jc-marker-title">${problemItem.problemTitle}</div>`
      }
      this.setMarkerAndListener(context.marker) //设置marker和添加监听
      context.marker.setContent(content + '</div>')
    },
    markerProblemClusterClick(context) {
      //  点击弹窗
      console.log('绘制问题-点击', context)
      let myJcMap = this.getMyJcMap() //获取地图对象

      //处理数据，如果是单个则去通知显示详情，是多个的聚合，则定位到显示
      if (context.clusterData.length > 1) {
        myJcMap.map.setBounds(this.getAmapBundles(context.clusterData))
      } else {
        //获取信息去通知显示详情
        let key = this.getKeyByLngLat(context.lnglat.lng, context.lnglat.lat)

        let problemItem = problemData.problems[key]

        this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: problemItem.businessKey, type: MESSAGE_TYPE.QUESTION } })
      }
    },
    getProblemCenterAndKey(lng, lat, problemId) {
      // 处理坐标
      let center = [parseFloat(lng).toFixed(6), parseFloat(lat).toFixed(6)]

      let key = center.join(',')

      //处理是已经有问题和当前问题位置完全相同，如果相同则进行处理偏差处理
      let problem = problemData.problems[key]

      if (problem && problem.businessKey != problemId) {
        //如果该坐标问题存在，且不是当前问题，则将该问题位置进行偏差，再次进行处理
        return this.getProblemCenterAndKey(parseFloat(lng) + 0.000001, parseFloat(lat) + 0.000001, problemId)
      }

      return { center, key }
    },
    fitProblems() {
      let myJcMap = this.getMyJcMap() //获取地图对象

      if (this.problemSignVisible && this.problemTogetherVisible) {
        if (problemData.markerCluster) {
          problemData.markerCluster.setData(problemData.lnglats) //如果已经存在，则去调整数据显示
        } else {
          problemData.markerCluster = new MarkerCluster(null, problemData.lnglats, {
            maxZoom: 18,
            gridSize: 120,
            renderClusterMarker: this.renderProblemClusterMarker,
            renderMarker: this.renderProblemMarker
          })
          problemData.markerCluster.on('click', this.markerProblemClusterClick)
        }
        problemData.markerCluster.setMap(myJcMap.map)
        problemData.markerCluster.setGridSize(120) //处理是否显示标题，以及状态
      } else if (problemData.markerCluster) {
        problemData.markerCluster.setMap(null)
        problemData.MarkerCluster = null
      }

      let jcSignVisible = !this.problemTogetherVisible && this.problemSignVisible

      for (let key in problemData.problems) {
        let signItem = problemData.problems[key]

        if (jcSignVisible) {
          if (signItem.labelMarker) {
            signItem.labelMarker.titleVisible = this.problemTipVisible
            signItem.labelMarker.show()
          } else {
            signItem.labelMarker = new JcMapMarker({
              id: signItem.businessKey,
              icon: JcProblemIcons.plain,
              map: myJcMap,
              zIndex: MAP_SIGN_ZINDEX.OTHER,
              name: this.getMarkerTitle(signItem.problemTitle),
              position: signItem.center,
              titleVisible: this.problemTipVisible
            })
            signItem.labelMarker.on(MAP_EVENT.CLICK, ()=> {
              this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: signItem.businessKey, type: MESSAGE_TYPE.QUESTION } })
            })
          }
        } else if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
    },
    clearProblems() {
      //清除所有数据
      if (problemData && problemData.markerCluster) {
        problemData.markerCluster.setMap(null)
      }
      for (let key in problemData.problems) {
        if (problemData.problems[key].labelMarker) {
          problemData.problems[key].labelMarker.hide()
        }
      }
      problemData = { markerCluster: null, problems: {}, lnglats: [] }
    },
    problemShowWordChange(words) {
      let problemTipVisible = words.includes('problem')

      if (this.problemTipVisible == problemTipVisible) {
        return
      }
      this.problemTipVisible = problemTipVisible
      this.fitProblems()
    },
    problemTogetherChange(togethers) {
      let problemTogetherVisible = togethers.includes('problem')

      if (this.problemTogetherVisible == problemTogetherVisible) {
        return
      }
      this.problemTogetherVisible = problemTogetherVisible
      this.fitProblems()
    },
    problemShowSignChange(data) {
      let neetFit = false

      //处理标题显示
      let problemTipVisible = data.words.includes('problem')

      if (this.problemTipVisible != problemTipVisible) {
        this.problemTipVisible = problemTipVisible
        neetFit = true
      }

      //处理聚合
      let problemTogetherVisible = data.togethers.includes('problem')

      if (this.problemTogetherVisible != problemTogetherVisible) {
        this.problemTogetherVisible = problemTogetherVisible
        neetFit = true
      }

      //处理实体显示
      let problemSignVisible = data.signs.includes('problem')

      if (this.problemSignVisible != problemSignVisible) {
        this.problemSignVisible = problemSignVisible
        this.initProblemData()
        neetFit = false
      }

      if (neetFit) {
        this.fitProblems()
      }
    }
  },
  beforeDestroy() {
    this.clearProblems()
    this.$EventBus.$off('org-change', this.eventOrgChange)
    this.$EventBus.$off('show-sign-change', this.problemShowSignChange)
  }
}
