<template>
  <el-dialog title="查看配置" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form" size="small">
      <el-form-item label="考勤名称">
        <span>{{form.attendanceName}}</span>
      </el-form-item>
      <el-form-item label="上班时间">
        <span>{{form.startWorkTime}}</span>
      </el-form-item>
      <el-form-item label="下班时间">
        <span>{{form.endWorkTime}}</span>
      </el-form-item>
      <el-form-item label="启用">
        <span>{{form.enabled?'是':'否'}}</span>
      </el-form-item>
      <el-form-item label="考勤区域">
        <span>{{form.orgName}}</span>
        <div ref="myMap" class="jc-area-warp"></div>
      </el-form-item>
      <el-form-item label="考勤人员">
        <span>{{form.users}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import FormMixins from '@/mixins/FormMixins'
import { ATTEND_CONFIGURE_STATUSES } from '@/constant/Dictionaries'
import viewOrgMixins from '../manage/viewOrgMixins'

import { JcMap } from '@/map'
let myJcMap

export default {
  name: 'ConfigureDetail',
  mixins: [FormMixins, viewOrgMixins],
  data() {
    return {
      ATTEND_CONFIGURE_STATUSES
    }
  },
  methods: {
    initMap(orgId) {
      if (!myJcMap) {
        this.$nextTick(() => {
          myJcMap = new JcMap()
          myJcMap.init(this.$refs.myMap).then(() => {
            this.viewControl(myJcMap, orgId).then(() => {
              myJcMap.fitView()
            })
          })
        })
      } else {
        this.$nextTick(() => {
          this.viewControl(myJcMap, orgId).then(() => {
            myJcMap.fitView()
          })
        })
      }
    },
    formatFormData() {
      if (this.options) {
        const { id, attendanceName, startWorkTime, endWorkTime, enabled, orgId, orgName, users } = this.options

        if (orgId) {
          this.initMap(orgId)
        }
        return { id, attendanceName, startWorkTime, endWorkTime, enabled, orgId, orgName, users: users.map(user => user.userName).join(' ') }
      } else {
        return {}
      }
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
    myJcMap = null
  }
}
</script>
<style lang="scss" scoped>
.jc-area-warp {
  height: 233px;
}
</style>
