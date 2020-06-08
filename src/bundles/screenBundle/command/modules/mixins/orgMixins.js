/**
 * 地图组织处理
 */
import { areaList } from '@/api/area'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { apiBoundariesFormat } from '@/libs/apiFormat'
import { JcMapSign } from '@/map'

let orgAreas = [] //组织区域数组

export default {
  data() {
    return {
      org: null,
      orgTipVisible: false, //组织是否显示名称
      orgAreaVisible: true //组织是否显示区域
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.orgMap) //监听行级别切换
    this.$EventBus.$on('show-area-change', this.orgShowAreaChange) //监听区域显示切换
    this.$EventBus.$on('show-word-change', this.orgShowWordChange) //监听文字显示切换
  },
  methods: {
    async orgMap(org) {
      //处理地图
      this.org = org
      console.log('指挥层级切换变化', org)
      try {
        let res = await areaList({ orgId: this.org.orgId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.ORG })

        this.drawOrgSign(res)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 绘画组织区域信息
     * @param {Array} data 组织区域数据
     */
    drawOrgSign(data) {
      let myJcMap = this.getMyJcMap() //获取地图对象

      myJcMap.removeSign(orgAreas) //清除之前的区域显示

      let areas = []

      if (data && data.length) {
        data.forEach(item => {
          if (item.orgId == this.org.orgId) {
            this.$EventBus.$emit('org-adcode-change', item)
          } else {
            areas.push(new JcMapSign({
              id: item.orgId,
              map: myJcMap,
              name: item.areaName,
              center: item.center.split(','),
              tipVisible: this.orgTipVisible,
              areaVisible: this.orgAreaVisible,
              extData: { orgId: item.orgId, adcode: item.areaCode, areaId: item.areaId, areaName: item.areaName },
              boundaries: apiBoundariesFormat(item)
            }))
          }
        })
      }
      orgAreas = areas

      myJcMap.addSign(orgAreas)
      myJcMap.fitView()
    },
    orgShowAreaChange(areas) {
      //组织区域显示
      if ((areas || areas.length).filter(id => id == 'org').length) {
        //如果存在组织区域显示，则显示区域
        this.orgAreaVisible = true
      } else {
        //不存在则显示
        this.orgAreaVisible = false
      }
      orgAreas.forEach(item => {
        item.showArea(this.orgAreaVisible)
      })
    },
    orgShowWordChange(words) {
      //组织文字显示
      if ((words || words.length).filter(id => id == 'org').length) {
        //如果存在组织区域显示，则显示文字
        this.orgTipVisible = true
      } else {
        //不存在则显示
        this.orgTipVisible = false
      }
      orgAreas.forEach(item => {
        item.showTip(this.orgTipVisible)
      })
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.orgMap)
    this.$EventBus.$off('show-area-change', this.orgShowAreaChange)
    this.$EventBus.$off('show-word-change', this.orgShowWordChange)
  }
}
