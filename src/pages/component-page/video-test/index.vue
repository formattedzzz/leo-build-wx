<template>
  <div class="container">
    <swiper
      class="swiper-content"
      circular
      duration="700"
      :current="current"
      @animationfinish="slideEnd"
      vertical>
      <block v-for="(item, index) in posters" :key="index">
        <swiper-item class="swiper-item">
        <img mode="aspectFill" :src="item">
        </swiper-item>
      </block>
    </swiper>
    <video
      class="video"
      id="videoCtx"
      :class="{'video-hide': videoHide}"
      :src="videoSrc"
      objectFit="cover"
      :show-center-play-btn="false"
      :show-play-btn="false"
      :show-fullscreen-btn="false"
      :controls="false"
      :muted="muted"
      @ended="videoEnd"
      controls>
    </video>
    <cover-view 
      class="cover-video"
      @click="togglePlay('pause')"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd">
      <cover-view style="background: #0c0;" v-if="playing === false && shifting === false" class="play-btn" @click.stop="togglePlay('play')">
        <!-- <cover-image src="./img/play.png"></cover-image> -->
      </cover-view>
    </cover-view>
    <img src="./img/play.png">
  </div>
</template>

<script>
let posters = JSON.parse(`[
  "https://p1.pstatp.com/large/c9720000a23e329867bf.jpg",
  "https://p3.pstatp.com/large/c70f0006ccbcd00418c9.jpg",
  "https://p3.pstatp.com/large/abec0009981f65db041d.jpg",
  "https://p3.pstatp.com/large/98580016705a1c23906d.jpg",
  "https://p3.pstatp.com/large/9748000794086a639920.jpg",
  "https://p99.pstatp.com/large/96df000e4f79beb8e00e.jpg",
  "https://p98.pstatp.com/large/96d6000aa3b62732e28e.jpg",
  "https://p3.pstatp.com/large/91660007b189770e5c5d.jpg",
  "https://p3.pstatp.com/large/8fa6000ec31173d3d087.jpg",
  "https://p3.pstatp.com/large/871a001381d17c09d8ef.jpg",
  "https://p1.pstatp.com/large/86cd001569eeddad9ab1.jpg",
  "https://p99.pstatp.com/large/869800023a02fcbb2b5d.jpg",
  "https://p3.pstatp.com/large/852b0011279a71028388.jpg",
  "https://p3.pstatp.com/large/847d000718b33cd67771.jpg",
  "https://p98.pstatp.com/large/817a00097da09cd398bd.jpg",
  "https://p98.pstatp.com/large/8047000d0645794ec7e6.jpg",
  "https://p3.pstatp.com/large/7fde000981c2d0e7f134.jpg",
  "https://p3.pstatp.com/large/7f96000ae35564d6eb29.jpg",
  "https://p98.pstatp.com/large/7f080010e13e7ee1b0d0.jpg",
  "https://p3.pstatp.com/large/7ed8000fbcc5af0cd7ed.jpg",
  "https://p98.pstatp.com/large/7c5a0014fd70966dfd11.jpg"]`).slice(0, 4)
let videos = JSON.parse(`[
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fa70000bem3b6k0gfkid6lf7l8g&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f3e0000bekgvs7a1havabobd8m0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f320000bdsktm91h1vr7v7jfb4g&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f180000bd3msocps0slndhenapg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbd0000bd10asqiv5705547ddfg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fe70000bd0c3e0697asd67i83cg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbd0000bd05977k43aql419shvg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fe70000bcmergakr6gep80dd6t0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbd0000bcjtbdcthbi90j15qqfg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f9a0000bc3p95fijqt2hspfag50&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f180000bc2quqf3cp53oafc87f0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbc0000bc26d4rcp23da5q0v4r0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fe70000bc0e6scm7fie8i25kf6g&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f660000bbuksk51mikeotlg61a0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f9a0000bbo3opnibkti55cpmvu0&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbc0000bbm76tsr08m62r6m5rsg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fbd0000bbkt3t7k43aql45h8gbg&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=e1ab5cfe11a34bc0b2fbaab81c63a3fe&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=ffdff4b381ed468bb427f4478e30d62a&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=adea447668dc48bbb82bddd12c6c44ab&line=0",
  "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=ff6727c979a84cf5bffc1ef82c6262c9&line=0"]`).slice(0, 4)
// let startY, disY
export default {
  data () {
    return {
      posters,
      videoCtx: null,
      // posters: posters.slice(0, 4),
      // videos: videos.slice(0, 4),
      posterSrc: posters[0],
      videoSrc: videos[0],
      current: 0,
      videoHide: false,
      playing: false,
      shifting: false,
      muted: false
    }
  },
  components: {
  },
  computed: {
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
  },
  onShow () {
    this.videoCtx = wx.createVideoContext('videoCtx')
    this.videoCtx.play()
    this.playing = true
    this.muted = false
  },
  onHide () {
    this.muted = true
    this.videoCtx.pause()
    // console.log(this.videoCtx)
    this.videoCtx = null
  },
  methods: {
    touchStart (e) {
      if (e.touches.length === 1) {
        this.startY = e.touches[0].clientY
        this.startT = e.timeStamp
      }
    },
    touchMove (e) {
      if (e.touches.length === 1) {
        this.disY = e.touches[0].clientY - this.startY
        this.disT = e.timeStamp - this.startT
      }
    },
    touchEnd (e) {
      let direct = ''
      if (Math.abs(this.disX) <= 5) return
      if (Math.abs(this.disT / this.disY) < 2) {
        if (this.disY > 0) {
          direct = 'down'
        }
        if (this.disY < 0) {
          direct = 'up'
        }
        this.videoHide = true
        this.videoCtx.pause()
        this.playing = false
        if (this.shifting === false) {
          this.shiftVideo(direct)
        }
        this.disY = 0
        this.disT = 0
      }
    },
    shiftVideo (direct) {
      if (direct === 'up') {
        this.shifting = true
        this.current + 1 === posters.length ? this.current = 0 : this.current++
        this.videoSrc = videos[this.current]
      }
      if (direct === 'down') {
        this.shifting = true
        this.current - 1 === -1 ? this.current = posters.length - 1 : this.current--
        this.videoSrc = videos[this.current]
      }
    },
    slideEnd () {
      this.shifting = false
      this.videoHide = false
      this.videoCtx.play()
      this.playing = true
    },
    togglePlay (mark) {
      if (mark === 'pause') {
        this.videoCtx.pause()
        this.playing = false
      } else {
        this.videoCtx.play()
        this.playing = true
      }
    },
    videoEnd () {
      // this.videoHide = false
      // this.shiftVideo('up')
    }
  }
}
</script>

<style lang="stylus">
.account-btn
  width 50px
  height 50px
  border-radius 50%
  background #0c0
  position fixed
  bottom 10px
  left 50%
  transform translateX(-50%)
  box-shadow 0 0 4px #ddd
  img 
    width 50%
    height 50%
    margin 25%
.swiper-content
  width 100vw
  height 100vh
  position fixed
.swiper-item
  width 100%
  height 100%
  img
    width 100%
    height 100%
    // position absolute
    
.video
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  transform translateX(0)
  &.video-hide
    transform translateX(-100%)
.cover-video
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(255, 255, 255, 0)
  .play-btn
    width 50px
    height 50px
    position absolute
    left 50%
    top 50%
    border-radius 50%
    transform translateX(-50%) translateY(-50%)
    background rgba(0, 0, 0, 0.5)
    color #0c0
    text-align center
    font-size 14px
    line-height 50px
    cover-image
      width 100%
      height 100%
</style>
