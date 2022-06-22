<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'countcard'" @refreshSearch="getList"/>
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
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单来源">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, orderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, paymentOfMode)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statCardName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="礼品卡名称">
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应收金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.orderAmount))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payableAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实收金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.payableAmount))}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="paidAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实收金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.paidAmount))}}</span>
          </template>
        </el-table-column> -->
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
          label="订单积分">
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
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="下单时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stage"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{scope.row.stage || '已完成'}}</span>
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
import { paymentOfMode, orderType, countcardOrder } from '@/utils/dict'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import * as api from '@/service/order'
import moment from 'moment'
export default {
  name:'order-countcardOrder-order',
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
        // refund: '',
        payType: '',
        id:null,
        startTime:null,
        endTime:null
      },
      paymentOfMode,
      orderType,
      countcardOrder
    }
  },
  components: {
    gtPagination, gtAdvance
  },
  created () {
    // 获取订单列表
    this.getDataList()
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'countcardOrder-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getstatOrderList({
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
      this.exportList(this.total, '礼品卡订单列表', 'STAT_ORDER', criteria, async () => {
        const { data, headers } = await api.statOrderexport({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '礼品卡订单列表.xls')
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'countcardOrder-view',query:{id}})
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

