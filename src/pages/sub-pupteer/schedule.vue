<template>
<div class="schedule-panel">
<div class="add-btn" @click="panelShow = true">
  <img src="/static/svg/index-add.svg">
</div>

<div class="add-schedule" :class="{'show': panelShow}">
  <div class="info-item">
    <span>选择开始日期</span>
    <picker
      class="time-picker"
      mode="date"
      @change="startDateChange"
      :start="today"
      :value="today"
      :end="yearlater"
      fields="day">
      {{scheduleInfo.startDate}}
    </picker>
  </div>
  <div class="info-item">
  <radio-group class="time-group" @change="radioChange">
    <block v-for="(radio, idx) in scheduleInfo.radioArr" :key="idx">
      <label class="time-item" :for="'#' + idx">
        <radio
          :id="'#' + idx"
          :value="idx"
          class="radio"
          size="16"
          color="#7b23c9"
          :checked="idx === scheduleInfo.radioIdx"></radio>
        <span>{{radio}}</span>
      </label>
    </block>
  </radio-group>
  </div>
  <div class="info-item" style="margin-top:0;">
    <span>选择时间段</span>
    <div style="display:flex;">
    <!-- <picker
      class="time-picker" 
      :class="{'disabled': scheduleInfo.timeIdx > 0}"
      mode="time"
      :disabled="scheduleInfo.timeIdx > 0"
      @change="startTimeChange" 
      :value="scheduleInfo.startTime" 
      start="08:00"
      end="18:00"
      fields="day">
      {{scheduleInfo.startTime}}
    </picker> -->
    <picker
      class="time-picker"
      mode="selector"
      :class="{'disabled': scheduleInfo.radioIdx > 0}"
      @change="startTimeChange"
      :value="scheduleInfo.startTime"
      :range="scheduleInfo.timeItemArr">
      {{scheduleInfo.timeItemArr[scheduleInfo.startTime]}}
    </picker>
    <span style="margin:0 4px;">至</span>
    <picker
      class="time-picker"
      mode="selector"
      :class="{'disabled': scheduleInfo.radioIdx > 0}"
      @change="endTimeChange"
      :value="scheduleInfo.endTime"
      :range="scheduleInfo.timeItemArr">
      {{scheduleInfo.timeItemArr[scheduleInfo.endTime]}}
    </picker>
    <!-- <picker
      class="time-picker"
      :class="{'disabled': scheduleInfo.timeIdx > 0}"
      mode="time"
      :disabled="scheduleInfo.timeIdx > 0"
      @change="endTimeChange" 
      :value="scheduleInfo.endTime" 
      :start="scheduleInfo.startTime" 
      end="20:00"
      fields="day">
      {{scheduleInfo.endTime}}
    </picker> -->
    </div>
  </div>
  <div class="info-item">
    <span>选择重复</span>
    <picker 
      class="time-picker" 
      mode="selector"
      @change="repeatChange" 
      :value="scheduleInfo.repeat" 
      :range="scheduleInfo.repeatArr">
      {{scheduleInfo.repeatArr[scheduleInfo.repeat]}}
    </picker>
  </div>
  <div class="info-item" v-if="scheduleInfo.repeat">
    <span>选择结束时间</span>
    <picker
      class="time-picker"
      mode="date"
      @change="endDateChange"
      :value="scheduleInfo.endDate" 
      :start="scheduleInfo.startDate" 
      :end="halfyearlater"
      fields="day">
      {{scheduleInfo.endDate}}
    </picker>
  </div>
  <div class="info-item">
    <span>选择地点</span>
    <picker
      style="width:40px;text-align:center;"
      class="time-picker"
      mode="selector"
      @change="locationChange"
      :value="scheduleInfo.location"
      :range="scheduleInfo.locationArr">
      {{scheduleInfo.locationArr[scheduleInfo.location]}}
    </picker>
  </div>
  <div class="btn-panel">
    <button class="cancel-btn" @click="panelShow = false">取消</button>
    <button class="ok-btn" @click="submitSchedule">确认</button>
  </div>
</div>

</div>
</template>

