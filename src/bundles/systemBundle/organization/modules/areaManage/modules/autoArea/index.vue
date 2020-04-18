<template>
  <div class="jc-auto-area">
    <el-select v-model="adcode" placeholder="请选择">
      <el-option v-for="item in list" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'SystemOrganizationAutoArea',
  data() {
    return {
      list: [],
      adcode: ''
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
