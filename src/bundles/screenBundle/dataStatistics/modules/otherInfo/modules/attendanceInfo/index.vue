<template>
  <div class="attendance-info jc-flex-warp jc-flex-vertical">
    <!-- 总体出勤 -->
    <div class="overall-attendance jc-flex-con jc-flex-warp jc-flex-vertical">
      <jc-abstract-area title="总体出勤">
        <!-- 总体出勤内容 -->
        <div class="overall-attendance-content jc-flex-warp jc-flex-con">
          <div class="jc-flex-con jc-flex-warp">
            <div class="img-wrap jc-flex-con-2 jc-flex-warp">
              <img src="./assets/online-number.png" alt="在线人数">
            </div>
            <div class="overall-attendance-info jc-flex-con-2 jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>在线人数</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <count-to :startVal="0" :endVal="58" />人
              </div>
            </div>
          </div>

          <div class="jc-flex-con overall-cont-center jc-flex-warp">
            <div class="img-wrap jc-flex-con-2 jc-flex-warp">
              <img src="./assets/mileage-patrol.png" alt="在线人数">
            </div>
            <div class="overall-attendance-info jc-flex-con-2 jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>巡逻里程</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <count-to :startVal="0" :endVal="486" />KM
              </div>
            </div>
          </div>

          <div class="jc-flex-con jc-flex-warp">
            <div class="img-wrap jc-flex-con-2 jc-flex-warp">
              <img src="./assets/gangdian-touch.png" alt="在线人数">
            </div>
            <div class="overall-attendance-info jc-flex-con-2 jc-flex-warp jc-flex-vertical">
              <div class="overall-title jc-flex-con jc-flex-warp">
                <span>岗点触碰</span>
              </div>
              <div class="overall-count-wrap jc-flex-con jc-flex-warp">
                <count-to :startVal="0" :endVal="139" />次
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
          <div class="regional-attendance-theader jc-flex-warp">
            <span class="jc-flex-con text-center"></span>
            <span class="jc-flex-con jc-omit-cell text-center">在线人数</span>
            <span class="jc-flex-con jc-omit-cell text-center">巡逻里程</span>
            <span class="jc-flex-con jc-omit-cell text-center">事件上报数</span>
            <span class="jc-flex-con jc-omit-cell text-center">任务处理数</span>
            <span class="jc-flex-con jc-omit-cell text-center">网巡上报</span>
            <span class="jc-flex-con jc-omit-cell text-center">视频查证</span>
          </div>

          <div class="regional-attendance-tbody jc-flex-con">
            <!-- 需要循环的数据,根据后台数据在调整 -->
            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
            </div>

            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
            </div>

            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
            </div>
            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
            </div>
            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
            </div>
            <div class="regional-attendance-tr jc-flex-warp">
              <span class="jc-flex-con jc-omit-cell text-center">永阳街道</span>
              <span class="jc-flex-con jc-omit-cell text-center">30</span>
              <span class="jc-flex-con jc-omit-cell text-center">22</span>
              <span class="jc-flex-con jc-omit-cell text-center">15</span>
              <span class="jc-flex-con jc-omit-cell text-center">16</span>
              <span class="jc-flex-con jc-omit-cell text-center">12</span>
              <span class="jc-flex-con jc-omit-cell text-center">17</span>
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

export default {
  name: 'ScreenDataStatisticsOtherInfoAttendanceInfo',
  components: { JcAbstractArea, countTo }
}
</script>

<style lang="scss" scoped>
.attendance-info {
  height: 100%;

  .overall-attendance {
    border-bottom: 1px solid rgb(32, 73, 154);

    .overall-attendance-content {
      height: 100%;
      padding: 16px;

      .overall-cont-center {
        margin: 0 20px;
      }

      .img-wrap {
        max-width: 100%;
        max-height: 100%;
        margin-right: 10px;
      }

      .overall-attendance-info {
        .overall-title {
          align-items: center;
          color: #11e7ff;
        }

        .overall-count-wrap {
          align-items: flex-end;
          color: #ffffff;

          span {
            font-size: 22px;
            margin-right: 4px;
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
        overflow: auto;
        max-height: 136px;
        .regional-attendance-tr {
          background-color: rgba(0, 46, 138, 0.2);
          height: 30px;
          line-height: 30px;

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
