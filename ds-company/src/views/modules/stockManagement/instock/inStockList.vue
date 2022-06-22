<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="warehouse" :inline="true" ref='warehouse' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="入库单号" prop='orderNo'>
          <el-input v-model="warehouse.orderNo" placeholder="请输入入库单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="入库状态" prop='status'>
          <el-select v-model="warehouse.status" placeholder="请选择入库状态" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in inStockstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库类型" prop='type'>
          <el-select v-model="warehouse.type" placeholder="请选择入库类型" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in inStockType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态" prop='settlement'>
          <el-select v-model="warehouse.settlement" placeholder="请选择结算状态" clearable>
            <el-option
              v-for="item in setStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间">
          <gt-time-range
            start-time-prop="beginInStockTime"
            :start-time-value="warehouse.beginInStockTime"
            :end-time-value="warehouse.endInStockTime"
            end-time-prop="endInStockTime"
            @changeStartValue="value => warehouse.beginInStockTime = value"
            @changeEndValue="value => warehouse.endInStockTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="关联单号" prop='linkOrderNo'>
          <el-input v-model="warehouse.linkOrderNo" placeholder="请输入入库单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="出库单位/供应商" prop='outUnitName' label-width="115px">
          <el-input v-model="warehouse.outUnitName" placeholder="出库单位/供应商" clearable></el-input>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:inStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')" type="export" class="gt-table-create" txt="结算" @click.native="() => settlement()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        @row-dblclick="doubleClick"
        ref="goodsTableList"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          :selectable="(row, index) => {
            return row.settlement !== 'FINISH' && row.status === 'FINISH'
          }"
          align="center"
          width="50">
        </el-table-column>
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
            <el-button class="nopadding" type="text" size="small" @click="StockViewHandle(scope.row.id, 'view')">查看</el-button>
            <span v-if="!(scope.row.status == 'REFUNDED' && scope.row.settlement == 'NOT') && !scope.row.storeReturnStockId && scope.row.type !== 'REFUND'">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100" v-if="!(scope.row.status == 'REFUNDED' && scope.row.settlement == 'NOT') && !scope.row.storeReturnStockId && scope.row.type !== 'REFUND'">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div v-if="scope.row.status == 'PENDING'" class="buttonOne" type="text" size="small" @click="StockViewHandle(scope.row.id, 'in')">入库</div>
              <div v-if="scope.row.status == 'PENDING'" class="buttonOne" @click="StockEditHandle(scope.row.id)" type="text" size="small">编辑</div>
              <div v-if="scope.row.status == 'PENDING'" class="buttonOne" @click="deleteStock(scope.row.id)" style="margin-bottom: 0">删除</div>
              <div v-if="isAuthMenu('stock_return') && scope.row.status == 'FINISH' && !scope.row.storeReturnStockId && scope.row.type !== 'REFUND'" class="buttonOne"  @click="returnStock(scope.row.id)" type="text" size="small">退货</div>
              <div v-if="scope.row.settlement !== 'NOT'" class="buttonOne" @click="settlementHistory(scope.row)" type="text" size="small">结算历史</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="inStockTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="入库时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="入库单号">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="入库类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type,inStockType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inStockUser"
          min-width="180"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="入库状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, inStockstatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="species"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品种类">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品数量"
          v-if="newStore == 'false'">
        </el-table-column>
        <el-table-column
          prop="settlement"
          min-width="100"
          :show-overflow-tooltip="true"
          label="结算状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.settlement, setStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkOrderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="关联单号">
        </el-table-column>
        <el-table-column
          prop="outUnitName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="出库单位">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
    <gt-instock v-if="stockviewVisible" ref="stockview" @refreshDataList="getDataList"/>
    <gt-settlement v-if="settlementVisible" ref="settlement" @refreshDataList="getDataList"/>
    <gt-settlementHistory v-if="settlementHistoryVisible" ref="settlementHistory" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import gtInstock from './instockView'
import gtSettlement from '../component/settlement'
import gtSettlementHistory from '../component/settlementHistory'
import { inStockstatus,setStatus,inStockType } from '@/utils/dict'
import { filterStatus, fileDownload } from '@/utils'
import { getShoppingSupplierList } from '@/service/stock'
import { getStore } from '@/utils/storage'
import _ from 'lodash'
export default {
  name: 'stockManagement-warehousingList',
  components: {
    gtPagination, gtTimeRange, gtInstock, gtSettlement,gtSettlementHistory
  },
  data(){
    return{
      dataListSelections:[],
      stockviewVisible: false,
      settlementVisible:false,
      settlementHistoryVisible:false,
      dataList: [],
      supplierList:[],
      dataListLoading: false,
      supplierLoading:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      inStockstatus,
      inStockType,
      setStatus,
      filterStatus,
      changePage: false,
      quoteInStock:true,
      warehouse:{
        settlement: null,
        orderNo:null,
        purchaseOrderNo:null,
        linkOrderNo:null,
        outUnitName:null,
        status: '',
        type:'',
        supplierId:null,
        beginInStockTime: null,
        endInStockTime: null,
      }
    }
  },
  created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取companyId和门店茶饮类型
    const { companyId = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    this.newStore = newStore
    // 获取数据列表
    this.getDataList()
  },
  inject: ['exportList'],
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getinStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.warehouse,
        // quoteInStock : this.quoteInStock,
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
        this.$nextTick(() => {
          if (this.dataListSelections && this.dataListSelections.length > 0) {
            this.dataListSelections.forEach(row => {
              const currentRow = this.dataList.find(item => (item.id == row.id))
              if (currentRow) {
                this.$refs.goodsTableList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }

    },
    //双击填入
    doubleClick(row){
      if (!(row.settlement !== 'FINISH' && row.status === 'FINISH')) {
        return
      }
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 多选
    selectionChangeHandle (pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.dataListSelections).filter(item => {
          return !this.dataList.some(ele => (ele.id == item.id))
        })
        const select = newList.concat(pushList)
        this.dataListSelections = select
      }
    },
    //结算
    settlement(){
      if (this.dataListSelections.length == 0) {
        this.$message.warning('请先选择结算选项')
      } else {
        this.settlementVisible = true
        this.$nextTick(() => {
          this.$refs.settlement.init(this.dataListSelections)
        })
      }
    },
    // 查看 or 入库
    StockViewHandle(id ,type){
      this.stockviewVisible = true
      this.$nextTick(() => {
        this.$refs.stockview.init(id, type)
      })
    },
    //退货
    returnStock(id){
      this.$router.push({name:'stockManagement-returnStock-newReturnStock',query:{returnId:id}})
    },
    //结算历史
    settlementHistory(row){
      this.settlementHistoryVisible = true
      this.$nextTick(() => {
        this.$refs.settlementHistory.init(row)
      })
    },
    // 删除
    deleteStock(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await api.deleteinStock(id)
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
    // 编辑
    StockEditHandle(id) {
      this.$router.push({name:'stockManagement-instock-inStockAdd',query:{id:id}})
    },

    // 导出入库清单
    async exportExcel() {
      const criteria = {
        ...this.warehouse,
        status: this.warehouse.status ? this.warehouse.status : null,
        type: this.warehouse.type ? this.warehouse.type : null,
      }
      // this.exportList(this.total, '入库清单', 'IN_STOCK_ORDER', criteria, async () => {
        const { data, headers } = await api.exportWarehouseExcel({
          ...criteria,
          size: 10000,
          page: 0,
        })
        fileDownload(data, '入库清单.xls')
      // })
    },

    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['warehouse'].resetFields()
        this.pageSize = 20
      }
      this.changePage = true
      this.dataListSelections = []
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

