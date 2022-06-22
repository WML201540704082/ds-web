<template>
  <section class="order-activity" v-loading="$store.state.loading.global">
    <el-form :inline="true" ref="baseInfo" label-width="100px" class="baseInfo">
    <gt-subtitle title="基本信息" style="display: inline-block;"/>
    <el-card style="margin-bottom: 10px;">
        <el-form-item label="订单编号">
          <span class="itemInput">{{baseInfo.orderNo}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span class="itemInput">{{baseInfo.createDate || '--'}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span class="itemInput">{{filterStatus(baseInfo.orderStatus, activityStatus)}}</span>
        </el-form-item>
        <el-form-item label="所属门店">
          <span class="itemInput">{{baseInfo.storeName || '--'}}</span>
        </el-form-item>
        <el-form-item label="所属活动">
          <span class="itemInput">{{baseInfo.distributionActivityTitle || '--'}}</span>
        </el-form-item>
        <el-form-item label="顾客">
          <span class="itemInput" v-if="baseInfo.contactPhone">{{baseInfo.memberName || '--'}}/{{baseInfo.contactPhone || '--'}}</span>
          <span class="itemInput" v-else>--</span>
        </el-form-item>
    </el-card>

    <gt-subtitle title="商品信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px;">
      <!-- table列表 -->
      <el-table
        :data="baseInfo.orderDetailList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        class="summarys"
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
          prop="productName"
          min-width="200"
          :show-overflow-tooltip="true"
          label="商品名称">
          <template slot-scope="scope">
            {{scope.row.productName || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productPrice"
          width="180"
          :show-overflow-tooltip="true"
          label="商品价格">
          <template slot-scope="scope">
            {{scope.row.productPrice}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productNum"
          width="180"
          :show-overflow-tooltip="true"
          label="商品数量">
          <template slot-scope="scope">
            {{scope.row.productNum || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          width="180"
          :show-overflow-tooltip="true"
          label="总金额">
          <template slot-scope="scope">
            {{scope.row.totalAmount}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <gt-subtitle title="结算信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
      <el-form-item label="应收金额">
        <span class="itemInput">¥ {{baseInfo.totalAmount}}</span>
      </el-form-item>
      <el-form-item label="实收金额">
        <span class="itemInput">¥ {{baseInfo.actualPaymentAmount}}</span>
      </el-form-item>
      <el-form-item label="支付方式">
        <span class="itemInput">微信</span>
      </el-form-item>
      <br>


      <el-form-item label="一级佣金">
        <span class="itemInput">¥ {{baseInfo.classACommission||'-'}}</span>
      </el-form-item>
      <el-form-item label="一级分佣人">
        <span class="itemInput">{{baseInfo.classAMemberName || '-'}}/{{baseInfo.classAMemberPhone||'-'}}</span>
      </el-form-item>
      <el-form-item label="佣金状态">
        <span class="itemInput">{{filterStatus(baseInfo.classACommissionStatus, dmpCommission) || '-'}}</span>
      </el-form-item>
      <br>
      <el-form-item label="二级佣金">
        <span class="itemInput">¥ {{baseInfo.classBCommission||'-'}}</span>
      </el-form-item>
      <el-form-item label="二级分佣人">
        <span class="itemInput">{{baseInfo.classBMemberName || '-'}}/{{baseInfo.classBMemberPhone||'-'}}</span>
      </el-form-item>
      <el-form-item label="佣金状态">
        <span class="itemInput">{{filterStatus(baseInfo.classBCommissionStatus, dmpCommission) || '-'}}</span>
      </el-form-item>
    </el-card>

    <gt-subtitle title="其他信息" style="display: block;"/>
    <el-card style="margin-bottom: 10px;">
      <el-form-item label="提货时间">
        <span class="itemInput">{{baseInfo.consumeDate || '--'}}</span>
      </el-form-item>
      <el-form-item label="退款时间">
        <span class="itemInput">{{baseInfo.applyDate || '--'}}</span>
      </el-form-item>
    </el-card>
    </el-form>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { activityStatus,orderOfMode,dmpCommission } from '@/utils/dict'
import { filterStatus, number } from '@/utils'
import { getDmpOrderDetail } from '@/service/order'
import moment from 'moment'
export default {
  name: 'activityOrder-view',
  components: {
    gtSubtitle
  },
  data(){
    return{
      dmpCommission,
      activityStatus,
      orderOfMode,
      dataListLoading: false,
      number,
      filterStatus,
      baseInfo:{
        orderDetailList:[]
      }
    }
  },
  methods:{
  },
  async created() {
    const { id } = this.$route.query
    if (id) {
      const {data} = await getDmpOrderDetail({orderId:id})
      if(data.code == 0&&data.data){
        this.baseInfo = {
          ...data.data
        }
      }else{
        this.$message.error(data.msg)
      }

    }
  },
}
</script>
<style lang="scss">
.order-activity{
  .itemInput{
    min-width: 60px;
    display: inline-block;
  }
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


