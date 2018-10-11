<template>
<div class="charts-page">
  <video 
    id="testVideo" 
    src="https://vodkgeyttp8.vod.126.net/cloudmusic/JDEgISEzICEgYiEiIDEwMg==/mv/389297/efc3c21176b701f412d22b8dac45a1ae.mp4?wsSecret=31d744b3ea5485d6c7e0f52de54507fd&wsTime=1538965413"
    binderror="videoErrorCallback"
    :danmu-list="danmuList"
    enable-danmu
    danmu-btn
    controls>
  </video>
  <button @click="sendDanmu" style="margin: 10px;" type="primary">发送弹幕</button>
</div>
</template>

<script>
  let getRandomColor = function () {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  }
  export default {
    data () {
      return {
        danmuList: [
          {
            text: '第 1s 出现的弹幕',
            color: '#ff0000',
            time: 1
          },
          {
            text: '第 3s 出现的弹幕',
            color: '#ff00ff',
            time: 3
          }
        ],
        videoContext: null
      }
    },
    computed: {
      baseURL () {
        return this.baseURL
      }
    },
    onReady () {
      this.videoContext = wx.createVideoContext('testVideo')
    },
    methods: {
      sendDanmu () {
        this.videoContext.sendDanmu({
          text: '这是实验弹幕',
          color: getRandomColor()
        })
      }
    }
  }
</script>

<style lang="stylus">
#testVideo
  width 100%
  height 240px
</style>