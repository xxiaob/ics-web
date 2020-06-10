<template>
  <div class="totalCount">
    <div class="title">
      <span>出勤情况(累计)</span>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">25</span>
          <span class="unit">人</span>
        </p>
        <p>在线人数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">466</span>
          <span class="unit">km</span>
        </p>
        <p>巡逻里程</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">139</span>
          <span class="unit">次</span>
        </p>
        <p>岗点触碰</p>
      </div>
    </div>
    <div class="title">
      <span>事件概要(累计)</span>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">49</span>
          <span class="unit">人</span>
        </p>
        <p>上报事件</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">6</span>
          <span class="unit">件</span>
        </p>
        <p>网巡反馈</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">4</span>
          <span class="unit">件</span>
        </p>
        <p>处理中</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">2</span>
          <span class="unit">件</span>
        </p>
        <p>已处理</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'totalCount'

}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;

  .jc-row-flex1 {
    flex: 1;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .count {
      font-size: 30px;
      color: #51cefc;
    }
    .unit {
      font-size: 20px;
      color: #51cefc;
    }
  }
}
</style>
