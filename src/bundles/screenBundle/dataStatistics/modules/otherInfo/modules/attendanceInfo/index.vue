<template>
  <div class="attendance-info jc-flex-warp jc-flex-vertical">
    <!-- 总体出勤 -->
    <div class="overall-attendance jc-flex-warp jc-flex-vertical">
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

          <div class="overall-cont-center jc-flex-warp jc-flex-con">
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
          <div class="regional-attendance-tbody jc-flex-con data-statistics-scrollbar" ref="regionalscroll">
            <div>
              <div class="regional-attendance-tr jc-flex-warp" v-for="item in arearService" :key="item.orgId">
                <span class="jc-flex-con-3 jc-omit-cell text-center">{{ item.orgName }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.onGuardUserCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.journey }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.eventReportCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.problemCount }}</span>
                <span class="jc-flex-con-2 jc-omit-cell text-center">{{ item.temporaryTaskCount}}</span>
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
      project: {},
      regionalscroll: null,
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
      isStartScroll: true
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
  mounted() {
    this.$nextTick(() => {
      this.regionalscroll = this.$refs.regionalscroll // 获取滚动元素
      this.scrollTop = this.regionalscroll.scrollTop // 获取滚动元素卷起高度
      this.clientHeight = this.regionalscroll.clientHeight // 获取滚动元素容器高度

      this.regionalscroll.addEventListener('scroll', this.regionalscrollhandle) // 绑定滚动事件,实时获取最新的卷起高度
      this.regionalscroll.addEventListener('mouseenter', this.setIntervalEnd) // 鼠标移入清理定时器
      this.regionalscroll.addEventListener('mouseleave', this.mouseenterHandle) // 鼠标离开开启定时器
    })
  },
  methods: {
    regionalscrollhandle(ev) {
      this.scrollTop = ev.target.scrollTop // 获取罪行的定时器
    },
    async getAreaServiceData() {
      let { orgId } = await getUser() // 获取用户orgId

      let { projectId } = this.project // 获取projectId

      this.arearService = await getAreaService({ orgId, projectId }) // 区域出勤数据

      let overallAttendance = await getOverallAttendance({ orgId, projectId })// 总体出勤数据Array

      this.overallAttendance = overallAttendance[0] // 取出总体数据 Object

      this.$nextTick(() => {
        this.scrollHeight = this.regionalscroll.scrollHeight // 数据加载完毕后获取元素滚动高度
        this.timer = 1
        this.setIntervalStart() // 开启定时器滚动
      })
    },
    setIntervalStart() { // 滚动定时器开始的方法
      if (this.isStartScroll) { // 判断用于处理在数据轮询更新是不重新开启定时器
        clearInterval(this.scrollTimer)
        this.scrollTimer = setInterval(this.scrollHandle, 50)
      }
    },
    setIntervalEnd() { // 结束定时器方法
      this.isStartScroll = false
      clearInterval(this.scrollTimer)
    },
    mouseenterHandle() { // 鼠标移出开始定时器
      this.isStartScroll = true
      this.setIntervalStart()
    },
    scrollHandle() { // 滚动函数
      let scrollTop = this.scrollTop + 1

      this.regionalscroll.scrollTo(0, scrollTop)

      if ((scrollTop + this.clientHeight) > this.scrollHeight) {
        this.scrollTop = 0
      }
    }
  },
  beforeDestroy() {
    // 清理定时器
    clearInterval(this.attendanceTimer)
    clearInterval(this.scrollTimer)
    // 清理事件
    this.regionalscroll.removeEventListener('scroll', this.regionalscrollhandle)
    this.regionalscroll.removeEventListener('mouseenter', this.setIntervalEnd)
    this.regionalscroll.removeEventListener('mouseleave', this.mouseenterHandle)
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
