<template>
  <div class="monitor">
    <div class="title">
      <span>实时上报事件</span>
    </div>
    <div class="content">
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">

        </div>
        <div class="jc-row-flex2">
          <p>2020年6月10日 12:22:22</p>
          <p>中国江苏省南京市江宁区开城路 188号 </p>
          <p>非机动车乱放</p>
          <p>
            <span>上报人:张三</span>
            <span class="jc-right">单位:江宁区</span>
          </p>
        </div>
      </div>
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">

        </div>
        <div class="jc-row-flex2">
          <p>2020年6月10日 12:22:22</p>
          <p>中国江苏省南京市江宁区开城路 188号 </p>
          <p>非机动车乱放</p>
          <p>
            <span>上报人:张三</span>
            <span class="jc-right">单位:江宁区</span>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'monitor'
}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  .jc-column-flex1 {
    flex: 1;

    display: flex;
    flex-direction: row;
    padding: 10px 8px;

    .jc-row-flex1 {
      flex: 3;
      box-sizing: border-box;
      background: url(./assets/monitor1.png) no-repeat;
      background-size: 100% 100%;
      border: 1px solid #1292f6;
    }
    .jc-row-flex2 {
      flex: 5;
      box-sizing: border-box;
      padding: 4px 8px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .jc-right {
        float: right;
      }
    }
  }
}
</style>
