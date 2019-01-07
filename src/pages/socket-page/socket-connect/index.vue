<template>
  <div class="page">
    <div class="question-banner background-cube">
      <span class="question-title">一站到底挑战赛</span>
    </div>
    <!-- <button class="match-btn background-0" hover-class="handle-class" @click="getVSmodal">自己玩吧</button> -->
    <button class="match-btn match-btn1 background-1" :class="{'cant-begin': roomMates.length > 1}" @click="findMatch">匹配对手</button>
    <button class="match-btn match-btn2 background-2" :class="{'can-begin': roomMates.length > 1}">好友同玩</button>
    <div class="room-content background-3" :style="{height: roomMates.length >= 3 ? '400rpx' : '240rpx'}">
      <div class="room-mate" v-for="(mate, index) in roomMates" :key="index">
        <img class="avatar" :src="mate.avatar">
        <h5 class="nickname">{{mate.nickname}}</h5>
      </div>
      <div v-if="roomMates.length <= 5" class="room-mate add-mate">
        <div class="add-icon"><button class="share-btn" open-type="share"></button><img src="/static/svg/account-add.svg"></div>
        <h5 class="nickname">添加</h5>
      </div>
    </div>

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
  // import IO from '@/../static/weapp.socket.io.js'
  // let socket = {}
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
        ],
        roomMates: []
      }
    },
    computed: {
      roomlen () {
        return this.roomMates.length
      }
    },
    onLoad (options) {
      if (this.socket.disconnected) {
        wx.showToast({
          title: '出现错误'
        })
      }
      this.query = options
      // this.connect()
      let {nickName, avatarUrl} = wx.getStorageSync('userInfo')
      this.nickname = nickName
      this.avatar = avatarUrl
      this.getQuestion()
      this.joinNewRoom()
    },
    onUnload () {
      this.matching = false
      if (this.query.room) {
        this.socket.emit('exit_room', {room: this.roomName, init: false})
      } else {
        this.socket.emit('exit_room', {room: this.roomName, init: true})
      }
      this.roomMates = []
    },
    onShareAppMessage (e) {
      if (e.from === 'button') {
        return {
          title: this.nickname + '邀请你参与一站到底挑战赛',
          path: `/pages/tab-more/main?from=${this.nickname}&room=${this.roomName}&project=${'专注力训练'}`
        }
      }
    },
    methods: {
      joinNewRoom () {
        console.log(this.query)
        let room = this.query.room
        if (room) {
          this.roomName = room
          this.socket.emit('join_room', {room: room, init: false})
        } else {
          let roomName = 'room_' + Math.random().toString(36).substr(2)
          this.roomName = roomName
          this.socket.emit('join_room', {room: roomName, init: true})
        }
        this.socket.off('join_info')
        this.socket.on('join_info', (roomarr) => {
          this.roomMates = roomarr
        })
        this.socket.on('join_fail', (msg) => {
          wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false,
            success: () => {
              wx.navigateBack()
            }
          })
        })
        this.socket.on('exit_info', (info) => {
          if (info.init) { // 如果房主掉线且为被邀请的房间
            if (this.query.room) {
              wx.showModal({
                title: '提示',
                content: '地主已退出房间，返回重新发起',
                showCancel: false,
                success: () => {
                  wx.navigateBack()
                }
              })
            } else {
              // console.log('房主自己离开')
              this.roomMates = []
            }
          } else {
            // console.log('如果被邀请掉线所有房间-1')
            this.roomMates = info.leftrooms
          }
        })
      },
      findMatch () {
        if (this.roomMates.length > 1) {
          wx.showModal({
            title: '提示', 
            content: '你正在进行好友对局',
            showCancel: false
          })
          return
        }
        if (!this.socket.connected) {
          wx.showModal({
            title: '提示', 
            content: '正在初始化连接..',
            showCancel: true
          })
          return false
        }
        
        if (this.matching) return
        this.matching = true
        this.socket.emit('need_match', true)
        this.socket.off('matched')
        this.socket.on('matched', (data) => {
          // console.log('matched')
          if (Array.isArray(data) && data.length) {
            data.forEach((item) => {
              if (item.openid === this.openid) {
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
        this.socket.on('match_failed', () => {
          this.matching = false
          wx.showModal({
            title: '提示',
            content: '好像找不到对手诶',
            showCancel: false
          })
        })
      },
      getVSmodal () {
        // 触发对战界面 应该做成组件易于管理
        // if (this.hasmatched) return
        // this.hasmatched = true
        wx.vibrateLong()
        if (this.socket.disconnected) {
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
            this.socket.emit('cancel_match', true)
          },
          fail: (res) => {
            console.log('取消退出')
          }
        })
      },
      getQuestion () {
        this.req({
          url: '/api/get-question'
        }).then(({data}) => {
          let res = data
          this.openid = res.openid
          if (!this.roomMates.length) {
            this.roomMates = [{
              openid: res.openid,
              nickname: this.nickname,
              avatar: this.avatar
            }]
          }
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
.match-btn1
  opacity 1
  &.cant-begin
    opacity 0.2
.match-btn2
  opacity 0.2
  &.can-begin
    opacity 1

.room-content
  width 90%
  position absolute
  padding 12px
  bottom 5%
  left 5%
  border-radius 30px
  display flex
  flex-wrap wrap
  justify-content flex-start
  transition height 0.4s ease-out
  .begin-btn
    width 120px
    height 36px
    line-height 36px
    text-align center 
    border-radius 4px
    position absolute
    font-size 14px
    color #222
    left 50%
    top -26px
    transform translateX(-50%)
    background #fff
    box-shadow 0 0 3px #ccc
    opacity 0.6
    &.begin-ok
      opacity 1
  .room-mate
    width 33.3%
    text-align center
    height 78px
    .avatar
      width 48px
      height 48px
      border-radius 50%
    .nickname
      font-size 12px
      color #fff
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
    .add-icon
      width 48px
      height 48px
      border-radius 50%
      overflow hidden
      border 1px dashed #fff
      padding 10px
      margin 0 auto
      position relative
      margin-bottom 7px
      img
        width 100%
        height 100%
      .share-btn
        opacity 0
        position absolute
        width 100%
        height 100%
        z-index 9
        left 0
        top 0

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
