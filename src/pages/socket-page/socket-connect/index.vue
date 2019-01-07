<template>
  <div class="page">
    <div class="question-banner background-cube">
      <span class="question-title">一站到底挑战赛</span>
    </div>
    <!-- <button class="match-btn background-0" hover-class="handle-class" @click="getVSmodal">自己玩吧</button> -->
    <button class="match-btn background-1" @click="findMatch">匹配对手</button>
    <button class="match-btn background-3" @click="toInvite">好友同玩</button>
    <button class="match-btn background-2" @click="disconnect">断开连接</button>

    <!-- <button class="match-btn background-2" hover-class="handle-class" @click="testjoin">调试入口</button> -->
    <!-- 寻找匹配模态框 -->
    <div class="matching-modal" :class="{'matching-modal-show': matching}">
      <div class="gooey">
        <span class="dot"></span>
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="matching-text">matching...</div>
      <button @click="cancalMatch" class="match-btn cancel-btn background-2">取消匹配</button>
    </div>

    <div class="vs-modal" :class="{'vs-modal-show': showVSmodal}">
      <div class="vs-modal-content background-2" :class="{'vs-modal-content-show': showVSmodal}">
      <div class="player player-l" :class="{'player-show': showVSmodal}">
        <div class="headimg"><img :src="VSmodalData[0].avatar"></div>
        <h5 class="nickname">{{VSmodalData[0].nickname}}</h5>
      </div>
      <span style="font-size: 32px;color:#fff;">VS</span>
      <div class="player player-r" :class="{'player-show': showVSmodal}">
        <div class="headimg"><img :src="VSmodalData[1].avatar"></div>
        <h5 class="nickname">{{VSmodalData[1].nickname}}</h5>
      </div>
      </div>
    </div>

  </div>
</template>
<script>
  import IO from '@/../static/weapp.socket.io.js'
  let socket = {}
  export default {
    data () {
      return {
        matching: false, // 正在匹配对手的状态量
        // hasmatched: false,
        showVSmodal: false, // VSmodal 显示控制即渲染数据
        VSmodalData: [
          {
            openid: '',
            nickname: '',
            avatar: '',
            socketid: ''
          },
          {
            openid: '',
            nickname: '',
            avatar: '',
            socketid: ''
          }
        ]
      }
    },
    onLoad (options) {
      this.query = options
      this.connect()
      this.nickname = wx.getStorageSync('userInfo').nickName
      this.getQuestion()
    },
    onUnload () {
      this.matching = false
      // this.hasmatched = false
    },
    // onShareAppMessage (e) {
    //   if (e.from === 'button') {
    //     return {
    //       title: this.nickname + '邀请你参与一站到底挑战赛',
    //       path: `/pages/tab-more/main?from=${this.nickname}&openid=${this.openid}&project=${'专注力训练'}`
    //     }
    //   }
    // },
    methods: {
      connect () {
        if (socket.connected) return
        let token = wx.getStorageSync('token')
        let URL = `${this.baseURL}/user?token=${token}`
        socket = IO(URL)
        this.eventBus.$emit('socket_emiton', socket)
        try {
          console.log(socket)
        } catch (err) {
          console.log(err)
        }
        socket.on('connect', () => {
          console.log('connected', socket.id)
          socket.on('beat_req', function (msg) {
            console.log('beat req')
            socket.emit('beat_res')
          })
          // socket.on('system_info', (msg) => {
          //   console.log('received system news: ', msg)
          // })
          // socket.on('broadcast', () => {
          //   console.log('broadcast')
          // })
          // socket.on('broadcast2', () => {
          //   console.log('broadcast2')
          // })
          // socket.on('private_msg', (from, to, msg) => {
          //   console.log(from, to, msg)
          // })
          // socket.emit('custom_info', {
          //   title: 'this is a news from custom'
          // })
        })
        socket.on('error', () => {
          wx.showModal({
            title: '提示',
            content: '连接失败,可能是token出错了',
            showCancel: false
          })
          this.matching = false
        })
        socket.on('disconnect', () => {
          console.log('断开连接')
          wx.showModal({
            title: '提示',
            content: '你已断开连接',
            showCancel: false
          })
          this.matching = false
        })
      },
      findMatch () {
        if (!socket.connected) {
          wx.showModal({
            title: '提示', 
            content: '正在初始化连接..'
          })
          return false
        }
        if (this.matching) return
        this.matching = true
        socket.emit('need_match', true)
        socket.off('matched')
        socket.on('matched', (data) => {
          console.log('matched')
          if (Array.isArray(data) && data.length) {
            data.forEach((item) => {
              if (item.socketid === socket.id) {
                item.self = true
              } else {
                item.self = false
              }
            })
          }
          this.VSmodalData = data
          wx.showToast({
            title: '匹配成功,go...'
          })
          this.matching = false
          this.getVSmodal()
        })
        socket.on('match_failed', () => {
          // setTimeout(() => {
          this.matching = false
          wx.showModal({
            title: '提示',
            content: '好像找不到对手诶',
            showCancel: false
          })
          // }, 4000)
        })
      },
      getVSmodal () {
        // 触发对战界面 应该做成组件易于管理
        // if (this.hasmatched) return
        // this.hasmatched = true
        if (socket.disconnected) {
          wx.showModal({
            title: '提示',
            content: '检测到断开连接,对局已触发,您被判定为逃跑。'
          })
          return
        }
        this.showVSmodal = true
        setTimeout(() => {
          this.showVSmodal = false
          let vsdata = this.VSmodalData
          
          wx.navigateTo({
            url: `/pages/socket-page/socket-emiton/main?vsdata=${JSON.stringify(vsdata)}`
          })
        }, 2000)
      },
      cancalMatch () {
        wx.showActionSheet({
          itemList: ['确认退出匹配'],
          success: (res) => {
            this.matching = false
            socket.emit('cancel_match', true)
          },
          fail: (res) => {
            console.log('取消退出')
          }
        })
      },
      disconnect () {
        socket.close()
      },
      getQuestion () {
        this.req({
          url: '/api/get-question'
        }).then(({data}) => {
          let res = data
          this.openid = res.openid
          if (res.code) {
            if (res.data && res.data.length) {
              wx.setStorageSync('questions', res.data)
            }
          }
        })
      },
      toInvite () {
        wx.navigateTo({
          url: '/pages/socket-page/socket-invite/main'
        })
      }
    }
  }
