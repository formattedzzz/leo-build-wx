<!--  -->
import { constants } from 'http2';
<template>
  <div class="calc-panel" :class="{'calc-panel-show': show}">
    <div class="panel-res">
      <!-- <span class="comment-txt">备注:</span> -->
      <input class="comment-val" v-model="account_comment" placeholder="写点备注吧..." type="text">
      <input disabled class="fund-val" placeholder="输入金额..." v-model="account_fund" type="text">
    </div>
    <div class="key-board">
      <div class="key-item" @click="pushval('1')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">1</div>
      <div class="key-item" @click="pushval('2')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">2</div>
      <div class="key-item" @click="pushval('3')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">3</div>
      <!-- <div class="key-item" hover-class="hover-key" hover-start-time="0" hover-stay-time="0">{{dateTxt}}</div> -->
      <picker class="key-item picker" mode="date" v-model="account_date" start="2010-01-01" end="2019-12-31" @change="dateChange">
        <view hover-class="hover-key" style="width:100%;height:100%;">
          {{dateTxt}}
        </view>
      </picker>
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
      <div class="key-item" :class="{'cant-post': account_fund === ''}" @click="calcOrSave" hover-class="hover-save" hover-start-time="0" hover-stay-time="40">
        {{saveBtnTxt}}
      </div>
    </div>
  </div>
</template>

<script>
function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
let nowDate = getNowFormatDate()
export default {
  props: {
    show: Boolean,
    fund: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: nowDate
    },
    comment: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      account_fund: this.fund + '',
      account_date: this.date,
      account_comment: this.comment
    }
  },
  computed: {
    saveBtnTxt () {
      return /\w[+|-]/.test(this.account_fund) ? '=' : '完成'
    },
    dateTxt () {
      return this.account_date === nowDate ? '今天' : this.account_date.replace(/-/g, '/').replace(/^\S{2}/, '')
    }
  },
  watch: {
    // 解决onload onshow 都触发却没有执行相关代码的问题
    'show': function (newval, val) {
      if (newval === true) {
        this.account_fund = this.fund + ''
        this.account_date = this.date
        this.account_comment = this.comment        
      }
    }
  },
  onLoad () {
    console.log('calc onload')    

  },
  onShow () {
    console.log('calc onshow')
    // this.account_fund = this.fund
    // this.account_date = this.date
    // this.account_comment = this.comment 
  },
  onUnload () {
    // console.log('calc onunload')
    this.account_fund = ''
    this.account_date = nowDate
    this.account_comment = ''
  },
  methods: {
    dateChange (e) {
      this.account_date = e.target.value
    },
    pushval (val) {
      let oldval = this.account_fund
      if (val === '+' || val === '-') {
        if (/[+|-]$/.test(oldval)) {
          return // 不能连续输入
        } else {
          if (/\.$/.test(oldval)) {
            this.account_fund = oldval + '0' + val // 跟在.后面补0
          } else {
            this.account_fund = oldval + val
          }
        }
      }
      if (val === '.') {
        if (/[+-]/.test(oldval)) {
          if (/[+|-]$/.test(oldval)) {
            this.account_fund = oldval + ('0' + val) // 跟在加号后面补0
          } else {
            let subReg = /[+-]([\d|.]+)$/.exec(oldval)
            if (subReg && /\./.test(subReg)) {
              return false // 到上一个加减号前已经输入过点
            }
            this.account_fund = oldval + val
          }
        } else {
          if (this.account_fund === '') {
            this.account_fund = oldval + ('0' + val)
          } else {
            if (/\./.test(this.account_fund)) {
              return false // 到下一个加减号前已经输入过点
            }
            this.account_fund = oldval + val
          }
        }
      }
      if (/\d/.test(val)) {
        if (/\.\d{2}$/.test(this.account_fund) || oldval === '0') {
          if (oldval === '0') {
            this.account_fund = val
          } else {
            return false // 金额限制为两位小数且0开头不能在输入数字
          }
        } else {
          if (/[+-]0$/.test(oldval)) {
            this.account_fund = oldval.substr(0, oldval.length - 1) + val
          } else {
            this.account_fund = oldval + val
          }
        }
      }
    },
    subval () {
      let str = this.account_fund + ''
      this.account_fund = str.substr(0, str.length - 1) || ''
    },
    calcOrSave () {
      let account_fund = this.account_fund
      if (!account_fund) {
        wx.showToast({
          title: '请输入金额',
          icon: 'none'
        })
        return false
      }
      if (this.saveBtnTxt === '=') {
        account_fund = account_fund.replace(/[+-]$/, '')
        if (!/^[+-]/.test(account_fund)) {
          account_fund = '+' + account_fund
        }
        let signArr = account_fund.match(/[+-][\d|.]+/g)
        if (signArr) {
          let resNum = 0
          signArr.forEach((item, index) => {
            resNum += Number(item)
          })
          this.account_fund = resNum.toFixed(2) + ''
        }
      } else {
        let {account_fund, account_date, account_comment} = this
        this.$emit('response', {account_fund: Number(account_fund), account_date, account_comment})
      }
    }
  }
}
</script>
<style lang='stylus'>
/* eslint disable */
.input-placeholder
  color #666
  font-size 14px
  font-weight 400
.calc-panel
  position fixed
  width 100%
  height 240px
  bottom 0
  left 0
  transition all 0.3s ease-out
  transform translateY(100%)
  &.calc-panel-show
    transform translateY(0)
.panel-res
  display flex
  height 40px
  justify-content space-between
  border-bottom 1rpx solid #ddd
  font-size 14px
  color #888
  font-weight 300
  line-height 40px
  background #f0f0f0
  .comment-txt
    width 40px
    flex-shrink 0
    text-align center
    font-weight 400
    color #626262
  .comment-val
    height 79rpx
    min-width 58%
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    font-weight 400
    color #222
    padding-left 20px
  .fund-val
    height 79rpx
    font-size 18px
    color #222
    font-weight 600
    min-width 86px
    text-align right
    padding-right 12px
.key-board
  height 200px
  width 100%
  display flex
  flex-wrap wrap
  color #333
  .picker
    box-sizing border-box
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
      border-color #0C0
      font-size 20px
    &:nth-child(15)
      border-color #0C0
    &:nth-child(16)
      background #0C0
      color #fff
    &.cant-post
      opacity 0.5
  .hover-key
    background #dddddd
  .hover-save
    opacity 0.7
</style>