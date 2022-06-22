<template>
  <div class="mod-store tea">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="tea" :model="tea" label-width="80px" @keyup.enter.native="resetForm('search')">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="tea.id" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="顾客" prop="customerId">
           <el-input v-model="tea.key" placeholder="顾客姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="startTime"
            :start-time-value="tea.startTime"
            :end-time-value="tea.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => tea.startTime = value"
            @changeEndValue="value => tea.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="渠道" prop="source">
          <el-select v-model="tea.source" placeholder="请选择渠道" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in teaOrderType"
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
            <el-button class="nopadding" type="text" size="small" @click="teaListView(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          align="center"
          min-width="170"
          :show-overflow-tooltip="true"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          align="center"
          min-width="185"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span>{{(scope.row.customerName || '--') + '/' + (scope.row.customerPhone || '--')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="170"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="orderSource"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单来源">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderSource, teaOrderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payableAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应付金额">
        </el-table-column>
        <el-table-column
          prop="paidAmount"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实付金额">
        </el-table-column>
        <el-table-column
          prop="payStatus"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payStatus, teaPayStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-teaview v-if="teaviewVisible" ref="teaview" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import NP from 'number-precision'
import gtTimeRange from '@/components/gt-time-range'
import { teaOrderType,teaPayStatus } from '@/utils/dict'
import { filterStatus } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import { getDrinkOrderList } from '@/service/survey'
import { getCustomerList } from '@/service/mycustomer'
import gtTeaview from './detail'
import moment from 'moment'
export default {
  name:'survey_tea',
  data(){
    return{
      NP,
      moment,
      dataListLoading:false,
      customerListLoading:false,
      filterStatus,
      teaPayStatus,
      teaOrderType,
      dataList:[],
      customerList:[],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      teaviewVisible: false,
      tea:{
        id: '',
        customerId: '',
        startTime: null,
        endTime: null,
        source: '',
        key:''
      }
    }
  },
  components:{
    gtTimeRange,gtPagination,gtTeaview
  },
  inject: ['exportList'],
  async created(){
    //数据详情
    this.getDataList()
    //获取顾客列表
    this.getCustomerList()
  },
  methods:{
    //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      const { data } = await getDrinkOrderList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.tea,
        startTime:moment(this.tea.startTime+' 00:00:00').valueOf() || null,
        endTime:moment(this.tea.endTime+' 23:59:59').valueOf() || null
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            payableAmount: this.priceNum(item.payableAmount),
            paidAmount: this.priceNum(item.paidAmount),
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    //顾客列表
    async getCustomerList(){
      this.customerListLoading = true
      const { data } = await getCustomerList({
        size: 1000000,
        page: 0,
      })
      this.customerListLoading = false
      if (data && data.code === 0) {
        this.customerList = data.data.records.map(item=>{
          return{
            ...item,
            name:item.name || '--'
          }
        })
      } else {
        this.customerList = []
        this.$message.warning(data.msg)
      }
    },
    //查看
    teaListView(id){
      this.teaviewVisible = true
      this.$nextTick(() => {
        this.$refs.teaview.init(id)
      })
    },
    //茶饮订单列表导出
    async exportExcel() {
      const criteria = {
        size: this.pageSize,
        page: this.currentPage,
        ...this.tea,
        startTime:moment(this.tea.startTime+' 00:00:00').valueOf() || null,
        endTime:moment(this.tea.endTime+' 23:59:59').valueOf() || null
      }
      this.exportList(this.total, '茶饮订单列表', 'DRINK_ORDER', criteria)
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
        this.$refs['tea'].resetFields()
        this.tea.key = null
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
