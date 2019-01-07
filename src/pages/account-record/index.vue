<template>
  <div class="page">
    <div class="record-head">
      <img class="head-icon" src="/static/svg/self.svg">
      <img class="head-icon" src="/static/svg/panel.svg">
      <img class="head-icon" src="/static/svg/oppo.svg">
    </div>
    <div class="record-item" v-for="(item, index) in records" :key="index">
      <span class="winner-mark fail" v-if="item.winner === 'FAILURE'">失败</span><span class="winner-mark" v-else>胜利</span>
      <div class="item-l">
        <div class="avatar">
          <img :src="item.self.avatar">
        </div>
        <h5 class="nickname">{{item.self.nickname}}</h5>
      </div>
      <div class="item-m">
        <span class="score score-l">{{item.self.score}}"</span>
        <h5 class="item-mt">一站到底挑战赛</h5>
        <h5 class="item-mm">VS</h5>
        <h5 class="item-mb">{{item.date}}</h5>
        <span class="score score-r">{{item.oppo.score}}"</span> 
      </div>
      <div class="item-r">
        <div class="avatar">
          <img :src="item.oppo.avatar">
        </div>
        <h5 class="nickname">{{item.oppo.nickname}}</h5>
      </div>
    </div>

    <div v-if="!records.length" class="nothing-mind"><span class="line-l"></span><span>暂无对局记录诶</span><span class="line-r"></span></div>
  </div>
</template>

<script>
  import { formatTime } from '@/utils/index.js'
  export default {
    data () {
      return {
        records: []
      }
    },
    computed: {

    },
    onLoad () {
      this.req({
        url: '/api/get-qarecord'
      }).then(({data}) => {
        let res = data
        if (res.code) {
          if (res.data && res.data.length) {
            let records = res.data.map((item) => {
              let self = JSON.parse(item.record_self)
              let oppo = JSON.parse(item.record_match)
              return {
                winner: item.record_winner === 1 ? 'WINNER' : (item.record_winner === 0 ? 'FAILURE' : 'DRAW'),
                self: {nickname: self.nickname, avatar: self.avatar, score: self.score},
                oppo: {nickname: oppo.nickname, avatar: oppo.avatar, score: oppo.score},
                date: formatTime(new Date(item.createdAt), '-')
              }
            })
            this.records = records
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    methods: {

    }
  }
</script>

<style lang="stylus">
.page
  padding-bottom 20px
.record-head
  width 100%
  padding 6px 36px
  height 40px
  line-height 40px
  display flex
  justify-content space-between
  align-items center
  background #f0f0f0
  font-size 16px
  color #626262
  position sticky
  top 0
  left 0
  z-index 9
  .head-icon
    width 24px
    height 24px
.record-item
  width 100%
  display flex
  padding 10px 0
  height 110px
  justify-content space-between
  align-items flex-end
  text-align center
  border-top 1rpx solid #ccc
  border-bottom 1rpx solid #ccc
  margin-top 10px
  position relative
  overflow hidden
  .winner-mark
    display inline-block
    width 82px
    height 39px
    line-height 50px
    font-size 12px
    color #fff
    background #00cc00
    position absolute
    left -28px
    transform rotate(-45deg)
    top -7px
    text-align center
    &.fail
      background #ff3100
  .item-l, .item-r
    flex-shrink 0
    width 100px
    .avatar
      width 42px
      height 42px
      border-radius 50%
      overflow hidden
      margin 0 auto
      position relative
      img
        width 100%
        height 100%
        border-radius 50%
    .nickname
      font-size 12px
      color #4a4a4a
      width 100%
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
      padding-top 8px
  .item-m
    width 120px
    position relative
    height 100%
    .item-mt 
      font-size 16px
      color #ee5500
    .item-mm
      font-size 24px
      color #e50
      transform scale(1.2)
    .item-mb
      font-size 12px
      color #9b9b9b
    .score
      font-size 20px
      position absolute
      bottom 28px
      color #0c0
    .score-l
      left -30px
    .score-r
      right -30px
 
</style>
