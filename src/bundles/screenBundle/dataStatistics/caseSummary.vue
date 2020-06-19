<template>
  <div class="caseSummary">
    <div class="title">
      <span>立案案件概况</span>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='50' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>案件总数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='6' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>已结案</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='4' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>处理中</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='80' :duration='10000'></countTo>
          </span>
          <span class="unit">%</span>
        </p>
        <p>结案率</p>
      </div>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='49' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>渣土运输</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='6' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>水务执法</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='4' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>违章建筑</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='2' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>餐饮油烟</p>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  components: { countTo },
  name: 'caseSummary'
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
      font-size: 28px;
      color: #51cefc;
    }
    .unit {
      font-size: 16px;
      color: #51cefc;
    }
  }
}
</style>
