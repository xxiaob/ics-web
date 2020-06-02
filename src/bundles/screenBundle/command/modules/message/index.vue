<template>
  <div class="jc-screen-message">wewww</div>
</template>
<script>
export default {
  name: 'ScreenCommandMessage',
  props: ['options'],
  data() {
    return {
      index: 1
    }
  },
  created() {
    console.log('ScreenCommandMessage')
  },
  methods: {

  },
  activated() {
    console.log('ScreenCommandMessage activated')
  },
  deactivated() {
    console.log('ScreenCommandMessage deactivated')
  }
}
</script>
