<template>
  <div class="mod-store">
    <el-card>
      <!-- <gt-sub-title title="结算历史"/> -->
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店名称" prop="storeName">
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择门店" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option 
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="filterForm.start"
            :end-time-value="filterForm.end"
            end-time-prop="end"
            valueFormat="yyyy-MM-dd"
            @changeStartValue="value => filterForm.start = value"
            @changeEndValue="value => filterForm.end = value"
            type='date'
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:fuiouAccountStatement:sumList')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      <el-form-item label="商户号" prop="merchantNo" class="gt-inline-item">
        <el-input v-model="filterForm.merchantNo"  placeholder="请输入商户号"></el-input>
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
              transactionAmount: scope.row.transactionAmount,
              storeId: scope.row.storeId
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
            <span v-if="scope.row.settlementAmount > 0" >{{ scope.row.settlementAmount ? priceNum(scope.row.settlementAmount) : '0.00元' }} </span>          </template>
        </el-table-column>
        <el-table-column
          prop="transactionAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="实收金额(元)">
          <template slot-scope="scope"><span>{{ scope.row.transactionAmount ? priceNum(scope.row.transactionAmount) : '0.00元'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="merchantNo"
          min-witdth="120"
          :show-overflow-tooltip="true"
          label="商户号">
        </el-table-column>
        <el-table-column
          prop="storeNameAcc"
          min-witdth="150"
          :show-overflow-tooltip="true"
          label="门店名称">
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
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import { getStoreList } from '@/service/systore'
import gtPagination from '@/components/gt-pagination'
//import gtInformation from '../settlement-information'
// import gtSubTitle from '@/components/gt-sub-title'
import { storeStatus, settlementStatus, settlementOrigin } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { getSettlementStoreHistoryList, storeexportExcel } from '@/service/setting'
import { filterStatus, filterColor, fileDownload } from '@/utils'
export default {
  name: 'settings-settlement-history',
  data () {
    return {
      storeList: [],
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterStatus,
      filterColor,
      settlementStatus,
      settlementOrigin,
      filterForm:{
        //asc (boolean, optional),
        storeId: null,
        end: null,
        liquidationDate: null,
        merchantN: null,
        start: null
      }
    }
  },
  components: {
    gtPagination, gtTimeRange
  },

  async created() {
    //获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    // 获取结算列表
    if(this.isAuth('company:fuiouAccountStatement:sumList')){
      this.getDataList()
    }
  },
  methods: {
    //获取门店列表
    async getStorelist(){
      this.dataListLoading =true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code == 0){
        this.storeList = data.data
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getSettlementStoreHistoryList({
        ...this.filterForm,
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
    // 导出结算中心列表
    async exportExcel() {
      const { data, headers } = await storeexportExcel({
        ...this.filterForm,
        size: 10000,
        page: 0
      })
      fileDownload(data, '结算中心.xls')
    },
    // 查看
    storeViewHandle (query){
      this.$router.push({name: 'settlement-order-store', query})
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
        this.filterForm.storeId = null
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

