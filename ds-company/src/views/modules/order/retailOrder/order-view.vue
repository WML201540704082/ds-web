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
          <span class="itemInput">{{filterStatus(baseInfo.stage, retailOrder)}}</span>
        </el-form-item>
        <el-form-item label="所属门店">
          <span class="itemInput">{{baseInfo.storeName || '--'}}</span>
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
        <el-form-item label="备注">
          <span class="itemInput">{{baseInfo.remark || '--'}}</span>
        </el-form-item>
        <el-form-item label="留言">
          <span class="itemInput">{{baseInfo.comments || '--'}}</span>
        </el-form-item>
    </el-card>

    <gt-subtitle title="商品信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="baseInfo.items"
        border
        :summary-method="getSummaries"
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
          label="原价">
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
            {{scope.row.offerAmount ? (priceNum(scope.row.offerAmount)>0?'-'+priceNum(scope.row.offerAmount):(priceNum(scope.row.offerAmount)==0?0:'+'+priceNum(Math.abs(scope.row.offerAmount)))) : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="salePrice"
          width="180"
          :show-overflow-tooltip="true"
          label="现价">
          <template slot-scope="scope">
            {{scope.row.salePrice ? priceNum(scope.row.salePrice) : 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          width="180"
          :show-overflow-tooltip="true"
          label="购买数量">
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
      <el-form-item label="购物卡名称" v-if="baseInfo.payType == 'SHOPPINGCARD'">
        <span class="itemInput">{{baseInfo.shoppingCardName}}</span>
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

    <gt-subtitle title="配送信息" style="display: block;" v-if="baseInfo.shipType ==='EXPRESS'"/>
    <el-card style="margin-bottom: 10px;"  v-if="baseInfo.shipType ==='EXPRESS'">
      <el-form-item label="收货人">
        <span class="itemInput">{{baseInfo.orderShip.name}}</span>
      </el-form-item>
      <el-form-item label="联系电话">
        <span class="itemInput">{{baseInfo.orderShip.phone}}</span>
      </el-form-item>
      <el-form-item label="收货地址">
        <span class="itemInput">{{baseInfo.orderShip.address}}</span>
      </el-form-item>
      <!-- <el-form-item label="物流公司">
        <span class="itemInput">{{baseInfo.orderShip.shipCompany}}</span>
      </el-form-item>
      <el-form-item label="物流单号">
        <span class="itemInput">{{baseInfo.orderShip.shipNo}}</span>
      </el-form-item> -->
    </el-card>

      <gt-subtitle title="关联信息" style="display: block;"/>
      <el-card>
        <el-form-item label="退货单">
          <span class="itemInput hoverOrder" v-if="baseInfo.returnOrder.id" @click="goOrder(baseInfo.returnOrder.id)">{{baseInfo.returnOrder.id}}</span>
          <span class="itemInput" v-else >--</span>
        </el-form-item>
      </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { paymentOfMode,orderOfMode, orderType,productHaveBulkType,retailOrder, productOwner, offerType } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getOrderDetail } from '@/service/order'
import moment from 'moment'

export default {
  name: 'retailOrder-view',
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
      retailOrder,
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
      this.$router.push({name:'returnOrder-view',query:{id}})
    },

  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const data = await getOrderDetail({id:id})
      // 优惠信息排序
      let offers = data.offers
      if (data.offers && data.offers.length > 1) {
        offers = data.offers.sort(function(a, b){ return a.type.charCodeAt() - b.type.charCodeAt()})
      }
      this.baseInfo = {
        ...data,
        offers,
        orderShip: data.orderShip ? data.orderShip : {},
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


