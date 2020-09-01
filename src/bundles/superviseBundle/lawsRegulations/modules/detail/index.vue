<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="700px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose">

    <div class="jc-user-content">
      <div class="jc-info-item">
        <label class="jc-info-label">法规类型：</label>
        <div class="jc-info-content" v-text="info && info.statuteTypeName"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">法规名称：</label>
        <div class="jc-info-content" v-text="info && info.statuteName"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">法规描述：</label>
        <div class="jc-info-content" v-text="info && info.statuteDesc"></div>
      </div>
      <div class="jc-info-item">
        <label class="jc-info-label">法规内容：</label>
        <div class="jc-info-content jc-info-editor" v-html="info && info.statuteText"></div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import { userGet } from '@/api/user'
import FormMixins from '@/mixins/FormMixins'

export default {
  name: 'superviseLawsAndRegulationsDetail',
  mixins: [FormMixins],
  props: {
    info: {
      type: Object
    },
    title: {
      type: String,
      default: '法规详情'
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
  margin-bottom: 20px;
  .jc-info-label {
    position: absolute;
    text-align: right;
    width: 120px;
    line-height: $jc-info-item-height * 1.6;
    top: 0;
    left: 0;
    color: $jc-color-text-secondary;
  }
  .jc-info-content {
    min-height: $jc-info-item-height;
    line-height: $jc-info-item-height * 1.6;
    padding-left: 1em;

    > ol {
      padding-left: 16px;
    }
    img {
      width: 100%;
    }
  }
}
</style>
