<template>
<div class="panel-page">
  <div v-for="(item, index) in outcomeList" :key="index">
    <img style="width: 30px;height: 30px;" :src="item.typeicon">
    <span>{{item.typedesc}}</span>
  </div>
  <div v-for="(item, index) in incomeList" :key="index">
    <img style="width: 30px;height: 30px;" :src="item.typeicon">
    <span>{{item.typedesc}}</span>
  </div>
</div>
</template>

<script>
  import {outcomeList, incomeList} from './typeList.js'
  export default {
    data () {
      return {
        outcomeList,
        incomeList
      }
    },
    computed: {
      baseURL () {
        return this.baseURL
      }
    },
    onReady () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus">
.panel-page
  min-height 100vh 
</style>