<template>
  <div ref="editor" class="jc-myeditor"></div>
</template>
<script>
import Editor from 'wangeditor'
import { uploadFile } from '@/api/upload'

export default {
  name: 'JcRichEditor',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      if (!this.editor) {
        if (this.$refs.editor) {
          this.editor = new Editor(this.$refs.editor)

          this.editor.customConfig.menus = [ 'head', 'bold', 'fontSize', 'italic', 'underline', 'strikeThrough', 'link', 'list', 'justify',
            'quote', 'image', 'table', 'undo', 'redo'] // 自定义菜单配置

          this.editor.customConfig.showLinkImg = false // 隐藏“网络图片”tab
          this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024
          this.editor.customConfig.uploadImgMaxLength = 1
          this.editor.customConfig.customUploadImg = function (files, insert) {
            if (files.length) {
              uploadFile({ file: files[0] }).then(res => {
                insert(res.url)
              })
            }
          }
          this.editor.customConfig.onchange = (html) => {
            this.$emit('change', html)
          }
          this.editor.create()
        } else {
          setTimeout(this.initData, 1000)
          return
        }
      }
      this.editor.txt.html(this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-myeditor {
  /deep/ .w-e-toolbar {
    line-height: 28px;
  }
}
</style>
