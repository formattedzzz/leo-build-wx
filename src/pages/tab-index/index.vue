<template>
  <div class="container">
    <div hover-class="hover-year" hover-start-time="0" hover-stay-time="40" @click="toAccountPanel" class="account-btn">
      <img src="/static/svg/index-add.svg">
    </div>
    <!-- <div class="year-info-null"></div> -->
    <div class="year-info">
      <picker :range="yearArr" v-model="currentYear"  @change="yearChange">
        <div hover-class="hover-year" hover-start-time="0" hover-stay-time="40" class="info-item">
        <span class="panel-txt">{{currentYear}}记账</span><br>
        <span class="panel-val">{{yearInfo.total}}</span> <span class="panel-txt" style="padding-left: 4px">笔</span>          
        </div>
      </picker>
      <div class="info-item">
        <span class="panel-txt">累计收入</span><br>
        <span class="panel-val">
          <span style="font-size: 14px;">¥</span>
          {{yearInfo.income}}
          <!-- <span style="font-size: 14px">.00</span> -->
        </span>
      </div>
      <div class="info-item">
        <span class="panel-txt">累计支出</span><br>
        <span class="panel-val">
          <span style="font-size: 14px;">¥</span>
          {{yearInfo.outcome}}
          <!-- <span style="font-size: 14px">.00</span> -->
        </span>
      </div>
    </div>
    <div class="sticky-con">
      <block v-for="(month, index) in monthList" :key="index">
      <block v-if="month.length">
        <div class="month-title">
          <span class="dot-circle"></span>
          <span>{{(12 - index) < 10 ? '0' + (12 - index) : (12 - index)}}</span>
          <span style="font-size:12px;">月 {{currentYear}}年</span>
        </div>
        <div class="item-content">
          <div
            v-for="(item, idx) in month" :key="item.id"
            @click="restoreItem(index, idx)" class="event-wrap">
            <div
              :data-index="index + '/' + idx"
              @touchstart="itemStart"
              @touchmove="itemMove"
              @touchend="itemEnd"
              :class="{'silde-left': item.slide}"
              class="account-item">
              <div class="item-l" :class="'background-' + idx % 4"><img :src="item.typeicon"></div>
              <div class="item-m">
                <span class="desc">{{item.typedesc}}</span><br>
                <span class="fund" :class="item.income ? 'income' : 'outcome'">
                  <span style="font-size: 14px;">¥ </span>{{item.fund}}
                </span>
              </div>
              <div class="item-r">
                <h5 class="date"><span class="day">{{dayArr[item.day-1]}} <span style="font-weight: 400;">{{item.date}}</span></span></h5>
                <h5 class="comment">备注：{{item.comment || '无'}}</h5>
              </div>
              <div class="del-btn" :class="{'show': item.slide}" @click.stop="delItem(index, idx)">DEL</div>
            </div>
          </div>
        </div>
      </block>
      </block>
    </div>
    <div v-if="!hasAccount" class="nothing-mind"><span class="line-l"></span><span>没有记账记录诶</span><span class="line-r"></span></div>
    <login-modal></login-modal>
  </div>
</template>

<script>
import loginModal from '@/components/loginModal'

