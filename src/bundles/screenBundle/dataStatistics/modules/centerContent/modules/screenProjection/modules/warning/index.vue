<template>
  <div class="jc-content data-statistics-scrollbar">
    <el-form label-width="100px" :model="form" size="mini">
      <el-form-item label="告警类型 : ">
        <span>{{form.alarmTypeName}}</span>
      </el-form-item>
      <el-form-item label="企业 : ">
        <span>{{form.transportCompany}}</span>
      </el-form-item>
      <el-form-item label="企业地址 : ">
        <span>{{form.transportCompanyAddress}}</span>
      </el-form-item>
      <el-form-item label="车牌号 : ">
        <span>{{form.carNumber}}</span>
      </el-form-item>
      <el-form-item label="时间 : ">
        <span>{{form.alarmDate}}</span>
      </el-form-item>
      <el-form-item label="车速 : ">
        <span>{{form.carSpeed}}</span>
      </el-form-item>
      <el-form-item label="状态 : ">
        <span>{{formatStatus(form.status)}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAlarmById } from '@/api/dregsAlarm'
import { MESSAGE_DATA_TYPES, SYSTEM_MESSAGE_TYPE, ALARM_STATUS } from '@/constant/Dictionaries'

export default {
  name: 'ScreenDataCenterContentScreenProjectionWarning',
  props: {
    options: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    formatStatus(value) {
      return ALARM_STATUS.toString(value)
    },
    async getDetail() {
      if (this.options && this.options.id && this.options.type === MESSAGE_DATA_TYPES.ALARM && this.options.systemSourceType == SYSTEM_MESSAGE_TYPE.DREGS) {
        try {
          const res = await getAlarmById(this.options.id)

          this.form = { ...res }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/index.scss";
</style>
