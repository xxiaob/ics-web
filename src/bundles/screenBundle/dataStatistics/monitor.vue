<template>
  <div class="monitor">
    <div class="title">
      <span>重点区域监控</span>
    </div>
    <div class="content">
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">
          <div class="top">健康小区 9 栋 朝东</div>
          <div class="img">
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="top">健康小区 9 栋 朝东</div>
          <div class="img2">
          </div>
        </div>
      </div>
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">
          <div class="top">健康小区 9 栋 朝东</div>
          <div class="img">
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="top">健康小区 9 栋 朝东</div>
          <div class="img2">
          </div>
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
    .jc-row-flex1 {
      flex: 1;
      box-sizing: border-box;
      padding: 4px 8px;

      display: flex;
      flex-direction: column;

      .top {
        color: #2c9cde;
        text-align: center;
        height: 24px;
        line-height: 24px;
      }
      .img {
        flex: 1;
        background: url(./assets/monitor1.png) no-repeat;
        background-size: 100% 100%;
      }
      .img2 {
        flex: 1;
        background: url(./assets/monitor2.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
