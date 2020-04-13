<template>
  <div class="jc-detail-card" v-loading="loading">
    <div class="jc-detail-line">
      <div class="jc-detail-item">组织名称： {{info.orgName}}</div>
      <div class="jc-detail-item">组织编码： {{info.orgCode}}</div>
    </div>
    <div class="jc-detail-line">
      <div class="jc-detail-item">是否同级查看： {{info.sameLevelAuth}}</div>
      <div class="jc-detail-item">默认接收人： {{info.defaultUser}}</div>
    </div>
    <div class="jc-detail-line">
      <div class="jc-detail-item">是否设置区域： {{info.setArea}}</div>
      <div class="jc-detail-item">添加时间： {{info.createTime}}</div>
    </div>
  </div>
</template>
<script>
import { organizationGet } from '@/api/organization'
import { formatDate } from '@/libs/util'

export default {
  name: 'SystemOrganizationInfo',
  data() {
    return {
      loading: false,
      info: { orgName: '--', orgCode: '--', sameLevelAuth: '--', defaultUser: '--', createTime: '--', setArea: '--' }
    }
  },
  methods: {
    initData(data) {
      if (data.orgId != this.info.orgId || data.type == 'manage') {
        this.loading = true
        organizationGet(data.orgId).then(res=> {
          Object.assign(this.info, {
            createTime: formatDate(res.createTime),
            orgId: res.orgId,
            orgName: res.orgName,
            pid: res.pid,
            sameLevelAuth: res.sameLevelAuth == 0 ? '否' : '是'
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-detail-card {
  padding: $jc-default-dis/2 $jc-default-dis;
}
.jc-detail-line {
  color: $jc-color-text-regular;
  .jc-detail-item {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    &:first-child {
      width: 220px;
    }
  }
}
</style>
