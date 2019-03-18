<template>
  <div class="issue-page">
    <div class="temp-box">
      <div class="temp-item" v-for="(temp, idx) in tempArr" :key="idx">
        <img v-if="temp.ok"  class="delete-btn" src="/static/svg/upload-ok.svg">
        <img v-else class="delete-btn" @click="deleteTemp(idx)" src="/static/svg/delete.svg">
        <div class="img-con" @click="checkImg(idx)">
          <img class="temp-img" mode="widthFix" :src="temp.path">
        </div>
        <span class="size-info">{{temp.infoTxt}}</span>
        <input :value="temp.name" :data-idx="idx" @blur="rename" class="img-name" :class="{'show-name': showName && !temp.ok}" type="text">
      </div>
      <div v-if="tempArr.length < 6" class="temp-item" @click="addImg">
        <div class="add-temp"><img src="/static/svg/account-add.svg"></div>
      </div>
    </div>
    <div class="res-box">
      <div class="res-item" v-if="resArr.length" v-for="(img, idx) in resArr" :key="img">
        <span class="img-name">{{img.name}}</span>
        <span class="img-size">{{img.sizeTxt}}</span>
        <span class="img-compress"> -{{img.rate}}%</span>
        <span class="img-link" @click="copyLink(img.path)">LINK</span>
      </div>
    </div>
    <div class="btn-box">
      <div class="handle-btn rename-btn" hover-class="click" hover-start-time="0" @click="showName = !showName">
        <img src="/static/svg/info.svg">
        <span>rename</span>
      </div>
      <div class="handle-btn clear-btn" hover-class="click" hover-start-time="0" @click="clearAll">
        <img src="/static/svg/delete-fff.svg">
        <span>clear</span>
      </div>
      <div class="handle-btn upload-btn" hover-class="click" hover-start-time="0" @click="handleUpload">
        <img src="/static/svg/upload.svg">
        <span>upload</span>
      </div>
    </div>
    <login-modal></login-modal>
  </div>
</template>

<script>
  import loginModal from '@/components/loginModal'
  let current = 0
  export default {
    data () {
      return {
        tempArr: [],
        showName: false,
        tempAdding: false,
        resArr: [],
        hasImglength: 0
      }
    },
    onLoad () {
      this.getopenid()
      this.getImgNum()
      this.eventBus.$on('updataImgNum', () => {
        this.getImgNum()
      })
      this.eventBus.$on('hideLogin', (data) => {
        this.getopenid()
      })
    },
    methods: {
      getopenid () {
        this.req({
          url: '/api/openid'
        }).then(({data}) => {
          let res = data
          if (res.code) {
            /* eslint-disable */
            this.__proto__.openid = res.openid
          }
        })
      },
      getImgNum () {
        this.req({
          url: '/api/get-album'
        }).then(({data}) => {
          let res = data
          if (res.code) {
            let pathArr = JSON.parse(res.data)
            this.hasImglength = pathArr.length
          }
        })
      },
      addImg () {
        if (this.tempArr.length >= 6) {
          wx.showToast({
            title: '一次性最多压缩六张o',
            icon: 'none'
          })
          return
        }
        this.tempAdding = true
        wx.chooseImage({
          count: 6 - this.tempArr.length,
          sizeType: ['compressed'],
          success: (res) => {
            let temps = res.tempFilePaths
            let fs = wx.getFileSystemManager()
            temps = temps.map((temp, idx) => {
              let obj = {}
              obj.path = temp
              obj.size = fs.statSync(temp).size
              obj.infoTxt = obj.size < 1000 * 1000 ? Math.ceil(obj.size / 1000) + 'K' : (obj.size / 1024 / 1024).toFixed(2) + 'M'
              obj.name = ''
              obj.ok = false
              return obj
            })
            this.tempArr = this.tempArr.concat(temps)
          },
          complete: () => {
            this.tempAdding = false
          }
        })
      },
      rename (e) {
        if (this.tempAdding) return
        let idx = e.target.dataset.idx
        let val = e.target.value
        if (!/[\u4e00-\u9fa5]/.test(val)) {
          this.tempArr[idx].name = val
        } else {
          wx.showToast({
            title: '还是不要输入中文吧',
            icon: 'none'
          })
          this.tempArr[idx].name = ''
          this.showName = false
        }
      },
      handleUpload () {
        if (this.hasImglength >= 50) {
          wx.showToast({
            title: '超出限额,请前往相册自行删除',
            icon: 'none'
          })
          return
        }
        let {tempArr} = this
        if (!tempArr.length || this.tempAdding) return
        if (!this.openid) {
          wx.showToast({
            title: '没openid不能保存o',
            icon: 'none'
          })
        }
        this.showName = false
        tempArr.forEach((temp) => {
          if (!/\S/.test(temp.name)) {
            temp.name = Math.random().toString(36).substr(2)
          } else {
            temp.name = temp.name.replace(/\s/g, '')
          }
        })
        let uploadArr = tempArr.filter((item) => {
          return item.ok === false
        })
        // wx.showLoading()
        // let process = 0
        // console.log(tempArr)
        if (uploadArr.length) {
          this.uploadImgArr(uploadArr)
        }
      },
      uploadImgArr (uploadArr) {
        wx.showLoading()
        wx.uploadFile({
          url: this.baseURL + '/upload/image',
          filePath: uploadArr[current].path,
          name: 'image',
          header: {
            openid: this.openid,
            name: uploadArr[current].name
          },
          success: (res) => {
            let data = JSON.parse(res.data)
            let pathArr = data.pathArr
            pathArr.forEach((item, index) => {
              let normalPath = item.path.replace(/\\/g, '/')
              let temparray = normalPath.split('/')
              item.path = this.baseURL + normalPath
              item.name = temparray[temparray.length - 1]
              item.sizeTxt = item.size < 1000 * 1000 ? Math.ceil(item.size / 1000) + 'K' : (item.size / 1024 / 1024).toFixed(2) + 'M'
              item.rate = 100 - (item.size / this.tempArr[this.resArr.length].size).toFixed(2) * 100
            })
            this.tempArr[this.resArr.length].ok = true
            this.resArr.push(pathArr[0])
            current++
            if (current < uploadArr.length) {
              this.uploadImgArr(uploadArr)
            } else {
              current = 0
              wx.hideLoading()
            }
          }
        })
      },
      deleteTemp (idx) {
        this.tempArr.splice(idx, 1)
      },
      checkImg (idx) {
        wx.previewImage({
          urls: this.tempArr.map(temp => temp.path),
          current: this.tempArr[idx].path
        })
      },
      clearAll () {
        if (this.tempAdding) return
        wx.showModal({
          content: '清空面板继续上传,请到我的相册查看压缩好的照片',
          success: (res) => {
            if (res.confirm) {
              this.tempArr = []
              this.resArr = []
              current = 0
            }
          }
        })
      },
      copyLink (link) {
        wx.setClipboardData({
          data: link,
          success: () => {
            wx.showToast({
              title: '已复制到剪贴板'
            })
          }
        })
      }
    },
    components:{
      loginModal
    }
  }
