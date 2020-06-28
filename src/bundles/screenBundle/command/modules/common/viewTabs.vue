<template>
  <div class="jc-tabs-warp no-select">
    <div class="jc-tabs-item" v-for="item in checkItems" :key="item.value" @click="itemClick(item)" :class="{'jc-disabled': item.disabled, 'jc-active': value == item.value}" v-text="item.label"></div>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandViewTabs',
  model: { prop: 'value', event: 'change' },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    value: null
  },
  computed: {
    checkItems() {
      let items = []
      const defaultItem = { label: '', value: '', disabled: false }

      this.options.forEach(v => {
        let item = {}

        if (typeof v === 'object') {
          Object.assign(item, defaultItem, v)
        } else {
          Object.assign(item, defaultItem, { value: v })
        }

        if (item.value != '') {
          if (item.label == '') {
            item.label = item.value
          }
          items.push(item)
        }
      })
      return items
    }
  },
  methods: {
    itemClick(item) {
      if (!item.disabled) {
        this.$emit('change', item.value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-tabs-warp {
  display: flex;
  position: relative;
  font-size: $jc-font-size-base;
  text-align: center;
  border-bottom: solid 1px $jc-color-line-primary;
  .jc-tabs-item {
    flex: 1;
    cursor: pointer;
    line-height: 28px;
    border-right: solid 1px $jc-color-line-primary;
    padding: 0 $jc-default-dis/2;
    margin: 6px 0;
    @include jc-text-warp;
    &.jc-active {
      color: $jc-color-primary;
    }
    &.jc-disabled {
      color: $jc-color-text-secondary;
    }
    &:last-child {
      border-right: none;
    }
  }
}
</style>
