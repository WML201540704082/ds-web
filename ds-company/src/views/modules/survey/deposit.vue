<template>
  <div class="mod-store customers">
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectNew_Old" style="float:left;" @change="getList">
        <el-radio-button label="DEPOSIT">寄存流水</el-radio-button>
        <el-radio-button label="EXTRACT">提取流水</el-radio-button>
      </el-radio-group>
    </el-card>
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="deposit" :inline="true" ref='deposit' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="时间">
          <gt-time-range
            start-time-prop="beginDate"
            :start-time-value="deposit.beginDate"
            :end-time-value="deposit.endDate"
            end-time-prop="endDate"
            @changeStartValue="value => deposit.beginDate = value"
            @changeEndValue="value => deposit.endDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="顾客" prop='customerInfo'>
          <el-input v-model="deposit.customerInfo" placeholder="请输入姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品" prop='productInfo'>
          <el-input v-model="deposit.productInfo" placeholder="商品条码/名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop='operator'>
          <el-input v-model="deposit.operator" placeholder="请输入收银员" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          :label="selectNew_Old==='EXTRACT'?'提取时间':'寄存时间'">
          <template slot-scope="scope">
            <span>{{scope.row.createTime || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          min-width="150"
          label="顾客">
          <template slot-scope="scope">
            <span>{{(scope.row.customerName || '--') + '/' + (scope.row.customerPhone || '--')  || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
          <template slot-scope="scope">
            <span>{{scope.row.productName|| '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="120"
          :show-overflow-tooltip="true"
          label="规格">
          <template slot-scope="scope">
            <span>{{scope.row.spec|| '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="条形码">
          <template slot-scope="scope">
            <span>{{scope.row.barcode|| '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="120"
          :show-overflow-tooltip="true"
          :label="selectNew_Old==='EXTRACT'?'提取门店':'寄存门店'">
          <template slot-scope="scope">
            <span>{{scope.row.storeName|| '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consignQuantity"
          min-width="120"
          :show-overflow-tooltip="true"
          label="数量">
          <template slot-scope="scope">
            <span>{{(selectNew_Old==='EXTRACT'?'':'+')+''+(scope.row.consignQuantity || scope.row.extractQuantity)|| 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operatorName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.operatorName || '-'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { fileDownload } from '@/utils'
import { getDataflow,getDataExtractflow,exportExcel} from '@/service/survey'
export default {
  name:'survey-deposit',
  data () {
    return {
      selectNew_Old: 'DEPOSIT',
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      deposit:{
        productInfo: null,
        operator:null,
        customerInfo: null,
        beginDate: null,
        endDate: null,
      },
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  created () {
    // 获取审核列表
    this.getDataflow()
  },
  inject: ['exportList'],
  methods: {
    getList(val){
      this.currentPage = 0
      this.pageSize = 20
      this.selectNew_Old=val
      this.getDataflow()
    },
    // 导出订单列表
    async exportExcel() {
      const criteria = {
        ...this.deposit,
        consignType: this.selectNew_Old==='DEPOSIT'?'in':'out',
      }
      var name = this.selectNew_Old==='DEPOSIT'?'寄存列表':'提取列表'
      if (this.total > 10000) {
        this.$message.warning('下载最多支持1万条查询数据，请缩小查询范围再进行下载！')
      } else {
        const { data, headers } = await exportExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, name+'.xls')
      }
    },

    // 获取寄存数据列表
    async getDataflow() {
      const { data } = this.selectNew_Old == 'DEPOSIT' ? await getDataflow({
        size: this.pageSize,
        page: this.currentPage,
        ...this.deposit,
      }) : await getDataExtractflow({
        size: this.pageSize,
        page: this.currentPage,
        ...this.deposit,
      })
      if (data.code === 0) {
        this.dataList = data.data.records || []
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataflow()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['deposit'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataflow()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

