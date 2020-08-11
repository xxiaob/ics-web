<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">在线状态：</div>
      <div class="jc-detail-content" v-text="detail.userName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">位置信息：</div>
      <div class="jc-detail-content" v-text="detail.account || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">视频信息：</div>
      <div class="jc-detail-content" v-text="detail.phone || '--'"></div>
    </div>
  </div>
</template>
<script>
import { userGet } from '@/api/user'

export default {
  name: 'ScreenCommandDeviceDetailWorkingInfo',
  props: ['options', 'project'],
  data() {
    return {
      loading: false,
      detail: {}
    }
  },
  computed: {
    userRoles() {
      if (this.detail.roles && this.detail.roles.length) {
        let rolesName = []

        this.detail.roles.forEach(item => {
          rolesName.push(item.roleName)
        })
        return rolesName.join('，')
      }
      return '--'
    }
  },
  watch: {
    options() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      this.detail = {}
      try {
        this.detail = await userGet({ userId: this.options.userId })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
