<template>
  <div class="suite-page" :style="{background: bgcolorArr[bgcolorIndex]}">

    <div class="setting-hard" :class="{'setting-hard-show': setting.hard}">
      <button size="mini" @click="resize(3)">3 × 3</button>
      <button size="mini" @click="resize(4)">4 × 4</button>
      <button size="mini" @click="resize(5)">5 × 5</button>
      <div class="more-hard">
        <h5 class="check-info">是否刷新</h5>
        <switch class="check-box" @change="changeFrash"/>
      </div>
      
      <div class="hard-btn" @click="toggleSetting('hard')">选择难度</div>
    </div>

    <div class="score-panel">
      <div class="panel-t">
        <span class="panel-tl">历史最高</span>
        <span class="panrl-tr">{{bestScore}}</span>
      </div>
      <div class="panel-b">
        <span class="panel-bl">最新战绩</span>
        <span class="panrl-br">{{currentScore}}</span>
      </div>
    </div>

    <div class="setting-bg bg1" :class="{'setting-show': setting.panel1}">
      <scroll-view class="setting-opt" scroll-x>
        <span 
        class="color-item" v-for="(color, index) in bgcolorArr" 
        :key="index"
        @click="bgcolorIndex = index"
        :style="{background: color}"></span>
      </scroll-view>
      <div class="setting-btn" @click="toggleSetting('panel1')"></div>
    </div>
    <div class="setting-bg bg2" :class="{'setting-show': setting.panel2}">
      <scroll-view class="setting-opt" scroll-x>
        <span 
        class="color-item" 
        v-for="(color, index) in cellcolorArr" 
        :key="index" 
        @click="cellcolorIndex = index"
        :style="{background: color}"></span>
      </scroll-view>
      <div class="setting-btn" @click="toggleSetting('panel2')"></div>
    </div>

    <div class="cell-con"
      :class="{'cell-con3x': size === 3,'cell-con4x': size === 4,'cell-con5x': size === 5, 'hide': shifting}">
      <div
      class="cell"
      v-for="(cell, index) in cellArr"
      :key="index"
      :style="{background: cellcolorArr[cellcolorIndex]}"
      @click="processTap(cell)"
      hover-class="hover-cell"
      :hover-start-time="0"
      :hover-stay-time="0">{{cell}}</div>
    </div>

    <div class="begin-btn">
      <span v-if="playing === false" @click="handleGo">GO</span>
      <span style="font-size: 16px;" v-else>{{timerTxt}}</span>
    </div>
    <div class="rank-btn" @click="toRank">Ranking</div>

  </div>
</template>

