<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="groupSales" :model="groupSales" @keyup.enter.native="resetForm('search')">
        <el-form-item label="销售单号" prop='orderNo'>
          <el-input v-model="groupSales.orderNo" placeholder="请输入销售单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <gt-time-range
            start-time-prop="orderTimeStart"
            :start-time-value="groupSales.orderTimeStart"
            :end-time-value="groupSales.orderTimeEnd"
            end-time-prop="orderTimeEnd"
            @changeStartValue="value => groupSales.orderTimeStart = value"
            @changeEndValue="value => groupSales.orderTimeEnd = value">
          </gt-time-range>
        </el-form-item>
        <el-form-item label="支付状态" prop='payStatus'>
          <el-select v-model="groupSales.payStatus" placeholder="请选择支付状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in payStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table list -->
    <el-card class="mode-store-table">
      <gt-border-button v-if="isAuthMenu('groupSales_list')" class="gt-table-create" txt="新建销售单" @click.native="() => createSales()"/>
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
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="groupSalesView(scope.row.id)">查看</el-button>
            <span v-if="scope.row.payStatus === 'UNPAY'">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100" v-if="scope.row.payStatus === 'UNPAY'">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne" type="text" size="small" @click="groupSalesPay(scope.row.id,scope.row.amtTol)">支付</div>
              <div class="buttonOne" type="text" size="small" @click="createSales(scope.row.id)" >编辑</div>
              <div class="buttonOne" @click="deleteGroupSales(scope.row.id)" style="margin-bottom: 0">删除</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="120"
          :show-overflow-tooltip="true"
          label="销售单号">
        </el-table-column>
        <el-table-column
          prop="orderTime"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="销售时间">
        </el-table-column>
        <el-table-column
          prop="custName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="客户">
        </el-table-column>
        <el-table-column
          prop="amtTol"
          min-width="100"
          :show-overflow-tooltip="true"
          label="总金额">
        </el-table-column>
        <el-table-column
          prop="payStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.payStatus, payStatus))">{{filterStatus(scope.row.payStatus, payStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, payType) || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-salesDetail v-if="groupSalesVisible" ref="groupView" @refreshDataList="getDataList"/>
    <gt-salesPay v-if="groupSalesPayVisible" ref="groupPay" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/order'
import { payStatus,payType } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import gtSalesDetail from './groupSalesDetail'
import gtSalesPay from './groupSalesPay'
export default {
  name:'order-groupSales-groupSalesList',
  data(){
    return{
      filterStatus, 
      filterColor,
      payStatus,
      payType,
      dataList: [],
      dataListLoading: false,
      groupSalesVisible:false,
      groupSalesPayVisible:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      groupSales:{
        orderNo:'',
        orderTimeStart:'',
        orderTimeEnd:'',
        payStatus:'',
      },
    }
  },
  components: {
    gtPagination,gtTimeRange,gtSalesDetail,gtSalesPay
  },
  created(){
    this.getDataList()
  },
  methods:{
    //new create sales or edit group sales
    createSales(id){
      this.$router.push({name:'order-groupSales-newGroupSalesOrder',query:{id:id}})
    },
    // export
    async exportExcel() {
      const { data, headers } = await api.exportGroupBuyExcel({
        ...this.groupSales,
        payStatus:this.groupSales.payStatus ? this.groupSales.payStatus : null,
        size: 10000,
        page: 0,
      })
      fileDownload(data, '批发团购销售订单.xls')
    },
    //get data list
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getGroupSalesList({
        ...this.groupSales,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            amtTol:this.priceNum(item.amtTol),
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //group sales view
    groupSalesView(id){
      this.groupSalesVisible = true
      this.$nextTick(() => {
        this.$refs.groupView.init(id)
      })
    },
    //group sales pay
    groupSalesPay(id,amtTol){
      this.groupSalesPayVisible = true
      this.$nextTick(() => {
        this.$refs.groupPay.init(id,amtTol)
      })
    },
    // delete
    deleteGroupSales(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据？',
        confirm: async () => {
          const { data } = await api.deleteGroupBuyOrder(id)
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
    //paging
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    //reset
    resetForm(type) {
      if (type==='reset') {
        this.$refs['groupSales'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>