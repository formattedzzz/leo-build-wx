<template>
  <div class="page">
    <div class="video-item" v-for="(poster, idx) in posterArr" :key="idx">
      <video 
      v-if="idx === currentIdx"
      :src="idx === currentIdx ? videoArr[idx] : ''" 
      :id="'video' + idx"
      :controls="false" muted class="video">
      </video>
      <div v-else class="poster"><img :src="poster"></div>
      <cover-view @click="shiftVideo(idx)" class="video-cover"></cover-view>
    </div>
  </div>
</template>

<script>
  let videoArr = [
    'https://outin-389ec27ef3a211e8b82100163e1c8dba.oss-cn-shanghai.aliyuncs.com/customerTrans/6a9648b1f8508c39c95205b4215b7847/28a14667-1675e4ab2b4-0005-9f7e-b86-902a6.mp4?Expires=1543492984&OSSAccessKeyId=LTAIx2xjxmIyFov4&Signature=YBe3BeqTOBcmqSDmGxn55VnDJQk%3D',
    'http://1254101407.vod2.myqcloud.com/73b71258vodgzp1254101407/db7fa1bb5285890783243898733/AFisY26lTIwA.mp4',
    'http://1254101407.vod2.myqcloud.com/73b71258vodgzp1254101407/d9173ab75285890783243786409/T8xnbccWyAkA.mp4',
    'http://1254101407.vod2.myqcloud.com/73b71258vodgzp1254101407/db5bece25285890783243879399/SDKFGpnW7boA.mp4',
    'http://1254101407.vod2.myqcloud.com/73b71258vodgzp1254101407/db5c02035285890783243879886/9VelJUiHwbQA.mp4'
  ]
  let posterArr = [
    'https://p1.pstatp.com/large/c9720000a23e329867bf.jpg',
    'https://p3.pstatp.com/large/c70f0006ccbcd00418c9.jpg',
    'https://p3.pstatp.com/large/abec0009981f65db041d.jpg',
    'https://p3.pstatp.com/large/98580016705a1c23906d.jpg',
    'https://p3.pstatp.com/large/91660007b189770e5c5d.jpg'
  ]
  export default {
    data () {
      return {
        videoArr,
        posterArr,
        videoCtx: null,
        currentIdx: ''
      }
    },
    computed: {

    },
    onLoad () {

    },
    onShow () {

    },
    onHide () {
      this.videoCtx.pause()
    },
    methods: {
      shiftVideo (idx) {
        if (idx === this.currentIdx) return
        this.currentIdx = idx
        this.videoCtx = wx.createVideoContext('video' + idx)
        setTimeout(() => {
          this.videoCtx.play()
        }, 100)
      }
    },
    components: {

    }
  }
</script>

<style lang="stylus">
.page
  width 100%
  min-height 100vh
.video-item
  width 100%
  height 210px
  position relative
  margin-bottom 50px
.video, .poster
  width 100vw
  height 210px
.poster
  img
    width 100%
    height 100%
.video-cover
  width 100%
  height 100%
  background rgba(255, 255, 255, 0.3)
  position absolute
  left 0
  top 0
  z-index 9
</style>
