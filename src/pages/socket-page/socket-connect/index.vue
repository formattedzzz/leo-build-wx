<template>
  <div class="page">
    <div class="question-banner background-cube">
      <span class="question-title">一站到底挑战赛</span>
    </div>
    <!-- <button class="match-btn background-0" hover-class="handle-class" @click="getVSmodal">自己玩吧</button> -->
    <button class="match-btn background-1" @click="findMatch">匹配对手</button>
    <button class="match-btn background-3" open-type="share">邀请好友</button>
    <button class="match-btn background-2" @click="disconnect">断开连接</button>
    <!-- <button class="match-btn background-2" hover-class="handle-class" @click="testjoin">调试入口</button> -->
    <!-- 寻找匹配模态框 -->
    <div class="matching-modal" :class="{'matching-modal-show': matching}">
      <div class="circles circlesup">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="circles circlesdown">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="matching-text">
        <span>matching</span>  
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
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
    computed: {
    },
    onLoad () {
      this.connect()
      this.nickname = wx.getStorageSync('userInfo').nickName
    },
    onUnload () {
      this.matching = false
      // this.hasmatched = false
    },
    onShareAppMessage (e) {
      if (e.from === 'button') {
        return {
          title: this.nickname + '邀请你参与一站到底挑战赛',
          path: `/pages/tab-more/main?from=${this.nickname}&qa=${'专注力训练'}`
        }
      }
    },
    methods: {
      connect () {
        if (socket.connected) return
        let token = wx.getStorageSync('token')
        let URL = `${this.baseURL}/user?token=${token}`
        socket = IO(URL)
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
            content: '检测到连接出现错误,有可能是token出错了',
            showCancel: false
          })
          this.matching = false
        })
        socket.on('disconnect', () => {
          console.log('断开连接')
          wx.showModal({
            title: '提示',
            content: '检测到您已断开连接',
            showCancel: false
          })
          this.matching = false
        })
      },
      findMatch () {
        if (!socket.connected) {
          wx.showModal({
            title: '提示', 
            content: '正在为您初始化socket连接'
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
            content: '好像找不到对手诶，不如邀请好友前来对战吧',
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
          this.eventBus.$emit('socket_emiton', socket)
          wx.navigateTo({
            url: `/pages/socket-page/socket-emiton/main?vsdata=${JSON.stringify(vsdata)}`
          })
        }, 2000)
      },
      testjoin () {
        let vsdata = [
          {
            openid: 'o2vnr0BidnGEnf9HZdrGyBpgRD7Y',
            nickname: 'leooo',
            avatar: 'https://wx.qlogo.cn/mmopen/vi_32/x3Ree29lzCicbs3byf2icmriaToZ4C3XtyE2WiaB4QFNv8cOyUhPgib1EtIiczGWicmNfx4ibEAzia3zPd5ZdibyfcicwmExg/132',
            socketid: socket.id,
            self: true
          },
          {
            openid: 'o2vnr0BidnGEnf9HZdrGyBpgRD7Y',
            nickname: 'leoop',
            avatar: 'https://wx.qlogo.cn/mmopen/vi_32/x3Ree29lzCicbs3byf2icmriaToZ4C3XtyE2WiaB4QFNv8cOyUhPgib1EtIiczGWicmNfx4ibEAzia3zPd5ZdibyfcicwmExg/132',
            socketid: socket.id,
            self: false
          }
        ]
        this.eventBus.$emit('socket_emiton', socket)
        wx.navigateTo({
          url: `/pages/socket-page/socket-emiton/main?vsdata=${JSON.stringify(vsdata)}`
        })
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
      }
    }
  }
</script>
<style>
.matching-text{
  position: absolute;
  display: inline-block;
  width: 140px;
  height: 30px;  
  left: 40%;
  top: 55%;
  color: #fff;
}
.dot{
  display: inline-block;
  width: 2px;
  height: 2px;
  background: #fff;
	-webkit-animation: text 2s infinite;
	animation: text 2s infinite;
  margin-left: 10px;
}
.dot:nth-child(2) {
	-webkit-animation-delay: 250ms; 
	animation-delay: 250ms;
}
.dot:nth-child(3) {
	-webkit-animation-delay: 500ms; 
	animation-delay: 500ms;
}
.circles{
  width: 50px;
  height: 50px;
  position: absolute;
}
.circlesup{
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-100%);
}
.circlesdown{
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-150%) rotate(180deg);
}
.circle {
	position: absolute;
	width: 50px;
	height: 50px;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
	-webkit-animation: orbit 2s infinite;
	animation: orbit 2s infinite;
	z-index:5;
}
.circle:after {
	content: '';
	position: absolute;
	width: 0.5em;
	height: 0.5em;
	-webkit-border-radius: 100%;
	border-radius: 100%;
	background: #13A3A5;
}
.circle:nth-child(2) {
	-webkit-animation-delay: 100ms;
	animation-delay: 100ms;
	z-index:4;
}
.circle:nth-child(2):after  {
	background: #56bebf;
	-webkit-transform: scale(0.8,0.8);
	transform: scale(0.8,0.8);
}
.circle:nth-child(3) {
	-webkit-animation-delay: 225ms; 
	animation-delay: 225ms; 
	z-index:3;
}
.circle:nth-child(3):after  {
	background: #ffa489;
	-webkit-transform: scale(0.6,0.6);
	transform: scale(0.6,0.6);
}
.circle:nth-child(4) {
	-webkit-animation-delay: 350ms; 
	animation-delay: 350ms; 
	z-index:2;
}
.circle:nth-child(4):after  {
	background: #ff6d37;
	-webkit-transform: scale(0.4,0.4);
	transform: scale(0.4,0.4);
}
.circle:nth-child(5) {
	-webkit-animation-delay: 475ms;
	animation-delay: 475ms; 
	z-index:1;
}
.circle:nth-child(5):after  {
	background: #DB2F00;
	-webkit-transform: scale(0.2,0.2);
	transform: scale(0.2,0.2);
}
@keyframes orbit { 
	0%{ transform:rotate(45deg);} 
	5%{ transform:rotate(45deg);animation-timing-function: ease-out;} 
	70%{ transform:rotate(405deg);animation-timing-function: ease-in;}
	100%{ transform:rotate(405deg);} 
}
@keyframes text {
	0%{ opacity: 0;}
  50%{ opacity: 1;}
	100%{ opacity: 0;}
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
  background rgba(0, 0, 0, 0.8)
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
