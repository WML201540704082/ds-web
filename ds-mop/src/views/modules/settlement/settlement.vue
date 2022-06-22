<template>
  <div class="mod-store">
    <el-card style="width: 100%;">
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="企业名称" prop="companyId" v-if="isAuth('mop:company:select3')">
          <el-select v-model="filterForm.companyId" filterable placeholder="请选择企业">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in companyList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="打款来源" prop="payOrigin">
          <el-select v-model="filterForm.payOrigin" placeholder="请选择打款来源">
            <el-option :value="null" label="全部"></el-option>
            <el-option v-for="item in settlementOrigin" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="结算时间">
          <gt-time-range
            start-time-prop="liquidationDateBegin"
            :start-time-value="filterForm.liquidationDateBegin"
            :end-time-value="filterForm.liquidationDateEnd"
            end-time-prop="liquidationDateEnd"
            @changeStartValue="value => filterForm.liquidationDateBegin = value"
            @changeEndValue="value => filterForm.liquidationDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('mop:fuiouAccountStatement:sumList')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <gt-border-button type="money" class="gt-table-create" txt="分账提现金额设置" @click.native="settingCommission"/>
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
          width="60"
          label="操作" v-if="isAuth('mop:fuiouAccountStatement:list')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle({
              companyId: scope.row.companyId,
              transactionAmount: scope.row.transactionAmount,
              liquidationDate: scope.row.liquidationDate
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
          prop="companyCode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="企业编号">
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="canuseMoneny"
          min-width="120"
          :show-overflow-tooltip="true"
          label="可用余额(元)">
          <template slot-scope="scope"><span>{{ scope.row.canuseMoneny ? scope.row.canuseMoneny : '0.00元'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="settlementAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算金额(元)">
          <template slot-scope="scope"><span>{{ scope.row.settlementAmount ? scope.row.settlementAmount : '0.00元'}}</span></template>
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
          min-width="180"
          :show-overflow-tooltip="true"
          label="提现账户">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="结算状态">
        </el-table-column>
        <el-table-column
          prop="source"
          :show-overflow-tooltip="true"
          min-width="150"
          label="打款来源">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    
    <settings v-if="settingVisible" ref="commissionSetting"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { settlementStatus, settlementOrigin } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import settings from './settings'
export default {
  name:'settlement-settlement',
  data () {
    return {
      settingVisible: false,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      companyList: [],
      filterForm:{
        companyId: '',
        // payOrigin: 0,
        liquidationDateBegin: null,
        liquidationDateEnd: null,
      },
      settlementOrigin,
      settlementStatus,
      filterStatus,
      filterColor
    }
  },
  components: {
    gtPagination, gtTimeRange,settings
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'settlement-order'){
        vm.reload()
      }
    })
  },
  async created() {
    this.getCompanyList()
    // 获取结算列表
    this.getDataList()
  },
  methods: {
    
    // 设置结算
    settingCommission() {
      this.settingVisible = true
      this.$nextTick(() => {
        this.$refs.commissionSetting.init()
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await this.$http({
        url: this.$http.adornUrl('/pay/mop/fuiouAccountStatement/sumList'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageSize,
          currentPage: this.currentPage,
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

    // 导出结算列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/pay/mop/fuiouAccountStatement/export'),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.filterForm,
          companyId: this.filterForm.companyId || null,
          pageSize: 10000,
          currentPage: 1,
        })
      })
      fileDownload(data, '结算中心.xls')
    },

    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
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
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['filterForm'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 1
      this.getDataList()
    },
  }
}
</script>
