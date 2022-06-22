<template>
  <el-dialog
    title="短信充值"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="short-message-recharge-modal"
    append-to-body>
    <div class="qrcode-tip">短信套餐确定成功，系统已为您生成一条“待支付”订单：</div>
    <div class="info-container"><span class="label">充值单号：</span><span class="name">{{rechargeInfo.orderNo}}</span></div>
    <div class="info-container"><span class="label">充值短信：</span><span class="name">{{rechargeInfo.amount}} 条</span></div>
    <div class="info-container"><span class="label">充值金额：</span><span class="name">{{priceNum(rechargeInfo.price)}} 元</span></div>
    <!-- <img alt="二维码" :src="rechargeInfo.qrcode" class="qrcode" /> -->
    <div class="qrcode-tip">请前往<span style="color: red;">“萌百格店务助手-物料商城-充值记录”</span>中对订单进行充值。</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSmsCouponList } from '@/service/campaign.js'
export default {
  data(){
    return{
      rechargeInfo: {},
      visible: false,
    }
  },
  methods:{
    async init(data){
      this.visible = true
      this.rechargeInfo = data
    },
  }
}
</script>
<style lang="scss" scoped>
.short-message-recharge-modal{
  .info-container{
    margin: 15px;
    font-size:16px;
    .label{
      margin-right: 10px;
    }
    .name{
      font-weight: 600;
    }
  }
  .qrcode{
    width: 200px;
    height: 200px;
    margin: 15px;
  }
  .qrcode-tip{
    font-size: 14px;
    text-align: center;
  }

}
</style>

