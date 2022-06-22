<template>
  <el-card class="mode-store-table">
    <div style="margin: 10px 0;margin-bottom: 3px;" class="isBorder">
      <span class="customerinfos">
        <span>顾客名称: {{name}}</span>
        <span style="margin-left: 10px;">手机号码: {{phone}}</span>
      </span>
      <el-radio-group v-model="activeName" @change="handleClick">
        <el-radio-button label="CZK">储值卡</el-radio-button>
        <el-radio-button label="GWK">购物卡</el-radio-button>
        <el-radio-button label="YHJ">优惠券</el-radio-button>
        <el-radio-button label="JCK">礼品卡</el-radio-button>
        <el-radio-button label="JC">寄存</el-radio-button>
        <el-radio-button label="JF">积分</el-radio-button>
      </el-radio-group>
    </div>
    <gt-store-card v-if="activeName == 'CZK'" :customerid="id" :storetype="activeName" :rechargeval="recharge"/>
    <gt-shopping-card-tab v-if="activeName == 'GWK'" :customerid="id" :cardtype="activeName"/>
    <gt-preview-yhj v-if="activeName == 'YHJ'" :customerid="id" :cardtype="activeName" />
    <gt-record-card-tab v-if="activeName == 'JCK'" :customerid="id" :cardtype="activeName" />
    <gt-deposit-list v-if="activeName == 'JC'" :customerid="id" :cardtype="activeName" />
    <gt-intergral-list v-if="activeName == 'JF'" :customerid="id" :cardtype="activeName" />
  </el-card>
</template>
<script>
import gtStoreCard from './storeCard'
import gtShoppingCardTab from './shoppingCardTab'
import gtPreviewYhj from './mycustomer-previewYHJ'
import gtRecordCardTab from './recordCardTab'
import gtDepositList from './depositList'
import gtIntergralList from '../intergral/list'
export default {
  name:'mycustomer-customerCard',
  components:{ gtStoreCard, gtShoppingCardTab, gtPreviewYhj, gtRecordCardTab, gtDepositList, gtIntergralList },
  data(){
    return{
      id: null,
      activeName: 'CZK',
      name: null,
      phone: null,
      recharge: null
    }
  },
  created(){
    const { id,name,phone,type,recharge } = this.$route.query
    this.id = id
    this.name = name
    this.phone = phone
    this.activeName = type
    this.recharge = recharge
  },
  methods:{
    handleClick(val){
      this.activeName = val
    }
  }
}
</script>
<style lang="scss">
  .customerinfos {
    padding-top: 10px;
    float: right;
  }
  .isBorder {
    .el-radio-button__inner {
      border: none;
      font-size: 16px;
      border-bottom: 2px solid #fff;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border: none;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background: none;
      border-radius: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
</style>


