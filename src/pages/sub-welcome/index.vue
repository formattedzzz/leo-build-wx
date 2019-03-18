<template>
<div id="welcome-page" class="welcome-page">
<div class="img-panel">
<img mode="widthFix" style="width:100%;" :src="img1">
<video id="courseVideo"
  src="http://1254101407.vod2.myqcloud.com/27deb500vodtransgzp1254101407/5407edd65285890786075491634/v.f40.mp4" 
  poster="https://1254101407.vod2.myqcloud.com/27deb500vodtransgzp1254101407/8f66a47f5285890781789494813/1536723699_1177859809.100_0.jpg"
  controls>
</video>
<button class="button-login" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">注册免费领取</button>
</div>
<img style="width:100%;" v-for="(img, idx) in imgArr1" :key="idx" mode="widthFix" :src="img">
<div class="swiper1">
  <h5 class="swiper1-txt1">教学模式和收费</h5>
  <h5 class="swiper1-txt2">多种课包任你挑选</h5>
  <swiper class="pkg-swiper"
    :previous-margin="40"
    :next-margin="40"
    circular
    @change="change1"
    :current="current1">
    <block v-for="(img, idx) in imgArr2" :key="idx">
      <swiper-item class="swiper-item">
        <div class="pkg-item" :style="idx === current1 ? 'transform:translateY(-32rpx)' : ''">
          <img :src="img">
        </div>
      </swiper-item>
    </block>
  </swiper>
</div>
<div class="swiper2">
  <h5 class="swiper2-txt1">用户好评</h5>
  <h5 class="swiper2-txt2">孩子学的开心 家长看得省心<br> 上万家长的共同选择</h5>
  <swiper class="pin-swiper"
    :previous-margin="76"
    :next-margin="76"
    circular
    @change="change2"
    :current="current2">
    <block v-for="(img, idx) in imgUrls" :key="idx">
      <swiper-item class="swiper-item">
        <div class="pkg-item" :style="idx === current2 ? 'transform:translateY(-14rpx)scale(1.2)' : ''">
          <img :src="img">
        </div>
      </swiper-item>
    </block>
  </swiper>
</div>
<div class="nncz-desc">
  <h5 class="size-20">关于牛牛成长</h5>
  <h5 class="left" style="margin-top:52rpx;">
    <span class="size-16">我们的使命：</span> <br>
    <span class="size-14">不是为了把孩子培养成专业的运动员，而是为了让中国2亿儿童都能成长为一个更好的人，成长为：</span> 
  </h5>
  <h5 class="size-16 quote" style="margin-top:80rpx;">
    <span class="span1">“</span>
    一个更健康、更开朗、更具生命力和<br>创造力的人
    <span class="span2">“</span>
  </h5>
  <h5 style="text-align:center;"><span @click="scrollToBot" class="size-14 read-more" style="margin-top:96rpx;">查看品牌故事</span></h5>
  <div class="panel" :class="{'expand': expand}">
    <h5 class="size-18" style="margin-top:86rpx;">我们为什么做牛牛成长？</h5>
    <h5 class="size-14 left" style="margin-top:50rpx;">
      中国儿童的体质水平连续25年下降，大量3-12岁的儿童患上了肥胖、近视、社交恐惧、怯懦、多动等心理和生理疾病。中国的儿科医患比高达1:2300（1名儿童医生要对应2300名患儿），孩子生病，为每个家庭带来了巨大的时间和经济成本。牛牛成长希望从根本上解决孩子们的健康问题——不仅是身体健康，更有心理健康。而体育教育，正是孩子体格和品格成长的绝佳方式。 
      <h5 style="margin-top:30rpx;"></h5>
      体育教学中最大的场地成本问题以及上学路程问题，导致很多家庭需要支付高昂的培训费，并投入大量时间和交通成本，孩子奔波于不同培训机构间，有时甚至累得在车里睡着。我们迫切希望能够解决这个困扰家长和孩子们的问题。为此，牛牛成长创新性地提出了移动式上门体育教学的模式，由家长和孩子在家门口组队，我们提供定制化的上门体育课，最大程度地方便家长和孩子，让每个孩子都能在家门口快乐的运动。 
      <h5 style="margin-top:30rpx;"></h5>
      我们以北美、澳洲及欧洲幼儿及小学体育教育体系为教研基础，由美国NAYS认证教练，国际体育科学协会认证训练师、ACI国际认证营养师、P.E.T.父母效能讲师组成专家团队，共同研发了适合在家门口开展的儿童多元运动教学体系，并创造性开发了品格教育场景化的游戏模块，寓教于乐，让每个孩子都能在家门口上世界的体育课。 
    </h5>
    <h5 class="size-18" style="margin-top:76rpx;">牛牛成长的企业愿景</h5>
    <h5 class="size-14 left" style="margin-top:40rpx;">我们希望在不久的将来，中国每一个孩子的体育启蒙可以发生在家门口。这将会使他们身体基石的打造提前至少三年，他们对某项运动的天赋启蒙会提前至少三年，他们对“团队、挫折、竞争”的意识会提前至少三年。他们未来的人生会感谢这三年，中国的体育竞技会感谢这三年，而整个中华民族的强大，也正是由一个个这样的三年所累积而成的。</h5>
  </div>
  <div v-if="expand" class="size-12 folder" @click="expand = false">
    <span class="arrow"><span class="arrow arrow-2"></span></span><br>
    收起
  </div>
