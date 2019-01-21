<template>
<div class="charts-page">
  <!-- <video 
    id="testVideo" 
    class="video"
    src="https://vodkgeyttp8.vod.126.net/cloudmusic/JDQgMCAlMCBkMCQgMDAgIA==/mv/5500070/517910b2413896785f271f89e36001ce.mp4?wsSecret=cc889e42c3fbce17cd2df3574e9c3a0d&wsTime=1539762297"
    :danmu-list="danmuList"
    enable-danmu
    @waiting="videoWating"
    @error="videoError"
    custom-cache="false"
    danmu-btn
    controls>
  </video> 
  <button @click="sendDanmu" style="margin: 10px;" type="primary">发送弹幕</button> -->
  <video
    v-if="tempath"
    :src="tempath"
    class="video"
    :danmu-list="danmuList"
    enable-danmu
    @waiting="videoWating"
    @error="videoError"
    custom-cache="false"
    danmu-btn
    controls>
  </video>
  <button @click="chooseVideo" style="margin: 10px;" type="primary">选择视频</button>
  <button @click="uploadVideo" style="margin: 10px;" type="primary">上传</button>
  <h5 v-if="respath">
    返回URL：{{baseURL + respath}}
  </h5>
  <video
    v-if="respath"
    :src="baseURL + respath"
    class="video"
    :danmu-list="danmuList"
    enable-danmu
    @waiting="videoWating"
    @error="videoError"
    custom-cache="false"
    danmu-btn
    controls>
  </video>
  <button @click="uploadImages" style="margin: 10px;" type="primary">上传图片</button>
  <div v-if="imgrespath.length">
    <img style="width: 50%;" mode="widthFix" v-for="(item, index) in imgrespath" :key="index" :src="baseURL + item">    
  </div>
  <!-- <video
    src="http://localhost:7003/upload/test.mp4"
    class="video"
    @waiting="videoWating"
    controls>
  </video> -->
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
        videoContext: null,
        tempath: '',
        respath: '',
        imgrespath: []
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
      },
      videoWating (res) {
        console.log(res)
      },
      videoError (err) {
        console.log(err)
      },
      chooseVideo () {
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success: (res) => {
            console.log(res.tempFilePath)
            this.tempath = res.tempFilePath
          }
        })
      },
      uploadVideo () {
        let tempath = this.tempath
        if (tempath === '') {
          wx.showToast({
            title: '请选择视频',
            icon: 'none'
          })
          return
        }
        wx.showLoading()
        wx.uploadFile({
          url: this.baseURL + '/upload/video',
          // url: 'https://wx.nnleo.cn/upload/video',
          filePath: tempath,
          name: 'video',
          success: (res) => {
            // console.log(res.data)
            this.respath = JSON.parse(res.data).path
            wx.hideLoading()
          }
        })
      },
      uploadImages () {
        wx.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths)
            wx.uploadFile({
              url: this.baseURL + '/upload/image', // 上传的接口
              // url: 'https://wx.nnleo.cn/upload/image',
              filePath: tempFilePaths[0],
              name: 'image', // 上传的后端可接受字段，不能随意更改
              formData: {
                user: 'test'
              },
              user: 'test',
              success: (res) => {
                // console.log(res) // res.code被微信转为了string
                let path = JSON.parse(res.data).path
                path.forEach((item, index) => {
                  path[index] = item.replace(/\\/g, '/') // 处理window下返回路径为\的问题
                })
                this.imgrespath = path
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
.charts-page
  height 2000px
  overflow hidden
.video
  width 100%
  height 240px
</style>