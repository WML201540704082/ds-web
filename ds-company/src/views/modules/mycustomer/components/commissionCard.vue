<template>
  <el-card class="mode-store-table">
    <div>
      <span>
        <span>姓名 : {{obj.name || '--'}}</span>
        <span style="margin-left: 10px;">手机号: {{obj.phone}}</span>
        <!-- <span style="margin-left: 10px;">团长级别: {{filterStatus(obj.groupbuy.level, commanderLevel)}}</span>
        <span style="margin-left: 10px;">粉丝数量: {{obj.groupbuy.fans}}</span> -->
      </span>
    </div>
    <div style="margin: 10px 0;margin-bottom: 3px;" class="isBorder">
      <span class="customerinfos" v-if="activeName == 'YJMX'">
        <span>已结算: ￥{{priceNum(numObj.settledAmount) || 0}}</span>
        <span style="margin-left: 10px;">待结算: ￥{{priceNum(numObj.amountToBeSettled) || 0}}</span>
        <span style="margin-left: 10px;">已取消: ￥{{priceNum(numObj.cancelledAmount) || 0}}</span>
      </span>
      <span class="customerinfos" v-else>
        <span>已提现总额: ￥{{priceNum(total)}}</span>
      </span>
      <el-radio-group v-model="activeName" @change="handleClick">
        <el-radio-button label="YJMX">佣金明细</el-radio-button>
        <el-radio-button label="TXMX">提现明细</el-radio-button>
      </el-radio-group>
    </div>
    <gt-commission-detail v-if="activeName == 'YJMX'" :customerid="obj.id" :cardtype="activeName" @updateObj="commissionTotal"/>
    <gt-presentation-detail v-if="activeName == 'TXMX'" :customerid="obj.id" :cardtype="activeName" />
  </el-card>
</template>
<script>
import gtCommissionDetail from './commissionDetail'
import gtPresentationDetail from './presentationDetail'
import {withdrawalTotal,commissionTotal} from '@/service/mycustomer'
import { commanderLevel } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  name:'mycustomer-commissionCard',
  components:{ gtCommissionDetail, gtPresentationDetail },
  data(){
    return{
      filterStatus,
      commanderLevel,
      obj: null,
      activeName: 'YJMX',
      total: 0,
      numObj:{},
    }
  },
  created(){
    const { obj,type } = this.$route.query
    this.obj = JSON.parse(obj)
    this.activeName = type
    this.getDataList(JSON.parse(obj).id)
    this.commissionTotal(JSON.parse(obj).id)
  },
  methods:{
    handleClick(val){
      this.activeName = val
    },

    async getDataList(id){
      const {data} = await withdrawalTotal({
        customerId: id
      })
      if(data.code == 0){
        this.total = data.data
      }else{
        this.total = 0
        this.$message.error(data.msg)
      }

    },
    async commissionTotal(res){
      const {data} = await commissionTotal({
        customerId: this.obj.id,
        orderStatus: res.orderStatus,
        orderSource: res.orderSource
      })
      if(data.code == 0){
        this.numObj = data.data
      }else{
        this.numObj = {}
        this.$message.error(data.msg)
      }

    },
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


