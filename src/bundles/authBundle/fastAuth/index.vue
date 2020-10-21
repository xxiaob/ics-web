<template>
  <div class="jc-tip" v-text="tip"></div>
</template>
<script>
import { mapMutations } from 'vuex'
import { login, loginByCode } from '@/api/auth'

export default {
  name: 'FastAuth',
  data() {
    return {
      tip: '正在自动登录中，请稍后。。。'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      let { account, pwd, code, state, route } = this.$route.query

      console.log(this.$route.query, account, pwd, code, state, route)
      if (code || (account && pwd)) {
        try {
          let res = code ? await loginByCode({ code, state }) : await login({ userName: account, password: pwd })

          this.setUser(res)

          let goRoute = route ? route : res.userRespInnerDTO && res.userRespInnerDTO.entranceRouter ? res.userRespInnerDTO.entranceRouter : 'index'

          this.$router.push({ name: goRoute })
        } catch (error) {
          console.log(error)
        }
      } else {
        this.tip = '参数错误'
      }
    },
    ...mapMutations('user', ['setUser'])
  }
}
</script>
<style lang="scss" scoped>
.jc-tip {
  height: 40px;
  line-height: 40px;
}
</style>
