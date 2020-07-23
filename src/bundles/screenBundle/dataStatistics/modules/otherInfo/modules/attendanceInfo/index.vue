<template>
  <div class="attendance-info jc-flex-warp jc-flex-vertical">
    <!-- 总体出勤 -->
    <div class="overall-attendance jc-flex-con jc-flex-warp jc-flex-vertical">
      <jc-abstract-area title="总体出勤">
        <!-- 总体出勤内容 -->
        <div class="overall-attendance-content jc-flex-warp">
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
    <div class="regional-attendance jc-flex-con-2">
      <jc-abstract-area title="区域勤务">

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

  .overall-attendance,
  .regional-attendance {
    padding: 0 16px;
  }

  .overall-attendance {
    padding-bottom: 20px;
    border-bottom: 1px solid rgb(32, 73, 154);

    .overall-attendance-content {
      height: 100%;
      padding-top: 20px;

      .overall-cont-center {
        margin: 0 20px;
      }

      .img-wrap {
        max-width: 100%;
        max-height: 100%;
        margin-right: 4px;
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
}
</style>
