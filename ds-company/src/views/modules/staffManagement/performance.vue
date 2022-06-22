<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="staff" :inline="true" ref='staff' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="员工信息" prop='key'>
          <el-input v-model="staff.key" placeholder="员工姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="工作月" prop='workDate' class="alter_time_style">
          <el-date-picker
            v-model="staff.workDate"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="日期查询">
          <gt-time-range
            start-time-prop="beginTime"
            :start-time-value="staff.beginTime"
            :end-time-value="staff.endTime"
            end-time-prop="endTime"
            type="date"
            @changeStartValue="value => staff.beginTime = value"
            @changeEndValue="value => staff.endTime = value"
          ></gt-time-range>
        </el-form-item> -->
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <span style="float:right;margin-right:15px;margin-top:10px;font-size:15px;">单位：元</span>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-table-height
        style="width: 100%; margin-top: 20px;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="commissionDetail(scope.row)">收入明细</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="workMonth"
          min-width="90"
          label="工作月">
        </el-table-column>
        <el-table-column
          prop="employeeName"
          min-width="180"
          :show-overflow-tooltip="true"
          label="员工">
          <template slot-scope="scope">
            <span>{{`${scope.row.employeeName || '--'} /${scope.row.phone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sysRoleName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="员工角色">
          <template slot-scope="scope">
            <span>{{scope.row.sysRoleName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ownerStore"
          min-width="100"
          :show-overflow-tooltip="true"
          label="所属门店">
          <template slot-scope="scope">
            <span>{{scope.row.ownerStore || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="performance"
          min-width="150"
          :show-overflow-tooltip="true"
          label="销售业绩/业绩指标">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.performance)}}/{{priceNum(scope.row.indicator)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="baseCommission"
          min-width="110"
          :show-overflow-tooltip="true"
          label="业绩提成基数">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.baseCommission)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commissions"
          min-width="90"
          :show-overflow-tooltip="true"
          label="业绩提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.commissions)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="newCustomerCommission"
          min-width="90"
          :show-overflow-tooltip="true"
          label="新客提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.newCustomerCommission)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="brokerage"
          min-width="100"
          :show-overflow-tooltip="true"
          label="合伙人佣金">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.brokerage)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { getStaffPerformanceList } from '@/service/staffManagement'
import * as api from '@/service/staffManagement'
// import { number } from '@/utils/validate'
import moment from 'moment'
import gtTimeRange from '@/components/gt-time-range'
import gtButton from '@/components/gt-button'
import { fileDownload } from '@/utils'
export default {
  name: 'staffManagement-performance',
  data () {
    return {
      // number,
      dataList: [],
      // dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      staff:{
        workMonth:null,
        // beginTime: null,
        // endTime: null
      },
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
        workDate: this.staff.workDate ? moment(this.staff.workDate).format('YYYY-MM') : null,
        // startDate: this.staff.beginTime ? moment(this.staff.beginTime).format('YYYY-MM') : null,
        // endDate: this.staff.endTime ? moment(this.staff.endTime).format('YYYY-MM') : null,
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
        workDate: this.staff.workDate ? moment(this.staff.workDate).format('YYYY-MM') : null,
        // startDate: this.staff.beginTime ? moment(this.staff.beginTime).format('YYYY-MM') : null,
        // endDate: this.staff.endTime ? moment(this.staff.endTime).format('YYYY-MM') : null,
        page: 0,
        size: 10000
      })
      fileDownload(data, '员工业绩.xls')
    },

    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    commissionDetail(staff) {
      const {employeeName, phone, workMonth, employeeId, baseCommission, newCustomerCommission, brokerage} = staff
      this.$router.push({name:'staff-commission', query: {name: employeeName, phone, workMonth, employeeId, baseCommission, newCustomerCommission, brokerage}})
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['staff'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    }
  }
}
</script>
