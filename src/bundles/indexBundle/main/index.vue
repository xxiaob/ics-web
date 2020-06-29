<template>
  <div class="jc-main-full-container">
    <div class="jc-welcome"></div>
    <div class="jc-link-space">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="jc-link-warp">
            <div class="jc-link-content jc-ai">AI智能分析系统</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="jc-link-warp">
            <div class="jc-link-content jc-huanwei">指挥环卫系统</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="jc-link-warp">
            <div class="jc-link-content jc-anjian">案件管理系统</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="jc-link-warp">
            <div class="jc-link-content jc-other">城管其他系统平台</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexMain'
}
</script>
<style lang="scss" scoped>
.jc-main-full-container {
  display: flex;
  box-orient: vertical;
  flex-flow: column;
}
.jc-welcome {
  flex: 1;
  background: url(./assets/welcome-bg.png) no-repeat center;
  background-size: auto 80%;
}
.jc-link-space {
  margin: $jc-default-dis;
}
.jc-link-warp {
  position: relative;
  width: 100%;
  background: url(./assets/card-bg.png) no-repeat center;
  background-size: 100% 100%;
  cursor: pointer;
  padding-top: 56%;
  .jc-link-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding-top: 80px;
    height: 105px;
    margin: auto;
    background-repeat: no-repeat;
    background-position: top center;
    background-size: auto 80px;
    text-align: center;
    line-height: 25px;
    transform: scale(1);
    transition: transform 0.4s;
    &:hover {
      transform: scale(1.1);
    }
    &.jc-ai {
      background-image: url(./assets/ai.png);
    }
    &.jc-huanwei {
      background-image: url(./assets/huanwei.png);
    }
    &.jc-anjian {
      background-image: url(./assets/anjian.png);
    }
    &.jc-other {
      background-image: url(./assets/other.png);
    }
  }
}
</style>