</script>
<style>
.matching-text{
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 30px;  
  left: 0%;
  top: 55%;
  text-align: center;
  color: #222;
}
.gooey {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 142px;
  height: 40px;
  margin: -20px 0 0 -71px;
  background: #fff;
  filter: contrast(20);
}
.gooey .dot {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 12px;
  left: 15px;
  filter: blur(4px);
  background: #000;
  border-radius: 50%;
  transform: translateX(0);
  animation: dot 2.8s infinite;
}
.gooey .dots {
  transform: translateX(0);
  margin-top: 12px;
  margin-left: 31px;
  animation: dots 2.8s infinite;
}
.gooey .dots span {
  display: block;
  float: left;
  width: 16px;
  height: 16px;
  margin-left: 16px;
  filter: blur(4px);
  background: #000;
  border-radius: 50%;
}
@keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}
</style>

<style lang="stylus">
.page
  width 100%
  min-height 100vh
.question-banner
  width 100%
  height 160px
  text-align center
  .question-title
    font-size 32px
    color #fff
    line-height 160px
.match-btn
  border-radius 0
  margin 30px
  color #ffffff

.matching-modal
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  z-index 19
  background #fff
  transform all 0.3s ease-out
  visibility hidden
  &.matching-modal-show
    visibility visible
  .cancel-btn
    width 315px
    height auto 
    position absolute
    left 30px
    bottom 30px
    margin 0

.vs-modal
  width 100vw
  height 100vh
  position fixed
  z-index 29
  background rgba(0, 0, 0, 0.8) 
  left 0
  top 0
  visibility hidden
  &.vs-modal-show
    visibility visible
.vs-modal-content
  position absolute
  width 100%
  height 40vh
  display flex
  justify-content space-between
  align-items center
  left 0
  top 20vh
  transition transform 0.3s ease-out
  transform translateY(-100%)
  &.vs-modal-content-show
    transform translateY(0)
  .player
    flex-grow 1
    text-align center
  .player-l
    transition transform 0.6s ease-out
    transform translateX(-100%)
    &.player-show
      transform translateX(0%)
  .player-r
    transition transform 0.6s ease-out
    transform translateX(100%)
    &.player-show
      transform translateX(0%)
  .headimg
    width 72px
    height 72px
    border-radius 50%
    overflow hidden
    margin 30px auto 0
    img
      width 100%
      height 100%
  .nickname
    color #fff
    font-size 20px
</style>
