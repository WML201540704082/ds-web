<template>
  <!-- table列表 -->
    <div>

      <!-- <span style="float: right;position:fixed;">
        <el-select v-model="orderSource" placeholder="请选择订单来源" clearable @change="changeVal">
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in MomType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span> -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
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
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="orderId"
          :show-overflow-tooltip="true"
          min-width="180"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="paidAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实付金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.paidAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="commissionAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="佣金金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.commissionAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderSource"
          min-width="100"
          :show-overflow-tooltip="true"
          label="佣金类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderSource,MomType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="佣金状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderStatus,commander)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="佣金结算/取消时间">
          <template slot-scope="scope">
            <span>{{scope.row.tradeDate}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { myCommissionDetail } from '@/service/mycustomer'
import { filterStatus } from '@/utils'
import { commander, orderS,MomType } from '@/utils/dict'

export default {
  components: {gtPagination},
  data(){
    return{
      filterStatus,
      commander,
      orderS,
      MomType,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      status: '',
      dataList: [],
      type: '',
    }
  },
  watch:{
    types:{
      handler(val,oldval){
        console.log(val)
        this.type=val
        const { obj,type } = this.$route.query
        this.customerid = JSON.parse(obj).id
        this.pageSize = 20,
        this.currentPage = 0,
        this.getDataList()
      },
      deep: true
    },
    orderSource:{
      handler(val,oldval){
        console.log(val)
        this.orderSource=val
        const { obj,type } = this.$route.query
        this.customerid = JSON.parse(obj).id
        this.pageSize = 20,
        this.currentPage = 0,
        this.getDataList()
      },
      deep: true
    }
  },
  props:['types','orderSource'],
  mounted(){
    const { obj,type } = this.$route.query
    this.customerid = JSON.parse(obj).id
    this.getDataList()
  },
  methods:{
    async getDataList(){
      const {data} = await myCommissionDetail({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
        'orderStatus': this.type,
        'orderSource': this.orderSource
      })
      if(data.code == 0){
        this.dataList = data.data.records
        this.total = data.data.total
      }else{
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }

    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>

