<template>
    <div class="jc-abstract-area jc-flex-warp jc-flex-vertical">
        <div class="jc-title">
            <span class="title">{{ title }}</span>
        </div>
       <div class="jc-flex-con">
           <slot></slot>
       </div>
    </div>
</template>

<script>
export default {
    name: 'ScreenDataStatisticsDataDockingDockBase',
    props: {
        title : {
            type : String,
            default: ""
        }
    }
}
</script>

<style lang="scss" scoped>
    .jc-title{
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAATCAYAAABLN4eXAAAAhUlEQVQoka2TQQqAMAwERwV9r18QFETx6nt8k3gRRam0XmxjA91LoGTZSUqyYTmIVAPUwKwxmcYCOPNYhzU8VWN6ldTUAqutH4UW4Ybegcq+XX9JbugyhCeihPBEFNPjwxNRQnhqGdNpXbsmqQc2YIw1Jf0nMV1zGr9JPrmFqe6pe5BhugFK1SpzSCdJlgAAAABJRU5ErkJggg==) no-repeat 0 10px;
        text-indent: 12px;
    }
</style>