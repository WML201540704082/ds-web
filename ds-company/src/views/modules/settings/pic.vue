<template>
  <div class="gt-setting-pic">
    <div class="pic-container" @mouseover="active = true" @mouseout="active = false">
      <img class="icon-left" v-show="!active" :src="'static/img/setting/'+temp+'/'+ icon +'-left.png'" alt="icon"/>
      <img class="icon-left" v-show="active" :src="'static/img/setting/'+temp+'/'+ icon +'-left-light.png'" alt="icon"/>
      <div class="text-container">
        <div class="text">{{text}}</div>
        <div class="tip">{{tip}}</div>
      </div>
      <img class="icon-right" v-show="!active" :src="'static/img/setting/'+ icon +'-right.png'" alt="icon"/>
      <img class="icon-right" v-show="active" :src="'static/img/setting/'+ icon +'-right-light.png'" alt="icon"/>
    </div>
  </div>
</template>
<script>
import { getStore } from '@/utils/storage'
export default {
  name: 'pic',
  data() {
    return {
      active: false,
      temp: 'orange'
    }
  },
  props: ['icon', 'text', 'tip'],
  created(){
    const theme = getStore({name: 'theme'})
    if (theme === 'ORANGEWHITE') {
      this.temp = 'orange'
    } else {
      this.temp = 'green'
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
  .gt-setting-pic{
    .pic-container{
      position: relative;
      margin: 15px;
      padding: 15px 10px;
      // border-radius: 5px;
      background-color: #fff;
      overflow: hidden;
      min-height: 100px;
      width: 250px;
      float: left;
      cursor: pointer;
      .icon-left{
        float: left;
        width: 30px;
        margin: 10px 10px 0 0;
      }
      .icon-right{
        position: absolute;
        right: 20px;
        top: 30px;
        width: 50px;
      }
      .text-container{
        position:relative;
        z-index: 1;
        float: left;
        .text{
          color: $info--main-font-color;
          font-size: 16px;
          margin: 10px 0 15px;
        }
        .tip{
          color: $info--sub-font-color;
          font-size: 12px;
        }
      }
      &:hover{
        // background: $--color-primary!important;
        .text{
          color: #fff;
        }
        .tip{
          color: #fff;
        }
      }
    }
  }
 
  @media (max-width: 1360px) {
    .gt-setting-pic{
      .pic-container{
        .icon-left{
          width: 30px;
        }
        .icon-right{
          width: 38px;
        }
      }
    }
  }
</style>
