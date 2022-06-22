<template>
  <div class="mod-store">
    <el-card>
      <!-- <gt-sub-title title="结算历史"/> -->
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="结算时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="liquidationDateBegin"
            :start-time-value="filterForm.liquidationDateBegin"
            @changeStartValue="value => filterForm.liquidationDateBegin = value"
            :end-time-value="filterForm.liquidationDateEnd"
            end-time-prop="liquidationDateEnd"
            @changeEndValue="value => filterForm.liquidationDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:fuiouAccountStatement:sumList')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
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
          width="80"
          label="操作"
          v-if="isAuth('company:fuiouAccountStatement:list')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle({
              liquidationDate: scope.row.liquidationDate,
              transactionAmount: scope.row.transactionAmount
            })">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="liquidationDate"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算时间">
        </el-table-column>
        <el-table-column
          prop="createDate"
          min-width="120"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="settlementAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算金额(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.settlementAmount > 0" style="color:#FC5A3D;text-decoration: underline;cursor: pointer;" @click="getInformation(scope.row.liquidationDate)">{{ scope.row.settlementAmount ? scope.row.settlementAmount : '0.00元' }} </span>          </template>
        </el-table-column>
        <el-table-column
          prop="transactionAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="实收金额(元)">
          <template slot-scope="scope"><span>{{ scope.row.transactionAmount ? scope.row.transactionAmount : '0.00元'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="accountNo"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算账户">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算状态">
        </el-table-column>
        <el-table-column
          prop="source"
          :show-overflow-tooltip="true"
          min-width="140"
          label="打款来源">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-Information ref="gtInformation"></gt-Information>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtInformation from './settlement-information'
// import gtSubTitle from '@/components/gt-sub-title'
import { storeStatus, settlementStatus, settlementOrigin } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { getSettlementHistoryList, exportExcel } from '@/service/setting'
import { filterStatus, filterColor, fileDownload } from '@/utils'
export default {
  name: 'settings-settlement-history',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      filterStatus,
      filterColor,
      settlementStatus,
      settlementOrigin,
      filterForm:{
        liquidationDateBegin: null,
        liquidationDateEnd: null,
      }
    }
  },
  components: {
    gtPagination, gtTimeRange,gtInformation
  },

  async created() {
    // 获取结算列表
    if(this.isAuth('company:fuiouAccountStatement:sumList')){
      this.getDataList()
    }
  },
  methods: {
    //企业结算信息
     getInformation (liquidationDate) {
      this.$nextTick(() => {
        visible: true,
        this.$refs.gtInformation.init(liquidationDate)
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getSettlementHistoryList({
        ...this.filterForm,
        pageSize: this.pageSize,
        currentPage: this.currentPage
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
    // 导出结算中心列表
    async exportExcel() {
      const { data, headers } = await exportExcel({
        ...this.filterForm,
        pageSize: 10000,
        currentPage: 1
      })
      fileDownload(data, '结算中心.xls')
    },
    // 查看
    storeViewHandle (query){
      this.$router.push({name: 'settlement-order', query})
    },
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
      this.currentPage = 1
      this.getDataList()
    },
  }
}
</script>

