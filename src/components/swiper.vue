<template>
<div class="swiper-container" :style="wrapStyle">
  <div class="video" style="background:#000;" v-for="(v,index) in choosed" :key="index" :style="strStyles[index]">
    <img :src="v" mode="aspectFill" style="height:100vh;width:100vw;margin:0 auto"></img>
  </div>
</div>
</template>
 
<script>
  export default {
    data () {
      return {
        wrapStyle: '',
        prev: null,
        styles: [0, 100, -100]
      }
    },
    props: {
      current: {
        default: 0,
        type: Number
      },
      choosed: {

      }
    },
    computed: {
      strStyles () {
        return this.styles.map(n => `transform:translateY(${n}%)`)
      }
    },
    watch: {
      current (now, prev) {
        /**
         * 0 100 -100
         * 0 100 200
         * 300 100 200
         */
        this.prev = prev
        if (this.current === 0) {
          if (this.prev === 2) {
            this.styles = [
              300, 100, 200
            ]
            this.wrapStyle = 'transform:translateY(-100%)'
            setTimeout(() => {
              this.wrapStyle = 'transition:none'
              this.styles = [0, 100, -100]
            }, 600)
          } else {
            this.styles = [
              0, 100, -100
            ]
            this.wrapStyle = 'transform:translateY(-0%)'
          }
        }
        if (this.current === 1) {
          this.styles = [0, 100, 200]
          this.wrapStyle = 'transform:translateY(-33.33333%)'
        }
        if (this.current === 2) {
          if (this.prev === 1) {
            this.styles = [300, 100, 200]
            this.wrapStyle = 'transform:translateY(-66.6667%)'
          } else {
            this.wrapStyle = 'transform:translateY(-100%);transition:none'
            this.styles = [300, 100, 200]
            setTimeout(() => {
              this.wrapStyle = 'transform:translateY(-66.6667%)'
            }, 50)
          }
        }
      }
    }
  }
</script>
 
<style lang="stylus">
.swiper-container
  width 100vw
  height 300vh
  background #000
  transition transform ease 0.5s
  .video
    position absolute 
    top 0
.top-0
  transform translateY(-0%)
  div
    transform translateY(0%)
.top-1
  transform translateY(-33.3333%)
.top-2
  transform translateY(-66.6667%)
.top-00
  transform translateY(-100%)
</style>