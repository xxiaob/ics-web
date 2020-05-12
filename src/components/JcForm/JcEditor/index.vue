<template>
  <div ref="editor" class="wcp-myeditor"></div>
</template>
<script>
import Editor from 'wangeditor'

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
