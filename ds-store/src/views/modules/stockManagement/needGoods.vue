<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="requiredInvent" :inline="true" ref='requiredInvent' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="订货单号" prop='orderNo'>
          <el-input v-model="requiredInvent.orderNo" placeholder="请输入订货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订货对象" prop="targetStoreId">
          <el-select
            v-model="requiredInvent.targetStoreId"
            placeholder="请选择" clearable
            filterable>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="requiredInvent.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in requestStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订货时间">
          <gt-time-range
            start-time-prop="beginCreateTime"
            :start-time-value="requiredInvent.beginCreateTime"
            :end-time-value="requiredInvent.endCreateTime"
            end-time-prop="endCreateTime"
            @changeStartValue="value => requiredInvent.beginCreateTime = value"
            @changeEndValue="value => requiredInvent.endCreateTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('store:reqStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
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
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="StockViewHandle(scope.row.id)">查看</el-button>
            <span v-if="scope.row.status === 'TAKE_PENDING' ||  scope.row.status === 'REJECT'">|</span>
            <el-button v-if="scope.row.status === 'REJECT' && scope.row.stockReqTypeEnum !='COMPANY_STORE'" class="nopadding" type="text" size="small" @click="updateHandle(scope.row.id)">编辑</el-button>
            <span v-if="scope.row.status === 'CHECK_PENDING'&& scope.row.stockReqTypeEnum !='COMPANY_STORE'">|</span>
            <el-button v-if="scope.row.status === 'CHECK_PENDING'&& scope.row.stockReqTypeEnum !='COMPANY_STORE'" class="nopadding" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            <span v-if="scope.row.status == 'STORE_PENDING'">|</span>
            <el-button v-if="scope.row.status == 'STORE_PENDING'" class="nopadding" type="text" size="small" @click="confirmView(scope.row.id)">去确认</el-button>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
              v-if="scope.row.status === 'TAKE_PENDING'">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <!-- <div class="buttonOne"  @click="updateHandle(scope.row.id)">编辑</div> -->
              <!-- <div class="buttonOne" v-if="isAuth('store:reqStock:list') && (scope.row.status == 'TAKE_PENDING' || scope.row.status == 'FINISH')" @click="LogisticalHandle(scope.row.logisticsCompany,scope.row.logisticsNumber)" >物流</div> -->
              <div class="buttonOne" @click="surefinish(scope.row.id)" style="margin-bottom: 0">确认收货</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订货时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订货单号">
        </el-table-column>
        <el-table-column
          prop="targetStoreName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订货对象">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="species"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货种类">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货数量"
          v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, requestStatus))">{{filterStatus(scope.row.status, requestStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
    <gt-approval-stock v-if="approvalviewVisible" ref="approvalview" @refreshDataList="getDataList"/>
    <gt-confirm-stock v-if="approvalviewVisible" ref="confirmview" @refreshDataList="getDataList"/>
    <gt-logistics-info v-if="logisticsviewVisible" ref="logisticsview" @refreshData="getDataList"/>
  </div>
</template>

<script>
import { getStoreList } from '@/service/systore'
import { requestStatus } from '@/utils/dict'
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import gtApprovalStock from './component/approvalView'
import gtLogisticsInfo from './component/logistics'
import { filterStatus,filterColor, fileDownload } from '@/utils'
import gtConfirmStock from './component/storeConfirm'
export default {
  name: 'stockManagement-requiredInventory-needGoods',
  components: {
    gtPagination, gtTimeRange, gtApprovalStock, gtLogisticsInfo,gtConfirmStock
  },
  data(){
    return{
      approvalviewVisible: false,
      logisticsviewVisible: false,
      requestStatus,
      filterStatus,
      filterColor,
      dataList: [],
      storeList:[],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      requiredInvent:{
        orderNo: null,
        beginCreateTime: null,
        endCreateTime: null,
        status: null
      }
    }
  },
  created(){
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    if(this.isAuth('store:reqStock:list')){
      this.getDataList()
    }
    // 过滤门店
    const { storeId = '', storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.myStoreId = storeId
    this.storeType = storeType
  },
  methods:{
    //确认
    confirmView(id){
      this.approvalviewVisible = true
      this.$nextTick(() => {
        this.$refs.confirmview.init(id)
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReqStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.requiredInvent
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
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        this.storeList = data.data.filter(store => this.myStoreId !== store.id)
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    // 物流
    LogisticalHandle(logisticsCompany,logisticsNumber){
      this.logisticsviewVisible = true
      this.$nextTick(() => {
        this.$refs.logisticsview.init(logisticsCompany,logisticsNumber)
      })
    },
    // 导出订货管理清单
    async exportExcel() {
      const { data, headers } = await api.exportRequiredExcel({
        ...this.requiredInvent,
        size: 10000,
        page: 0
      })
      fileDownload(data, '订货清单.xls')
    },
    // 确认收货
    surefinish(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定确认收货',
        confirm: async () => {
          const { data } = await api.confirmReqStock(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('确认收货成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 查看
    StockViewHandle(id){
      this.approvalviewVisible = true
      this.$nextTick(() => {
        this.$refs.approvalview.init(id)
      })
    },
    // 编辑
    updateHandle(id){
      this.$router.push({name:'stockManagement-requiredAdd',query:{id:id}})
    },

    //删除
    deleteHandle(id){
       this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该订货单吗？',
        confirm: async () => {
          const { data } = await api.deletereqStock(id)
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
        this.$refs['requiredInvent'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

