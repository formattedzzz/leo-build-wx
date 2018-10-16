<template>
<div class="panel-page" :class="{'panel-page-up': panelShow}">
  <h5 class="type-title">支出</h5>
  <div class="type-list">
    <div class="type-item" v-for="(item, index) in outcomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeId}"><img :src="item.typeicon"></div>
      <span class="css1516558dbe1e46f">{{item.typedesc}}</span>
    </div>    
  </div>
  <h5 class="type-title">收入</h5>
  <div class="type-list" style="justify-content: flex-start;">
    <div class="type-item" v-for="(item, index) in incomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeId}"><img :src="item.typeicon"></div>
      <span class="css1516558dbe1e46f">{{item.typedesc}}</span>
    </div>
  </div>
  <div class="calc-panel" :class="{'calc-panel-show': panelShow}">
    <div class="panel-res">
      <span class="comment-txt">备注:</span>
      <input class="comment-val" placeholder="点击写备注..." type="text">
      <input disabled class="fund-val" placeholder="输入金额..." v-model="fundVal" type="text">
    </div>
    <div class="key-board">
      <div class="key-item" @click="pushval('1')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">1</div>
      <div class="key-item" @click="pushval('2')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">2</div>
      <div class="key-item" @click="pushval('3')" hover-class="hover-key" hover-start-time="0" hover-stay-time="40">3</div>
      <!-- <div class="key-item" hover-class="hover-key" hover-start-time="0" hover-stay-time="0">{{dateTxt}}</div> -->
      <picker class="key-item picker" mode="date" v-model="pickDate" start="2010-01-01" end="2019-12-31" @change="dateChange">
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
      <div class="key-item" @click="calcOrSave" hover-class="hover-save" hover-start-time="0" hover-stay-time="40">
        {{saveBtnTxt}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import {outcomeList, incomeList, getNowFormatDate} from './typeList.js'
  let nowDate = getNowFormatDate()
  export default {
    data () {
      return {
        outcomeList,
        incomeList,
        activeId: '',
        activeType: {},
        // panel数据项
        panelShow: false,
        fundVal: '',
        pickDate: nowDate
      }
    },
    computed: {
      baseURL () {
        return this.baseURL
      },
      saveBtnTxt () {
        return /\w[+|-]\w/.test(this.fundVal) ? '=' : '完成'
      },
      dateTxt () {
        return this.pickDate === nowDate ? '今天' : this.pickDate.replace(/-/g, '/').replace(/^\S{2}/, '')
      }
    },
    onLoad () {

    },
    onUnload () {
      this.panelShow = false
    },
    onReady () {
    },
    methods: {
      pick (type) {
        this.activeId = type.typeid
        this.activeType = type
        console.log(type)
        if (!this.panelShow) {
          this.panelShow = true
        }
      },
      dateChange (e) {
        this.pickDate = e.target.value
      },
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

<style lang="stylus">
svg 
  fill #ffffff
.panel-page
  min-height 100vh
.panel-page-up
  padding-bottom 250px
.type-title
  font-weight 300
  font-size 20px
  color #444
  padding 16px 16px 16px 24px
.type-list
  padding 10px 0
  display flex
  justify-content space-around
  flex-wrap wrap
.type-item
  display inline-block
  width 25%
  height 90px
  text-align center    
  font-size 16px
  color #626262
  font-weight 300
  .img-con 
    margin  0 auto
    width 56px
    height 56px
    border-radius 50%
    overflow hidden
    background #eee
    transition all 0.4s ease-out
    padding 15px
    img
      width 100%
      height 100%
  .img-con-active
    background #00cc00
// 面板样式
.input-placeholder
  color #aaa
  font-size 12px
  font-weight 300
.calc-panel
  position fixed
  width 100%
  height 240px
  bottom 0
  left 0
  transition all 0.4s ease-out
  transform translateY(100%)
.calc-panel-show
  transform translateY(0)
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
  .hover-key
    background #dddddd
  .hover-save
    opacity 0.7
</style>