<template>
<div class="calender-page">
<div class="fixed-btn back-btn" :class="{'show': !showBackToday}" @click="backToday">今</div>
<schedule @submit="submitSchedule"></schedule>
<div class="yyyy-mm">
  <div class="prev" @click="prevMon"><img src="/static/img/prev.png"></div>
  <div>
    <picker mode="date" @change="dateChange" start="1949-01" end="2049-12" fields="month">
      {{currentY}} - {{currentM < 10 ? '0' + currentM : currentM}}
    </picker>
    <div class="lunar-date">
      {{activeDay.lunarDatestr}}
      <span style="color:#7b23c9;">{{activeDay.holiday}}</span>
    </div>
  </div>
  <div class="next" @click="nextMon"><img src="/static/img/next.png"></div>
</div>
<div class="week-head">
  <div v-for="(week, idx) in weekArr" :key="idx" class="week-item">{{week}}</div>
</div>
<div class="day-body">
  <div v-for="(empday, idx) in monEmpty" :key="idx + '-'" class="day-item empty"></div>
  <div
    v-for="(day, idx) in dayArr"
    :key="idx"
    @click="lightDay(day, idx)"
    class="day-item"
    :class="{'active':idx === activeDayIdx,'today':day.date === today,'holiday':day.holiday}">
      {{day.date === today ? '今' : idx + 1}}
  </div>
</div>
<div class="shedule-item" v-for="(sche, idx) in activeSchedule" :key="idx">
  {{sche.F}}-{{sche.T}} {{sche.AT}}
</div>
<div class="schedule-panel">{{scheduleDataTxt}}</div>

</div>
</template>

<script>
/* eslint-disable */
import Lunar, {holiday} from './lunar.js'
import schedule from './schedule.vue'
// console.log(new Lunar(new Date('2031-06-24')), holiday)
function fixNum (n) {
  return n < 10 ? '0' + n : n
}
function getDayArr (y, m) {
  // m 真实月份
  return new Array(new Date(y, m, 0).getDate()).fill(1).map((_, idx) => {
    let normal = `${y}-${fixNum(m)}-${fixNum(idx + 1)}`
    let tmp = new Lunar(new Date(normal))
    let lunar = `${tmp.year}-${fixNum(tmp.month)}-${fixNum(tmp.day)}`
    return {
      date: normal,
      lunar,
      holiday: holiday.normal[normal.slice(5)] || holiday.lunar[lunar.slice(5)] || ''
    }
  })
}
function getMonGo (y, m) {
  return new Array(new Date(`${y}-${fixNum(m)}-01`).getDay()).fill(1)
}
function scheduleAssign (oldsche, sche) {
  // 数据格式 0-3T0 表示：8点到11点在家 T0 表示常驻地点的代号 一个教练会有几个常驻地点 下标从零开始
  // {
  //   '2019-05-06': ['0-3T0', '4-6T1'],
  //   '2019-05-07': ['0-3T0', '4-6T1']
  // }
  // GET
  // [
  //   {
  //     address: '',
  //     lat: '',
  //     lng: ''
  //   }
  // ]
  // POST
  
  // let a = {
  //   '2019-05-06': [
  //     {
  //       id: 1,
  //       start: 12328716348,
  //       end: 10894732187,
  //       addr: '',
  //       lat: '',
  //       lng: ''
  //     },
  //     {
  //       id: 1,
  //       start: 12328716348,
  //       end: 10894732187,
  //       addr: '',
  //       lat: '',
  //       lng: ''
  //     }
  //   ]
  // }
  let newSche = Object.assign({}, oldsche)
  if (typeof sche !== 'object') throw new Error('Function scheduleAssign receive illegal parameters')
  // 新老数据合并
  Object.keys(sche).forEach((date, idx) => {
    if (newSche[date]) {
      console.log('newSche有', date)
      let AT = sche[date].split('T')[1]
      let [F, T] = sche[date].split('T')[0].split('-')
      newSche[date].forEach((span, subidx) => {
        let at = span.split('T')[1]
        let [f, t] = span.split('T')[0].split('-')
        if (F <= f && T >= t) {
          newSche[date][subidx] = ''
        }
        if (F <= f && T > f && T < t) {
          // 右边在中间
          newSche[date][subidx] = `${T}-${t}T${at}`
        }
        if (F > f && F < t && T >= t) {
          // 左边在中间
          newSche[date][subidx] = `${f}-${F}T${at}`
        }
        if (F > f && T < t) {
          newSche[date][subidx] = ''
          newSche[date].push(`${f}-${F}T${at}`, `${T}-${t}T${at}`)
        }
      })
      newSche[date].push(sche[date])
      newSche[date] = newSche[date].filter((time) => {
        return time !== ''
      })
    } else {
      console.log('newSche没',date)
      newSche[date] = [sche[date]]
    }
  })
  return newSche
}
let now = 0
let date = new Date()
let month = date.getMonth() + 1
let year = date.getFullYear()
let day = date.getDate()
let today = `${year}-${fixNum(month)}-${fixNum(day)}`
// let halfyearlater = new Date(Date.now() + 31536000000).toLocaleDateString().replace(/\//g, '-')
export default {
  data () {
    return {
      weekArr: ['日', '一', '二', '三', '四', '五', '六'],
      today,
      // halfyearlater,
      currentM: month,
      currentY: year,
      activeDayIdx: day - 1,
      dayArr: getDayArr(year, month),
      monEmpty: getMonGo(year, month),
      scheduleData: {},
      activeSchedule: []
    }
  },
  computed: {
    showBackToday () {
      return this.currentY === year && this.currentM === month
    },
    // 本月高亮当天节假日、农历描述日期
    activeDay () {
      let day = this.dayArr[this.activeDayIdx] || this.dayArr[this.dayArr.length - 1]
      return {
        holiday: day.holiday || '',
        lunarDatestr: '农历' + day.lunar
      }
    },
    scheduleDataTxt () {
      return JSON.stringify(this.scheduleData)
    }
  },
  onLoad () {
  },
  methods: {
    backToday () {
      this.currentM = month
      this.currentY = year
      this.dayArr = getDayArr(year, month)
      this.monEmpty = getMonGo(year, month)
    },
    nextMon () {
      if (Date.now() - now < 200) return
      now = Date.now()
      let {currentM, currentY} = this
      console.log(currentM, currentY)
      if (currentM < 12) {
        this.monEmpty = getMonGo(currentY, currentM + 1)
        this.dayArr = getDayArr(currentY, currentM + 1)
        this.currentM++
      } else {
        if (currentY >= 2049) return
        this.monEmpty = getMonGo(currentY + 1, 1)
        this.dayArr = getDayArr(currentY + 1, 1)
        this.currentM = 1
        this.currentY++
      }
    },
    prevMon () {
      if (Date.now() - now < 200) return
      now = Date.now()
      let {currentM, currentY} = this
      if (currentM > 1) {
        this.monEmpty = getMonGo(currentY, currentM - 1)
        this.dayArr = getDayArr(currentY, currentM - 1)
        this.currentM--
      } else {
        if (currentY <= 1949) return
        this.monEmpty = getMonGo(currentY - 1, 12)
        this.dayArr = getDayArr(currentY - 1, 12)
        this.currentM = 12
        this.currentY--
      }
    },
    lightDay (day, idx) {
      console.log(day)
      this.activeDayIdx = idx
      if (!this.scheduleData[day.date]) {
        this.activeSchedule = [] 
        return
      }
      this.activeSchedule = this.scheduleData[day.date].map((span) => {
        let AT = ['家', '学校', '其他'][span.split('T')[1]]
        let [F, T] = span.split('T')[0].split('-')
        return {
          F: (Number(F) + 8) + ':00',
          T: (Number(T) + 8) + ':00',
          AT
        }
      })

    },
    dateChange (e) {
      console.log(e)
      let [yyyy, mm] = e.target.value.split('-')
      this.currentM = Number(mm)
      this.currentY = Number(yyyy)
      this.monEmpty = getMonGo(Number(yyyy), Number(mm))
      this.dayArr = getDayArr(Number(yyyy), Number(mm))
    },
    submitSchedule (data) {
      console.log('submit', data)
      this.scheduleData = scheduleAssign(this.scheduleData, data)
      // console.log(this.scheduleData)
    }
  },
  components: {
    schedule
  }
}
</script>

