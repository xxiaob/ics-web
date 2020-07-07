<template>
  <el-dialog :title="user.userName" :visible.sync="visible" width="1000px" :close-on-click-modal="false" :append-to-body="true">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item label="日期" prop="date" :rules="rules.NOT_NULL">
        <el-date-picker v-model="form.date" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" :loading="loading" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="jc-map-warp" ref="myMap"></div>
  </el-dialog>
</template>
<script>
import { NOT_NULL } from '@/libs/rules'
import { JcMap, JcMapMarker } from '@/map'
import { initMoveAnimation } from '@/map/aMap/aMapUtil'
import { getUserHistoryPosition } from '@/api/screen'

let myJcMap = null

let startMarker, endMarker, moveMarker //定义开始，

export default {
  name: 'ScreenCommandUserDetailTrajectory',
  data() {
    return {
      form: { date: '' },
      loading: false,
      visible: true,
      user: { userId: '56776731599568896', userName: '--' },
      rules: { NOT_NULL }
    }
  },
  created() {
    this.$EventBus.$on('screen-user-trajectory', this.initData) //监听显示人员轨迹
    setTimeout(this.initData, 1000 * 5)
  },
  methods: {
    async initData() {
      if (!myJcMap) {
        myJcMap = new JcMap()
        await initMoveAnimation() //加载动画组件
        await myJcMap.init(this.$refs.myMap) //等待地图初始化
        // myJcMap.map.setPitch(45)
      }
      this.clearMap()
    },
    clearMap() {
      myJcMap.clearSign()
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          getUserHistoryPosition({ userId: this.user.userId, startTime: this.form.date[0], endTime: this.form.date[1] }).then((res) => {
            console.log('UserHistoryPosition', res)
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  },
  beforeDestroy() {
    if (myJcMap) {
      myJcMap.destroy()
    }
    startMarker = null
    endMarker = null
    moveMarker = null
    this.$EventBus.$off('screen-user-trajectory', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp {
  position: relative;
  width: 100%;
  height: 500px;
}
</style>
