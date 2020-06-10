<template>
  <div class="attend">
    <div class="title">
      <span>各区勤务情况</span>
    </div>
    <div class="content">
      <table>
        <tr v-for="first in list" :key="first">
          <td v-for="second in first" :key="second">{{second}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'attend',
  data() {
    return {
      list: [
        ['', '在线人数', '巡逻里程', '事件上报', '任务处理', '网巡上报', '视频查证'],
        ['南京', 30, 22, 15, 16, 12, 17],
        ['玄武', 30, 22, 15, 16, 12, 17],
        ['鼓楼', 30, 22, 15, 16, 12, 17],
        ['溧水', 30, 22, 15, 16, 12, 17],
        ['高淳', 30, 22, 15, 16, 12, 17]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  overflow: auto;
  font-size: 12px;
  table {
    height: 100%;
    tr:first-child td,
    tr td:first-child {
      color: rgb(18, 146, 246);
    }
    td {
      text-align: center;
    }
  }
}
</style>
