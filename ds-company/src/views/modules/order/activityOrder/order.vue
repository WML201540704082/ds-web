
<template>
  <div class="mod-store customers">
    <el-card>
      <gt-advance ref="advance" :orderName="'activity'" @refreshSearch="getList"/>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportBrandExcel()"/>
      <span style="padding-bottom: 10px;padding-right: 10px;float:right">总成交额：{{totalAmount || 0}}</span>
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
            <span v-if="scope.row.orderStatus === 2">|</span>
            <el-button v-if="scope.row.orderStatus === 2" class="nopadding" type="text" size="small" @click="pickup(scope.row.id)">提货</el-button>
            <span v-if="scope.row.orderStatus === 2">|</span>
            <el-button v-if="scope.row.orderStatus === 2" class="nopadding" type="text" size="small" @click="refund(scope.row.id)">退款</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          :show-overflow-tooltip="true"
          min-width="180"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="distributionActivityTitle"
          min-width="100"
          :show-overflow-tooltip="true"
          label="所属活动">
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应收金额">
        </el-table-column>
        <el-table-column
          prop="actualPaymentAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付金额">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          min-width="160"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span v-if="scope.row.contactPhone">{{scope.row.memberName || '--'}}/{{scope.row.contactPhone}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderStatus, activityStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>


    <inventory-view v-if="viewVisible" ref='inventoryView' @refreshData="getDataList" />
  </div>
</template>

<script>
import inventoryView from '../components/order-refundReview'
import gtPagination from '@/components/gt-pagination'
import gtAdvance from '../components/orderAdvance'
import { activityStatus } from '@/utils/dict'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import * as api from '@/service/order'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name: 'order-activityOrder-order',
  data () {
    return {
      viewVisible: false,
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
        createDateEnd: null,
        createDateStart: null,
        currentPage: 0,
        distributionActivityId: null,
        memberPhone: null,
        orderNo: null,
        orderStatus: null,
        pageSize: 20,
        storeIdList: []
      },
      activityStatus,
      totalAmount: 0
    }
  },
  components: {
    gtPagination, gtAdvance,inventoryView
  },
  created () {

  },

  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'activityOrder-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 总成交额
    async getTotalAmount(){
      const { data } =  await api.getTotalAmount({
        ...this.order
      })
      if (data && data.code === 0) {
        this.totalAmount = data.data
      } else {
        this.totalAmount = 0
      }
    },
    // 导出订单列表
    async exportBrandExcel() {
      const { data, headers } = await api.exportBrandExcel({
        ...this.order
      })
      fileDownload(data, '品牌方活动订单列表.xls')
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getDmpOrderList({
        // pageSize: this.pageSize,
        // currentPage: this.currentPage,
        ...this.order
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        if(data.data){
          this.dataList = data.data.records
          this.total = data.data.total
        }else{
          this.dataList = []
          this.total = 0
        }

      } else {
        this.dataList = []
        this.total = 0
      }
    },
    //提货
    pickup(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定要进行提货操作吗？',
        confirm: async () => {
          const { data } = await api.getGtExtract({
            orderId: id
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('提货成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 退款
    refund(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定要进行退款操作吗？',
        confirm: async () => {
          const { data } = await api.getGtAudit({
            auditStatus: 1,
            auditUserId: getStore({name:'commenInfo'})&&getStore({name:'commenInfo'}).userName || null,
            auditUserName: getStore({name:'commenInfo'})&&getStore({name:'commenInfo'}).userName || null,
            orderId: id
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('退款成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'activityOrder-view',query:{id}})
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
      this.getTotalAmount()
    },
    // 重置
    getList(obj) {
      this.order = obj.order
      if (obj.type==='reset') {
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
      this.getTotalAmount()
    },
  }
}
</script>
