<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="staff" :inline="true" ref='staff' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="查询时间">
          <gt-time-range
            start-time-prop="beginTime"
            :start-time-value="staff.beginTime"
            :end-time-value="staff.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => staff.beginTime = value"
            @changeEndValue="value => staff.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-button type="export" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-table-height
        style="width: 100%; margin-top: 20px;">
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workMonth"
          min-width="120"
          label="工作月">
        </el-table-column>
        <el-table-column
          prop="employeeName"
          min-width="90"
          :show-overflow-tooltip="true"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          prop="position"
          min-width="90"
          :show-overflow-tooltip="true"
          label="员工岗位">
        </el-table-column>
        <el-table-column
          prop="indicator"
          min-width="120"
          :show-overflow-tooltip="true"
          label="销售业绩指标">
        </el-table-column>
        <el-table-column
          prop="performance"
          min-width="90"
          :show-overflow-tooltip="true"
          label="销售业绩">
        </el-table-column>
        <el-table-column
          prop="commissions"
          min-width="90"
          :show-overflow-tooltip="true"
          label="销售提成">
        </el-table-column>
        <el-table-column
          prop="servicePerformance"
          min-width="90"
          :show-overflow-tooltip="true"
          label="服务业绩">
        </el-table-column>
        <el-table-column
          prop="serviceCommissions"
          min-width="90"
          :show-overflow-tooltip="true"
          label="服务提成">
        </el-table-column>
        <el-table-column
          prop="count"
          min-width="90"
          :show-overflow-tooltip="true"
          label="收银笔数">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="90"
          :show-overflow-tooltip="true"
          label="收银总额">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterStatus, filterColor } from '@/utils'
import { getStoreList } from '@/service/systore'
import * as api from '@/service/staffManagement'
import { number } from '@/utils/validate'
import gtTimeRange from '@/components/gt-time-range'
import gtButton from '@/components/gt-button'
import moment from 'moment'
import { fileDownload } from '@/utils'
export default {
  data () {
    return {
      number,
      dataList: [],
      // dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      staff:{
        beginTime: null,
        endTime: null
      }
    }
  },
  created () {
    // 获取订单列表
    this.getDataList()
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtButton
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStaffPerformanceList({
        ...this.staff,
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
    // 工作人员业绩导出
    async exportExcel() {
      const { data, headers } = await api.exportExcel({
        ...this.staff,
        page: this.currentPage,
        size: this.pageSize
      })
      fileDownload(data, '员工业绩.xls')
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['staff'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
