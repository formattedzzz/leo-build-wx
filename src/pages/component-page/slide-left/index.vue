<template>
 <div class='page'>
   <!-- -->
   <block v-for="(item, index) in mockdata" :key="index" >
   <slide-left v-bind="item" :index="item.index" @handle="handle"></slide-left>
   </block>
   <div style="padding: 20px; text-align: center;">{{handleres}}</div>
 </div>
</template>

<script>
  import slideLeft from '@/components/slideLeft'
  import mockdata from './mock'
  export default {
    data () {
      return {
        handleres: null,
        mockdata
      }
    },
    computed: {

    },
    methods: {
      handle (data) {
        // console.log(data)
        this.handleres = JSON.stringify(data)
      }
    },
    components: {
      slideLeft
    }
  }
</script>

<style lang="stylus">
.item-content
  background #00cc00
</style>
