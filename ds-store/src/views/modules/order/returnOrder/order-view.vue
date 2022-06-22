<template>
  <section class="order" v-loading="$store.state.loading.global">

    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
    <gt-subtitle title="基本信息" style="display: inline-block;"/>
    <span style="color: #FC5A3D" v-if="baseInfo.type=='WESHOP'">（社区拼团退货单）</span>
    <el-card style="margin-bottom: 10px;">
        <el-form-item label="退货单号">
          <span class="itemInput">{{baseInfo.id}}</span>
        </el-form-item>
        <el-form-item label="退单时间">
          <span class="itemInput">{{baseInfo.createTime || '--'}}</span>
        </el-form-item>
        <!-- <el-form-item label="退单状态">
          <span class="itemInput">{{filterStatus(baseInfo.stage, returnOrder)}}</span>
        </el-form-item> -->
        <el-form-item label="顾客">
          <span class="itemInput" v-if="baseInfo.customer">{{baseInfo.customer.name || '--'}}/{{baseInfo.customer.phone || '--'}}</span>
          <span class="itemInput" v-else>--</span>
        </el-form-item>
        <el-form-item label="退单类型">
          <span class="itemInput">{{filterStatus(baseInfo.returnType, returnType) || '--'}}</span>
        </el-form-item>
        <el-form-item label="退单渠道">
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
        <el-form-item label="审核说明" v-if="baseInfo.comment">
          <span class="itemInput">{{baseInfo.comment || '--'}}</span>
        </el-form-item>
    </el-card>

    <gt-subtitle title="商品信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="baseInfo.items"
        border
        v-loading="dataListLoading"
        :stripe="true"
        :summary-method="getSummaries"
        class="summarys"
        height="300"
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
          prop="productName"
          min-width="200"
          :show-overflow-tooltip="true"
          label="商品名称">
          <template slot-scope="scope">
            {{scope.row.productName || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            {{scope.row.type ? filterStatus(scope.row.type,productHaveBulkType) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ownership"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品归属">
          <template slot-scope="scope">
            {{scope.row.ownership ? filterStatus(scope.row.ownership,productOwner) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="spec"
          width="150"
          :show-overflow-tooltip="true"
          label="商品规格">
          <template slot-scope="scope">
            {{scope.row.spec || '默认规格'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          width="200"
          :show-overflow-tooltip="true"
          label="商品条码">
          <template slot-scope="scope">
            {{scope.row.barcode || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="technician"
          min-width="150"
          :show-overflow-tooltip="true"
          label="技师">
          <template slot-scope="scope">
            {{scope.row.technician || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          width="180"
          :show-overflow-tooltip="true"
          label="零售价">
          <template slot-scope="scope">
            {{scope.row.retailPrice ? priceNum(scope.row.retailPrice) : 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="offerType"
          width="180"
          :show-overflow-tooltip="true"
          label="优惠操作">
          <template slot-scope="scope">
            {{scope.row.offerType ? filterStatus(scope.row.offerType,orderOfMode) : '--'}}{{scope.row.offerType=='COMPOSE'||scope.row.offerType=='MANY_DISCOUNT'?(scope.row.offerName?'-'+scope.row.offerName:''):''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="offerAmount"
          width="180"
          :show-overflow-tooltip="true"
          label="优惠价格">
          <template slot-scope="scope">
            {{scope.row.offerAmount ? (priceNum(scope.row.offerAmount)>0?'-'+priceNum(scope.row.offerAmount):(priceNum(scope.row.offerAmount)==0?0:'+'+priceNum(Math.abs(scope.row.offerAmount)))) : 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="refundPrice"
          width="180"
          :show-overflow-tooltip="true"
          label="退单价">
          <template slot-scope="scope">
            {{scope.row.refundPrice ? priceNum(scope.row.refundPrice) : 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          width="180"
          :show-overflow-tooltip="true"
          label="退货数量">
          <template slot-scope="scope">
            {{scope.row.amount || '--'}}<span v-if="scope.row.type == 'BULK'">kg</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="itemAmount"
          width="180"
          :show-overflow-tooltip="true"
          label="小计">
          <template slot-scope="scope">
            {{scope.row.itemAmount ? priceNum(scope.row.itemAmount) : 0}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <gt-subtitle title="优惠信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="baseInfo.offers"
        border
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="优惠名称">
          <template slot-scope="scope">
            {{scope.row.name || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="180"
          :show-overflow-tooltip="true"
          label="优惠类型">
          <template slot-scope="scope">
            {{scope.row.type ? filterStatus(scope.row.type,orderOfMode) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          width="180"
          :show-overflow-tooltip="true"
          label="优惠值">
          <template slot-scope="scope">
            {{scope.row.amount ? (priceNum(scope.row.amount)>0?'-'+priceNum(scope.row.amount):(priceNum(scope.row.amount)==0?0:'+'+priceNum(Math.abs(scope.row.amount)))) : '--'}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <gt-subtitle title="结算信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
      <el-form-item label="应退金额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.amount))}}</span>
      </el-form-item>
      <el-form-item label="实退金额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.amount))}}</span>
      </el-form-item>
      <!-- <el-form-item label="实退金额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.refundAmount))}}</span>
      </el-form-item> -->
      <el-form-item label="退款方式">
        <span class="itemInput">{{filterStatus(baseInfo.payType, returnMode) || '--'}}</span>
      </el-form-item>
      <el-form-item label="扣减积分">
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
          label="退款时间">
          <template slot-scope="scope">
            {{scope.row.createTime || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退款方式">
          <template slot-scope="scope">
            {{scope.row.payType ? filterStatus(scope.row.payType,returnMode) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="paidAmount"
          width="180"
          :show-overflow-tooltip="true"
          label="退款金额">
          <template slot-scope="scope">
             {{scope.row.paidAmount ? priceNum(scope.row.paidAmount) : 0}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>


      <gt-subtitle title="关联信息" style="display: block;"/>
      <el-card>
        <el-form-item label="零售订单">
          <span class="itemInput hoverOrder" v-if="baseInfo.orderId" @click="goOrder(baseInfo.orderId)">{{baseInfo.orderId}}</span>
          <span class="itemInput" v-else >--</span>
        </el-form-item>
      </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { paymentOfMode,orderOfMode, orderType,productHaveBulkType,returnOrder,returnType,returnMode, productOwner, offerType } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getreturnOrderDetail } from '@/service/order'
import moment from 'moment'

export default {
  name:'returnOrder-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      productHaveBulkType,
      orderOfMode,
      productOwner,
      offerType,
      dataListLoading: false,
      number,
      paymentOfMode,
      filterStatus,
      returnOrder,
      returnType,
      returnMode,
      orderType,
      baseInfo:{
        returnOrder: {},
        orderShip: {},
        customer: {}
      }
    }
  },
  methods:{
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 10) {
          sums[index] = '合计'
          return
        }
        if(index === 12 || index===11){
          const values = data.map(item => Number(item[column.property]))

          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = (index==11)?sums[index]:this.priceNum(sums[index])
          } else {
            sums[index] = '--'
          }
        }

      })

      return sums
    },
    // 退货单
    goOrder(id){
      this.$router.push({name:'retailOrder-view',query:{id}})
    },

  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const data = await getreturnOrderDetail({id:id})
      this.baseInfo = {
        ...data,
        returnOrder: data.returnOrder ? data.returnOrder : {},
        createTime: moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.baseInfo.items = this.baseInfo.items.map(item => {
        return{
          ...item,
          amount: item.type == 'BULK' ? item.amount / 1000 : item.amount
        }
      })
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


