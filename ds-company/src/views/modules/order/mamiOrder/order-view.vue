<template>
  <section class="order" v-loading="$store.state.loading.global">

    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
      <gt-subtitle title="基本信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;">
        <el-form-item label="订单编号">
          <span class="itemInput">{{baseInfo.orderNo}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span class="itemInput">{{baseInfo.createDate || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span class="itemInput">{{filterStatus(baseInfo.orderStatus, mamiOrderStatus)}}</span>
        </el-form-item>
        <el-form-item label="所属门店">
          <span class="itemInput">{{baseInfo.mbgStoreName || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单类型">
          <span class="itemInput">{{filterStatus(baseInfo.orderType, mamiType)}}</span>
        </el-form-item>
        <el-form-item label="顾客">
          <span class="itemInput">{{baseInfo.mbgCustomerName || '--'}}/{{baseInfo.mbgCustomerPhone || '--'}}</span>
        </el-form-item>
      </el-card>

      <gt-subtitle title="商品信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
        <!-- table列表 -->
        <el-table
          :data="baseInfo.mwOrderMbgDetailListCompanyWebRespList"
          border
          v-loading="dataListLoading"
          :stripe="true"
          height="300"
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
            prop="skuName"
            min-width="200"
            :show-overflow-tooltip="true"
            label="商品名称"
            width="120">
            <template slot-scope="scope">
              {{scope.row.skuName || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="skuSpec"
            width="150"
            :show-overflow-tooltip="true"
            label="规格">
            <template slot-scope="scope">
              {{scope.row.skuSpec || '默认规格'}}
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
            prop="totalAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="原价">
            <template slot-scope="scope">
              {{scope.row.totalAmount ? scope.row.totalAmount : 0}}
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            :show-overflow-tooltip="true"
            label="优惠方式">
            <template slot-scope="scope">
              {{scope.row.discountType == 'CASH' ? scope.row.discountName : scope.row.discountType}}
            </template>
          </el-table-column>
          <el-table-column
            prop="discountAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="优惠价格">
            <template slot-scope="scope">
              {{scope.row.discountAmount ? scope.row.discountAmount : 0}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualPaymentAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="现价">
            <template slot-scope="scope">
              {{scope.row.actualPaymentAmount ? scope.row.actualPaymentAmount : 0}}
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            width="180"
            :show-overflow-tooltip="true"
            label="购买数量">
            <template slot-scope="scope">
              {{scope.row.num || '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="itemAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="小计">
            <template slot-scope="scope">
              {{scope.row.actualPaymentAmount ? NP.round(NP.times(scope.row.actualPaymentAmount, scope.row.num), 2) : 0}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <gt-subtitle title="结算信息" style="display: block;"/>
      <el-card style="margin-bottom: 10px;">
        <el-form-item label="应收金额">
          <span class="itemInput">¥ {{number(baseInfo.totalAmount)}}</span>
        </el-form-item>
        <el-form-item label="实收金额">
          <span class="itemInput">¥ {{number(baseInfo.actualPaymentAmount)}}</span>
        </el-form-item>
        <!-- <el-form-item label="实收金额">
          <span class="itemInput">¥ {{number(baseInfo.actualPaymentAmount)}}</span>
        </el-form-item> -->
        <el-form-item label="支付方式">
          <span class="itemInput">微信</span>
        </el-form-item>
        <el-form-item label="订单积分">
          <span class="itemInput">/</span>
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
            prop="payDate"
            :show-overflow-tooltip="true"
            label="支付时间">
          </el-table-column>
          <el-table-column
            prop="payType"
            min-width="180"
            :show-overflow-tooltip="true"
            label="支付方式">
          </el-table-column>
          <el-table-column
            prop="actualPaymentAmount"
            width="180"
            :show-overflow-tooltip="true"
            label="支付金额">
            <template slot-scope="scope">
              {{scope.row.actualPaymentAmount ? number(scope.row.actualPaymentAmount) : 0}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <gt-subtitle title="其他信息" style="display: block;"/>
      <el-card>
        <el-form-item label="提货时间">
          <span class="itemInput">{{baseInfo.consumeDate}}</span>
        </el-form-item>
      </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { mamiType, mamiOrderStatus } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getMamiOrderDetail } from '@/service/order'
import NP from 'number-precision'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name: 'mamiOrder-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      NP,
      dataListLoading: false,
      number,
      filterStatus,
      mamiType,
      mamiOrderStatus,
      baseInfo: {
        mwOrderMbgDetailListCompanyWebRespList: [],
        payItems: []
      }
    }
  },
  methods:{


  },
  async created() {
    const { id } = this.$route.query
    const { companyId = '' } = getStore({name: 'commenInfo'})
    if (id) {
      const { data } = await getMamiOrderDetail({
        companyId: 2,
        mbgCompanyId: companyId,
        id:id
      })
      if (data.code === 0) {
        const payItems = [{
          payDate: data.data.payDate,
          payType: '微信',
          actualPaymentAmount: data.data.actualPaymentAmount
        }]
        this.baseInfo = {
          ...data.data,
          payItems
        }
      } else {
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


