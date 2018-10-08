<template>
<div class="container">
<scroll-view class="scroll-view" scroll-y="true" scroll-x="true" @touchmove="moveTouch" @touchend="endTouch">
  <img src="/static/img/md2.jpg" style="width: 300px;height: 600px;" @touchmove="imgMove" @touchend="imgEnd">
</scroll-view>
</div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
    },
    onLoad () {

    },
    methods: {
      moveTouch (e) {
        console.log(e)
      },
      endTouch (e) {
        console.log(e)
      },
      imgMove (e) {
        console.log('img', e)
      },
      imgEnd (e) {
        console.log(e)
      }
    }
  }
</script>

<style lang="stylus">
.scroll-view
  width 300px
  height 300px
  margin 50px auto 0
</style>