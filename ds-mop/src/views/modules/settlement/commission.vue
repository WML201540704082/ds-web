<template>
  <div class="mod-store">
    <el-card style="width: 100%;">
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="申请日期">
          <gt-time-range
            value-format="timestamp"
            start-time-prop="applyForDateBegin"
            :start-time-value="filterForm.applyForDateBegin"
            :end-time-value="filterForm.applyForDateEnd"
            end-time-prop="applyForDateEnd"
            @changeStartValue="value => filterForm.applyForDateBegin = value"
            @changeEndValue="value => filterForm.applyForDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm"/>
        </el-form-item>
      </el-form>
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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="auditQuery(scope.row)">审核查询</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="80"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, commissionWithdrawStatus))">{{filterStatus(scope.row.status, commissionWithdrawStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="withdrawalAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="提现金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.withdrawalAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="提现用户">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor } from '@/utils'
import { commissionWithdrawStatus } from '@/utils/dict'
export default {
  name:'settlement-commission',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        applyForDateBegin: null,
        applyForDateEnd: null,
      },
      commissionWithdrawStatus,
      filterStatus,
      filterColor
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  async created() {
    // 获取结算列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await this.$http({
        url: this.$http.adornUrl('/mop/commission/withdrawalRecord/list'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.filterForm
        })
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

    // 查询审核状态
    async auditQuery(item){
      const { data } = await this.$http({
        url: this.$http.adornUrl(`/mop/commission/withdrawalRecord/getById/${item.id}`),
        method: 'get',
        // params: this.$http.adornParams()
      })
      if (data.code === 0) {
        this.$easyAlert.show({
          title: '提示',
          content: '<div style="color:#67C23A; font-size: 24px;"><i class="el-icon-success" ></i> 已完成</div>',
          confirm: ()=>{
            console.log('点击了确定')
            this.getDataList()
          }
        })
      } else {
        this.$easyAlert.show({
          title: '提示',
          content: '<div style="color:#F56C6C; font-size: 24px;"><i class="el-icon-warning"></i> 失败</div>',
          confirm: ()=>{
            console.log('点击了确定')
            this.getDataList()
          }
        })
      }
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['filterForm'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
