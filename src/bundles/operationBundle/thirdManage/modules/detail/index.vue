<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">

    <div class="jc-user-content">
      <div class="jc-info-item">
        <label class="jc-info-label">第三方名称：</label>
        <div class="jc-info-content" v-text="info && info.thirdPartyName"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">组织名称：</label>
        <div class="jc-info-content" v-text="info && info.orgName"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">授权截止时间：</label>
        <div class="jc-info-content" v-text="info && info.endTime"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">appkey：</label>
        <div class="jc-info-content" v-text="info && info.appKey"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">appsecret：</label>
        <div class="jc-info-content" v-text="info && info.appSecret"></div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible=false">关闭窗口</el-button>
    </div>

  </el-dialog>
</template>
<script>
// import { userGet } from '@/api/user'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'OperationThirdDetail',
  mixins: [FormMixins],
  props: {
    info: {
      type: Object
    },
    title: {
      type: String,
      default: '第三方详情'
    }
  },
  data() {
    return {

    }
  },
  methods: {
    formatFormData() {
      return {}
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-info-item-height: 20px;
.jc-user-content {
  display: inline-block;
  text-align: left;
}
.jc-info-item {
  position: relative;
  padding-left: 120px;
  margin-bottom: 10px;
  .jc-info-label {
    position: absolute;
    text-align: right;
    width: 120px;
    line-height: $jc-info-item-height;
    top: 0;
    left: 0;
    color: $jc-color-text-secondary;
  }
  .jc-info-content {
    min-height: $jc-info-item-height;
    line-height: $jc-info-item-height;
  }
}
</style>
