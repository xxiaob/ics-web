<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题标题：</div>
      <div class="jc-detail-content" v-text="detail.userName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题ID：</div>
      <div class="jc-detail-content" v-text="detail.account || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">上报人员：</div>
      <div class="jc-detail-content" v-text="detail.phone || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">上报组织：</div>
      <div class="jc-detail-content" v-text="detail.lawNbr || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题类型：</div>
      <div class="jc-detail-content" v-text="detail.chestNbr || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">创建时间：</div>
      <div class="jc-detail-content" v-text="detail.positionName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题位置：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题状态：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">问题描述：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">附件：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
  </div>
</template>
<script>
import { userGet } from '@/api/user'

export default {
  name: 'ScreenCommandProblemDetailBaseInfo',
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
