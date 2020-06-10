<template>
  <div class="mapRight">
    <div class="jc-column-flex1">
      <p>
        <span class="count">25</span>
        <span class="unit">人</span>
      </p>
      <p>在线人数</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">466</span>
        <span class="unit">km</span>
      </p>
      <p>巡逻里程</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">139</span>
        <span class="unit">次</span>
      </p>
      <p>上报事件</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">49</span>
        <span class="unit">件</span>
      </p>
      <p>网巡反馈</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">19</span>
        <span class="unit">件</span>
      </p>
      <p>AI智能分析</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mapRight'

}
</script>

<style lang="scss" scoped>
.mapRight {
  width: 100px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  z-index: 100;
  background: rgba($color: #011128, $alpha: 0.7);

  .jc-column-flex1 {
    flex: 1;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .count {
      font-size: 28px;
      color: #51cefc;
    }
    .unit {
      font-size: 16px;
      // color: #51cefc;
    }
  }
}
</style>
