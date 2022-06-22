<template>
  <div class="page-recharge">
    <!-- <div class="title">短信充值，请拨打客服热线：400-920-3806</div>
    <div class="tip">工作时间： 周一至周五 8：30 - 17：00（法定节假日除外）</div> -->

    <span class="itemInput_package">请选择充值套餐</span>
    <div style="overflow:hidden;">
      <div v-for="item in packagesList" :key="item.id" class="package" :class="{active: currentItem.id === item.id}" @click="() => changeItem(item)">
        <div class="amount">{{item.amount}}条</div>
        <div class="price">{{item.price/100}}元</div>
      </div>
    </div>
    <div class="tip">说明：企业短信消耗包括：营销中心-短信营销-手动发送短信；顾客管理-发放优惠券；员工任务-员工短信回访</div>
    <img src="static/img/qrcode.jpg" class="qrcode" />
    <div class="qrcode-tip">萌百格，您的移动店务助手，让门店零售更智能，更简单</div>
    <div class="gt-form-bottom-submit" style="margin: 20px 0;">
      <gt-button size="large" :loading="dataListLoading" @click.native="doOrder" txt="确定"/>
    </div>
    <recharge-modal ref="rechargeModal" />

  </div>


</template>
<script>
import * as api from '@/service/campaign'
import rechargeModal from './components/recharge-modal'
export default {
  name: 'page-shortmessage-recharge',
  data(){
    return{
      dataListLoading: false,
      currentItem: {},
      packagesList: []
    }
  },
  created () {
    this.getPackagesList()
  },
  components: {
    rechargeModal
  },
  methods: {
    // 获取当前项
    changeItem(item) {
      this.currentItem = item
    },
    //获取套餐列表
    async getPackagesList() {
      this.dataListLoading = true
      const { data } = await api.getMessageRechargeList()
      if (data.code === 0) {
        this.packagesList = data.data
      } else {
        this.packagesList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 下单
    async doOrder() {
      if (this.currentItem.id || this.currentItem.id === 0){
        this.dataListLoading = true
        const { data } = await api.createMessageRecharge({
          'operator': 'COMPANY',
          'packageId': this.currentItem.id,
        })
        if (data.code === 0) {
          this.$nextTick(() => {
            this.$refs.rechargeModal.init({
              ...data.data,
              amount: this.currentItem.amount,
              price: this.currentItem.price
            })
          })
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      } else {
        this.$message.warning('请选择充值金额！')
      }

    }
  },

}
</script>
<style lang="scss">
.page-recharge {
  .tip{
    font-size: 14px;
    margin: 20px;
  }
  .package{
    float: left;
    text-align: center;
    line-height: 50px;
    width: 180px;
    height: 100px;
    margin-right:20px;
    cursor: pointer;
    margin-top:20px;
    margin-left: 50px;
    background-color: whitesmoke;
    color: #656565;
    &.active {
      color: whitesmoke;
    }
  }
  .qrcode{
    display: block;
    width: 200px;
    height: 200px;
    margin: 30px auto;

  }
  .qrcode-tip{
    font-size: 16px;
    text-align: center;
    width: 100%;
  }
  .amount{
    margin-top: 15px;
    font-size: 16px;
    // color: #7F7F7F;
  }
  .price{
    margin-top: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .itemInput_package{
    font-size: 16px;
  }
}
</style>
