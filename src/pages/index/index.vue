<template>
  <div class="container">

    <a href="/pages/counter/main"><h5>Relative</h5></a>
    <div class="panel">
      <div class="panel-title" @click="extend" >
        这是标题
      </div>
      <div class="panel-con">
        1<br>1<br>1<br>1<br>1<br>1<br>1<br>
      </div>
    </div>

  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style lang="stylus">
.panel-con
  height 0 
  opacity 0
  transform translateY(-100%)
</style>
