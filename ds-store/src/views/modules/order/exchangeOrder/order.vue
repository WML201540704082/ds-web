<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'exchange'" @refreshSearch="getList"/>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <!-- <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/> -->
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
          prop="orderSource"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单来源">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderSource, orderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="exchangeType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="兑换方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.exchangeType, exchangeType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productTotalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应收金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.productTotalAmount))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="integralTotalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="使用积分">
        </el-table-column>
        <el-table-column
          prop="customerPhone"
          min-width="160"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span>{{scope.row.customerName || '--'}}/{{scope.row.customerPhone}}</span>
          </template>
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
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="下单时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.orderStatus, exchangeStatus))">{{filterStatus(scope.row.orderStatus, exchangeStatus)}}</span>
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
import { orderType, exchangeStatus,exchangeType } from '@/utils/dict'
import { filterStatus, filterColor, number } from '@/utils'
import * as api from '@/service/order'
import moment from 'moment'
export default {
  name:'order-exchangeOrder-order',
  data () {
    return {
      filterStatus,
      filterColor,
      exchangeType,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      order:{
        customerPhone:'',
        orderSource:'',
        orderStatus:'',
        exchangeType:'',
        id:null,
        startTime:null,
        endTime:null
      },
      orderType,
      exchangeStatus
    }
  },
  components: {
    gtPagination, gtAdvance
  },
  created () {
    // 获取订单列表
    this.getDataList()
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'exchangeOrder-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getintegralOrderList({
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

    // 查看
    storeViewHandle (id){
      this.$router.push({name:'exchangeOrder-view',query:{id}})
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
