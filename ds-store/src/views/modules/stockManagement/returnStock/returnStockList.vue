<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="returnStock" :inline="true" ref='returnStock' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
         <el-form-item label="退货单号" prop='orderNo'>
          <el-input v-model="returnStock.orderNo" placeholder="请输入退货单号" clearable></el-input>
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
        <el-form-item label="单据状态" prop='status'>
          <el-select v-model="returnStock.status" placeholder="请选择单据状态" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in returnStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联单号" prop='inStockOrderNo'>
          <el-input v-model="returnStock.inStockOrderNo" placeholder="请输入原入库单号" clearable></el-input>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
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
          min-width="80"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="90"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="returnStockView(scope.row,'view')">查看</el-button>
            <span v-if="scope.row.status === 'CHECK_PENDING' || scope.row.status === 'CHECK_FINISH'">|</span>
            <el-button v-if="scope.row.status === 'CHECK_FINISH'" class="nopadding" type="text" size="small" @click="returnStockView(scope.row,'confirm')">去退货</el-button>
            <!-- <el-button v-if="scope.row.status === 'CHECK_PENDING'" class="nopadding" type="text" size="small" @click="editReturnStock(scope.row.id)" >编辑</el-button>
            <span v-if="scope.row.status === 'CHECK_PENDING'">|</span>
            <el-button v-if="scope.row.status === 'CHECK_PENDING'" class="nopadding" type="text" size="small" @click="deleteReturnStock(scope.row.id)">删除</el-button> -->
            <span v-if="scope.row.status === 'CHECK_PENDING'">
              <el-popover
                class="popover"
                placement="bottom"
                width="100">
                <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
                <div class="buttonOne" v-if="scope.row.status === 'CHECK_PENDING'" @click="editReturnStock(scope.row.id)" >编辑</div>
                <div class="buttonOne" v-if="scope.row.status === 'CHECK_PENDING'" @click="deleteReturnStock(scope.row.id)" style="margin-bottom: 0">删除</div>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnTime"
          min-width="160"
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
          label="退货数量"
          v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, returnStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inStockOrderNo"
          min-width="100"
          :show-overflow-tooltip="true"
          label="关联单号">
        </el-table-column>
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
import gtApprovalStock from './returnStockView'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { returnStatus } from '@/utils/dict'
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
        beginReturnTime: null,
        endReturnTime: null,
        status: null,
        inStockOrderNo:null,
      }
    }
  },
  created(){
    //获取companyId and storeId
    const { companyId = '', storeId = '', storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.companyId = companyId
    this.storeId = storeId
    this.storeType = storeType

    const { status } = this.$route.params
    this.returnStock.status = status
    this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReturnStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.returnStock,
        companyId: this.companyId,
        storeId: this.storeId
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    //导出退货清单
    async exportExcel() {
      const { data, headers } = await api.exportreturnStockExcel({
        ...this.returnStock,
        size: 10000,
        page: 0
      })
      fileDownload(data, '调整清单.xls')
    },

    // 查看or去退货
    returnStockView(row,type){
      this.returnStockViewVisible = true
      this.$nextTick(() => {
        this.$refs.returnStockView.init(row,type)
      })
    },
    // 编辑
    editReturnStock(id) {
      this.$router.push({name:'stockManagement-returnStock-returnStockAdd',query:{id:id}})
    },
    //删除
    deleteReturnStock(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await api.deleteReturnStock(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
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