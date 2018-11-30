<template>
  <div class="container">
    <div class="weui-cells weui-cells_after-title">
      <navigator url="/pages/component-page/slide-list/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">跳转标题1</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/img-cut/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">跳转标题2</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/toggle-panel/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">跳转标题3</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/video-test/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">跳转标题4</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/video-list-test/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">跳转标题5</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>
    <!-- <video 
    style="width: 100%;"
    src="https://outin-389ec27ef3a211e8b82100163e1c8dba.oss-cn-shanghai.aliyuncs.com/customerTrans/6a9648b1f8508c39c95205b4215b7847/28a14667-1675e4ab2b4-0005-9f7e-b86-902a6.mp4?Expires=1543492984&OSSAccessKeyId=LTAIx2xjxmIyFov4&Signature=YBe3BeqTOBcmqSDmGxn55VnDJQk%3D" >
    </video> -->
    
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  computed: {
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
  },
  onShow () {
    // this.userInfo = wx.getStorageSync('userInfo')
    // this.req({
    //   url: '/api/admin'
    // }).then((res, data) => {
    //   // console.log(res)
    // }).catch((err) => {
    //   console.log(err)
    // })
  },
  onHide () {
  },
  methods: {
  },
  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style lang="stylus">

.weui-cells
  margin-top 20px
.video
  width 100%
</style>