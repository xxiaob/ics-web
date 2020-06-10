<template>
  <div class="caseSummary">
    <div class="title">
      <span>渣土专项执法</span>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='50' :duration='10000'></countTo>
          </span>
          <span class="unit">方</span>
        </p>
        <p>总出土量</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='6' :duration='10000'></countTo>
          </span>
          <span class="unit">辆</span>
        </p>
        <p>渣土车在线</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='4' :duration='10000'></countTo>
          </span>
          <span class="unit">个</span>
        </p>
        <p>出土工地数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='80' :duration='10000'></countTo>
          </span>
          <span class="unit">个</span>
        </p>
        <p>消纳场数</p>
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
        <p>检测报警数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='6' :duration='10000'></countTo>
          </span>
          <span class="unit">个</span>
        </p>
        <p>运输公司数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='4' :duration='10000'></countTo>
          </span>
          <span class="unit">个</span>
        </p>
        <p>卡点</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">
            <countTo :startVal='0' :endVal='2' :duration='10000'></countTo>
          </span>
          <span class="unit">件</span>
        </p>
        <p>违法案件</p>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  components: { countTo },
  name: 'slagSummary'
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
