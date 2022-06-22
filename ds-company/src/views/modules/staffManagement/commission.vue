<template>
  <div class="mod-store page-staff-commissions">
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <div class="info">
        <span>员工：{{staff.name || '--'}}/{{staff.phone || '--'}}</span>
        <span>工作月：{{staff.workMonth}}</span>
      </div>
      <el-radio-group v-model="classification" @change="change_classification">
        <el-radio-button label="performance">业绩提成基数</el-radio-button>
        <el-radio-button label="commission">新客提成</el-radio-button>
        <el-radio-button label="detail">佣金明细</el-radio-button>
      </el-radio-group>
      <!-- <gt-button type="export" @click.native="() => exportExcel()"/> -->
      <div class="total-container">
        <span v-show="classification === 'performance'">业绩提成基数总额: {{priceNum(staff.baseCommission)}} 元</span>
        <span v-show="classification === 'commission'">新客提成总额: {{priceNum(staff.newCustomerCommission)}} 元</span>
        <span v-show="classification === 'detail'">佣金明细总额: {{priceNum(staff.brokerage)}} 元</span>
      </div>
      <el-table
        :data="dataList1"
        border
        :stripe="true"
        style="width: 100%; margin-top: 20px;"
        v-show="classification == 'performance'"
        >
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          :show-overflow-tooltip="true"
          min-width="120"
          label="订单编号">
          <template slot-scope="scope">
            <span class="theme-color" style="cursor:pointer" @click="orderDetail(scope.row.orderId)">{{scope.row.orderId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="下单时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.orderDate ||  '').format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopOwnerGet"
          min-width="120"
          :show-overflow-tooltip="true"
          label="店长提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.shopOwnerGet)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shoppingGuideGet"
          min-width="120"
          :show-overflow-tooltip="true"
          label="导购员提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.shoppingGuideGet)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="attributionStaffGet"
          min-width="120"
          :show-overflow-tooltip="true"
          label="归属员工提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.attributionStaffGet)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="technicianGet"
          min-width="120"
          :show-overflow-tooltip="true"
          label="技师提成">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.technicianGet)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalGet"
          min-width="90"
          :show-overflow-tooltip="true"
          label="提成总额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.totalGet)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="dataList2"
        border
        :stripe="true"
        style="width: 100%; margin-top: 20px;"
        v-show="classification == 'commission'"
        >
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="提成时间">
          <!-- <template slot-scope="scope">
            <span>{{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="commissionAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="提成金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.commissionAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commissionSource"
          min-width="120"
          :show-overflow-tooltip="true"
          label="提成来源">
          <template slot-scope="scope">
            <span>{{scope.row.commissionSource === 'REGISTER' ? '新客注册':
                    scope.row.commissionSource === 'ORDER' ? '新客注册下单':'额外奖励'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerId"
          min-width="120"
          :show-overflow-tooltip="true"
          label="新客信息">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}/{{scope.row.customerPhone}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="dataList3"
        border
        :stripe="true"
        style="width: 100%; margin-top: 20px;"
        v-show="classification == 'detail'"
        >
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="下单时间">
          <!-- <template slot-scope="scope">
            <span>{{moment(scope.row.orderDate ||  '').format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="orderCode"
          :show-overflow-tooltip="true"
          min-width="120"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="commissionAmount"
          min-width="90"
          :show-overflow-tooltip="true"
          label="佣金金额">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.commissionAmount)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { exportCommissionList, getCommissionList,getNewStaffCommission,getEmployeeCommission } from '@/service/staffManagement'
import { getOrderList } from '@/service/order'
import moment from 'moment'
import { number } from '@/utils/validate'
import { fileDownload } from '@/utils'
export default {
  name: 'staff-commission',
  data () {
    return {
      classification:'performance',
      dataList1: [], // 业绩提成基数
      dataList2: [], // 新客提成
      dataList3: [], // 佣金明细
      number,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      staff:{
        name: null,
        phone: null,
        id: null,
        workMonth: null,
        baseCommission: null,
        newCustomerCommission: null,
        brokerage: null
      },
    }
  },
  created () {
    // 获取订单列表
    const {name, phone, employeeId, workMonth, baseCommission, newCustomerCommission, brokerage} = this.$route.query
    this.staff = {
      name,
      phone,
      employeeId,
      workMonth,
      baseCommission,
      newCustomerCommission,
      brokerage
    }
    this.getDataList()
  },
  components: {
    gtPagination
  },
  methods: {
    async change_classification(val){
      this.currentPage = 0
      this.pageSize = 20

      if (val=='performance') {
        await this.getDataList()
      }else if (val=='commission') {
        await this.init()
      }else{
        await this.getCommissionDetail()
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCommissionList({
        employeeId: this.staff.employeeId,
        workMonth: this.staff.workMonth,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList1 = data.data.records
        this.total = data.data.total
      } else {
        this.dataList1 = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    async orderDetail(id){
      this.id = id
      const { data } = await getOrderList({
        size: 10,
        page: 0,
        id: this.id
      })
      if (data.code === 0 && data.data.records.length != 0) {
        this.$router.push({name:'order-view', query: {id}})
      } else {
        this.$router.push({name:'lpkOrder-view', query: {id}})
      }
    },
    //获取新客提成详情
    async init() {
      this.dataListLoading = true
      const { data } = await getNewStaffCommission({
        employeeId: this.staff.employeeId,
        nowDate: this.staff.workMonth,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList2 = data.data.records
        this.total = data.data.total
      } else {
        this.dataList2 = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //获取佣金明细详情
    async getCommissionDetail() {
      this.dataListLoading = true
      const { data } = await getEmployeeCommission({
        employeeId: this.staff.employeeId,
        nowDate: this.staff.workMonth,
        size: this.pageSize,
        page: this.currentPage,
      })
      if (data.code === 0) {
        this.dataList3 = data.data.records
        this.total = data.data.total
      } else {
        this.dataList3 = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 工作人员业绩导出
    async exportExcel() {
      const { data, headers } = await exportCommissionList({
        employeeId: this.staff.employeeId,
        workMonth: this.staff.workMonth,
        page: this.currentPage,
        size: this.pageSize
      })
      fileDownload(data, '员工提成.xls')
    },

    // 分页
    async pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      if (this.classification=='performance') {
        await this.getDataList()
      }else if (this.classification=='commission') {
        await this.init()
      }else{
        await this.getCommissionDetail()
      }
    },
    commissionDetail() {
      this.$router.push({name:'staff-commission'})
    },
  }
}
</script>
<style lang="scss" scoped>
.page-staff-commissions{
  .total-container{
    text-align: right;
    font-size: 16px;
    padding-right: 20px;
  }
  .info{
    margin-bottom: 20px;
    span{
      font-size: 14px;
    }
  }
}
</style>

