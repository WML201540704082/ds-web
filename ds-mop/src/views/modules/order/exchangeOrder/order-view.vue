<template>
  <section class="order" v-loading="$store.state.loading.global">

    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
    <gt-subtitle title="基本信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
        <el-form-item label="订单编号">
          <span class="itemInput">{{baseInfo.integralOrder.id}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span class="itemInput">{{baseInfo.integralOrder.createTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span class="itemInput">{{filterStatus(baseInfo.integralOrder.orderStatus, exchangeStatus)}}</span>
        </el-form-item>
        <el-form-item label="所属企业">
          <span class="itemInput">{{baseInfo.integralOrder.companyName || '--'}}</span>
        </el-form-item>
        <el-form-item label="所属门店">
          <span class="itemInput">{{baseInfo.integralOrder.storeName || '--'}}</span>
        </el-form-item>
        <el-form-item label="顾客">
          <span class="itemInput">{{baseInfo.integralOrder.customerName || '--'}}/{{baseInfo.integralOrder.customerPhone || '--'}}</span>
        </el-form-item>
        <el-form-item label="收银员">
          <span class="itemInput">{{baseInfo.integralOrder.cashier || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单来源">
          <span class="itemInput">{{filterStatus(baseInfo.integralOrder.orderSource, orderType) || '--'}}</span>
        </el-form-item>
    </el-card>

    <gt-subtitle title="商品信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="baseInfo.orderItems"
        border
        v-loading="dataListLoading"
        :stripe="true"
        height="300"
        class="summarys"
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          min-width="200"
          :show-overflow-tooltip="true"
          label="商品名称"
          width="120">
          <template slot-scope="scope">
            {{scope.row.productName || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productCategory"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            {{scope.row.productCategory ? filterStatus(scope.row.productCategory,productType) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productOwner"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品归属">
          <template slot-scope="scope">
            {{scope.row.productOwner ? filterStatus(scope.row.productOwner,productOwner) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productSpec"
          width="150"
          :show-overflow-tooltip="true"
          label="商品规格">
          <template slot-scope="scope">
            {{scope.row.productSpec || '默认规格'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productBarCode"
          width="200"
          :show-overflow-tooltip="true"
          label="商品条码">
          <template slot-scope="scope">
            {{scope.row.productBarCode || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productPrice"
          width="180"
          :show-overflow-tooltip="true"
          label="零售价">
          <template slot-scope="scope">
            {{scope.row.productPrice ? priceNum(scope.row.productPrice) : 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productNum"
          width="180"
          :show-overflow-tooltip="true"
          label="数量">
          <template slot-scope="scope">
            {{scope.row.productNum || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="spendIntegral"
          width="180"
          :show-overflow-tooltip="true"
          label="使用积分">
        </el-table-column>
      </el-table>
    </el-card>

    <gt-subtitle title="结算信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
      <el-form-item label="应收金额">
        <span class="itemInput">¥ {{number(priceNum(baseInfo.integralOrder.productTotalAmount))}}</span>
      </el-form-item>
      <el-form-item label="兑换方式">
        <span class="itemInput">{{filterStatus(baseInfo.integralOrder.exchangeType,exchangeType)}}</span>
      </el-form-item>
      <el-form-item label="实收金额">
        <span class="itemInput">¥ 0</span>
      </el-form-item>
      <!-- <el-form-item label="实收金额">
        <span class="itemInput">¥ 0</span>
      </el-form-item> -->
    </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { paymentOfMode,orderOfMode, orderType,productType,exchangeStatus, productOwner,exchangeType } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getintegralOrderDetail } from '@/service/order'
import moment from 'moment'

export default {
  name:'exchangeOrder-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      productType,
      orderOfMode,
      productOwner,
      exchangeType,
      dataListLoading: false,
      number,
      paymentOfMode,
      filterStatus,
      exchangeStatus,
      orderType,
      baseInfo:{
        integralOrder:{},
        orderItems:[]
      }
    }
  },
  methods:{

  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const {data} = await getintegralOrderDetail({id:id})
      this.baseInfo = {
        integralOrder: data.data.integralOrder,
        orderItems: data.data.orderItems,
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


