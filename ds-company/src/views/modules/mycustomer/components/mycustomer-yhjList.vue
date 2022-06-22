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
          prop="name"
          width="200"
          :show-overflow-tooltip="true"
          label="优惠券名称">
        </el-table-column>
        <el-table-column
          prop="couponCode"
          width="200"
          :show-overflow-tooltip="true"
          label="劵码">
        </el-table-column>
        <el-table-column
          prop="type"
          width="150"
          :show-overflow-tooltip="true"
          label="优惠券类别">
        </el-table-column>
        <el-table-column
          prop="applyToStores"
          :show-overflow-tooltip="true"
          width="180"
          label="适用门店">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="180"
          label="使用渠道">
          <template slot-scope="scope">
            <span>{{scope.row.channel == 0 ? '线上、线下' : scope.row.channel == 1 ? '线上' : '线下'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="grantDate"
          width="200"
          :show-overflow-tooltip="true"
          label="发放日期">
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          width="380"
          :show-overflow-tooltip="true"
          label="有效期">
        </el-table-column>
        <el-table-column
          prop="useDateAndStore"
          min-width="180"
          :show-overflow-tooltip="true"
          label="消费时间/门店">
        </el-table-column>
        <el-table-column
          prop="status"
          width="180"
          :show-overflow-tooltip="true"
          label="优惠券状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,couponStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { customerCoupon } from '@/service/campaign'
import { filterStatus } from '@/utils'
import { couponStatus } from '@/utils/dict'

export default {
  components: {gtPagination},
  data(){
    return{
      filterStatus,
      couponStatus,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      status: -1,
      dataList: [],
    }
  },
  watch:{
    types:{
      handler(val,oldval){
        console.log(val)
        this.currentPage = 0
        this.pageSize = 20
        this.getDataList(val)
      },
      deep: true
    }
  },
  props:['types','customerid'],
  created(){
    this.getDataList('-1')
  },
  methods:{
    async getDataList(type) {
      const { data } = await customerCoupon({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
        'status': type
      })
      if (data.code == 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
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

