<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">

    <div class="jc-user-content">
      <div class="jc-info-item">
        <label class="jc-info-label">权利编码：</label>
        <div class="jc-info-content" v-text="info && info.one"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">权利名称常用：</label>
        <div class="jc-info-content" v-text="info && info.two"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">设定依据：</label>
        <div class="jc-info-content" v-text="info && info.three"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">罚则：</label>
        <div class="jc-info-content" v-text="info && info.four"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">法律适用情形：</label>
        <div class="jc-info-content" v-text="info && info.five"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">裁量情节描述: </label>
        <div class="jc-info-content" v-text="info && info.six"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">裁量结果：</label>
        <div class="jc-info-content" v-text="info && info.seven"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">适用建议：</label>
        <div class="jc-info-content" v-text="info && info.eight"></div>
      </div>
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
      default: '条例详情'
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
