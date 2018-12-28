<template>
  <div class="page">

    <div class="score-board" v-for="(item, index) in vsdata" :key="index" >
      <div class="score-avatar">
        <img :src="item.avatar">
      </div>
      <div class="score-bar"><div :style="item.self ? currentScoreBar : oppositeScoreBar" class="score-fill"></div></div>
      <div class="score-award">
        <img src="/static/svg/trophy.svg">
        <span class="score-num">{{item.self ? currentScore : oppositeScore}}</span>
      </div>
      <div class="score-name">{{item.nickname}}</div>
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
        vsdata: [],
        questionArr,

        currentQ: 0,
        currentA: -1,
        currentScore: 0,
        currentRes: ['', '', '', ''],

        oppositeScore: 20,

        resting: true,
        beginModalShow: false,
        timerSec: 10,
        bgcolors: getColorGradient('#00cc00', '#ff0000')
      }
    },
    computed: {
      currentScoreBar () {
        return `width: ${this.currentScore}%;`
      },
      oppositeScoreBar () {
        return `width: ${this.oppositeScore}%;`
      }
    },
    onLoad (options) {
      this.vsdata = JSON.parse(options.vsdata)
      // this.eventBus.$on('socket_emiton', (data) => {
      //   socket = data
      // })
      // 不能挂在this上面 整个应用在/user路由只维护一个socket对象
      console.log(this.socket.id)
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
          this.currentScore += 20
          wx.showToast({
            title: '恭喜你答对了'
          })
        } else {
          this.$set(this.currentRes, key, 'wrong')
          this.$set(this.currentRes, an, 'right')
          wx.showToast({
            title: '很遗憾答错了',
            icon: 'none'
          })
        }
      }
    },
    onUnload () {
      clearInterval(timer)
      this.currentQ = 0
      this.timerSec = 10
      this.currentA = -1
      this.currentRes = ['', '', '', '']
      this.currentScore = 0
    },
    onShareAppMessage (e) {
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
  .score-name
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
    font-size 18px
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
</style>
