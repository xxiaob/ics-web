<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <warning-list :list="warnList"></warning-list>
    <div class="jc-pt" v-if="list.length">
      <div class="jc-node-warp">
        <div class="jc-node" v-for="(item,index) in list" :key="index">
          <div class="jc-node-times">{{item.time}}<br />{{item.date}}</div>
          <div class="jc-node-content">
            <div>{{item.userName + ' ' + item.typeName + ' ' + item.areaName}}</div>
            <div v-if="inTypes.includes(item.type)">{{`在岗时长${item.duration}H，巡逻里程${item.distence}KM，上报事件数${item.reportEvent}件`}}</div>
            <template v-if="inTypes.includes(item.type) && item.url">
              <div class="jc-node-success">打卡成功</div>
            </template>
            <el-image v-if="item.url" :src="item.url" @click="showFullImg(item.url,[item.url])"></el-image>
          </div>
        </div>
      </div>
    </div>
    <view-empty v-if="!list.length&&!warnList.length"></view-empty>
  </div>
</template>
<script>
import { getTaskPersonalLine } from '@/api/screen'
import { USER_GRID_STATUS, WARNING_DETAIL_TYPE } from '@/constant/Dictionaries'
import { getDetail } from '@/api/warning'

export default {
  name: 'ScreenCommandUserDetailWorkCheck',
  props: ['options', 'project'],
  components: {
    WarningList: () => import('@/bundles/screenBundle/command/modules/common/warningList'),
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      loading: false,
      list: [],
      warnList: [],
      outTypes: [USER_GRID_STATUS.OUTCIRCLE, USER_GRID_STATUS.OUTGUARD],
      inTypes: [USER_GRID_STATUS.INGUARD, USER_GRID_STATUS.INCIRCLE]
    }
  },
  watch: {
    options() {
      this.initData()
      this.getWarning()
    }
  },
  created() {
    this.initData()
    this.getWarning()
  },
  methods: {
    async getWarning() {
      try {
        this.warnList = await getDetail({
          businessId: this.options.userId,
          projectId: this.project.projectId,
          selectType: WARNING_DETAIL_TYPE.PEOPLE
        })
      } catch (error) {
        console.error(error)
      }
    },
    async initData() {
      this.loading = true
      this.analysis = {}
      try {
        const result = await getTaskPersonalLine({ userId: this.options.userId, projectId: this.project.projectId })

        let list = []

        if (result && result.length) {
          result.forEach(item => {
            let times = item.time.split(' ')

            list.push({ userId: item.userId, userName: item.userName, type: item.type + '', typeName: USER_GRID_STATUS.toString(item.type + ''),
              areaId: item.areaId, areaName: item.areaName, time: times[1], date: times[0], url: item.photoUrl,
              duration: item.onguardDuration, distence: item.journey, reportEvent: item.eventReportCount })
          })
        }
        this.list = list
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    showFullImg(url, imgs) {
      this.$EventBus.$emit('show-full-img', { url, imgs })
    }
  }
}
</script>