<script>
  function formatScore (score) {
    if (typeof score === 'string') {
      let Arr = score.split(':')
      return Number(Arr[0]) * 60 * 10 + Number(Arr[1]) * 10 + Number(Arr[2])
    }
    if (typeof score === 'number') {
      let ms = score % 10
      let sec = ((score - ms) / 10) % 60
      let min = Math.floor((score - ms - sec * 10) / 600)
      return `${min} : ${sec < 10 ? '0' + sec : sec} : ${ms}`
    }
  }
  let timer = null
  let beginTimer = null
  let bgcolorArr = ['#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222']
  let cellcolorArr = ['#003300', '#006600', '#006633', '#0066CC', '#0066FF', '#009900', '#009933', '#009966', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#330066', '#336600', '#336633', '#336699', '#3366CC', '#3366FF', '#339900', '#660033', '#660099', '#6600CC', '#6600FF', '#663300', '#663399', '#6699FF', '#993300', '#9933CC', '#996600', '#CC6600', '#FF6600', '#FF9933']
  export default {
    data () {
      return {
        roomMembers: [],
        size: 3,
        cellArr: [],
        bgcolorArr,
        bgcolorIndex: 10,
        cellcolorArr,
        cellcolorIndex: 5,
        setting: {
          panel1: false,
          panel2: false,
          hard: false
        },
        isfrash: false,
        shifting: false,
        playing: false,
        timerTxt: '0 : 00 : 0',
        currentStep: 1,
        currentScoreinfo: {hard3: 0, hard4: 0, hard5: 0},
        bestScoreinfo: {hard3: 0, hard4: 0, hard5: 0}
      }
    },
    computed: {
      bestScore () {
        return formatScore(Number(this.bestScoreinfo['hard' + this.size]))
      },
      currentScore () {
        return formatScore(Number(this.currentScoreinfo['hard' + this.size]))
      }
    },
    onLoad () {
      this.resize(3)
      this.req({
        url: '/api/shulte/get-rank?self=1'
      }).then(({data}) => {
        let res = data
        if (res.code) {
          if (res.data && res.data.length) {
            this.bestScoreinfo = res.data[0]
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    onUnload () {
      this.setting.panel1 = false
      this.setting.panel2 = false
      this.runStop()
    },
    methods: {
      toggleSetting (index) {
        if (this.playing === true && index === 'hard') return
        this.setting[index] = !this.setting[index]
      },
      shiftPanel () {
        this.shifting = true
        setTimeout(() => {
          this.shifting = false
          this.resize(this.size)
        }, 1000)
      },
      resize (size) {
        this.size = size
        let len = size * size
        let arr = new Array(len).fill(1)
        arr.forEach((item, index) => {
          arr[index] = index + 1
        })
        let newArr = []
        for (let i = 0; i < len; i++) {
          newArr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0])
        }
        this.cellArr = newArr
      },
      changeFrash (e) {
        this.isfrash = e.target.value
      },
      handleGo () {
        this.shiftPanel()
        this.setting.hard = false
        this.playing = true
        clearInterval(timer)
        beginTimer = setTimeout(() => {
          this.beginTimer()
        }, 2000)
      },
      beginTimer () {
        let min = 0
        let sec = 0
        let ms = 0
        timer = setInterval(() => {
          ms += 1
          if (ms > 9) {
            ms = 0
            sec++
          }
          if (sec > 59) {
            sec = 0
            min++
          }
          if (min === 2) {
            wx.vibrateLong()
            this.runStop()
          }
          this.timerTxt = `${min} : ${sec < 10 ? '0' + sec : sec} : ${ms}`
        }, 100)
      },
      processTap (cell) {
        if (!this.playing) return
        if (this.currentStep !== cell) {
          // 结束游戏
          wx.vibrateLong()
          clearInterval(timer)
          clearTimeout(beginTimer)
          wx.showModal({
            title: '提示',
            content: '很遗憾 挑战失败',
            showCancel: false,
            success: () => {
              this.currentStep = 1
              this.playing = false
              this.timerTxt = '0 : 00 : 0'
              // this.currentScore = '挑战失败'
            }
          })
          return
        }
        if (this.currentStep === this.size * this.size) {
          this.currentScoreinfo['hard' + this.size] = formatScore(this.timerTxt)
          clearInterval(timer)
          let currentNum = Number(this.currentScoreinfo['hard' + this.size])
          let bestNum = Number(this.bestScoreinfo['hard' + this.size])
          if (bestNum === 0) {
            this.bestScoreinfo['hard' + this.size] = currentNum
            this.postScore()
          } else if (currentNum < bestNum) {
            this.bestScoreinfo['hard' + this.size] = currentNum
            this.postScore()
          }
          wx.showModal({
            title: '提示',
            content: '恭喜 挑战成功',
            showCancel: false,
            success: () => {
              this.currentStep = 1
              this.playing = false
              this.timerTxt = '0 : 00 : 0'
            }
          })
          return
        }
        if (this.isfrash) {
          this.resize(this.size)
        }
        this.currentStep++
      },
      runStop () {
        this.currentStep = 1
        this.playing = false
        clearInterval(timer)
        this.timerTxt = '0 : 00 : 0'
      },
      postScore () {
        // let Arr = this.currentScore.split(':')
        // let score = Number(Arr[0]) * 60 * 10 + Number(Arr[1]) * 10 + Number(Arr[2])
        let score = Number(this.currentScoreinfo['hard' + this.size])
        this.req({
          url: '/api/shulte/update-score',
          method: 'POST',
          data: {
            score,
            hard: this.size
          }
        }).then(({data}) => {
          console.log(data)
        })
      },
      toRank () {
        wx.navigateTo({
          url: '/pages/socket-page/shulte-rank/main?hard=' + this.size
        })
      }
    }
  }
</script>

<style lang="stylus">
page
  background #555
.hover-cell
  opacity 0.5
.suite-page
  height 100vh
/*------------------------成绩面板------------------------*/
.score-panel
  position fixed
  width 160px
  height 50px
  padding 0 12px
  font-size 14px
  color #ee5500
  right 0
  top 13px
  background #fff
  border-radius 6px 0 0 6px
  z-index 8
  .panel-t, .panel-b
    display flex
    justify-content space-between
    line-height 25px

/*------------------------设置难度------------------------*/
.setting-hard
  height 42px
  width 360px
  position fixed
  left -290px
  top 16px
  height 44px
  display flex
  transition left 0.3s ease-out
  justify-content space-between
  align-items center
  border-radius 0 22px 22px 0
  background #fff
  overflow hidden
  z-index 9
  &.setting-hard-show
    left 0
  button 
    width 54px
    height 30px
    background #e50
    padding 0
    margin 0
    font-size 16px
    color #fff
    line-height 30px
    &:nth-child(1)
      margin-left 10px
  .more-hard 
    width 60px
    font-size 10px
    text-align center
    .check-info
      position relative
      top 4px
    .check-box
      transform scale(0.6)
  .hard-btn
    width 72px
    height 44px
    font-size 14px
    line-height 44px
    text-align center
    background #ee5500
    color #fff
/*------------------------设置背景------------------------*/
.setting-bg
  width 100vw
  position fixed
  left -332px
  height 32px
  display flex
  transition left 0.3s ease-out
  justify-content space-between
  z-index 9
  &.bg1
    bottom 52px
  &.bg2
    bottom 94px
  &.setting-show
    left 0
  .setting-opt
    background #fff
    width 330px
    white-space nowrap
    .color-item
      display inline-block
      width 32px
      height 32px
      background #fff
      border-right 1rpx solid #fff
  .setting-btn
    width 44px
    height 32px
    border-radius 0 21px 21px 0
    background linear-gradient(#e50, transparent), linear-gradient(90deg, #0c0, transparent), linear-gradient(-90deg, #3a8, transparent), linear-gradient(45deg, #000, transparent)
    background-blend-mode screen
/*------------------------主单元格------------------------*/
.cell-con
  position fixed
  left 0
  top 50%
  transform translateY(-60%)
  width 100%
  height 100vw
  display flex
  justify-content flex-start
  align-items center
  flex-wrap wrap
  transition opacity 0.8s ease-out
  &.hide
    opacity 0
.cell-con3x
  .cell
    width 125px
    height @width
    background #45B64A
    font-size 36px
    line-height 125px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(3n)
      border-right none
    &:nth-child(n+7)
      border-bottom none
.cell-con4x
  .cell
    width 25%
    height @width
    background #45B64A
    font-size 32px
    line-height 94px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(4n)
      border-right none
    &:nth-child(n+13)
      border-bottom none
.cell-con5x
  .cell
    width 20%
    height @width
    background #45B64A
    font-size 28px
    line-height 75px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(5n)
      border-right none
    &:nth-child(n+21)
      border-bottom none
/*------------------------开始按钮------------------------*/
.begin-btn
  width 80px
  height 80px
  position fixed
  left 50%
  transform translateX(-50%)
  bottom 50px
  text-align center
  font-size 28px
  color #ffffff
  background #0099FF
  border-radius 50%
  z-index 8
  span 
    display inline-block
    position absolute
    line-height 80px
    width 100%
    height 100%
    left 0
    top 0
    z-index 2
/*------------------------排行按钮------------------------*/
.rank-btn
  width 72px
  height 32px
  line-height 32px
  position fixed
  right 0
  bottom 75px
  background #0099FF
  text-align center
  font-size 16px
  border-radius 16px 0 0 16px
  z-index 8
  color #fff
</style>
