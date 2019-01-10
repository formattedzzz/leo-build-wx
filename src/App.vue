<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    console.log('当前环境为：', process.env.NODE_ENV)
  },
  onLanuch () {
    // let vm = this
  }
}
</script>

<style lang="css">
@import url('../static/weui.wxss');
</style>
<style lang="stylus">
button:before, button:after
  border none
.button-hover
  opacity 0.8
.input-placeholder
  font-size 14px
  color #626262
  line-height 32px
page
  background #fff
  min-height 100vh
div, h1, h2, h3, h4, h5
  box-sizing border-box
scroll-view
  box-sizing border-box

colors = #00cc00 #4B95EA #ee5500 #996633
for clr,i in colors
  .background-{i}
    background clr
    background-image linear-gradient(-45deg, darken(clr, 10) 0%, darken(clr, 10) 50%, clr 50%, clr 100%)
gary = #444 #555 #666 #777 #888 #999 #aaa #bbb #ccc #ddd
for cr, i in gary 
  .gary-bg
    background repeating-linear-gradient(45deg,#000,cr 30px)

.background-cell
  background:
    radial-gradient(circle farthest-side at 0% 50%,#fb1 23.5%,rgba(240,166,17,0) 0)21px 30px,
    radial-gradient(circle farthest-side at 0% 50%,#B71 24%,rgba(240,166,17,0) 0)19px 30px,
    linear-gradient(#fb1 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,#fb1 0)0 0,
    linear-gradient(150deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
    linear-gradient(30deg,#fb1 24%,#B71 0,#B71 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,#B71 0,#B71 76%,#fb1 0)0 0,
    linear-gradient(90deg,#B71 2%,#fb1 0,#fb1 98%,#B71 0%)0 0 #fb1;
  background-size: 40px 60px;
.background-line
  background:
    radial-gradient(black 3px, transparent 4px),
    radial-gradient(black 3px, transparent 4px),
    linear-gradient(#fff 4px, transparent 0),
    linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
    linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),
    #fff;
  background-size: 109px 109px, 109px 109px,100% 6px, 109px 109px, 109px 109px;
  background-position: 54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
.background-cube
  background-color:#556;
  background-image: linear-gradient(30deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(150deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(30deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(150deg, #445 12%, transparent 12.5%, transparent 87%, #445 87.5%, #445),
  linear-gradient(60deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a),
  linear-gradient(60deg, #99a 25%, transparent 25.5%, transparent 75%, #99a 75%, #99a);
  background-size:80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
.background-dot
  background:
    radial-gradient(black 3px, transparent 4px),
    radial-gradient(black 3px, transparent 4px),
    linear-gradient(#fff 4px, transparent 0),
    linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
    linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),#fff;
  background-size: 109px 109px, 109px 109px,100% 6px, 109px 109px, 109px 109px;
  background-position: 54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;

// 为空的样式
.nothing-mind
  height 60px
  width 100%
  display flex
  justify-content center
  align-items center
  font-size 14px
  color #626262
  .line-l
    display inline-block
    width 60px
    height 1rpx
    transform scaleY(0.5)
    background #4a4a4a
    margin-right 20px
  .line-r
    display inline-block
    width 60px
    height 1rpx
    transform scaleY(0.5)
    background #4a4a4a
    margin-left 20px

// 页面的便利贴样式
.corner
  text-align center
  color #fff
  background linear-gradient(-150deg, transparent 15px, #f49714 0)
  border-radius 8px
  font-weight 300
  text-shadow -2px -2px 2px #000
  &:before
    content ''
    position absolute
    top 0
    right 0
    background linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.4)) 100% 0 no-repeat
    width 17.3px
    height 30px
    transform translateY(-13px) rotate(-30deg)
    transform-origin bottom right
    border-bottom-left-radius inherit
    box-shadow -2px 2px 3px -1px rgba(0, 0, 0, 0.15)

// 很漂亮的组合渐变
.colorful-stripe
  text-align: center;
  color: #fff;
  background:
  linear-gradient(limegreen, transparent), linear-gradient(90deg, skyblue, transparent), linear-gradient(-90deg, coral, transparent);
  background-blend-mode: screen;

.wave
  position: relative;
  background: linear-gradient(90deg, #945700 0%, #f49714 100%);
  filter: drop-shadow(-7px 4px 3px #333);
  color: #fff;
  font-weight: 300;
  box-sizing: border-box;
  border-radius: 8px;
  text-shadow: -2px -2px 2px #333;
  &::before,
  &::after
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom :0;
  &::before
    width: 10px;
    background-image: radial-gradient(circle at -5px 10px, transparent 12px, #fff 13px, #fff 0px);
    background-size: 20px 20px;
    background-position: 0 15px;
  &::after
    width: 15px;
    background-image: radial-gradient(circle at 15px 10px, #fff 12px, transparent 13px, transparent 0px);
    background-size: 20px 40px;
    background-position: 0 15px;
</style>
