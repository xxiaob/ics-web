<template>
  <div class="attendance-info jc-flex-warp jc-flex-vertical">
    <!-- 总体出勤 -->
    <div class="overall-attendance jc-flex-con jc-flex-warp jc-flex-vertical">
      <jc-abstract-area title="总体出勤">
        <!-- 总体出勤内容 -->
        <div class="overall-attendance-content jc-flex-warp jc-flex-con">
          <div class="jc-flex-con jc-flex-warp">
            <div class="img-wrap jc-flex-warp">
              <img src="./assets/online-number.png" width="100%" height="100%" alt="在线人数">
            </div>
            <div class="overall-attendance-info jc-flex-con jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>在线人数</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <span>
                  <count-to class="overall-count" :startVal="0" :endVal="+overallAttendance.onGuardUserCount || 0" />人
                </span>
              </div>
            </div>
          </div>

          <div class="jc-flex-con overall-cont-center jc-flex-warp">
            <div class="img-wrap jc-flex-warp">
              <img src="./assets/mileage-patrol.png" width="100%" height="100%" alt="巡逻里程">
            </div>
            <div class="overall-attendance-info jc-flex-con jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>巡逻里程</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <span>
                  <count-to class="overall-count" :startVal="0" :endVal="+overallAttendance.journey || 0" />KM
                </span>
              </div>
            </div>
          </div>

          <div class="jc-flex-con jc-flex-warp">
            <div class="img-wrap jc-flex-warp">
              <img src="./assets/gangdian-touch.png" width="100%" height="100%" alt="岗点触碰">
            </div>
            <div class="overall-attendance-info jc-flex-con jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>岗点触碰</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <span>
                  <count-to class="overall-count" :startVal="0" :endVal="+overallAttendance.inoutCount || 0" />次
                </span>
              </div>
            </div>
          </div>
        </div>
      </jc-abstract-area>
    </div>

    <!-- 区域出勤 -->
    <div class="regional-attendance jc-flex-con-2 jc-flex-warp">
      <jc-abstract-area title="区域勤务">
        <!-- 区域出勤列表 -->
        <div class="regional-attendance-content jc-flex-con jc-flex-warp jc-flex-vertical">
          <!-- 区域出勤标题 -->
          <div class="regional-attendance-theader jc-flex-warp">
            <span class="jc-flex-con-3 text-center"></span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">在线人数</span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">巡逻里程</span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">事件上报</span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">网巡问题</span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">任务处理</span>
            <span class="jc-flex-con-2 jc-omit-cell text-center">岗点触碰</span>
          </div>

          <!-- 区域出勤数据 -->
          <div class="regional-attendance-tbody jc-flex-con data-statistics-scrollbar">
            <div>
              <div class="regional-attendance-tr jc-flex-warp" v-for="item in arearService" :key="item.orgId">
                <span class="jc-flex-con-3 jc-omit-cell text-center">{{ item.orgName }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.onGuardUserCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.journey }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.eventReportCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.temporaryTaskCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.problemCount}}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.inoutCount}}</span>
              </div>
            </div>
          </div>
        </div>
      </jc-abstract-area>
    </div>
  </div>
</template>

<script>
import JcAbstractArea from '../../../common/abstractArea'
import countTo from 'vue-count-to'
import { getAreaService, getOverallAttendance } from '@/api/dataScreen' // 获取数据方法
import { getUser } from '@/libs/storage'

export default {
  name: 'ScreenDataStatisticsOtherInfoAttendanceInfo',
  components: { JcAbstractArea, countTo },
  data() {
    return {
      arearService: [],
      overallAttendance: {},
      project: {}
    }
  },
  created() {
    // 获取projectId所在对象
    this.$EventBus.$on('data-statistics-init-success', val=>{
      // console.log('chartStatistics 接收信息成功', val)
      this.project = val
      this.getAreaServiceData()

      // 轮询更新数据
      this.attendanceTimer = setInterval(() => {
        this.getAreaServiceData()
      }, 25000)
    })
  },
  methods: {
    async getAreaServiceData() {
      let { orgId } = await getUser() // 获取用户orgId

      let { projectId } = this.project // 获取projectId

      this.arearService = await getAreaService({ orgId, projectId }) // 区域出勤数据

      let overallAttendance = await getOverallAttendance({ orgId, projectId })// 总体出勤数据Array

      this.overallAttendance = overallAttendance[0] // 取出总体数据 Object
    }
  },
  beforeDestroy() {
    // 清理定时器
    clearInterval(this.attendanceTimer)
  }

}
</script>

<style lang="scss" scoped>
.attendance-info {
  .overall-attendance {
    border-bottom: 1px solid rgb(32, 73, 154);

    .overall-attendance-content {
      padding: 10px 16px 16px;

      .overall-cont-center {
        margin: 0 20px;
      }

      .img-wrap {
        width: 50px;
        margin-right: 12px;
      }

      .overall-attendance-info {
        .overall-title {
          align-items: flex-start;
          color: #11e7ff;
        }

        .overall-count-wrap {
          align-items: flex-end;
          color: #ffffff;

          .overall-count {
            font-size: 22px;
          }
        }
      }
    }
  }

  .regional-attendance {
    .regional-attendance-content {
      color: #8bc1fc;
      font-size: 12px;
      margin-top: 10px;

      .jc-omit-cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .regional-attendance-theader {
        padding-bottom: 10px;
      }
      .regional-attendance-tbody {
        overflow-x: hidden;
        overflow-y: auto;

        & > div {
          height: 0;
        }

        .regional-attendance-tr {
          background-color: rgba(0, 46, 138, 0.2);
          height: 30px;
          line-height: 30px;

          & span:first-child {
            padding-left: 8px;
          }

          .jc-omit-cell:not(:first-child) {
            color: #4ee2fd;
          }

          &:not(:first-child) {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
