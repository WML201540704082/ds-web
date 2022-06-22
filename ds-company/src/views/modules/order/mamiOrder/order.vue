<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'mami'" @refreshSearch="getList"/>
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
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <!-- <span v-if="scope.row.orderStatus === 1">|</span> -->
            <!-- <el-button v-if="scope.row.orderStatus === 1" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">提货</el-button> -->
          </template>
        </el-table-column>
         <el-table-column
          prop="createDate"
          :show-overflow-tooltip="true"
          min-width="180"
          label="下单时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="mbgStoreName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="orderType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderType, mamiType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应收金额">
          <template slot-scope="scope">
            <span>{{number(scope.row.totalAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="actualPaymentAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付金额">
          <template slot-scope="scope">
            <span>{{number(scope.row.actualPaymentAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer"
          min-width="160"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span>{{scope.row.mbgCustomerName || '--'}}/{{scope.row.mbgCustomerPhone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.orderStatus, mamiOrderStatus))">{{filterStatus(scope.row.orderStatus, mamiOrderStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtAdvance from '../components/orderAdvance'
import { mamiType, mamiOrderStatus } from '@/utils/dict'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import * as api from '@/service/order'
import { getStore } from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'order-mamiOrder-order',
  data () {
    return {
      filterStatus,
      filterColor,
      companyId: null,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      order:{
        storeId: '',
        orderType: '',
        orderStatus: '',
        phone: '',
        id:null,
        startTime:null,
        endTime:null,
        productName:'',
      },
      mamiType,
      mamiOrderStatus
    }
  },
  components: {
    gtPagination, gtAdvance
  },
  created () {
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    // 获取订单列表
    this.getDataList()
  },

  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'mamiOrder-view'){
        vm.reload()
      }
    })
  },

  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getMamiOrderList({
        companyId: 2,
        mbgCompanyId: this.companyId,
        mbgStoreId: this.order.storeId,
        createDateBegin: this.order.startTime,
        createDateEnd: this.order.endTime,
        mbgCustomerPhone: this.order.phone,
        orderNo: this.order.id,
        orderStatus: this.order.orderStatus,
        orderType: this.order.orderType,
        productName: this.order.productName || null,
        pageSize: this.pageSize,
        currentPage: this.currentPage + 1,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data ? data.data.records : []
        this.total = data.data ? data.data.total : 0
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    // 导出订单列表
    async exportExcel() {
      const { data, headers } = await api.exportExcel({
        companyId:2,
        mbgCompanyId: this.companyId,
        createDateBegin: this.order.createDateStart || null,
        createDateEnd: this.order.createDateEnd || null,
        mbgCustomerPhone: this.order.phone || null,
        mbgStoreId: this.order.storeId || null,
        orderNo: this.order.orderNo || null,
        orderStatus :this.order.orderStatus || null,
        orderType: this.order.type || null,
        productName: this.order.productName || null,
        size: 10000,
        page: 0
      })
      fileDownload(data, '妈咪全知道订单列表.xls')
    },

    // 查看
    storeViewHandle (id){
      this.$router.push({name:'mamiOrder-view',query:{id}})
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    getList(obj) {
      this.order = obj.order
      if (obj.type==='reset') {
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
