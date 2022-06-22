<template>
    <div class="dialog_show_pic" v-show="isShowImg">
      <div @click="isShowImg=false" class="close_icon">X</div>
      <img :src="imgUrl" alt="">
    </div>
</template>
<script>
export default {
  name: 'dialog-show-pic',
  props:{
    imgUrl:{
      type:String
    },
  },
  data(){
    return{
      isShowImg:false,
    }
  },
  methods:{
    init:function(){
      this.isShowImg = true
    }
  }
}
</script>

<style lang="scss">
.dialog_show_pic{
  position: fixed;
  top: 0;bottom: 0;
  left: 0;right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  .close_icon{
      position: absolute;
      z-index: 100;
      top: 30px;right: 30px;
      color: #fff;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
  }
  img{
      position: absolute;
      z-index: 99;
      top: 0;bottom: 0;
      left: 0;right: 0;
      max-width: 100%;
      max-height: 100%;
      display: block;
      margin: auto;
  }
}
</style>

