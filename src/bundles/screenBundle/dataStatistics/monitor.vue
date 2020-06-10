<template>
  <div class="monitor">
    <div class="title">
      <span>重点区域监控</span>
    </div>
    <div class="content">
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">
          <div class="top">施工现场</div>
          <div class="img">
            <video src="/static/videos/1.mp4" autoplay muted width="100%" height="100%"></video>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="top">鼓楼广场</div>
          <div class="img">
            <video src="/static/videos/2.mp4" autoplay muted width="100%" height="100%"></video>
          </div>
        </div>
      </div>
      <div class="jc-column-flex1">
        <div class="jc-row-flex1">
          <div class="top">水西门大街</div>
          <div class="img">
            <video src="/static/videos/3.mp4" autoplay muted width="100%" height="100%"></video>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="top">新街口广场</div>
          <div class="img">
            <video src="/static/videos/4.mp4" autoplay muted width="100%" height="100%"></video>
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
        // background: url(./assets/monitor1.png) no-repeat;
        // background-size: 100% 100%;
        border: 1px solid #1292f6;
        position: relative;
        video {
          position: absolute;
        }
      }
    }
  }
}
</style>
