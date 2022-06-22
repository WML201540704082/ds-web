<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="sales" :inline="true" ref='sales' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="sales.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="sales.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售单号" prop='id'>
          <el-input v-model="sales.id" placeholder="请输入销售单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="sales.startTime"
            :end-time-value="sales.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => sales.startTime = value"
            @changeEndValue="value => sales.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="支付方式" prop='payType'>
          <el-select v-model="sales.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in paymentOfMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop='stage'>
          <el-select v-model="sales.stage" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in orderStage"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:reqStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>销售金额合计：{{details.totalAmount || 0}}元</span>
        <span>折扣金额合计：{{NP.minus(details.totalAmount,details.paidAmount) || 0}}元</span>
        <span>实收金额合计：{{details.paidAmount || 0}}元</span>
      </div>
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
          prop="storeCode"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店编码">
          <template slot-scope="scope">
            <span>{{'ST000' + scope.row.storeId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeInfo.realName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="营业执照名称">
        </el-table-column>
        <el-table-column
          prop="storeInfo.province"
          min-width="150"
          :show-overflow-tooltip="true"
          label="省份">
        </el-table-column>
        <el-table-column
          prop="id"
          min-width="160"
          :show-overflow-tooltip="true"
          label="销售单号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="销售时间">
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          min-width="180"
          :show-overflow-tooltip="true"
          label="销售金额">
        </el-table-column>
        <el-table-column
          prop="salesMoney"
          min-width="180"
          :show-overflow-tooltip="true"
          label="折扣金额">
          <template slot-scope="scope">
            <span>{{NP.minus(scope.row.orderAmount,scope.row.payableAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payableAmount"
          min-width="180"
          :show-overflow-tooltip="true"
          label="实收金额">
        </el-table-column>
        <el-table-column
          min-width="180"
          :show-overflow-tooltip="true"
          label="会员信息">
          <template slot-scope="scope">
            <span>{{(scope.row.customer.name || '--') + '/' + (scope.row.customer.phone || '--')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          min-width="180"
          :show-overflow-tooltip="true"
          label="会员获得积分">
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
          prop="cashier"
          min-width="180"
          :show-overflow-tooltip="true"
          label="收银员">
        </el-table-column>
        <el-table-column
          prop="stage"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.stage, orderStage)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="180"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination ="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import NP from 'number-precision'
import { paymentOfMode,orderStage } from '@/utils/dict'
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { getOrderList,orderReport } from '@/service/order'
import { addExportDownload } from '@/service/setting'
import { exportExcel } from '@/service/goods'
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name: 'statement-posCommoditySalesDocuments-sales',
  data(){
    return{
      NP,
      storeList: [],//门店列表
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      paymentOfMode,
      orderStage,
      details:{},
      sales:{
        storeId: null,
        id: null,
        startTime: null,
        endTime: null,
        payType: '',
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtSelectProvince,
  },
  inject: ['exportList'],
  created(){
    //获取门店下拉列表
    this.getStoreList();
    this.getDataList()
    this.getOrderReport()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await getOrderList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.sales,
        provinceId: local.provinceId || null,
        notStatus:'NOPAID'
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            orderAmount: this.priceNum(item.orderAmount),
            payableAmount: this.priceNum(item.payableAmount),
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
      }
    },
    // 合计
    async getOrderReport() {
      this.dataListLoading = true
      const { data } = await orderReport({
        size: this.pageSize,
        page: this.currentPage,
        ...this.sales,
        notStatus:'NOPAID'
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.details.totalAmount = this.priceNum(data.data.totalAmount)
        this.details.offerAmount = this.priceNum(data.data.offerAmount)
        this.details.paidAmount = this.priceNum(data.data.paidAmount)
      } else {
        this.details = {}
      }
    },
    // 监听省份
    async getStoreValue(val){
      const { data } = await getStoreList({
        status:1,
        provinceId:val.id
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },
    // 导出销售清单
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        size: this.pageSize,
        page: this.currentPage,
        ...this.sales,
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, 'pos商品销售单', 'REPORT_POS_SALE_ORDER', criteria)
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.getDataList();
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['sales'].resetFields()
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
      this.getOrderReport()
    },
  },
}
</script>