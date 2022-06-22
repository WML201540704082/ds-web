<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="requestMe" :inline="true" ref='requestMe' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
         <el-form-item label="退货单号" prop='orderNo'>
          <el-input v-model="requestMe.orderNo" placeholder="请输入订货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="退货门店" prop="storeId">
          <el-select v-model="requestMe.storeId" placeholder="请选择退货门店" filterable clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货时间">
          <gt-time-range
            start-time-prop="beginReturnTime"
            :start-time-value="requestMe.beginReturnTime"
            :end-time-value="requestMe.endReturnTime"
            end-time-prop="endReturnTime"
            @changeStartValue="value => requestMe.beginReturnTime = value"
            @changeEndValue="value => requestMe.endReturnTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:reqStock:list')">
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
          min-width="112"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="requestMeViewOrReview(scope.row.id,'view')">查看</el-button>
            <span v-if="scope.row.status === 'CHECK_PENDING' || scope.row.status === 'TAKE_PENDING'">|</span>
            <el-button v-if="scope.row.status === 'CHECK_PENDING'" class="nopadding" type="text" size="small" @click="requestMeViewOrReview(scope.row.id,'review')">去审核</el-button>
            <el-button v-if="scope.row.status === 'TAKE_PENDING'" class="nopadding" type="text" size="small" @click="requestMeViewOrReview(scope.row.id,'confirm')">确认收货</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退货时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="退货单号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="退货门店">
        </el-table-column>
        <el-table-column
          prop="operatorId"
          min-width="150"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone  || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="species"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退货种类">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退货数量"
          v-if="newStore == 'false'">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, requestMeStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-request-me v-if="requestMeViewVisible" ref="requestMeView" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import { getStoreList } from '@/service/systore'
import gtRequestMe from './requestMeView'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { requestMeStatus } from '@/utils/dict'
import { getStore } from '@/utils/storage'
export default {
  name: 'stockManagement-returnStockList',
  components: {
    gtPagination,
    gtTimeRange,
    gtRequestMe,
  },
  data(){
    return{
      requestMeViewVisible: false,
      requestMeStatus,
      filterStatus,
      filterColor,
      dataList: [],
      storeList: [],
      dataListLoading: false,
      supplierLoading:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      requestMe:{
        orderNo: null,
        storeId:null,
        beginReturnTime: null,
        endReturnTime: null,
        status: null
      }
    }
  },
  created(){
    // 获取companyId和门店茶饮类型
    const { companyId = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    this.newStore = newStore

    const { status } = this.$route.params
    this.requestMe.status = status
    // 获取所属门店
    this.getStores()
    //获取列表
    this.getDataList()
  },
  methods:{
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStoreReturnList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.requestMe
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            amount:item.productType == 'BULK' ? item.amount/1000 : item.amount,//商品数量
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    // 导出退货清单
    async exportExcel() {
      const { data, headers } = await api.exportRequestExcel({
        ...this.requestMe,
        size: 10000,
        page: 0
      })
      fileDownload(data, '退货清单.xls')
    },

    // 查看or去审核
    requestMeViewOrReview(id,type){
      this.requestMeViewVisible = true
      this.$nextTick(() => {
        this.$refs.requestMeView.init(id,type)
      })
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
        this.$refs['requestMe'].resetFields()
        this.requestMe.status = ''
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

