<template>
  <div class="album-page">
    <div class="img-box">
      <div 
        class="img-item" 
        v-for="(item, idx) in pathArr" 
        :key="idx" 
        @click="previewImg(idx)" 
        @longpress="showDel = true">
        <img mode="widthFix" :src="baseURL + item.path">
        <div class="del-div" v-if="showDel" @click.stop="toggleCheck(idx)" >
          <span class="check-box" :class="{'checked': item.checked}"></span>
        </div>
      </div>
    </div>
    <div class="btn-box" v-if="showDel">
      <div class="handle-btn rename-btn" hover-class="click" hover-start-time="0" @click="showDel = false">
        <img src="/static/svg/info.svg">
        <span>cancel</span>
      </div>
      <div class="handle-btn rename-btn" hover-class="click" hover-start-time="0" @click="checkLink">
        <img src="/static/svg/info.svg">
        <span>links</span>
      </div>
      <div class="handle-btn upload-btn" hover-class="click" hover-start-time="0" @click="postDelete">
        <img src="/static/svg/delete-fff.svg">
        <span>delete</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pathArr: [],
      showDel: false
    }
  },
  computed: {
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
    this.req({
      url: '/api/get-album'
    }).then(({data}) => {
      // console.log(data)
      let res = data
      if (res.code) {
        let pathArr = JSON.parse(res.data)
        this.pathArr = pathArr.map((img) => {
          // img.checked = false
          return {
            path: img,
            checked: false
          }
        })
      }
    })
  },
  onUnload () {
    this.showDel = false
  },
  methods: {
    previewImg (idx) {
      wx.previewImage({
        urls: this.pathArr.map(img => this.baseURL + img.path),
        current: this.baseURL + this.pathArr[idx].path
      })
    },
    toggleCheck (idx) {
      this.pathArr[idx].checked = !this.pathArr[idx].checked
    },
    postDelete () {
      let arr = this.pathArr.filter((item) => {
        return item.checked
      }).map(img => img.path)
      if (!arr.length) return
      wx.showLoading()
      this.req({
        url: '/api/del-album',
        method: 'POST',
        data: {
          delArr: arr
        }
      }).then(({data}) => {
        let res = data
        wx.hideLoading()
        if (res.code) {
          wx.showToast({
            title: '删除成功'
          })
          this.pathArr = this.pathArr.filter((item) => {
            return !item.checked
          })
          this.showDel = false
        }
      })
    },
    checkLink () {

    }
  },
  components: {
    
  }
}
</script>

<style lang="stylus">
.album-page
  background #555
.img-box
  width 100%
  display flex
  align-items center
  flex-wrap wrap
  padding-top 9px
  .img-item
    width 113px
    height 113px
    margin 0 0 9px 9px
    overflow hidden
    position relative
    background #000
    img
      position absolute
      width 100%
      top 50%
      left 0
      transform translateY(-50%)
    .del-div
      width 100%
      height 100%
      background rgba(255, 255, 255, 0.2)
      position relative
      .check-box
        position absolute
        display inline-block
        width 20px
        height 20px
        background transparent
        box-sizing border-box
        border-radius 50%
        border 1px solid #fff
        right 0px
        top 0px
        &.checked
          background #0c0
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
</style>