<style lang="stylus">
.fixed-btn
  width 40px
  height 40px
  position fixed
  top 0
  text-align center
  line-height 40px
  background #9652d5
  color #fff
  font-weight 600
  border-radius 50%
.back-btn
  left 4px
  transition transform 0.3s ease-out
  transform translateX(-120%)
  &.show
    transform translateX(0)
// .add-btn
//   right 4px
//   padding 6px
//   img 
//     width 100%
//     height 100%
.yyyy-mm
  width 100%
  height 44px
  text-align center
  font-size 18px
  font-weight 600
  color #333
  display flex
  padding 0 60px
  justify-content space-between
  align-items center
  .prev, .next
    display block
    width 36px
    height 36px
    border-radius 50%
    background #FFF 
    border 1px solid #eee
    padding 5px
    img
      height 100%
      width 100%
  .lunar-date
    font-size 12px
    position relative
    top -2px
    width 144px

.week-head
  width 100%
  height 44px
  display flex
  align-content center
  font-size 16px
  font-weight 600
  color #333
  background #f2d9b4
  .week-item
    flex 1
    line-height 44px
    text-align center
    border-right 1px solid #fff
    &:first-child
      color #7b23c9
    &:last-child
      color #7b23c9
      border-right none
.day-body
  width 100%
  height auto 
  display flex
  flex-wrap wrap
  justify-content flex-start
  .day-item
    width 50px
    height @width
    background #eee
    margin-top 3px
    margin-left 3px
    text-align center
    line-height 50px
    border-radius 50%
    transition background 0.2s ease-out 
    &.empty
      background #fff
    &.today
      color #fff
      font-size 18px
      font-weight 600
      background #c7a3e8
    &.holiday
      font-weight 600
      color #7b23c9
      position relative
      &:after
        content ''
        display inline-block
        width 8px
        height 8px
        border-radius 4px
        background #fff
        position absolute
        bottom 5px
        left 21px
    &.active
      background #e80

</style>
