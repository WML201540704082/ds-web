<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'storedvalue'" @refreshSearch="getList"/>
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
          label="退款单号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="退单时间">
        </el-table-column>
        <el-table-column
          prop="customerPhone"
          min-width="160"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span v-if="scope.row.customerPhone">{{scope.row.customerName || '--'}}/{{scope.row.customerPhone}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退款项目">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.cardType, rechargeProject)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundTotal"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退款总额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.refundTotal))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实退金额">
          <template slot-scope="scope">
            <span>{{number(priceNum(scope.row.refundAmount))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="deductionIntegral"
          min-width="100"
          :show-overflow-tooltip="true"
          label="扣减积分">
          <template slot-scope="scope">
            <span>{{scope.row.deductionIntegral || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashierName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="收银员">
        </el-table-column>
        <el-table-column
          prop="guidName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="导购员">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,storevalueStatus)}}</span>
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
import { storevalueStatus,rechargeProject } from '@/utils/dict'
import { filterStatus,number, fileDownload } from '@/utils'
import * as api from '@/service/order'
import moment from 'moment'
export default {
  name: 'order-storedvalueCard-order',
  data () {
    return {
      viewVisible: false,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      order:{
        customerPhone: null,
        id:null,
        startTime:null,
        endTime:null
      },
      filterStatus,
      storevalueStatus,
      rechargeProject
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
      if(from.name !== 'storedvalueCard-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getRefundRechargeList({
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
      this.exportList(this.total, '储值卡退款单列表', 'CARD_REFUND_ORDER', this.order, async () => {
        const { data, headers } = await api.refundRechargeexport({
          ...this.order,
          size: 10000,
          page: 0
        })
        fileDownload(data, '储值卡退款单列表.xls')
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'storedvalueCard-view',query:{id}})
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
