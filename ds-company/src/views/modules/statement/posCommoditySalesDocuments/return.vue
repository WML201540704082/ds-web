<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="returnGoods" :inline="true" ref='returnGoods' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="returnGoods.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="returnGoods.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货单号" prop='id'>
          <el-input v-model="returnGoods.id" placeholder="请输入退货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="退货时间">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="returnGoods.start"
            :end-time-value="returnGoods.end"
            end-time-prop="end"
            @changeStartValue="value => returnGoods.start = value"
            @changeEndValue="value => returnGoods.end = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="退款方式" prop='payType'>
          <el-select v-model="returnGoods.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in returnMode"
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
        <span>退货金额合计：{{details.saleAmount || 0}}元</span>
        <span>实退金额合计：{{details.saleAmount || 0}}元</span>
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
          label="退货单号">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="160"
          :show-overflow-tooltip="true"
          label="关联销售单号">
        </el-table-column>
        <el-table-column
          prop="refundTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退货时间">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="180"
          :show-overflow-tooltip="true"
          label="退货金额">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="180"
          :show-overflow-tooltip="true"
          label="实退金额">
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
          <template slot-scope="scope">
            <span>{{scope.row.integral == 0 ? 0 : ('-' + scope.row.integral)}}</span>
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
          prop="cashier"
          min-width="180"
          :show-overflow-tooltip="true"
          label="收银员">
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
import { returnMode } from '@/utils/dict'
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { getreturnOrderList,returnOrderReport } from '@/service/order'
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name: 'statement-posCommoditySalesDocuments-return',
  data(){
    return{
      NP,
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      returnMode,
      details:{},
      returnGoods:{
        storeId: null,
        id: null,
        start: null,
        end: null,
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
    this.getReturnOrderReport()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await getreturnOrderList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.returnGoods,
        stage:'FINISH',
        type:"POS",
        provinceId: local.provinceId || null,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            amount: this.priceNum(item.amount),
            refundAmount: this.priceNum(item.refundAmount),
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
      }
    },
    // 合计
    async getReturnOrderReport() {
      this.dataListLoading = true
      const { data } = await returnOrderReport({
        size: this.pageSize,
        page: this.currentPage,
        ...this.returnGoods,
        stage:'FINISH',
        type:"POS"
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.details.saleAmount = this.priceNum(data.data.saleAmount)
        this.details.refundAmount = this.priceNum(data.data.refundAmount)
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
    // 导出退货清单
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        size: this.pageSize,
        page: this.currentPage,
        ...this.returnGoods,
        stage:'FINISH',
        type:"POS",
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, 'pos商品退货单', 'REPORT_POS_RETURN_ORDER', criteria)
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
        this.$refs['returnGoods'].resetFields()
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
      this.getReturnOrderReport()
    },
  },
}
</script>