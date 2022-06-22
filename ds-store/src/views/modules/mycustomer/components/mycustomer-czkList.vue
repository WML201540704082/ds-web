<template>
  <!-- table列表 -->
    <div>
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
          prop="createTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="120"
          :show-overflow-tooltip="true"
          label="订单编号">
          <template slot-scope="scope">
            <span>{{scope.row.orderId || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordType"
          min-width="80"
          :show-overflow-tooltip="true"
          label="操作类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.recordType, recordType)}}</span>
          </template>
        </el-table-column> <el-table-column
          prop="amount"
          min-width="80"
          :show-overflow-tooltip="true"
          label="变动余额">
          <template slot-scope="scope">
            <span>{{scope.row.amount>0?('+'+Number(priceNum(scope.row.amount)).toFixed(2)):(scope.row.amount==0?0:Number(priceNum(scope.row.amount)).toFixed(2))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          min-width="80"
          :show-overflow-tooltip="true"
          label="变动后余额">
          <template slot-scope="scope">
            <span v-if="scope.row.balance !== null">{{Number(priceNum(scope.row.balance)).toFixed(2)}}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作用户">
          <template slot-scope="scope">
            <span>{{scope.row.operator || '-'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { cardRecord } from '@/service/mycustomer'
import { recordType } from '@/utils/dict'
import { filterStatus } from '@/utils'

export default {
  components: {gtPagination},
  data(){
    return{
      filterStatus,
      recordType,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
    }
  },
  watch:{
    types:{
      handler(val,oldval){
        console.log(val)
        this.pageSize = 20
        this.currentPage = 0
        this.getDataList(val)
      },
      deep: true
    }
  },
  props:['types','customerid'],
  created(){
    this.getDataList('')
  },
  methods:{
    async getDataList(type){
      const {data} = await cardRecord({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
        'recordType': type
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
      this.getDataList(this.types)
    },
  }
}
</script>
