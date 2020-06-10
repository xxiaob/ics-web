<template>
  <div class="mapRight">
    <div class="jc-column-flex1">
      <p>
        <span class="count">25</span>
        <span class="unit">辆</span>
      </p>
      <p>网巡车辆</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">88</span>
        <span class="unit">个</span>
      </p>
      <p>临时摆摊</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">39</span>
        <span class="unit">个</span>
      </p>
      <p>视频监控</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">49</span>
        <span class="unit">个</span>
      </p>
      <p>无人机</p>
    </div>
    <div class="jc-column-flex1">
      <p>
        <span class="count">19</span>
        <span class="unit">个</span>
      </p>
      <p>在建工地</p>
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