</div>
<div class="right">Copyright &#169 牛牛成长<br> 2017 沪ICP备17044602号-1</div>
</div>
</template>

<script>
let imgArr1 = [
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/2.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/3.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/4.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/5.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/6.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/7.png'
]
let imgArr2 = [
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-1.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-2.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-3.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-4.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-5.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-6.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-7.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-8.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-9.png',
  'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/pkg-10.png'
]
export default {
  data () {
    return {
      query: {},
      img1: 'https://nnemp-1258047925.cos.ap-shanghai.myqcloud.com/welcome/1.png',
      current1: 1,
      current2: 1,
      imgArr1,
      imgArr2,  
      imgUrls: [
        'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
        'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
        'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
      ],
      expand: false
    }
  },
  computed: {
  },
  onLoad (options) {
    console.log(options)
    this.query = options
  },
  onShow () {
  },
  methods: {
    onGotUserInfo (e) {
      // let res = e.target
      // if (res.encryptedData && res.iv) {
      //   this.req({
      //     url: '/api/v1/wechat/login',
      //     method: 'POST',
      //     data: {
      //       encryptedData: res.encryptedData,
      //       iv: res.iv,
      //       inviterId: this.query.inviterId,
      //       parent: this.query.parent
      //     },
      //     success: data => {
      //       // 绑定手机号的前提是登录成功了
      //       this.eventBus.$emit('register')
      //       this.req({
      //         url: '/api/v1/my/profile',
      //         success: (data) => {
      //           wx.setStorageSync('userInfo', data)
      //         }
      //       })
      //       this.eventBus.$emit('hasUserInfo')
      //       // 这里还是需要重定向 如果是跳转 则分享到二级页面的话存在返回注册页面的行为
      //       wx.redirectTo({
      //         url: `/pages/register/main?from=${this.query.from}&parent=${this.query.parent}`
      //       })
      //     }
      //   })
      // } else {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: '牛牛成长需要您的授权',
      //     showCancel: false
      //   })
      // }
    },
    change1 (e) {
      this.current1 = e.target.current
    },
    change2 (e) {
      this.current2 = e.target.current
    },
    scrollToBot () {
      this.expand = true
      setTimeout(() => {
        wx.createSelectorQuery().select('#welcome-page').boundingClientRect(function (rect) {
          wx.pageScrollTo({
            scrollTop: Math.abs(rect.top - rect.bottom),
            duration: 500
          })
        }).exec()
      }, 200)
    }
  }
}
</script>

<style lang="stylus">
.img-panel
  width 100%
  position relative
  #courseVideo
    position absolute
    width 330px
    height 238px
    left 50%
    transform translateX(-50%)
    top 225px
    border-radius 6px
  .button-login
    position absolute 
    top 523px
    left 50%
    transform translateX(-50%)
    width 234px
    height 58px
    border-radius 29px
    background linear-gradient(to bottom, #FF4C00 0%, #FF6800 100%)
    text-align center
    line-height 58px
    font-size 20px
    color #fff
.swiper1
  width 100%
  text-align center
  background #fafafa
  .swiper1-txt1
    padding-top 32px
    font-size 22px
    color #303030
  .swiper1-txt2
    font-size 16px
    margin-top 10px
    color #9b9b9b
.swiper2
  width 100%
  text-align center
  background #fff
  padding-bottom 90px
  .swiper2-txt1
    font-size 22px
    padding-top 55px
    color #303030
  .swiper2-txt2
    font-size 16px
    margin-top 10px
    color #9b9b9b
.pkg-swiper
  width 100%
  height 325px
  margin-top 42px
  .swiper-item
    padding 10px
    padding-top 20px
    box-sizing border-box
    background #fafafa
  .pkg-item
    width 100%
    height 100%
    transition transform 0.3s ease-out
    img
      width 100%
      height 100%
.pin-swiper
  width 100%
  height 380px
  margin-top 42px
  .swiper-item
    padding 26px 24px
    padding-top 43px
    box-sizing border-box
    background #fff
  .pkg-item
    width 100%
    height 100%
    transition transform 0.3s ease-out
    img
      width 100%
      height 100%
.nncz-desc
  background #F45B36
  color #fff
  padding 44px 22px
  text-align center
  padding-bottom 70px
  position relative
  .size-12
    font-size 12px
  .size-14
    font-size 14px
  .size-16
    font-size 16px
  .size-18
    font-size 18px
  .size-20
    font-size 20px
  .left
    text-align left
  .read-more
    width 140px
    height 50px
    line-height 50px
    border 1px solid #fff
    display inline-block
  .quote
    position relative
    .span1
      position absolute
      left 0
      top 0
    .span2
      position absolute
      right 0
      bottom 0
  .panel
    height 0
    // transition height 0.8s ease-out
    overflow hidden
    &.expand
      height 900px
  .folder
    width 100%
    position absolute
    left 0
    bottom 4px
    text-align center
    .arrow
      position relative
      display inline-block
      width 16px
      height 16px
      border-top 2px solid #fff
      border-right 2px solid #ffffff
      transform rotate(-45deg)
    .arrow-2
      transform:rotate(0);
      position:relative;
      top:6px;
      right:8px;
.right
  width 100%
  padding 8px 0
  text-align center
  background #444
  font-size 11px
  color #fff

</style>