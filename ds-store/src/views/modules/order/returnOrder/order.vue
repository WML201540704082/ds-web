<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'return'" :stage="order.stage" @refreshSearch="getList"/>
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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退货单号">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
          <template slot-scope="scope">
            <span style="color:#FC5A3D;text-decoration: underline;cursor: pointer;" @click="goOrder(scope.row.orderId)">{{scope.row.orderId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退款类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.returnType, returnType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退款渠道">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, orderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退款方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, returnMode)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应退金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.amount))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实退金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.amount))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer"
          min-width="160"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span v-if="scope.row.customer">{{scope.row.customer.name || '--'}}/{{scope.row.customer.phone}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          min-width="100"
          :show-overflow-tooltip="true"
          label="扣减积分">
        </el-table-column>
        <el-table-column
          prop="cashier"
          min-width="120"
          :show-overflow-tooltip="true"
          label="收银员">
          <template slot-scope="scope">
            <span>{{scope.row.cashier || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="guide"
          min-width="120"
          :show-overflow-tooltip="true"
          label="导购员">
          <template slot-scope="scope">
            <span>{{scope.row.guide || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="employee"
          min-width="120"
          :show-overflow-tooltip="true"
          label="归属员工">
          <template slot-scope="scope">
            <span>{{scope.row.employee || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="退单时间">
        </el-table-column>
        <!-- <el-table-column
          prop="stage"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退单状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.stage, returnOrder)}}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtAdvance from '../components/orderAdvance'
import { returnMode, orderType, returnOrder,returnType } from '@/utils/dict'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import * as api from '@/service/order'
import moment from 'moment'
export default {
  name:'order-returnOrder-order',
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
      order:{
        storeId: '',
        type: '',
        stage: '',
        payType: '',
        id:null,
        startTime:null,
        endTime:null
      },
      returnMode,
      orderType,
      returnOrder,
      returnType
    }
  },
  components: {
    gtPagination, gtAdvance
  },
  created () {
    const { stage } = this.$route.params
    this.order.stage = stage
    // 获取订单列表
    this.getDataList()
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'returnOrder-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 跳转相对应的订单
    goOrder(id){
      this.$router.push({name:'retailOrder-view',query:{id}})
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getreturnOrderList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.order
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
      }
    },

    // 导出订单列表
    async exportExcel() {
      const criteria = {
        ...this.order,
        storeId: this.order.storeId || null,
        payType: this.order.payType || null,
        type: this.order.type || null,
        stage: this.order.stage || null,
      }
      this.exportList(this.total, '退货单列表', 'RETURN_ORDER', criteria, async () => {
        const { data, headers } = await api.returnOrderexport({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '退货单列表.xls')
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'returnOrder-view',query:{id}})
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
