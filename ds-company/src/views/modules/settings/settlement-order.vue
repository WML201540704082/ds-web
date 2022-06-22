<template>
  <div class="mod-store">
    <el-card>
      <gt-sub-title title="结算对应订单" />
      <div class="info">
        {{transactionAmount}}元
        <span class="time-info">{{`${liquidationDate} 00:00:00 - ${liquidationDate} 23:59:59` }}</span>
      </div>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
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
          prop="merchantOrderNo"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="transactionCompletionTime"
          :show-overflow-tooltip="true"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="transactionAmount"
          :show-overflow-tooltip="true"
          label="实收金额">
        </el-table-column>
        <el-table-column
          prop="storeName"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtSubTitle from '@/components/gt-sub-title'
import { settlementStatus, settlementOrigin } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import { getSettlementOrderList } from '@/service/setting'
export default {
  name:'settlement-order',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      transactionAmount: 0,
      liquidationDate: null,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      settlementOrigin,
      settlementStatus,
      filterStatus,
      filterColor
    }
  },
  components: {
    gtPagination, gtSubTitle
  },
  async created() {
    if(this.isAuth('company:fuiouAccountStatement:list')){
      this.getDataList(this.$route.query)
    }
  },
  methods: {
    // 获取数据列表
    async getDataList({liquidationDate, transactionAmount}) {
      this.liquidationDate = liquidationDate
      this.transactionAmount = transactionAmount
      this.dataListLoading = true
      const { data } = await getSettlementOrderList({
        liquidationDateBegin: liquidationDate + ' 00:00:00',
        liquidationDateEnd: liquidationDate + ' 23:59:59',
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList(this.$route.query)
    },
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/assets/scss/_variables.scss';
  .info{
    font-size: 20px;
    color: $status--common-color;
    margin-left: 20px;
    .time-info{
      font-size: 16px;
      margin-left: 10px;
      color: $info--sub-font-color;
    }
  }
</style>

