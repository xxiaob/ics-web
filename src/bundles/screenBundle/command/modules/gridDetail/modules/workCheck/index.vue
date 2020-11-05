<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-work-space">
      <div class="jc-work-warp">
        <div class="jc-work-item jc-duration">
          <div class="jc-work-icon"></div>
          <div class="jc-num" v-text="analysis.duration || '--'"></div>
          <div class="jc-title">在岗时长/H</div>
        </div>
        <div class="jc-work-item jc-distence">
          <div class="jc-work-icon"></div>
          <div class="jc-num" v-text="analysis.distence || '--'"></div>
          <div class="jc-title">在岗里程/KM</div>
        </div>
      </div>
      <div class="jc-work-warp">
        <div class="jc-work-item jc-times">
          <div class="jc-work-icon"></div>
          <div class="jc-num" v-text="analysis.times || '--'"></div>
          <div class="jc-title">触岗次数/次</div>
        </div>
        <div class="jc-work-item jc-report-event">
          <div class="jc-work-icon"></div>
          <div class="jc-num" v-text="analysis.reportEvent || '--'"></div>
          <div class="jc-title">上报事件数/件</div>
        </div>
      </div>

      <warning-list :list="warnList"></warning-list>

      <template v-if="list.length">
        <div class="jc-card-title">出入岗记录</div>
        <div class="jc-node-warp">
          <div class="jc-node" v-for="(item,index) in list" :key="index">
            <div class="jc-node-times">{{item.time}}<br />{{item.date}}</div>
            <div class="jc-node-content">
              <div>{{item.userName + ' ' + item.typeName}}</div>
              <div v-if="inTypes.includes(item.type)">{{`在岗时长${item.duration}H，巡逻里程${item.distence}KM，上报事件数${item.reportEvent}件`}}</div>
              <template v-if="inTypes.includes(item.type) && item.url">
                <div class="jc-node-success">打卡成功</div>
              </template>
              <el-image v-if="item.url" :src="item.url" @click="showFullImg(item.url,[item.url])"></el-image>
            </div>
          </div>
        </div>
      </template>
      <view-empty v-if="!list.length&&!warnList.length"></view-empty>
    </div>
  </div>
</template>
<script>
import { getTaskPostLine } from '@/api/screen'
import { USER_GRID_STATUS, WARNING_DETAIL_TYPE } from '@/constant/Dictionaries'
import { getDetail } from '@/api/warning'

export default {
  name: 'ScreenCommandGridDetailWorkCheck',
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
      inTypes: [USER_GRID_STATUS.INGUARD, USER_GRID_STATUS.INCIRCLE],
      analysis: {}
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
          businessId: this.options.areaId,
          projectId: this.project.projectId,
          selectType: WARNING_DETAIL_TYPE.POST
        })
      } catch (error) {
        console.error(error)
      }
    },
    async initData() {
      this.loading = true
      this.analysis = {}
      try {
        const { eventReportCount, inOutCount, journey, onguardDuration, taskPostlLineEventInnerBos } = await getTaskPostLine({ areaId: this.options.areaId, projectId: this.project.projectId })

        this.analysis = { duration: onguardDuration, distence: journey, times: inOutCount, reportEvent: eventReportCount }

        let list = []

        if (taskPostlLineEventInnerBos && taskPostlLineEventInnerBos.length) {
          taskPostlLineEventInnerBos.forEach(item => {
            let times = item.time.split(' ')

            list.push({ userId: item.userId, userName: item.userName, type: item.type + '', typeName: USER_GRID_STATUS.toString(item.type + ''),
              time: times[1], date: times[0], url: item.photoUrl, duration: item.onguardDuration, distence: item.journey, reportEvent: item.eventReportCount })
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
<style lang="scss" scoped>
.jc-work-space {
  position: relative;
  height: 100%;
  display: flex;
  box-orient: vertical;
  flex-flow: column;
}
.jc-work-warp {
  display: flex;
  margin: $jc-default-dis/4;
  .jc-work-item {
    position: relative;
    flex: 1;
    margin: 0 $jc-default-dis/4;
    padding-left: 50px;
    height: 50px;
    .jc-work-icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
    &.jc-duration {
      background-color: rgba($color: #68cacb, $alpha: 0.2);
      .jc-work-icon {
        background-color: rgba($color: #68cacb, $alpha: 0.8);
        background-image: url(./assets/duration.png);
      }
    }
    &.jc-distence {
      background-color: rgba($color: #ff6d5e, $alpha: 0.2);
      .jc-work-icon {
        background-color: rgba($color: #ff6d5e, $alpha: 0.8);
        background-image: url(./assets/distence.png);
      }
    }
    &.jc-times {
      background-color: rgba($color: #fdd849, $alpha: 0.2);
      .jc-work-icon {
        background-color: rgba($color: #fdd849, $alpha: 0.8);
        background-image: url(./assets/times.png);
      }
    }
    &.jc-report-event {
      background-color: rgba($color: #5dcfe9, $alpha: 0.2);
      .jc-work-icon {
        background-color: rgba($color: #5dcfe9, $alpha: 0.8);
        background-image: url(./assets/report-event.png);
      }
    }
  }
  .jc-num {
    height: 30px;
    line-height: 32px;
    text-align: center;
    font-size: $jc-font-size-larger;
  }
  .jc-title {
    text-align: center;
    color: $jc-color-info;
    font-size: $jc-font-size-smaller;
  }
}
.jc-card-title {
  margin: $jc-default-dis/2;
}
</style>
