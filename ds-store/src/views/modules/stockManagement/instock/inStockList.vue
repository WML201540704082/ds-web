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
        <!-- <el-form-item label="结算状态" prop='settlement'>
          <el-select v-model="warehouse.settlement" placeholder="请选择结算状态" clearable>
            <el-option
              v-for="item in setStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
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
        <el-form-item label="出库单位" prop='outName'>
          <el-input v-model="warehouse.outName" placeholder="请输出库单位" clearable></el-input>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:inStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <!-- <gt-border-button v-show="storeRoleName === '店长'" type="export" class="gt-table-create" txt="结算" @click.native="() => settlement()"/> -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <!-- <el-table-column
          type="selection"
          header-align="center"
          :selectable="(row, index) => {
            return row.settlement !== 'FINISH' && row.status === 'FINISH'
          }"
          align="center"
          width="50">
        </el-table-column> -->
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="135"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="StockViewHandle(scope.row.id, 'view')">查看</el-button>
            <span v-if="scope.row.status !== 'FINISH'">|</span>
            <el-button v-if="scope.row.status === 'TAKE_PENDING'" class="nopadding" type="text" size="small" @click="sureReceive(scope.row.id)">确认收货</el-button>
            <span v-if="scope.row.status === 'PENDING'">
              <el-popover
                class="popover"
                placement="bottom"
                width="100">
                <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
                <div class="buttonOne" @click="StockViewHandle(scope.row.id, 'in')" style="border-top: 0">入库</div>
                <div class="buttonOne" @click="StockEditHandle(scope.row.id)" >编辑</div>
                <div class="buttonOne" @click="deleteStock(scope.row.id)" style="margin-bottom: 0">删除</div>
              </el-popover>
            </span>
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
          v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">
        </el-table-column>
        <el-table-column
          prop="linkOrderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="关联单号">
        </el-table-column>
        <el-table-column
          prop="outName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="出库单位">
        </el-table-column>
        <!-- <el-table-column
          prop="settlement"
          min-width="100"
          :show-overflow-tooltip="true"
          label="结算状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.settlement, setStatus)}}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
    <gt-instock v-if="stockviewVisible" ref="stockview" @refreshDataList="getDataList"/>
    <gt-settlement v-if="settlementVisible" ref="settlement" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import gtInstock from './instockView'
import gtSettlement from '../component/settlement'
import { inStockstatus,setStatus,inStockType } from '@/utils/dict'
import { filterStatus, fileDownload } from '@/utils'
import _ from 'lodash'
export default {
  name:'stockManagement-warehousingList',
  components: {
    gtPagination, gtTimeRange, gtInstock, gtSettlement
  },
  data(){
    return{
      dataListSelections:[],
      stockviewVisible: false,
      settlementVisible:false,
      dataList: [],
      dataListLoading: false,
      receiveLoading:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      inStockstatus,
      inStockType,
      setStatus,
      filterStatus,
      warehouse:{
        settlement: null,
        orderNo:null,
        linkOrderNo:null,
        outName:null,
        status: '',
        type:'',
        beginInStockTime: null,
        endInStockTime: null,
      }
    }
  },

  created(){
    const { storeRoleName = '',storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.storeType = storeType
    if(this.isAuth('company:inStock:list')){
      this.getDataList()
    }
  },
  inject: ['exportList'],
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getinStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.warehouse
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }

    },
    // 确认收货
    sureReceive(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '您是否确认收货',
        confirm: async () => {
          const { data } = await api.sureReceive(id)
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
      this.$router.push({name:'stockManagement-instock-interStockAdd',query:{id:id}})
    },

    // 导出入库清单
    async exportExcel() {
      const criteria = {
        ...this.warehouse,
        status:this.warehouse.status ? this.warehouse.status : null,
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
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['warehouse'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
