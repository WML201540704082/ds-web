<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="申请时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="applyForDateBegin"
            :start-time-value="filterForm.applyForDateBegin"
            @changeStartValue="value => filterForm.applyForDateBegin = value"
            :end-time-value="filterForm.applyForDateEnd"
            end-time-prop="applyForDateEnd"
            @changeEndValue="value => filterForm.applyForDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword" class="gt-inline-item">
          <el-input v-model="filterForm.keyword" placeholder="请输入微信昵称/手机号"></el-input>
        </el-form-item>
        <el-form-item label="提现状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择提现状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in commissionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="佣金结算设置" @click.native="settingCommission"/>
      <div style="float:right;margin-right:10px;margin-top:5px">提现总金额：{{priceNum(commissionTotal)}} 元</div>
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
        <!-- <el-table-column
          min-width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status !== 'PROCESSED'" class="nopadding" type="text" size="small" @click="handle(scope.row.id, scope.row.customerId)">处理</el-button>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="wechatName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="微信昵称">
          <template slot-scope="scope">
            <span>{{scope.row.wechatName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="申请人姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="level"
          min-width="90"
          :show-overflow-tooltip="true"
          label="团长级别">
          <template slot-scope="scope"><span>{{filterStatus(scope.row.level, headerLevel) || '--'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="withdrawalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="提现金额">
          <template slot-scope="scope"><span>{{scope.row.withdrawalAmount ? priceNum(scope.row.withdrawalAmount) : '--'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="提现状态">
          <template slot-scope="scope"><span>{{filterStatus(scope.row.status, commissionStatus) || '--'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="withdrawalMode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="提现方式">
          <template slot-scope="scope"><span>{{filterStatus(scope.row.withdrawalMode, commissionType)}}</span></template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <settings v-if="settingVisible" ref="commissionSetting"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { commissionStatus, headerLevel, commissionType } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { getCommissionList, handleCommission, getCommissionTotal } from '@/service/setting'
import { filterStatus, filterColor } from '@/utils'
import settings from './settings'
export default {
  name: 'settlement-commission',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      settingVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterStatus,
      filterColor,
      commissionStatus,
      commissionType,
      commissionTotal: 0,
      headerLevel,
      filterForm:{
        applyForDateBegin: null,
        applyForDateEnd: null,
        keyword: null,
        status: null
      }
    }
  },
  components: {
    gtPagination, gtTimeRange, settings
  },

  async created() {
    // // 获取提现总金额
    // this.getCommission()
    // 获取结算列表
    this.getDataList()
  },
  methods: {
    async getCommission() {
      const { data } = await getCommissionTotal({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.commissionTotal = data.data
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCommissionList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        // 获取提现总金额
        this.getCommission()
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 设置结算
    settingCommission() {
      this.settingVisible = true
      this.$nextTick(() => {
        this.$refs.commissionSetting.init()
      })
    },

    // 处理佣金
    async handle(id, customerId) {
      const { data } = await handleCommission({
        id,
        customerId
      })
      if (data.code == 0) {
        this.getDataList()
      } else {
        this.$message.error(data.msg)
      }
    },

    // 分页回调时间
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">
.commission-total{
  height: 40px;
  line-height: 40px;
  float: right;
}
</style>

