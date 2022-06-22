<template>
  <div class="lefts">
    <div class="phoneTop">
      <img src="static/img/goods/phone/campaignLabelTime.png" alt="">
    </div>
    <div class="paygiftContent">
      <div class="notice">订单支付成功通知</div>
      <div class="commomColor">9月8日</div>
      <div class="commomColor">您好，您已支付成功！</div>
      <div class="commomColor">支付门店：萌宝之家人广店</div>
      <div class="commomColor">支付订单：2894857291287824</div>
      <div class="commomColor">支付金额：298.00</div>
      <div class="commomColor">支付时间：2019-02-23 14:13:24</div>
      
      <div class="noticeTitle" style="line-height: 18px;color: red">{{activeadd.title}}</div>
      <div class="noticeTitle" style="line-height: 18px;color: red">立即点击详情查看</div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  props:{
    activeadd:{
      type: Object
    }
  }

}
</script>

