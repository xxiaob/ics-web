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
import { getOrgInfo } from '@/api/area'

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
      this.loading = true
      getOrgInfo(data.orgId).then(res=> {
        Object.assign(this.info, {
          createTime: res.createrTime,
          orgId: res.orgId,
          orgName: res.orgName,
          orgCode: res.orgCode,
          defaultUser: res.receivers && res.receivers.length ? res.receivers.join('，') : '--',
          pid: res.pid,
          setArea: res.settingArea == 0 ? '否' : '是',
          sameLevelAuth: res.sameLevelAuth == 0 ? '否' : '是'
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
