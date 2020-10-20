<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-pt" v-if="list.length">
      <div class="jc-node-warp">
        <div class="jc-node" v-for="(item,index) in list" :key="index">
          <div class="jc-node-times">{{item.time}}<br />{{item.date}}</div>
          <div class="jc-node-content">
            <div>{{item.userName + ' ' + item.typeName + ' ' + item.areaName}}</div>
            <div v-if="inTypes.includes(item.type)">{{`在岗时长${item.duration}H，巡逻里程${item.distence}KM，上报事件数${item.reportEvent}件`}}</div>
            <template v-if="inTypes.includes(item.type) && item.url">
              <div class="jc-node-success">打卡成功</div>
              <el-image :src="item.url" @click="showFullImg(item.url,[item.url])"></el-image>
            </template>
          </div>
        </div>
      </div>
    </div>
    <view-empty v-else></view-empty>
  </div>
</template>
<script>
import { getTaskPersonalLine } from '@/api/screen'
import { USER_GRID_STATUS } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandUserDetailWorkCheck',
  props: ['options', 'project'],
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      loading: false,
      list: [],
      outTypes: [USER_GRID_STATUS.OUTCIRCLE, USER_GRID_STATUS.OUTGUARD],
      inTypes: [USER_GRID_STATUS.INGUARD, USER_GRID_STATUS.INCIRCLE]
    }
  },
  watch: {
    options() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
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
