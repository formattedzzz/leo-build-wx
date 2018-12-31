<template>
 <div class='page'>
   <div class="record-item" v-for="(item, index) in records" :key="index">
    <div class="item-l">
      <div class="avatar">
        <img :src="item.self.avatar">
      </div>
      <h5 class="nickname">{{item.self.nickname}}</h5>
    </div>
    <div class="item-m">
      <h5 class="item-mt" :class="{'fail': item.winner === 'FAILURE'}">{{item.winner}}</h5>
      <h5 class="item-mm">
        <span class="score score-l">{{item.self.score}}</span>  VS <span class="score score-r">{{item.oppo.score}}</span> 
      </h5>
      <h5 class="item-mb">{{item.date}}</h5>
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
    onShow () {

    },
    methods: {

    },
    components: {

    }
  }
</script>

<style lang="stylus">
.record-item
  width 100%
  display flex
  padding 10px 0
  justify-content space-between
  align-items center
  text-align center
  border-top 1rpx solid #ccc
  border-bottom 1rpx solid #ccc
  margin-top 10px
  .item-l, .item-r
    flex-shrink 0
    width 100px
    .avatar
      width 42px
      height 42px
      border-radius 50%
      overflow hidden
      margin 0 auto
      img
        width 100%
        height 100%
    .nickname
      font-size 12px
      color #4a4a4a
      width 100%
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
      padding-top 8px
  .item-m
    width 100px
    .item-mt 
      font-size 16px
      color #0c0
      &.fail 
        color #f00
    .item-mm
      font-size 24px
      color #e50
      transform scale(1.2)
      .score
        font-size 14px
        position relative
        bottom 0
        color #0c0
      .score-l
        left -30px
      .score-r
        right -30px
    .item-mb
      font-size 12px
      color #9b9b9b
 
</style>
