<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">

    <div class="jc-user-content">
      <div class="jc-info-item">
        <label class="jc-info-label">权力编码：</label>
        <div class="jc-info-content" v-text="info && info.powerEncode"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">权力名称常用：</label>
        <div class="jc-info-content" v-text="info && info.powerName"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">设定依据：</label>
        <div class="jc-info-content" v-text="info && info.powerGist"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">罚则：</label>
        <div class="jc-info-content" v-text="info && info.fineCriterion"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">法律适用情形：</label>
        <div class="jc-info-content" v-text="info && info.lawApply"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">裁量描述和结果：</label>
        <div class="jc-info-content" v-text="info && info.descResult"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">适用建议：</label>
        <div class="jc-info-content" v-text="info && info.suggestion"></div>
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
  padding-left: 140px;
  margin-bottom: 30px;
  .jc-info-label {
    position: absolute;
    text-align: right;
    width: 140px;
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
.el-dialog__body {
  padding: 30px;
}
</style>