</script>

<style lang="stylus">
.issue-page
  background #555
  min-height 100vh
.temp-box
  width 100%
  padding 15px
  display flex
  // justify-content space-between
  flex-wrap wrap
  align-items center
  border-bottom 1rpx solid #fff
.temp-item
  width 115px
  height @width
  padding 10px
  position relative
  .delete-btn
    width 20px
    height 20px
    position absolute
    right 0px
    top 0px
    z-index 9
  .img-con
    width 100%
    height 100%
    background #000
    position relative
    overflow hidden
  .temp-img
    width 100%
    position absolute
    top 50%
    transform translateY(-50%)
  .size-info
    display inline-block
    width 42px
    height 16px
    background #e50
    color #fff
    border-radius 3px
    line-height 16px
    text-align center
    font-size 10px
    position absolute
    bottom 2px
    right 10px
    opacity 0.8

  .img-name
    width 0
    height 28px
    position absolute
    left 10px
    bottom 10px
    background #ffffff
    border-top 1rpx solid #ccc
    padding 0
    margin 0
    font-size 14px
    color #ee5500
    line-height 28px
    text-align center
    border-radius 0
    visibility hidden
    transition all 0.2s ease-out
    &.show-name
      width 95px
      visibility visible

.add-temp
  width 100%
  height 100%
  padding 20px
  border-radius 50%
  border 1rpx dashed #fff
  img
    width 100%
    height 100%
    position relative

.res-box
  width 100%
  padding 20px 10px
  color #555
  font-size 14px
  .res-item
    background #ffffff
    margin-bottom 10px
    padding 8px 10px
    display flex 
    justify-content space-between
    align-items center
  .img-name
    color #ff9300
    font-size 16px
    width 150px
    flex-shrink 0
    overflow hidden
  .img-compress
    color #0c0
    width 44px
  .img-size
    width 44px
  .img-link
    width 60px
    height 24px
    line-height 24px
    display inline-block
    background #ff9300
    color #fff
    font-size 16px
    border-radius 2px
    text-align center

.btn-box
  width 100%
  position fixed
  left 0
  bottom 0
  padding 12px
  display flex
  justify-content space-between
  align-items center
  .handle-btn
    display flex
    justify-content space-between
    align-items center
    width 100px
    height 36px
    border-radius 18px
    padding 0 12px
    font-size 15px
    color #fff
    background #ee5500
    img
      width 20px
      height 20px
  .rename-btn
    padding-left 10px
    img 
      width 24px
.click
  opacity 0.5

</style>
