<template>
  <div class="test-page">
    <div @click="dispatch">处罚</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {},
  onLoad (options) {
    // console.log('/////////////////')
    // this.handleInit(options)
    var cb = (...data) => { console.log(data); this.handleInit(options) }
    this.eventBus.$on('test', cb, 1, false)
    // this.eventBus.$on('test', cb, 1)
  },
  methods: {
    handleInit (options) {
      console.log('-----------------------', options)
    },
    dispatch () {
      this.eventBus.$emit('test', 'leo', 'npm', {})
    }
  },
  components: {}
}
</script>
<style lang="stylus">
</style>
