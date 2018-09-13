<template>
  <div class="container">

    <a href="/pages/counter/main"><h5>Relative</h5></a>
    <div class="menu-container">
      <div class="panel" v-for="(item, index) in menuList" :key="index">
        <div class="panel-title" @click="toggle(index)" :style="{background: item.color}">
          <span class="expand-mark" :class="{'expand-mark-show': item.open}"></span> {{item.title}}
        </div>
        <div class="panel-con" :class="{'show-con': item.open}">
          <!-- <div style="padding: 10px;"> -->
            <!-- <div class="menu-item border-bottom-1px" v-for="(subitem, idx) in item.content" :key="idx" >
              {{subitem}}
            </div> -->
            <div v-for="(subitem, idx) in item.content" :key="idx" class="weui-cell weui-cell_access">
              <div class="weui-cell__bd">{{subitem}}</div>
              <div class="weui-cell__ft weui-cell__ft_in-access"></div>
            </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userInfo: {},
      expand: false,
      menuList: [
        {
          title: '标题一',
          color: '#45B64A',
          content: ['菜单一', '菜单二'],
          open: false
        },
        {
          title: '标题一',
          color: '#4484DE',
          content: ['菜单一', '菜单二', '菜单三'],
          open: false
        },
        {
          title: '标题一',
          color: '#FF7A51',
          content: ['菜单一', '菜单二', '菜单三', '菜单四'],
          open: false
        },
        {
          title: '标题一',
          color: '#32BEBC',
          content: ['菜单一', '菜单二', '菜单三'],
          open: false
        }
      ]
    }
  },
  components: {
  },
  onLoad () {},
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    toggle (idx) {
      let menuList = this.menuList
      menuList.forEach((item, index) => {
        if (idx === index) {
          item.open = !item.open
        } else {
          // item.open = false
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style lang="stylus">
page 
  background #eee
.menu-container
  padding 0 20px
.panel
  margin-top 20px
  background #fff
  // box-shadow 0 0 8px #eee
  overflow hidden
  border-radius 6px
  .panel-title 
    overflow hidden
    color #fff
    position relative
    height 44px
    line-height 44px
    padding-left 20px
    font-weight 300
    z-index 9
    box-shadow 0 0 8px #eee
    &:hover
      opacity 0.7
  .panel-con
    max-height 0px
    transform translateY(-44px)
    -webkit-transform translateY(-44px)
    opacity 0
    transition all .4s cubic-bezier(.38, .62, .68, 1.23)
    overflow hidden
    position relative
    z-index 2
    .menu-item
      height 40px
      line-height 40px
      padding-left 20px
      font-size 16px
      font-weight 300
      position relative
  .show-con
    opacity 1
    height auto
    transform translateY(0)
    -webkit-transform translateY(0)

.border-bottom-1px:after
  content ''
  display block
  width 100%
  height 1px
  position absolute
  left 0
  bottom -1px
  background #dedede
  transform scaleY(0.4)
  -webkit-transform scaleY(0.4)
.expand-mark{
  display: inline-block;
  margin: 0px;
  border-right: 2px solid;
  border-top: 2px solid;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
  position: absolute;
  top: 16px;
  right: 20px;
  transition: all 0.4s ease-out;
}
.expand-mark-show{
  transform-origin: 50% 50%;
  transform: rotateZ(135deg);
}
.weui-cell_access
  font-weight 300
  color #626262
  font-size 16px
</style>
