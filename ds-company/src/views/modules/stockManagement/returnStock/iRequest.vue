<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="returnStock" :inline="true" ref='returnStock' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
         <el-form-item label="退货单号" prop='orderNo'>
          <el-input v-model="returnStock.orderNo" placeholder="请输入订货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select
            v-model="returnStock.supplierId"
            placeholder="请选择" clearable
            filterable
            :remote-method="getSupplierlist"
            @change="getContact"
            >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货时间">
          <gt-time-range
            start-time-prop="beginReturnTime"
            :start-time-value="returnStock.beginReturnTime"
            :end-time-value="returnStock.endReturnTime"
            end-time-prop="endReturnTime"
            @changeStartValue="value => returnStock.beginReturnTime = value"
            @changeEndValue="value => returnStock.endReturnTime = value"
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
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="returnStockView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
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
          label="商品数量"
          v-if="newStore == 'false'">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, returnStatus))">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkOrderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="关联单号">
        </el-table-column>
        <el-table-column
          prop="supplier"
          min-width="150"
          :show-overflow-tooltip="true"
          label="供应商">
        </el-table-column>
        <!-- <el-table-column
          prop="linkman"
          min-width="150"
          :show-overflow-tooltip="true"
          label="联系人">
          <template slot-scope="scope">
            <span>{{`${scope.row.linkman || '--'}/${scope.row.phone || '--'}`}}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-approval-stock v-if="returnStockViewVisible" ref="returnStockView" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import gtApprovalStock from '../component/returnStockView'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { returnStatus } from '@/utils/dict'
import { getShoppingSupplierList ,exportiRequestExcel} from '@/service/stock'
import { getStore } from '@/utils/storage'
export default {
  name: 'stockManagement-returnStockList',
  components: {
    gtPagination,
    gtTimeRange,
    gtApprovalStock,
  },
  data(){
    return{
      returnStockViewVisible: false,
      returnStatus,
      filterStatus,
      filterColor,
      dataList: [],
      supplierList:[],
      dataListLoading: false,
      supplierLoading:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      returnStock:{
        orderNo: null,
        supplierId: null,
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
    this.returnStock.status = status
    // 获取供应商下拉列表
    this.getSupplierlist()
    if(this.isAuth('company:reqStock:list')){
      this.getDataList()
    }
  },
  methods:{
    // 获取供应商下拉列表
    async getSupplierlist(key){
      this.supplierLoading = true
      const { data } = await getShoppingSupplierList()
      if(data && data.code ==0){
        this.supplierList = data.data
      }else{
        this.supplierList =[]
      }
      this.supplierLoading = false
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReturnStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.returnStock
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
      const { data, headers } = await api.exportiRequestExcel({
        ...this.returnStock,
        size: 10000,
        page: 0
      })
      fileDownload(data, '退货清单.xls')
    },

    // 查看
    returnStockView(row){
      this.returnStockViewVisible = true
      this.$nextTick(() => {
        this.$refs.returnStockView.init(row)
      })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    getContact(val) {
      const supplier = this.supplierList.find(ele => ele.id === val)
      if (supplier) {
        this.goodsAdd.bossName = supplier.bossName
        this.goodsAdd.bossPhone = supplier.bossPhone
      }
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['returnStock'].resetFields()
        this.returnStock.status = ''
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

