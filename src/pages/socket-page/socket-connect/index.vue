<template>
  <div class="page">
    <div class="question-banner background-cube">
      <span class="question-title">{{projectMap[query.project].name}}</span>
    </div>
    <button class="match-btn background-0" @click="messageShow = true">打开聊天框</button>
    <button class="match-btn match-btn1 background-1" :class="{'cant-begin': roomMates.length > 1}" @click="findMatch">匹配对手</button>
    <button v-if="!isInvitee" class="match-btn match-btn2 background-2" :class="{'can-begin': roomMates.length > 1}" @click="dissFriend">好友同玩</button>

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

    <div class="message-modal" :class="{'message-modal-show': messageShow}">
      <div class="close-region" @click="messageShow = false"></div>
      <div class="message-content" :class="{'message-content-show': messageShow}">
        <scroll-view :scroll-top="scrollTop" scroll-y class="message-box">
          <div  v-for="(msg, idx) in messageArr" :key="idx" :class="{'message-item': !msg.self, 'message-item-self': msg.self}">
            <block v-if="!msg.self">
              <img :src="msg.avatar" class="avatar">
              <div class="msg">{{msg.message}}</div>
            </block>
            <block v-else>
              <div class="msg">{{msg.message}}</div>
              <img :src="msg.avatar" class="avatar">
            </block>
          </div>
        </scroll-view>
        <div class="emit-panel">
          <input v-model="msgVal" cursor-spacing="6" class="panel-l" type="text" placeholder="对话框内容">
          <button class="panel-r" @click="sendMsg">发 送</button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  let projectMap = {
    concentrate: {name: '专注训练', path: '/pages/socket-page/socket-invite/main'},
    question: {name: '答题挑战', path: '/pages/socket-page/socket-emiton/main'}
  }
  export default {
    data () {
      return {
        matching: false,
        showVSmodal: false, 
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
        roomMates: [],
        isInvitee: false,
        query: {},
        projectMap,
        // 对话框相关
        messageShow: false,
        messageArr: [],
        msgVal: '',
        scrollTop: 0
      }
    },
    computed: {
    },
    onLoad (options) {
      console.log(options)
      if (this.socket.disconnected) {
        wx.showModal({
          title: '提示',
          content: '你已经失去连接,请删除小程序重新进入',
          showCancel: false,
          success: () => {
            this.$nextTick(() => { wx.navigateBack() })
          }
        })
      }
      this.query = options
      wx.setNavigationBarTitle({ title: projectMap[options.project].name })
      this.nickname = wx.getStorageSync('userInfo').nickName
      this.avatar = wx.getStorageSync('userInfo').avatarUrl
      this.initProjectData()
      this.joinNewRoom()
      if (options.room) { this.isInvitee = true }

      this.socket.off('diss_begin')
      this.socket.off('room_msg')
      // 接受房主的开局指令
      this.socket.on('diss_begin', () => {
        this.roomMates.forEach((mate) => {
          if (mate.openid === this.openid) {
            mate.self = true
          } else {
            mate.self = false
          }
        })
        wx.navigateTo({
          url: `${projectMap[this.query.project].path}?vsdata=${JSON.stringify(this.roomMates)}`
        })
      })
      // 接受群发的消息
      this.socket.on('room_msg', (msginfo) => {
        console.log(msginfo)
        this.getRoomMsg(msginfo)
      })
    },
    onUnload () {
      this.matching = false
      if (this.query.room) {
        this.socket.emit('exit_room', {room: this.roomName, init: false})
      } else {
        this.socket.emit('exit_room', {room: this.roomName, init: true})
      }
      this.roomMates = []
      this.isInvitee = false
      this.messageArr = []
      this.messageShow = false
    },
    onShareAppMessage (e) {
      if (e.from === 'button') {
        return {
          title: this.nickname + '邀请你参与' + projectMap[this.query.project].name,
          path: `/pages/tab-more/main?from=${this.nickname}&room=${this.roomName}&project=${this.query.project}`
        }
      }
    },
    methods: {
      joinNewRoom () {
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
          if (info.init) { 
            // 如果房主掉线则房间作废 被邀请的房间自动回退
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
              // 如果房主掉线 则房主自己不做任何处理
              this.roomMates = []
            }
          } else {
            // 如果被邀请退出 刷新所有房间的成员信息
            this.roomMates = info.leftrooms
          }
        })
      },
      findMatch () {
        // 如果房间内由其他成员进入了 则无法发起普通匹配
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
        // 匹配到对手 触发对战界面
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
            url: `${projectMap[this.query.project].path}?vsdata=${JSON.stringify(vsdata)}`
          })
        }, 2000)
      },
      cancalMatch () {
        wx.showActionSheet({
          itemList: ['确认退出匹配'],
          success: (res) => {
            this.matching = false
            this.socket.emit('cancel_match', true)
          }
        })
      },
      initProjectData () {
        if (this.query.project === 'question') {
          this.getQuestion()
        }
      },
      getQuestion () {
        this.req({
          url: '/api/get-question'
        }).then(({data}) => {
          let res = data
          if (res.code) {
            if (res.data && res.data.length) {
              wx.setStorageSync('questions', res.data)
            }
          }
        })
      },
      dissFriend () {
        // console.log('当前人数', this.roomMates.length)
        // 发起开始请求
        if (this.roomMates.length === 1) return
        if (this.query.project === 'question' && this.roomMates.length !== 2) { 
          wx.showModal({
            title: '此项目暂时只支持两个人',
            showCancel: false
          })
          return
        }
        this.socket.emit('req_begin', this.roomName) 
      },
      sendToRoom (msg) { // 发送群发消息
        this.socket.emit('room_msg', {
          roomname: this.roomName,
          msg: msg,
          openid: this.openid
        })
      },
      getRoomMsg (msginfo) { // 处理群发消息
        let who = this.findWhoById(msginfo.from)
        if (!this.messageShow) {
          wx.vibrateLong()
          this.messageShow = true
        }
        this.messageArr.push({
          openid: msginfo.from,
          avatar: who.avatar,
          message: msginfo.msg,
          self: false
        })
        if (this.messageArr.length > 30) {
          this.messageArr.shift()
        }
        this.msgVal = ''
        this.scrollTop = 60 * this.messageArr.length
      },
      findWhoById (openid) {
        let obj
        this.roomMates.forEach((item, index) => {
          if (item.openid === openid) {
            obj = item
          }
        })
        return obj
      },
      sendMsg () {
        let val = this.msgVal
        if (!/\S/.test(val)) {
          wx.showToast({
            title: '不能发送空消息',
            icon: 'none'
          })
          return
        }
        this.messageArr.push({
          openid: this.openid,
          avatar: this.avatar,
          message: val,
          self: true
        })
        if (this.messageArr.length > 30) {
          this.messageArr.shift()
        }
        this.sendToRoom(val)
        this.msgVal = ''
        this.scrollTop = 60 * this.messageArr.length
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
  margin-top 10px
  color #ffffff
.match-btn1
  opacity 1
  &.cant-begin
    opacity 0.2
.match-btn2
  opacity 0.2
  &.can-begin
    opacity 1
/* ----------------------房间模块----------------------*/
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
/* ----------------------匹配弹层----------------------*/
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
/* ----------------------对战弹层----------------------*/
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
/* ----------------------聊天弹层----------------------*/
.message-modal
  position fixed
  width 100vw
  height 100vh
  background rgba(0, 0, 0, 0.5)
  z-index 9
  left 0
  bottom 0
  visibility hidden
  &.message-modal-show 
    visibility visible
.close-region
  width 100vw
  height 50vh
  opacity 0
  position relative
.message-content
  width 100%
  height 500px
  position absolute
  left 0
  bottom 0
  border-radius 10px 10px 0 0 
  background #fff
  overflow hidden
  transition transform 0.3s ease-out
  transform translateY(100%)
  &.message-content-show 
    transform translateY(0)
  .message-box
    width 100%
    height 458px
    color #f0f0f0
    border-bottom 1rpx solid #ccc
    padding 12px
    background-color #555
  .message-item
    width 100%
    height auto 
    display flex
    justify-content flex-start
    align-items flex-start
    margin-bottom 12px
    position relative
    .avatar 
      width 36px
      height 36px
      border-radius 50%
      margin-right 12px
      flex-shrink 0
      background #fff
    .msg
      border-radius 4px
      background #fff
      padding 0 12px
      color #222
      font-size 16px
      line-height 28px
      position relative
      min-height 36px
      padding-top 4px
      &:before
        content ''
        display inline-block
        width 12px
        height 12px
        position absolute
        left -5px
        top 12px
        background #ffffff
        transform rotate(45deg)
  .message-item-self
    width 100%
    height auto 
    display flex
    justify-content flex-end
    align-items flex-start
    margin-bottom 12px
    position relative
    .avatar 
      width 36px
      height 36px
      border-radius 50%
      margin-left 12px
      margin-right 0
      flex-shrink 0
      background #fff
    .msg
      border-radius 4px
      background #62BA47
      padding 0 12px
      color #222
      font-size 16px
      line-height 28px
      position relative
      min-height 36px
      padding-top 4px
      &:before
        content ''
        display inline-block
        width 12px
        height 12px
        position absolute
        right -5px
        top 12px
        background #62BA47
        transform rotate(45deg)
  .emit-panel
    height 42px
    display flex
    justify-content space-around
    align-items center
    .panel-l
      width 250px
      background #f0f0f0
      border-radius 4px
      height 32px
      padding-left 12px
      font-size 16px
    .panel-r 
      width 80px
      padding 0
      margin 0
      font-size 16px
      color #fff
      background #ee5500
      border-radius 6px
      height 32px
      line-height 32px
</style>
