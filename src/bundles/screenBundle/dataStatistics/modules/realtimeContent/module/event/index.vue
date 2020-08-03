<template>
  <div class="jc-flex-con jc-flex-warp jc-flex-vertical jc-event">
    <div class="jc-title">
      <span class="jc-title-content">实时事件</span>
      <div class="jc-right-box">
        <!-- <span class="jc-right-item">{{nowDate}}</span> -->
        <span class="jc-right-item">{{user.orgName}}</span>
      </div>
    </div>
    <div class="jc-flex-con jc-event-list data-statistics-scrollbar ">
      <transition-group name="jc-list" tag="div">
        <div class="jc-list-item jc-flex-warp" v-for="item in list" :key="item.id">
          <div class="img">
            <img v-if="item.afterPhotos&&item.afterPhotos.length" :src="item.afterPhotos[0]" alt="" width="100%" height="100%">
            <img v-else src="./assets/none.png" alt="" width="100%" height="100%">
          </div>
          <div class="jc-flex-con jc-list-item-content jc-flex-warp jc-flex-vertical">
            <div class="jc-list-item-content-title">{{item.eventTitle}}</div>
            <div class="jc-list-item-content-position">{{item.positionName}}</div>
            <div class="jc-list-item-content-detail jc-flex-warp">
              <span class="reportUserName">{{item.reportUserName}}</span>
              <span class="orgName">{{item.orgName}}</span>
              <span class="createTime">{{item.createTime|fliterTime}}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { eventManageList } from '@/api/eventManage'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'ScreenDataStatisticsRealtimeContentEvent',
  data() {
    return {
      // nowDate: moment(new Date()).format('MM月DD日'),
      list: [],
      loading: false,
      filter: {},
      page: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created() {
    this.initData()
  },
  filters: {
    fliterTime(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { resultList } = await eventManageList({ ...this.filter, ...this.page })

          this.list = resultList.length > 5 ? resultList.slice(0, 5) : resultList
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.initData()
    }, 1000 * 60)
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-event {
  box-sizing: border-box;
  padding: 0 $jc-default-dis $jc-default-dis/2;
  overflow: auto;
}

.jc-title .jc-right-box {
  font-size: 14px;
  color: #8bc1fc;
}

.jc-event-list {
  overflow-x: hidden;
  overflow-y: auto;

  .jc-list-item {
    padding: 15px 0;
    height: 120px;
    border-bottom: 1px solid rgba($color: #20499a, $alpha: 0.8);

    .img {
      width: 140px;
    }

    .jc-list-item-content {
      padding: 0 20px;
      justify-content: space-between;
      width: 0;

      .jc-list-item-content-title {
        color: #11e7ff;
        font-size: 16px;
        @include jc-text-warp;
      }

      .jc-list-item-content-position {
        color: #8bc1fc;
        font-size: 14px;
        @include jc-text-warp;
        margin-bottom: 10px;
      }

      .jc-list-item-content-detail {
        color: #8bc1fc;
        justify-content: space-between;
        span {
          @include jc-text-warp;
          display: inline-block;
        }
        .reportUserName {
          width: 20%;
        }
        .orgName {
          width: 20%;
          margin: 0 10%;
        }
        .createTime {
          width: 40%;
        }
      }
    }
  }
}

//出场入场动画
.jc-list-enter-active,
.jc-list-leave-active {
  transition: transform 0.6s, opacity 0.6s;
}

.jc-list-enter,
.jc-list-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.jc-list-leave-active {
  position: absolute;
}

.jc-list-move {
  transition: transform 0.6s;
}
</style>
