<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务名称：</div>
      <div class="jc-detail-content" v-text="detail.userName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">项目名称：</div>
      <div class="jc-detail-content" v-text="detail.account || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">创建时间：</div>
      <div class="jc-detail-content" v-text="detail.phone || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务时间：</div>
      <div class="jc-detail-content" v-text="detail.lawNbr || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务类型：</div>
      <div class="jc-detail-content" v-text="detail.chestNbr || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务状态：</div>
      <div class="jc-detail-content" v-text="detail.positionName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务来源：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">下发组织：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">下发人员：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务位置：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务人员：</div>
      <div class="jc-detail-content" v-text="detail.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">任务描述：</div>
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
  name: 'ScreenCommandProblemDetailRelateTask',
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
<style lang="scss" scoped>

</style>
