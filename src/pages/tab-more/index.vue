<template>
  <div class="container">
    <div class="weui-cells weui-cells_after-title">
      <!-- <navigator url="/pages/component-page/slide-list/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">滑动列表</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/img-cut/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">图片裁剪</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/toggle-panel/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">折叠面板</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator> -->
      <navigator url="/pages/component-page/slide-left/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">左滑删除</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/socket-page/socket-connect/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">英语单词王</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>
    <login-modal></login-modal>

  </div>
</template>

<script>
// console.log(123, this)

import loginModal from '@/components/loginModal'
export default {
  data () {
    return {
      resPanelShow: false
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
  },
  onHide () {
  },
  methods: {
  },
  components: {
    loginModal
  }
}
</script>

<style lang="stylus">
.weui-cells
  margin-top 20px
.video
  width 100%
</style>