<script>
function fixNum (n) {
  return n < 10 ? '0' + n : n
}
let today = new Date().toJSON().split('T')[0]
// 只针对一年内的时间做标记
let yearlater = new Date(Date.now() + 31536000000).toJSON().split('T')[0]
export default {
  data () {
    return {
      panelShow: false,
      today,
      yearlater,
      scheduleInfo: {
        startDate: today,
        radioArr: ['自定义', '上午', '下午', '全天'],
        radioIdx: 0,
        timeItemArr: new Array(13).fill(1).map((_, idx) => (idx + 8) + ':00'),
        startTime: 6,
        endTime: 8,
        endDate: today,
        repeatArr: ['不重复', '每天重复', '每周重复', '每月重复'],
        repeat: 0,
        locationArr: ['家', '学校', '其他'],
        location: 0
      }
    }
  },
  methods: {
    startDateChange (e) {
      // console.log(e)
      this.scheduleInfo.startDate = e.target.value
      if (+new Date(e.target.value) > +new Date(this.scheduleInfo.endDate)) {
        this.scheduleInfo.endDate = e.target.value
      }
    },
    endDateChange (e) {
      // console.log(e)
      this.scheduleInfo.endDate = e.target.value
    },
    startTimeChange (e) {
      this.scheduleInfo.startTime = Number(e.target.value)
      if (this.scheduleInfo.startTime >= this.scheduleInfo.endTime) {
        this.scheduleInfo.endTime = this.scheduleInfo.startTime + 1
      }
    },
    endTimeChange (e) {
      if (Number(e.target.value) > this.scheduleInfo.startTime) {
        this.scheduleInfo.endTime = Number(e.target.value)
      }
    },
    radioChange (e) {
      this.scheduleInfo.radioIdx = Number(e.target.value)
      switch (Number(e.target.value)) {
        case 0:
          this.scheduleInfo.startTime = 6
          this.scheduleInfo.endTime = 8
          break
        case 1:
          this.scheduleInfo.startTime = 0
          this.scheduleInfo.endTime = 4
          break
        case 2:
          this.scheduleInfo.startTime = 4
          this.scheduleInfo.endTime = 10
          break
        case 3:
          this.scheduleInfo.startTime = 0
          this.scheduleInfo.endTime = 10
          break
      }
    },
    repeatChange (e) {
      this.scheduleInfo.repeat = Number(e.target.value)
    },
    locationChange (e) {
      this.scheduleInfo.location = Number(e.target.value)
    },
    submitSchedule () {
      // 通过表单计算数据 开始、结束、重复方式、地点
      let {startDate, endDate, startTime, endTime, repeat, location} = this.scheduleInfo
      let DISTARR = [86400000, 604800000]
      let scheduleData = {}
      switch (repeat) {
        case 0:
          scheduleData[startDate] = `${startTime}-${endTime}T${location}`
          break
        case 1:
        case 2:
          let repeats = Math.floor((+new Date(endDate) - +new Date(startDate)) / DISTARR[repeat - 1])
          console.log(repeat, repeats)
          for (let i = 0; i <= repeats; i++) {
            scheduleData[new Date(+new Date(startDate) + i * DISTARR[repeat - 1]).toJSON().split('T')[0]] = `${startTime}-${endTime}T${location}`
          }
          break
        case 3:
        // 处理每月重复的逻辑根前两个不一样 无法再根据时间跨度计算
          let [yy1, mm1, dd1] = startDate.split('-')
          let [yy2, mm2, dd2] = endDate.split('-')
          yy1 = Number(yy1)
          yy2 = Number(yy2)
          mm1 = Number(mm1)
          mm2 = Number(mm2)
          let months = (yy2 - yy1) * 12 + (mm2 - mm1)
          if (Number(dd2) < Number(dd1)) months--
          for (let i = 0; i <= months; i++) {
            let mm = mm1 + i <= 12 ? fixNum(mm1 + i) : fixNum(mm1 - 12 + i)
            let yyyy = mm1 + i <= 12 ? yy1 : yy1 + 1
            let key = `${yyyy}-${mm}-${dd1}`
            scheduleData[key] = `${startTime}-${endTime}T${location}`
          }
          break
      }
      // console.log(scheduleData)
      this.$emit('submit', scheduleData)
    }
  }
}
</script>

<style lang="stylus">
.add-btn
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
  right 4px
  padding 6px
  img 
    width 100%
    height 100%
.add-schedule
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  z-index 9
  background #eee
  color #333
  font-size 16px
  visibility hidden
  &.show
    visibility visible
  .info-item
    width 100%
    margin-top 10px
    height 42px
    padding 0 20px
    display flex
    justify-content space-between
    align-items center
    background #fff
    .time-picker
      background #f0f0f0
      border-radius 4px
      padding 0 6px
      color #7b23c9
      font-weight 600
      &.disabled
        opacity 0.6

  .time-group
    width 100%
    height 100%
    display flex
    justify-content space-between
    align-items center
    border-bottom 1px dashed #f0f0f0
    .time-item
      display flex
      align-items center
      font-weight 600
      color #777
    .radio
      margin-right 1px
      transform scale(0.8)
  .btn-panel
    width 100%
    margin-top 20px
    height 42px
    padding 0 20px
    display flex
    justify-content space-between
    align-items center
    position absolute
    left 0
    bottom 24px
    button
      width 80px
      height 36px
      color #fff
      line-height 36px
      font-size 16px
    .cancel-btn
      background #ccc
    .ok-btn
      background #7b23c9
</style>
