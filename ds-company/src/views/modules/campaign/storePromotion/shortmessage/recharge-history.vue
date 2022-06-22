<template>
  <div class="mod-store">
    <!-- table列表 -->
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
        min-width="120"
        :show-overflow-tooltip="true"
        label="时间">
        <template slot-scope="scope">
          <span>{{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        min-width="120"
        :show-overflow-tooltip="true"
        label="充值单号">
      </el-table-column>
      <el-table-column
        prop="send"
        min-width="150"
        :show-overflow-tooltip="true"
        label="发送数量">
      </el-table-column>
      <el-table-column
        prop="recharge"
        min-width="150"
        :show-overflow-tooltip="true"
        label="充值数量">
      </el-table-column>
      <el-table-column
        prop="amount"
        min-width="150"
        :show-overflow-tooltip="true"
        label="短信余量">
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import moment from 'moment'
import * as api from '@/service/campaign'
export default {
  name: 'recharge-history',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
    }
  },
  components: {
    gtPagination,
  },
  async created() {
    // 获取商品列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.rechargeListRecord({
        size: this.pageSize,
        page: this.currentPage
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
      this.getDataList()
    },
  }
}
</script>
