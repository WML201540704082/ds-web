<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="outline" :inline="true" ref='outline' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="时间">
          <gt-time-range
            value-format="timestamp"
            start-time-prop="start"
            :start-time-value="outline.start"
            :end-time-value="outline.end"
            end-time-prop="end"
            @changeStartValue="value => outline.start = value"
            @changeEndValue="value => outline.end = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="企业" prop="companyId">
          <el-select v-model="outline.companyId" filterable placeholder="请选择企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询列表" @click.native="() => exportExcel()"/>
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
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业名称">
          <template slot-scope="scope">
            <span class="theme-color" style="cursor:pointer; text-decoration: underline;" @click="goCompanyDetail(scope.row.companyId)">{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="paidAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="总销售额（元）">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(scope.row.paidAmount, 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orders"
          :show-overflow-tooltip="true"
          min-width="150"
          label="销售笔数（笔）">
        </el-table-column>
        <el-table-column
          prop="rechargeAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="总充值金额（元）">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(scope.row.rechargeAmount, 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeOrders"
          min-width="140"
          :show-overflow-tooltip="true"
          label="储值卡笔数（笔）">
        </el-table-column>
        <el-table-column
          prop="addCustomer"
          min-width="120"
          :show-overflow-tooltip="true"
          label="顾客数量（位）">
        </el-table-column>
        <el-table-column
          prop="storeCount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="门店数量（间）">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { activeStatus, activeType,audio } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import moment from 'moment'
import NP from 'number-precision'
export default {
  name:'survey-outline',
  data () {
    return {
      filterStatus,
      filterColor,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      companyList: [],
      storeList: [],
      NP,
      filterCopy: {
        companyId:'',
        start: null,
        end: null,
      },
      outline:{
        companyId:'',
        start: null,
        end: null,
      }
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  created () {
    if(this.$route.params.state){
      this.activity.status = this.$route.params.state
    }
    // 获取审核列表
    this.getDataList()
    // 获取企业列表
    this.getCompanyList()
  },
  methods: {
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

    // 查看企业详情
    goCompanyDetail(companyId) {
      this.$router.push({name: 'survey-list',query: {companyId}})
    },

    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/mop/data/companyList'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.filterCopy
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },

    // 导出订单列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/mop/data/exportCompanyList'),
        method: 'get',
        responseType: 'arraybuffer',
        selfHandleError: true,
        params: this.$http.adornParams({
          size: 10000,
          page: 0,
          ...this.filterCopy
        })
      })
      fileDownload(data, '营业概况.xls')
    },

    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['outline'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.filterCopy = this.outline
      this.getDataList()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

