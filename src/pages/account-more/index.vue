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
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
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
  font-weight 300
</style>
