<template>
  <div class="page">

    <div class="score-board">
      <div class="score-avatar">
        <img :src="selfClient.avatar">
      </div>
      <div class="score-bar"><div :style="currentScoreBar" class="score-fill"></div></div>
      <div class="score-award">
        <img src="/static/svg/trophy.svg">
        <span class="score-num">{{currentScore}}</span>
      </div>
      <div class="score-name1">{{selfClient.nickname}}</div>
    </div>

    <div class="score-board">
      <div class="score-award">
        <img src="/static/svg/trophy.svg">
        <span class="score-num">{{oppositeScore}}</span>
      </div>
      <div class="score-bar"><div :style="oppositeScoreBar" style="display:inline-block;float:right;" class="score-fill"></div></div>
      <div class="score-avatar">
        <img :src="oppositeClient.avatar">
      </div>
      <div class="score-name2">{{oppositeClient.nickname}}</div>
    </div>

    <div class="question-panel" :class="{'show': !resting}">
      <div class="timer" :style="{'background': bgcolors[10 - timerSec]}">{{timerSec}}</div>
      <div class="question">{{questionArr[currentQ].question}}</div>
      <div class="answers">
        <h5
        class="answer"
        v-for="(item, index) in questionArr[currentQ].answers"
        @click="confirmAnswer(index)"
        :class="currentRes[index]"
        :key="index">{{item}}</h5>
      </div>
    </div>
    <div class="begin-modal" :class="{'begin-modal-show': beginModalShow}">
      ROUND{{currentQ + 1}} ！
    </div>

    <div class="res-panel" :class="{'res-panel-show': resPanelShow}">
      <div class="res-content" :class="{'res-content-show': resPanelShow}">
        <div class="res-over">
          <img class="res-award" src="/static/svg/award.svg">
          <span class="res-winner">{{isWinner}}</span>
        </div>
        <div class="res-head">
          <span>玩家</span><span>/</span>
          <span>得分</span><span>/</span>
          <span>评价</span>
        </div>
        <div class="res-item">
          <div class="item-l">
            <img class="item-avatar" :src="selfClient.avatar">
            <h5 class="item-nickname">{{selfClient.nickname}}</h5>
          </div>
          <div class="item-m">{{currentScore}}"</div>
          <div class="item-r">{{currentScore >= oppositeScore ? 'S' : 'A'}}</div>
        </div>
        <div class="res-item">
          <div class="item-l">
            <img class="item-avatar" :src="oppositeClient.avatar">
            <h5 class="item-nickname">{{oppositeClient.nickname}}</h5>
          </div>
          <div class="item-m">{{oppositeScore}}"</div>
          <div class="item-r">{{oppositeScore >= currentScore ? 'S' : 'A'}}</div>
        </div>
        <button class="continue-btn background-2" hover-class="handle-class" @click="continueQa">继续挑战</button>
      </div>
    </div>
  </div>
