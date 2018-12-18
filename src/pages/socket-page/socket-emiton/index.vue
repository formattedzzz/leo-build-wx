<template>
  <div class="page">

  </div>
</template>
<script>
  // let socket = null
  import questionArr from './question.js'
  export default {
    data () {
      return {
        vsdata: [],
        questionArr
      }
    },
    computed: {

    },
    onLoad (options) {
      this.vsdata = JSON.parse(options.vsdata)
      this.vsdata = options.vsdata
      // this.eventBus.$on('socket_emiton', (data) => {
      //   socket = data
      // })
      console.log(this.socket.id)
    },
    onShow () {
      // console.log('emiton页面：', socket.id)
    },
    onUnload () {
    },
    onShareAppMessage (e) {
    },
    methods: {
    },
    components: {
    }
  }
</script>

<style lang="stylus">
</style>
