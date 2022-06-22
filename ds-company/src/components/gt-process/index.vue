<template>
  <div class="gt-process">
    <div class="base-info">
      <span class="info-left">{{infoleft}}</span>
      <span class="info-right" v-if="inforight">{{inforight}}</span>
    </div>
    <el-progress :percentage="percentage" :color="theme"></el-progress>
    <div class="base-info">
      <span class="unit-left">{{unit}}</span>
      <span class="unit-right" v-if="unit !== '销售业绩'">{{`${value}/${total}`}}</span>
      <span class="unit-right" v-else>{{`${value}`}}</span>
    </div>
  </div>
</template>
<script>
import { getStore } from '@/utils/storage'
import NP from 'number-precision'
export default {
  name: 'gt-process',
  props:{
    infoleft:{
      type:String
    },
    inforight:{
      type:String
    },
    unit: {
      type:String
    },
    value: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
    }
  },
  computed: {
    percentage() {
      let per = NP.times(NP.divide(this.value,this.total), 100) || 0
      if (per < 0) {
        per = 0
      } else if (per >= 100) {
        per = 100
      }
      console.log('per', per)
      return per
    }
  },
  created() {
    const theme = getStore({name: 'theme'})
    if (theme == 'ORANGEWHITE') {
      this.theme = '#F48442'
    } else {
      this.theme = '#4cbbb4'
    }
  },
  methods:{

  }
}
</script>
<style lang="scss">
.gt-process{
  font-size: 14px;
  color: #aaa;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
  &:last-child{
    border: none;
  }
  .el-progress-bar{
    padding-right: 0;
  }
  .el-progress__text{
    display: none;
  }
  .base-info{
    overflow: hidden;
    margin: 5px 0;
    .info-right{
      float: right;
    }
    .unit-right{
      float: right;
    }
  }
}
</style>

