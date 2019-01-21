### 小程序的touch事件和tap事件间的需要留心的一些点

先看实际例子：
```html
<div
  :data-index="idx1 + '/' + idx2"
  @touchstart="itemStart"
  @touchmove="itemMove"
  @touchend="itemEnd"
  @click="itemTap"
  class="account-item">
</div>
<script>
itemStart (e) {
  console.log('start', e)
  if (e.touches.length === 1) {
    this.startX = e.touches[0].clientX
    this.startTime = e.timeStamp
  }
  // 嵌入tap会触发的代码
  if (this.currentSlide) {
    let [idx1, idx2] = this.currentSlide.split('/')
    let [index, idx] = e.currentTarget.dataset.index.split('/')
    if (!(idx1 === index && idx2 === idx)) {
      this.monthList[idx1][idx2].slide = false
    }
  }
},
itemMove (e) {
  console.log('move')
  // 实时挂载记录值
  if (e.touches.length === 1) {
    this.disX = e.touches[0].clientX - this.startX
    this.disT = e.timeStamp - this.startTime
  }
},
itemEnd (e) {
  console.log('end', e)
  // 过滤tap不应该触发的相关逻辑
  if (Math.abs(this.disX) <= 5) return
  let [index, idx] = e.currentTarget.dataset.index.split('/')
  if (Math.abs(this.disX / this.disT) > 0.5) {
    this.currentSlide = index + '/' + idx
    this.monthList[index][idx].slide = true
  }
  // 重置位移值
  this.disX = 0
},
itemTap (index1, index2) {
  console.log('tap')
  let account = this.monthList[index1][index2]
  let {slide} = account
  this.monthList[index1][index2].slide = false
  if (this.currentSlide) {
    let [idx1, idx2] = this.currentSlide.split('/')
    this.monthList[idx1][idx2].slide = false
  }
  if (slide === false) {
    wx.setStorageSync('account', account)
    wx.navigateTo({
      url: '/pages/account-panel/main?from=edit'
    })
  }
}
</script>
```

对照实现效果。上面的所做的事情是在一个二维数组的渲染的列表上滑动的速度大于一定值的时候精准定位该列表项索引值。
对于上面绑定了四个事件，触发tap执行顺序为：touchstart---->touchend---->tap。
touchstart：记录初始位置、初始时间。同时需要处理tap事件会触发的逻辑。
touchmove: 将位移差、时间差挂载到this（这里我们只是简单挂在，没有必要申明在data里面，更不要用它来不断触发视图更新）。
touchend: 判断速度大小。如果速度大于阈值则记录该条索引，将其标记为当前操作的列表项，同时重置位移值。这里存在的问题是tap事件也会触发touchend，我们需要在end事件进入时先对位移差进行过滤。如果小于某个值不要执行end操作，直接进入tap事件。
tap：【itemSatrt】拿到索引值，判断点击的列表项是不是当前操作项，不是的话将当前操作项重置。【itemEnd】跳过。【itemTap】判断当前操作项状态，如果激活将其重置，否则进入详情页面。



