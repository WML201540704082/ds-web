<template>
  <section class="order" v-loading="$store.state.loading.global">
    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
    <gt-subtitle title="基本信息" style="display: inline-block;"/>
    <el-card style="margin-bottom: 10px;">
        <el-form-item label="退货单号">
          <span class="itemInput">{{baseInfo.id}}</span>
        </el-form-item>
        <el-form-item label="退单时间">
          <span class="itemInput">{{baseInfo.createTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span class="itemInput">{{filterStatus(baseInfo.status,storevalueStatus)}}</span>
        </el-form-item>
        <el-form-item label="所属企业">
          <span class="itemInput">{{baseInfo.companyName || '--'}}</span>
        </el-form-item>
        <el-form-item label="所属门店">
          <span class="itemInput">{{baseInfo.storeName || '--'}}</span>
        </el-form-item>
        <el-form-item label="顾客">
          <span class="itemInput" v-if="baseInfo.customerPhone">{{baseInfo.customerName || '--'}}/{{baseInfo.customerPhone || '--'}}</span>
          <span class="itemInput" v-else>--</span>
        </el-form-item>
        <el-form-item label="退单渠道">
          <span class="itemInput">{{filterStatus(baseInfo.refundChannels,orderType)}}</span>
        </el-form-item>
        <el-form-item label="退款项目">
          <span class="itemInput">{{filterStatus(baseInfo.cardType, rechargeProject) || '--'}}</span>
        </el-form-item>
        <el-form-item label="收银员">
          <span class="itemInput">{{baseInfo.cashierName || '--'}}</span>
        </el-form-item>
        <el-form-item label="导购员">
          <span class="itemInput">{{baseInfo.guidName || '--'}}</span>
        </el-form-item>
        <el-form-item label="备注" v-if="baseInfo.remark">
          <span class="itemInput">{{baseInfo.remark || '--'}}</span>
        </el-form-item>
    </el-card>

    <gt-subtitle title="结算信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
      <el-form-item label="退卡名称">
        <span class="itemInput">{{baseInfo.cardName || '储值卡余额'}}</span>
      </el-form-item>
      <el-form-item label="退款总额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.refundTotal))}}</span>
      </el-form-item>
      <el-form-item label="实退金额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.refundAmount))}}</span>
      </el-form-item>
      <el-form-item label="赠送扣减">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.deductionAmount))}}</span>
      </el-form-item>
      <el-form-item label="退款方式">
        <span class="itemInput">{{filterStatus(baseInfo.refundType, countcardMode) || '--'}}</span>
      </el-form-item>
      <el-form-item label="扣减积分">
        <span class="itemInput">{{baseInfo.deductionIntegral || 0}}</span>
      </el-form-item>
    </el-card>

    <gt-subtitle title="支付信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="paylist"
        border
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          label="退款时间">
          <template slot-scope="scope">
            {{scope.row.createTime || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="refundType"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退款方式">
          <template slot-scope="scope">
            {{scope.row.refundType ? filterStatus(scope.row.refundType,countcardMode) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="refundAmount"
          width="180"
          :show-overflow-tooltip="true"
          label="退款金额">
          <template slot-scope="scope">
             {{scope.row.refundAmount ? priceNum(scope.row.refundAmount) : 0}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { countcardMode,storevalueStatus,orderType,rechargeProject } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getRefundRechargeDetail } from '@/service/order'
import moment from 'moment'
export default {
  name: 'storedvalueCard-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      dataListLoading: false,
      number,
      filterStatus,
      storevalueStatus,
      countcardMode,
      orderType,
      rechargeProject,
      paylist:[],
      baseInfo:{}
    }
  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const {data} = await getRefundRechargeDetail({id:id})
      if(data&&data.code==0){
        
        this.baseInfo = {
          ...data.data,
        }
        this.paylist =[{
          createTime:data.data.createTime,
          refundType:data.data.refundType,
          refundAmount:data.data.refundAmount
        }]
      }else{
        this.$message.error(data.msg)
      }
    }
  },
}
</script>
<style lang="scss">
.order{
  .order-left {
    .order-img {
      width: 30px;
      height: 30px;
      img {
        width: 30px;
        height: 30px;
      }
    }
    span {
      font-size: 15px;
      color: #919191;
    }
    .order-code {
      font-size: 18px;
      color: #77777D;
    }
  }
  .order-times {
    float: right;
    margin-top: 7px;
    color: #919191;
  }

}
.summarys td {
  text-align: left!important;
}
.summarys .has-gutter {
  height: 40px;
}
.summarys .el-table__footer-wrapper ,.el-table__footer {
  height: 40px;
}
</style>


