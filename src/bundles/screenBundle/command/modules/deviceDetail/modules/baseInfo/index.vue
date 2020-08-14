<template>
  <div class="jc-view-content" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp">
      <div class="jc-detail-label">设备名称：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.deviceName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">设备类型：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.deviceTypeName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">所属组织：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.orgName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">设备编号：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.deviceId || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label" title="IP地址及端口">IP地址及端口：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.positionName || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">接入协议：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.treatyType || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label" title="设备序列号">设备序列号：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.deviceSeriNum || '--'"></div>
    </div>
    <div class="jc-detail-warp">
      <div class="jc-detail-label">设备描述：</div>
      <div class="jc-detail-content" v-text="deviceDetaillData.descript || '--'"></div>
    </div>
  </div>
</template>
<script>


export default {
  name: 'ScreenCommandDeviceDetailBaseInfo',
  props: ['deviceDetaillData'],
  data() {
    return {
    }
  }
}
</script>
