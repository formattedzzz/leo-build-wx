<!--  -->
<template>
  <div class="calc-panel">
    <div class="panel-res">
      <span class="comment-txt">备注:</span>
      <input class="comment-val" placeholder="点击写备注..." type="text">
      <input disabled class="fund-val" v-model="fundVal" type="text">
    </div>
    <div class="key-board">
      <div class="key-item" @click="pushval('1')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">1</div>
      <div class="key-item" @click="pushval('2')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">2</div>
      <div class="key-item" @click="pushval('3')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">3</div>
      <div class="key-item" hover-class="hover-key" hover-start-time="0" hover-stay-time="0">今天</div>
      <div class="key-item" @click="pushval('4')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">4</div>
      <div class="key-item" @click="pushval('5')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">5</div>
      <div class="key-item" @click="pushval('6')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">6</div>
      <div class="key-item" @click="pushval('+')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">+</div>
      <div class="key-item" @click="pushval('7')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">7</div>
      <div class="key-item" @click="pushval('8')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">8</div>
      <div class="key-item" @click="pushval('9')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">9</div>
      <div class="key-item" @click="pushval('-')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">-</div>
      <div class="key-item" @click="pushval('.')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">.</div>
      <div class="key-item" @click="pushval('0')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">0</div>
      <div class="key-item" @click="subval" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">DEL</div>
      <div class="key-item" @click="calcOrSave" hover-class="hover-save" hover-start-time="0" hover-stay-time="40">{{saveBtnTxt}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
      fundVal: ''
    }
  },
  computed: {
    saveBtnTxt () {
      return /\w[+|-]\w/.test(this.fundVal) ? '=' : '完成'
    }
  },
  methods: {
    pushval (val) {
      let oldval = this.fundVal
      if (val === '+' || val === '-') {
        if (/[+|-]$/.test(oldval)) {
          return // 不能连续输入
        } else {
          if (/\.$/.test(oldval)) {
            this.fundVal = oldval + '0' + val // 跟在.后面补0
          } else {
            this.fundVal = oldval + val
          }
        }
      }
      if (val === '.') {
        if (/[+-]/.test(oldval)) {
          if (/[+|-]$/.test(oldval)) {
            this.fundVal = oldval + ('0' + val) // 跟在加号后面补0
          } else {
            let subReg = /[+-]([\d|.]+)$/.exec(oldval)
            if (subReg && /\./.test(subReg)) {
              return false // 到上一个加减号前已经输入过点
            }
            this.fundVal = oldval + val
          }
        } else {
          if (this.fundVal === '') {
            this.fundVal = oldval + ('0' + val)
          } else {
            if (/\./.test(this.fundVal)) {
              return false // 到下一个加减号前已经输入过点
            }
            this.fundVal = oldval + val
          }
        }
      }
      if (/\d/.test(val)) {
        if (/\.\d{2}$/.test(this.fundVal) || oldval === '0') {
          return false // 金额限制为两位小数且0开头不能在输入数字
        } else {
          this.fundVal = oldval + val
        }
      }
    },
    subval () {
      let str = this.fundVal
      this.fundVal = str.substr(0, str.length - 1) || ''
    },
    calcOrSave () {
      let fundVal = this.fundVal
      if (!fundVal) {
        wx.showToast({
          title: '请输入金额',
          icon: 'none'
        })
        return false
      }
      fundVal = fundVal.replace(/[+-]$/, '')
      if (!/^[+-]/.test(fundVal)) {
        fundVal = '+' + fundVal
      }
      let signArr = fundVal.match(/[+-][\d|.]+/g)
      if (signArr) {
        let resNum = 0
        signArr.forEach((item, index) => {
          resNum += Number(item)
        })
        this.fundVal = resNum.toFixed(2) + ''
      }
    }
  }
}
</script>
<style lang='stylus'>
.calc-panel
  position fixed
  width 100%
  height 240px
  bottom 0
  left 0
.panel-res
  display flex
  height 40px
  justify-content space-between
  border-bottom 1rpx solid #ddd
  font-size 12px
  color #888
  font-weight 300
  line-height 40px
  background #f0f0f0
  .comment-txt
    width 40px
    flex-shrink 0
    text-align center
  .comment-val
    height 79rpx
    min-width 58%
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
  .fund-val
    height 79rpx
    font-size 16px
    color #555
    font-weight 300
    min-width 86px
    text-align right
    padding-right 20px
.key-board
  height 200px
  width 100%
  display flex
  flex-wrap wrap
  color #333
  .key-item
    width 25%
    height 50px
    border-bottom 1rpx solid #ddd
    border-right 1rpx solid #ddd
    background #fefefe
    line-height 50px
    text-align center
    &:nth-child(4n)
      border-right none
    &:nth-child(n+13)
      border-bottom none
    &:nth-child(8)
      font-size 20px
    &:nth-child(12)
      border-color #f60
      font-size 20px
    &:nth-child(15)
      border-color #f60
    &:nth-child(16)
      background #f60
      color #fff
  .hover-key
    background #dddddd
  .hover-save
    opacity 0.7
</style>