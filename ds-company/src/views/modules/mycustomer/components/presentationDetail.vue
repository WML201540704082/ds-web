<template>
  <div class="mode-store-table" style="margin: 10px 0;margin-bottom: 3px;">
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
          prop="withdrawalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="提现金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.withdrawalAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="提现状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,commissionStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          :show-overflow-tooltip="true"
          min-width="180"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="checkDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="到账时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { myCommissionList } from '@/service/mycustomer'
import { filterStatus } from '@/utils'
import { commissionStatus } from '@/utils/dict'

export default {
  components: {gtPagination},
  data(){
    return{
      dataListLoading: false,
      filterStatus,
      commissionStatus,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
    }
  },
  props:['customerid'],
  created() {
    this.getDataList()
  },
  // 方法
  methods:{
    async getDataList() {
      const {data} = await myCommissionList({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
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
