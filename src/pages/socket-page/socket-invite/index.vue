<template>
  <div class="invite-page">
    邀请好友
  </div>
</template>

<script>
  // import IO from '@/../static/weapp.socket.io.js'
  // let socket = null
  export default {
    data () {
      return {
        roomMembers: []
      }
    },
    computed: {

    },
    onLoad () {
      // this.connect()
      console.log(this.socket.id)
    },
    methods: {
      // connect () {
      //   if (socket.connected) return
      //   let token = wx.getStorageSync('token')
      //   let URL = `${this.baseURL}/user?token=${token}`
      //   socket = IO(URL)
      //   socket.on('connect', () => {
      //     console.log('connected', socket.id)
      //     socket.on('beat_req', function (msg) {
      //       console.log('beat req', 123)
      //       socket.emit('beat_res')
      //     })
      //   })
      // }
    }
  }
</script>

<style>

 
</style>
