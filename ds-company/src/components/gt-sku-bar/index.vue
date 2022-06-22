<template>
  <div class="gt-sku-bar" :class="getIndex(index)">
    <div class="number">{{index + 1}}</div>
    <div class="text-container">
      <div class="text-left">{{infoleft}}</div>
      <div class="text-right">
        <span class="count">{{count}}</span>
        <span class="price">/{{priceNum(price)}}元</span>
      </div>
    </div>
    <div class="process" :style="`width: ${this.percentage}%; background-color: ${this.theme}`"></div>
  </div>
</template>
<script>
import { getStore } from '@/utils/storage'
import NP from 'number-precision'
export default {
  name: 'gt-sku-bar',
  props:{
    infoleft:{
      type:String
    },
    index: {
      type: Number
    },
    count: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
    }
  },
  data(){
    return{
    }
  },
  computed: {
    percentage() {
      let per = NP.times(NP.divide(this.count,this.total), 100) || 0
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
    getIndex() {
      let indexStr = 0
      switch (this.index) {
      case 0:
        indexStr = 'one'
        break
      case 1:
        indexStr = 'two'
        break
      case 2:
        indexStr = 'three'
        break
      default:
        break
      }
      return indexStr
    }
  }
}
</script>
<style lang="scss">
.gt-sku-bar{
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  color: #777;
  background-color: #f0f2f3;
  margin: 10px 0;
  &:after{
    content: '';
    width: 40px;
    height: 40px;
    z-index: 40;
    position: absolute;
    top: -20px;
    left: -26px;
    transform: rotate(36deg);
    background-color: #c5cfcb;
  }
  .number{
    position: absolute;
    left: 0;
    top: 0;
    height: 10px;
    line-height: 10px;
    z-index: 50;
    padding: 3px;
    font-size: 8px;
    color: #fff;
  }
  .process{
    z-index: 10;
    position: absolute;
    opacity: .6;
    height: 34px;
    left: 0;
    top: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .text-container{
    font-size: 12px;
    display: flex;
    flex-direction: row;
    z-index: 20;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    .text-left{
      height: 34px;
      line-height: 34px;
      padding-left: 15px;
      flex: 1;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .text-right{
      height: 34px;
      line-height: 34px;
      padding-right: 10px;
      .count {
        font-size: 16px;
      }
      .price {
        font-size: 12px;
      }
    }
  }

}
.gt-sku-bar.one{
  &:after{
    background-color: #ff6a08;
  }
}
.gt-sku-bar.two{
  &:after{
    background-color: #ffcc33;
  }
}
.gt-sku-bar.three{
  &:after{
    background-color: #F0E68C;
  }
}
</style>

