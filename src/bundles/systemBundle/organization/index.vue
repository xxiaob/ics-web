<template>
  <div class="jc-main-container-warp">
    <tab-filter></tab-filter>
  </div>
</template>
<script>
export default {
  name: 'SystemOrganizationIndex',
  components: {
    TabFilter: () => import('./modules/tabFilter')
  }
}
</script>
