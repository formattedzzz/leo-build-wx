<template>
<div class="panel-page" :class="{'panel-page-up': panelShow}">
  <h5 class="type-title">支出</h5>
  <div class="type-list">
    <div class="type-item" v-for="(item, index) in outcomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeTypeid}"><img :src="item.typeicon"></div>
      <span>{{item.typedesc}}</span>
    </div>
  </div>
  <h5 class="type-title" @click="panelShow = false">收入</h5>
  <div class="type-list" style="justify-content: flex-start;">
    <div class="type-item" v-for="(item, index) in incomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeTypeid}"><img :src="item.typeicon"></div>
      <span>{{item.typedesc}}</span>
    </div>
  </div>
  <calc-panel :show="panelShow" v-bind="panelData" @response="doneHandle"></calc-panel>
</div>
</template>

<script>
  import {outcomeList, incomeList, getNowFormatDate} from '@/utils/typeList'
  import calcPanel from '@/components/calcPanel'
  let nowDate = getNowFormatDate()
  export default {
    data () {
      return {
        from: '',
        outcomeList,
        incomeList,
        activeTypeid: '',
        // panel数据项
        panelShow: false,
        panelData: {
          fund: '',
          date: nowDate,
          comment: ''
        },
        posting: false
      }
    },
    computed: {
      baseURL () {
        return this.baseURL
      }
    },
    onLoad (options) {
      this.from = options.from
      if (this.from === 'edit') {
        let account = wx.getStorageSync('account')
        let {fund, date, comment, type, id} = account
        this.panelData = {fund, date, comment}
        this.activeTypeid = type
        this.panelShow = true
        this.account_id = id
      } else {
        this.panelData = {
          fund: '',
          date: nowDate,
          comment: ''
        }
      }
    },
    onShow () {

    },
    onUnload () {
      this.panelShow = false
      this.activeTypeid = ''
    },
    methods: {
      pick (type) {
        this.activeTypeid = type.typeid
        if (!this.panelShow) {
          this.panelShow = true
        }
      },
      doneHandle (data) {
        if (Number(data.account_fund) > 20000) {
          wx.showModal({
            title: '提示',
            content: '单笔记账2W以上土豪请自觉绕道',
            showCancel: false
          })
          return
        }
        if (this.from === 'add') {
          this.addAccount(data)
        } else {
          this.editAccount(data)
        }
      },
      editAccount (data) {
        let postData = Object.assign(data, {
          account_type: this.activeTypeid,
          account_income: this.activeTypeid.charAt(1) === '1' ? 1 : 0,
          account_id: this.account_id
        })
        console.log('put', postData)
        if (this.posting === true) return
        this.posting = true
        this.req({
          url: '/api/edit-account',
          data: postData,
          method: 'PUT'
        }).then((res) => {
          // console.log(res)
          if (res.data && res.data.code) {
            wx.showToast({
              title: '保存成功'
            })
            setTimeout(() => {
              wx.navigateBack()
              this.posting = false
            }, 800)
            // this.eventBus.$emit('updateAccount', true)
            wx.setStorageSync('updateAccount', true)
          } else {
            wx.shoToast({
              title: res.message,
              icon: 'none'
            })
            this.posting = false
          }
        }).catch((err) => {
          wx.shoToast({
            title: err,
            icon: 'none'
          })
          this.posting = false
        })
      },
      addAccount (data) {
        let postData = Object.assign(data, {
          account_type: this.activeTypeid,
          account_income: this.activeTypeid.charAt(1) === '1' ? 1 : 0
        })
        console.log('post', postData)
        if (this.posting === true) return
        this.posting = true
        this.req({
          url: '/api/add-account',
          data: postData,
          method: 'POST'
        }).then((res) => {
          if (res.data && res.data.code) {
            wx.showToast({
              title: '记账成功'
            })
            setTimeout(() => {
              wx.navigateBack()
              this.posting = false
            }, 800)
            // this.eventBus.$emit('updateAccount', true)
            wx.setStorageSync('updateAccount', postData.account_date.split('-')[0])
          } else {
            wx.shoToast({
              title: res.message,
              icon: 'none'
            })
            this.posting = false
          }
        }).catch((err) => {
          wx.shoToast({
            title: err,
            icon: 'none'
          })
          this.posting = false
        })
      }
    },
    components: {
      calcPanel
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
  font-weight 600
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
  font-weight 400
  .img-con 
    margin  0 auto
    width 56px
    height 56px
    border-radius 50%
    overflow hidden
    background #eee
    transition all 0.2s ease-out
    padding 15px
    img
      width 100%
      height 100%
  .img-con-active
    background #00cc00
</style>