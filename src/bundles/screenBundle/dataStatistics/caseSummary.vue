<template>
  <div class="caseSummary">
    <div class="title">
      <span>案件概要</span>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">50</span>
          <span class="unit">件</span>
        </p>
        <p>案件总数</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">6</span>
          <span class="unit">件</span>
        </p>
        <p>已结案</p>
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
          <span class="count">80</span>
          <span class="unit">%</span>
        </p>
        <p>结案率</p>
      </div>
    </div>
    <div class="content">
      <div class="jc-row-flex1">
        <p>
          <span class="count">49</span>
          <span class="unit">件</span>
        </p>
        <p>渣土运输</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">6</span>
          <span class="unit">件</span>
        </p>
        <p>水务执法</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">4</span>
          <span class="unit">件</span>
        </p>
        <p>违章建筑</p>
      </div>
      <div class="jc-row-flex1">
        <p>
          <span class="count">2</span>
          <span class="unit">件</span>
        </p>
        <p>餐饮油烟</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
