<template>
<div class="login-page">
  <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" type="primary">获取用户信息授权登录</button>
  <button open-type="openSetting">打开授权设置页</button>
</div>
</template>

<script>
  export default {
    data () {
      return {
        userInfo: {}
      }
    },
    methods: {
      onGotUserInfo (e) {
        let vm = this
        console.log(e)
        if (e.target.errMsg === 'getUserInfo:fail auth deny') return
        this.userInfo = e.target.userInfo
        let { encryptedData, iv, signature } = e.target
        wx.login({
          success: (res) => {
            vm.req({
              url: '/wx/login',
              data: {
                code: res.code,
                encryptedData,
                iv,
                signature
              },
              menthod: 'GET',
              success (response) {
                let data = response.data
                if (data.code) {
                  wx.setStorageSync('sessionID', data.sessionID)
                  wx.showToast({
                    title: data.message
                  })
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
 
</style>