</template>
<script>
  import questionArr from './question.js'
  let timer = null
  function getColorGradient(from, to, gradient = 10, mode = 'linear') {
    let start = from
    let end = to
    let HexRe = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
    if (HexRe.test(from) && HexRe.test(to)) {
      if (from.charAt(0) === '#') from = from.slice(1).split('')
      if (to.charAt(0) === '#') to = to.slice(1).split('')
      if (from.length === 3) {
        from = from.forEach((item) => {
          return item + item
        }).join('').split('')
      }
      if (to.length === 3) {
        to = to.map((item) => {
          return item + item
        }).join('').split('')
      }
      let fromArr = []
      let toArr = []
      let distArr = []
      for (let i = 0; i < 3; i++) {
        fromArr.push(parseInt((from[2 * i] + from[2 * i + 1]), 16))
        toArr.push(parseInt((to[2 * i] + to[2 * i + 1]), 16))
        distArr.push(Number(((toArr[i] - fromArr[i]) / gradient).toFixed(2)))
      }
      let targetArr = []
      for (let i = 1; i < gradient; i++) {
        let hex = [0, 1, 2].map((v) => {
          let mark = Math.ceil(fromArr[v] + i * distArr[v]).toString(16)
          return mark.length === 1 ? '0' + mark : mark
        }).join('')
        targetArr.push('#' + hex)
      }
      targetArr.unshift(start.charAt(0) === '#' ? start : '#' + start)
      targetArr.push(end.charAt(0) === '#' ? end : '#' + end)
      return targetArr
    } else {
      console.error('hex颜色值不合法')
      return false
    }
  }
  export default {
    data () {
      return {
        questionArr,
        selfClient: {},
        oppositeClient: {},

        currentQ: 0,
        currentA: -1,
        currentScore: 0,
        currentRes: ['', '', '', ''],

        oppositeScore: 0,

        resting: true,
        beginModalShow: false,
        timerSec: 10,
        bgcolors: getColorGradient('#00cc00', '#ff0000'),
        resPanelShow: false
      }
    },
    computed: {
      currentScoreBar () {
        return `width: ${this.currentScore / (this.questionArr.length * 0.2)}%;`
      },
      oppositeScoreBar () {
        return `width: ${this.oppositeScore / (this.questionArr.length * 0.2)}%;`
      },
      isWinner () {
        return this.currentScore >= this.oppositeScore ? 'WINNER ^_^' : 'FAILURE ...'
      }
    },
    onLoad (options) {
      let vsdata = JSON.parse(options.vsdata)
      if (Array.isArray(vsdata) && vsdata.length) {
        vsdata.forEach((client) => {
          if (client.self) {
            this.selfClient = client
          } else {
            this.oppositeClient = client
          }
        })
      }
      // this.eventBus.$on('socket_emiton', (data) => {
      //   socket = data
      // })
      // 不能挂在this上面 整个应用在/user路由只维护一个socket对象
      console.log(this.socket.id)
      this.socket.off('private_msg')
      this.socket.on('private_msg', (data) => {
        console.log(data)
        this.oppositeScore += Number(data.msg)
      })
    },
    onShow () {
      this.initBeginModal()
      // console.log('emiton页面：', socket.id)
    },
    methods: {
      initBeginModal () {
        this.beginModalShow = true
        this.resting = true
        setTimeout(() => {
          this.timerSec = 10
          this.currentA = -1
          this.currentRes = ['', '', '', '']

          this.beginModalShow = false
          this.resting = false
          this.runStart()
        }, 2000)
      },
      runStart () {
        timer = setInterval(() => {
          this.timerSec--
          if (this.timerSec <= 0) {
            this.runEnd()
            clearInterval(timer)
          }
        }, 1000)
      },
      runEnd () {
        // 进行单题结算...
        if (this.currentA === -1) {
          this.currentA = Number(this.questionArr[this.currentQ].key)
          this.$set(this.currentRes, Number(this.questionArr[this.currentQ].key), 'right')
          wx.showToast({
            title: '很遗憾未作答',
            icon: 'none'
          })
        }
        if (this.currentQ === (this.questionArr.length - 1)) {
          wx.showToast({
            title: '已答题完毕'
          })
          clearInterval(timer)
          this.postRecord()
          setTimeout(() => {
            this.showResPanel()
          }, 1000)
          return
        }
        setTimeout(() => {
          this.currentQ++
          this.initBeginModal()
        }, 2000)
      },
      confirmAnswer (key) {
        if (this.currentA !== -1 || this.resting) return
        this.currentA = key
        let an = Number(this.questionArr[this.currentQ].key)
        if (an === Number(key)) {
          this.$set(this.currentRes, key, 'right')
          let perFull = 20
          let perSubFull = 12
          if (this.timerSec >= 7) {
            this.currentScore += perFull
            this.updateScore(perFull)
            wx.showToast({
              title: `又快又对,+ ${perFull}`
            })
          } else {
            this.currentScore += perSubFull
            this.updateScore(perSubFull)
            wx.showToast({
              title: `恭喜,+ ${perSubFull}`
            })
          }
        } else {
          this.$set(this.currentRes, key, 'wrong')
          this.$set(this.currentRes, an, 'right')
          wx.showToast({
            title: '很遗憾答错了',
            icon: 'none'
          })
        }
      },
      updateScore (score) {
        let {oppositeClient} = this 
        this.socket.emit('update_score', {
          score,
          openid: oppositeClient.openid
        })
      },
      showResPanel () {
        this.resPanelShow = true
      },
      continueQa () {
        this.resPanelShow = false
        // setTimeout(() => {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }, 800)
      },
      postRecord () {
        let res
        if (this.currentScore > this.oppositeScore) {
          res = 1
        } else if (this.currentScore === this.oppositeScore) {
          res = 2
        } else {
          res = 0
        }
        delete this.selfClient.socketid
        delete this.oppositeClient.socketid
        this.selfClient.score = this.currentScore
        this.oppositeClient.score = this.oppositeScore
        let postdata = {
          record_self: JSON.stringify(this.selfClient),
          record_match: JSON.stringify(this.oppositeClient),
          record_winner: res,
          record_qatype: 'T001'
        }
        this.req({
          url: '/api/add-qarecord',
          data: postdata,
          method: 'POST'
        }).then(({res}) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    onUnload () {
      console.log('onUnload')
      clearInterval(timer)
      this.currentQ = 0
      this.timerSec = 10
      this.currentA = -1
      this.currentRes = ['', '', '', '']
      this.currentScore = 0
      this.oppositeScore = 0
      this.resPanelShow = false
    }
  }
</script>

<style lang="stylus">
.score-board
  padding 10px 20px 28px 20px
  display flex
  justify-content space-between
  align-items center
  position relative
  .score-avatar
    width 48px
    height 48px
    border-radius 50%
    flex-shrink 0
    position relative
    overflow hidden
    img
      width 100%
      height 100%
      barder-radius 50%
  .score-bar
    width 220px
    flex-shrink 0
    height 6px
    border-radius 3px
    overflow hidden
    background #dddddd
    .score-fill
      height 100%
      background #00cc00
      transition width 0.4s ease-out
  .score-award
    flex-shrink 0
    width 32px
    height 32px
    position relative
    img 
      width 100%
      height 100%
    .score-num
      display inline-block
      position absolute
      left 50%
      transform translateX(-50%)
      bottom -32px
      color #00cc00
      font-size 18px
  .score-name1
    position absolute
    padding-left 25px
    width 220px
    height 20px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    left 0
    bottom 0
    font-size 14px
    color #4a4a4a
  .score-name2
    position absolute
    padding-right 25px
    width 220px
    height 20px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    text-align right
    right 0
    bottom 0
    font-size 14px
    color #4a4a4a
    
.question-panel
  position fixed
  bottom 0
  left 0
  height auto
  padding-bottom 30px
  width 100%
  transition opacity 0.5s ease-out
  opacity 0
  &.show
    opacity 1
  .timer
    width 48px
    height 48px
    background #00cc00
    border-radius 50%
    margin 0 auto
    text-align center
    line-height 48px
    color #fff 
    font-size 20px
    transition background 1s ease-out
  .answers .answer
      padding 10px 20px
      border-top 1rpx solid #eeeeee
      font-size 16px
      &.right
        background #8DC43C
      &.wrong
        background #C4573C
      &:last-child
        border-bottom 1rpx solid #eeeeee
  .question
    padding 20px

.begin-modal
  position fixed
  width 200px
  height 48px
  line-height 48px
  text-align center
  background #555
  color #fff
  font-size 28px
  left 50%
  top 30%
  transform translateX(-50%)
  transition all 0.4s ease-out
  opacity 0
  visibility hidden
  &.begin-modal-show 
    opacity 1
    visibility visible
    
.res-panel
  width 100vw
  height 100vh
  background rgba(0, 0, 0, 0.8)
  position fixed
  left 0
  top 0
  z-index 9
  visibility hidden
  &.res-panel-show 
    visibility visible
.res-content
  width 88%
  height auto
  padding 20px 0
  background #fff
  overflow hidden
  left 50%
  top 50%
  position absolute
  opacity 0
  transition all 0.4s ease-out
  transform translateX(-50%) translateY(-150%)
  &.res-content-show
    opacity 1
    transform translateX(-50%) translateY(-50%)
  .res-over
    display flex
    justify-content space-around
    align-items center
    padding-bottom 20px
    .res-award
      width 64px
      height 64px
    .res-winner
      margin-left 20px
      font-size 32px
      color #ee5500
  .res-head
    width 100%
    display flex
    justify-content space-between
    align-items center
    font-size 18px
    color #fff
    padding 10px 20px
    border-bottom 1rpx solid #ddd
    background #555
  .res-item
    display flex
    justify-content space-between
    align-items center
    padding 10px 20px
    border-bottom 1rpx solid #ccc
    background #f0f0f0
    .item-l
      width 80px
      flex-shrink 0
      position relative
      .item-avatar
        width 36px
        height 36px
        border-radius 50%
      .item-nickname
        font-size 12px
        color #333
        width 100%
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
    .item-m
      font-size 20px
      color #00cc00
      position relative
      left -8px
    .item-r
      width 60px
      flex-shrink 0
      font-size 24px
      color #ee5500
      text-align right
  .continue-btn
    border-radius 0
    margin 30px 30px 0
    color #ffffff
</style>