import { formatTime } from '@/utils/index.js'
import {outcomeList, incomeList, totalTpye} from '@/utils/typeList'
let currentYEAR = new Date().getFullYear()
let yearArr = [currentYEAR, currentYEAR - 1, currentYEAR - 2, currentYEAR - 3]
export default {
  data () {
    return {
      outcomeList,
      incomeList,
      monthList: [],
      yearInfo: {},
      dayArr: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'],
      yearArr,
      currentYear: new Date().getFullYear(),
      currentSlide: ''
    }
  },
  components: {
    loginModal
  },
  computed: {
    baseURL () {
      return this.baseURL
    },
    hasAccount () {
      return this.monthList.some((month) => {
        if (month.length) {
          return true
        }
      })
    }
  },
  onLoad () {    
    let {currentYear} = this
    if (wx.getStorageSync('token')) {
      this.getIndexData(currentYear)
    } else {
      // 登录完成刷新数据
      this.eventBus.$on('hideLogin', (data) => {
        this.getIndexData(currentYear)
      })
    }
    
  },
  onShow () {
    let update = wx.getStorageSync('updateAccount')
    if (update === this.currentYear + '' || update === true) {
      let {currentYear} = this
      this.getIndexData(currentYear)
    } else {
      wx.removeStorageSync('updateAccount')
    }
  },
  methods: {
    yearChange (e) {
      if (this.yearArr[e.target.value] === this.currentYear) return
      this.currentYear = this.yearArr[e.target.value]
      let year = this.yearArr[e.target.value]
      this.getIndexData(year)
    },
    getIndexData (year, refresh = 'load') {
      wx.removeStorageSync('updateAccount')
      if (refresh === 'load') {
        wx.showLoading({
          title: '初始化中...'
        })        
      }
      this.req({
        url: '/api/account-info',
        data: {
          year: year
        }
      }).then((res) => {
        // console.log(res)
        this.yearInfo = res.data
      })
      this.req({
        url: '/api/get-account',
        data: {
          year: year
        }
      }).then((res) => {
        if (res.data.code) {
          let monthList = res.data.data
          monthList.forEach((item, index) => {
            if (item.length) {
              item.forEach((inner, index) => {
                inner.slide = false
                inner.day = new Date(inner.date).getDay()
                //  = inner.date.split('T')[0]
                inner.date = formatTime(new Date(inner.date), '/', 'YYYY-MM-DD')
                totalTpye.forEach((type) => {
                  if (inner.type === type.typeid) {
                    inner.typeicon = type.typeicon
                    inner.typedesc = type.typedesc
                  }
                })
              })
            }
          })
          this.monthList = monthList.reverse()
          if (refresh === 'load') {
            wx.hideLoading()     
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          if (refresh === 'load') {
            wx.hideLoading()
          }
        }
      })
    },
    toAccountPanel () {
      wx.navigateTo({
        url: '/pages/account-panel/main?from=add'
      })
      wx.removeStorageSync('account')
    },
    itemStart (e) {
      if (e.touches.length === 1) {
        this.startX = e.touches[0].clientX
        this.startTime = e.timeStamp
      }
      if (this.currentSlide) {
        let [idx1, idx2] = this.currentSlide.split('/')
        let [index, idx] = e.currentTarget.dataset.index.split('/')
        if (!(idx1 === index && idx2 === idx)) {
          this.monthList[idx1][idx2].slide = false
        }
      }
    },
    itemMove (e) {
      if (e.touches.length === 1) {
        this.disX = e.touches[0].clientX - this.startX
        this.disT = e.timeStamp - this.startTime
      }
    },
    itemEnd (e) {
      // console.log(this.disX)
      if (Math.abs(this.disX) <= 5) return
      let [index, idx] = e.currentTarget.dataset.index.split('/')
      if (Math.abs(this.disX / this.disT) > 0.5) {
        // console.log(this.disT / this.disX)
        // this.$set(this.monthList[index][idx], 'slide', true)
        this.currentSlide = index + '/' + idx
        this.monthList[index][idx].slide = true
      }
      this.disX = 0
    },
    restoreItem (index1, index2) {
      let account = this.monthList[index1][index2]
      let {slide} = account
      this.monthList[index1][index2].slide = false
      if (this.currentSlide) {
        let [idx1, idx2] = this.currentSlide.split('/')
        this.monthList[idx1][idx2].slide = false
      }
      // console.log(temp, '--tap--')
      if (slide === false) {
        wx.setStorageSync('account', account)
        wx.navigateTo({
          url: '/pages/account-panel/main?from=edit'
        })
        
      }
    },
    delItem (index1, index2) {
      let {currentYear} = this
      let account_id = this.monthList[index1][index2].id
      wx.showLoading({
        title: '处理中..'
      })
      this.req({
        url: '/api/del-account',
        method: 'DELETE',
        data: {
          account_id
        }
      }).then(({data}) => {
        wx.hideLoading()
        if (data.code) {
          this.delingId = account_id
          this.monthList[index1].splice(index2, 1)
          this.req({
            url: '/api/account-info',
            data: {
              year: currentYear
            }
          }).then(({data}) => {
            this.yearInfo = data
          })
        }
      }).catch((err) => {
        // console.log(err)
        wx.showToast({
          title: err,
          icon: 'none'
        })
        wx.hideLoading()
      })
    }
  },
  onPullDownRefresh () {
    let {currentYear} = this
    this.getIndexData(currentYear, 'refresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
}
</script>

<style lang="stylus">
.hover-year
  background darken(#ee5500, 10)
.account-btn
  width 64px
  height 64px
  border-radius 50%
  background #e50
  position fixed
  bottom 10px
  left 50%
  padding 10px
  transform translateX(-50%)
  box-shadow 0 0 4px #dddddd
  z-index 99
  opacity 0.8
  &:after
    content ''
    display inline-block
    width 2px
    height 100%
    position absolute
    left 50%
    top 0
    transform translateX(-50%)
    background #fff
  &:before
    content ''
    display inline-block
    height 2px
    width 100%
    position absolute
    left 0
    top 50%
    background #fff
    transform translateY(-50%)
  img 
    width 100%
    height 100%
// .year-info-null
//   height 72px
.year-info
  width 100%
  height 72px
  // background #e50
  background linear-gradient(to bottom, #e50 0%, #EE7600 100%)
  // background-image linear-gradient(-30deg, #e50 0%, #e50 50%, #e50 50%, rgba(255, 255, 255, 0.5) 100%)
  display flex
  color #fff
  text-align center
  justify-content space-around
  align-items center
  position sticky
  left 0
  top 0
  border-bottom 1rpx solid #fff
  z-index 19
  .info-item 
    padding 0 5px
  .panel-txt
    font-size 12px
    font-weight 300
  .panel-val 
    font-size 22px
    font-weight 600
.month-title
  width 100%
  height 36px
  position sticky
  padding-left 16px
  line-height 36px
  font-size 20px
  color #222
  top 72px
  font-weight 600
  background #f0f0f0
  z-index 9
  .dot-circle
    display inline-block
    position absolute
    width 9px
    height 9px
    border-radius 5px
    background #fff
    border 1rpx solid #999
    left 5rpx
    top 50%
    transform translateY(-50%)
  &:before 
    content: ''
    display inline-block
    position absolute
    width 1rpx
    height 100%
    left 7px
    border-radius 3px
    background #999
    top 0
.item-content
  width 100%
  padding 10px 10px 0 14px
  overflow hidden
  position relative
  &:before 
    content: ''
    display inline-block
    position absolute
    width 1rpx
    height 100%
    left 7px
    border-radius 3px
    background #999
    top 0
.account-item
  height 64px
  width 100%
  padding-right 10px
  display flex
  justify-content space-between
  align-items center
  color #333
  font-size 16px
  border 1rpx solid #f0f0f0
  margin-bottom 10px
  // &:last-child
  //   border-bottom none
  position relative
  transition transform 0.4s ease-out
  &.silde-left
    transform translateX(-75px)
  .item-l
    width 64px
    height 64px
    padding 16px
    flex-shrink 0
    // background linear-gradient(to right, #e50 0%, #EE7600 100%)
    img 
      width 100%
      height 100%
  .item-m
    width 80px
    flex-shrink 0
    text-align center
    .fund
      font-size 20px
      font-weight 600
      &.income 
        color #0c0
      &.outcome 
        color #f00
  .item-r 
    // flex-grow 1
    width 180px
    color #626262
    text-align right
    .day
      display inline-block
      padding 0 4px
      background #cc6633
      font-weight 600
      color #fff 
      font-size 14px
      border-radius 2px
    .comment
      display inline-block
      width 100%
      height 20px
      font-size 14px
      font-weight 300
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
      color #222
      margin-top 5px
  .del-btn
    width 64px
    height 100%
    position absolute
    right -75px
    top 0
    background #ff4400
    line-height 64px
    text-align center
    color #fff
    font-size 16px
    opacity 0
    transition all 0.3s ease-out
    &.show
      opacity 1

</style>
