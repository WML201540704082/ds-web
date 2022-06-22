<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="出库单号" prop="orderNo" >
          <el-input v-model="filterForm.orderNo" placeholder="请输入出库单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联单号" prop="linkOrderNo" >
          <el-input v-model="filterForm.linkOrderNo" placeholder="请输入关联单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="收货单位" prop="storeId">
          <el-select v-model="filterForm.storeId" @change="getStoreName" placeholder="请选择收货单位" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in outGoingType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间">
          <gt-time-range
            start-time-prop="beginOutStockTime"
            :start-time-value="filterForm.beginOutStockTime"
            :end-time-value="filterForm.endOutStockTime"
            end-time-prop="endOutStockTime"
            @changeStartValue="value => filterForm.beginOutStockTime = value"
            @changeEndValue="value => filterForm.endOutStockTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" >
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
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="140"
          label="操作"
          v-if="isAuth('company:outStock:list')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewHandle(scope.row.id, scope.row.batchNumber,'view')">查看</el-button>
            <span v-if="scope.row.status === 'OUT_PENDING'">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100" v-if="scope.row.status === 'OUT_PENDING'">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div v-if="scope.row.status === 'OUT_PENDING' && scope.row.outType === 'ALLOT' && !scope.row.linkId" class="buttonOne buttonOne1" @click="edit(scope.row.id)" >编辑</div>
              <div class="buttonOne" type="text" size="small" @click="viewHandle(scope.row.id, scope.row.batchNumber,'out')">出库</div>
              <div v-if="scope.row.status === 'OUT_PENDING' && scope.row.outType === 'ALLOT' && !scope.row.linkId" class="buttonOne" style="margin-bottom: 0"  @click="deleteStock(scope.row.id)">删除</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="outStockTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="出库时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="出库单号">
        </el-table-column>
        <el-table-column
          prop="outType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="出库类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.outType, outType1)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="出库状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, outGoingType))">{{filterStatus(scope.row.status, outGoingType)}}</span>
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
          min-width="100"
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
          prop="targetStoreName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="收货单位">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.outType !== 'REFUND'">{{scope.row.targetStoreName || '--'}}</span>
            <span v-else>企业总部</span> -->
            <span>{{ scope.row.outType === "ALLOT" ? scope.row.targetStoreName :
                     scope.row.outType === "REFUND" ? '企业总部' : '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <outgoing-view v-if="viewVisible" ref="outgoingView" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { outGoingType,outType1 } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { getStoreList } from '@/service/systore'
import { getOutgoingList, auditOutgoing, deleteOutStock, exportOutgoingExcel } from '@/service/stock'
import gtTimeRange from '@/components/gt-time-range'
import outgoingView from './outgoingView'
export default {
  name: 'stockManagement-outstock-outgoingList',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      viewVisible: true,
      logisticsVisible: true,
      outGoingType,
      outType1,
      filterStatus,
      filterColor,
      filterForm:{
        orderNo: null,
        relevanceNo:null,
        storeId: '',
        status: '',
        beginOutStockTime: null,
        endOutStockTime: null
      },
      storeList: []
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    outgoingView,
  },

  async created() {
    // 获取出库列表
    if(this.isAuth('company:outStock:list')){
      this.getDataList()
    }
    // 获取所属门店
    if(this.isAuth('stock:company:company:select')){
      this.getStores()
    }
    // 过滤门店
    const { storeId = '',storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.myStoreId = storeId
    this.storeType = storeType
  },
  inject: ['exportList'],
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getOutgoingList({
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
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data.filter(store => this.myStoreId !== store.id)
      } else {
        this.$message.error(data.msg)
      }
    },
    //获取门店名称
    getStoreName(val) {
      const sname = this.storeList.find(ele => ele.id === val)
      if (sname) {
        this.filterForm.targetStoreId = sname.id
        this.filterForm.targetStoreName = sname.name
      }
    },
    // 导出出库清单
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        status: this.filterForm.status === '' ? null : this.filterForm.status,
      }
      // this.exportList(this.total, '出库清单', 'OUT_STOCK_ORDER', criteria, async () => {
        const { data, headers } = await exportOutgoingExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '出库清单.xls')
      // })
    },
    // 查看/出库
    viewHandle (id, batchNumber,flag){
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.outgoingView.init(id, batchNumber,flag)
      })
    },
    // 编辑
    edit(id) {
      this.$router.push({name:'stockManagement-outstock-outStockAdd', query: {id}})
    },
    // 删除
    deleteStock(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await deleteOutStock(id)
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
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
        this.filterForm.targetStoreId = null
        this.filterForm.targetStoreName = null
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

