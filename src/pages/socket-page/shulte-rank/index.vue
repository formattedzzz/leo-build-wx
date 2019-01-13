<template>
  <div class="rank-page">
    <div class="rank-item" v-for="(item, index) in rankinfo" :key="index">
      <img class="avatar" :src="item.avatar">
      <span>{{item.nickname}}</span>
      <span>{{item.ranktxt}}</span>
    </div>
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
  export default {
    data () {
      return {
        rankinfo: []
      }
    },
    computed: {

    },
    onLoad (options) {
      this.query = options
      console.log(options)
      this.req({
        url: '/api/shulte/get-rank'
      }).then(({data}) => {
        let res = data
        if (res.code) {
          if (res.data && res.data.length) {
            res.data.sort(function (item1, item2) {
              return Number(item1['hard' + options.hard]) - Number(item2['hard' + options.hard])
            })
            res.data.forEach((item) => {
              item.ranktxt = formatScore(Number(item['hard' + options.hard]))
            })
            this.rankinfo = res.data
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

    },
    components: {

    }
  }
</script>

<style lang="stylus">
.rank-item
  width 100%
  padding 20px
  height 64px
  display flex
  font-size 16px
  color #e50
  justify-content space-between
  align-items center
  border-bottom 1rpx solid #ccc
  &:nth-child(1)
    border-top 1rpx solid #ccc
  .avatar
    width 48px
    height 48px
    border-radius 50%

</style>
