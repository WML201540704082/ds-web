<template>
  <section class="order" v-loading="$store.state.loading.global">
    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
      <gt-subtitle title="基本信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;">
        <el-form-item label="订单编号">
          <span class="itemInput">{{baseInfo.id}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span class="itemInput">{{baseInfo.createTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span class="itemInput">已完成</span>
        </el-form-item>
        <el-form-item label="顾客">
          <span class="itemInput" v-if="baseInfo.customer">{{baseInfo.customer.name || '--'}}/{{baseInfo.customer.phone || '--'}}</span>
          <span class="itemInput" v-else>--</span>
        </el-form-item>
        <el-form-item label="订单来源">
          <span class="itemInput">{{filterStatus(baseInfo.type, orderType) || '--'}}</span>
        </el-form-item>
        <el-form-item label="收银员">
          <span class="itemInput">{{baseInfo.cashier || '--'}}</span>
        </el-form-item>
        <el-form-item label="导购员">
          <span class="itemInput">{{baseInfo.guide || '--'}}</span>
        </el-form-item>
        <el-form-item label="归属员工">
          <span class="itemInput">{{baseInfo.employee || '--'}}</span>
        </el-form-item>
      </el-card>

      <gt-subtitle title="礼品卡信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
        <el-form-item label="礼品卡名称">
          <span class="itemInput">{{baseInfo.statCardName || '--'}}</span>
        </el-form-item>
        <el-form-item label="有效期">
          <span class="itemInput">{{baseInfo.startTime}} - {{baseInfo.endTime}}</span>
        </el-form-item>
        <!-- table列表 -->
        <el-table
          :data="baseInfo.items"
          border
          v-loading="dataListLoading"
          :stripe="true"
          style="width: 100%;">
          <el-table-column
            prop="index"
            width="55"
            label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :show-overflow-tooltip="true"
            min-width="200"
            label="服务项目">
            <template slot-scope="scope">
              {{scope.row.name || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="retailPrice"
            min-width="140"
            label="零售价">
            <template slot-scope="scope">
              <span>{{priceNum(scope.row.retailPrice) || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            min-width="180"
            :show-overflow-tooltip="true"
            label="服务次数">
          </el-table-column>
        </el-table>
        <el-form-item label="适用门店">
          <span class="itemInput">{{baseInfo.storeRange || '--'}}</span>
        </el-form-item>
      </el-card>

      <gt-subtitle title="结算信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;">
        <el-form-item label="应收金额">
          <span class="itemInput">¥ {{number(priceNum(baseInfo.orderAmount))}}</span>
        </el-form-item>
        <el-form-item label="实收金额">
          <span class="itemInput">¥ {{number(priceNum(baseInfo.payableAmount))}}</span>
        </el-form-item>
        <!-- <el-form-item label="实收金额">
          <span class="itemInput">¥ {{number(priceNum(baseInfo.paidAmount))}}</span>
        </el-form-item> -->
        <el-form-item label="支付方式">
          <span class="itemInput">{{filterStatus(baseInfo.payType, paymentOfMode) || '--'}}</span>
        </el-form-item>
        <el-form-item label="积分">
          <span class="itemInput">{{baseInfo.integral}}</span>
        </el-form-item>
      </el-card>

      <gt-subtitle title="支付信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
        <!-- table列表 -->
        <el-table
          :data="baseInfo.payItems"
          border
          :stripe="true"
          style="width: 100%;">
          <el-table-column
            prop="createTime"
            :show-overflow-tooltip="true"
            label="支付时间">
          </el-table-column>
          <el-table-column
            prop="payType"
            min-width="180"
            :show-overflow-tooltip="true"
            label="支付方式">
            <template slot-scope="scope">
              {{scope.row.payType ? filterStatus(scope.row.payType,paymentOfMode) : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="paidAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="支付金额">
            <template slot-scope="scope">
              {{scope.row.paidAmount ? priceNum(scope.row.paidAmount) : 0}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { paymentOfMode,orderOfMode, orderType,productHaveBulkType,countcardOrder } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getstatOrderDetail } from '@/service/order'
import moment from 'moment'

export default {
  name:'countcardOrder-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      productHaveBulkType,
      orderOfMode,
      dataListLoading: false,
      number,
      paymentOfMode,
      filterStatus,
      countcardOrder,
      orderType,
      baseInfo:{
        returnOrder: {},
        orderShip: {},
        customer: {}
      }
    }
  },
  methods:{

  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const data = await getstatOrderDetail({id:id})
      this.baseInfo = {
        ...data,
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
</style>


