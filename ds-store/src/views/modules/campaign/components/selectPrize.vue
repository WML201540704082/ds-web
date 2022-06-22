<template>
  <div>
     <el-dialog
      title="请选择奖品类别"
      :close-on-click-modal="false"
      :visible.sync="visible"
      append-to-body>
        <div class="box">
          <span @click="clickPro('PRODUCT')">商品</span>
          <span @click="clickPro('COUPON')">优惠券</span>
          <span @click="clickPro('STATCARD')">礼品卡</span>
          <!-- <span @click="clickPro('CUSTOMEIZE')">自定义</span> -->
        </div>
     </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      visible: false
    }
  },
  methods:{
    init(){
      this.visible = true
    },
    clickPro(type){
      // CUSTOMEIZE(自定义)  PRODUCT  COUPON  STATCARD
      this.$emit('refresh',type)
      this.visible = false
    },
  }
}
</script>
<style lang="scss" scope>
.box {
  padding: 30px 0;
  text-align: center;
  span {
    display: inline-block;
    background: #e1e1e1;
    color: #424242;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    margin: 0 20px;
    cursor: pointer;
  }
  span:hover {
    box-shadow: 0 4px 5px rgba(0,0,0,.2)
  }
}
</style>


