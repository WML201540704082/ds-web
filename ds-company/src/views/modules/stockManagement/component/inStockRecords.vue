<template>
  <el-dialog
    title="出入库明细"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="stockview">
    <div class="toptitle">
      <!-- 商品名称、条码、规格 -->
      <div class="tip">商品：{{details.productName || '--'}}</div>
      <span class="tip">条码：{{details.barcode || '--'}}</span>
      <span class="tip">规格：{{details.spec || '--'}}</span>
      <el-form :inline="true" class="mode-form-line1" style="display: inline-block;float: right;" ref="outInDetails" label-width="80px" :model="outInDetails" @keyup.enter.native="resetForm('search')">
        <el-form-item label="出入库时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="outInDetails.startTime"
            @changeStartValue="value => outInDetails.startTime = value"
            :end-time-value="outInDetails.endTime"
            end-time-prop="endTime"
            @changeEndValue="value => outInDetails.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item>
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height="360"
      style="width: 100%;margin-top:-20px">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        min-width="120"
        :show-overflow-tooltip="true"
        label="出入库单号">
      </el-table-column>
      <el-table-column
        prop="outgoingAndWarehousingTime"
        min-width="120"
        :show-overflow-tooltip="true"
        label="出入库时间">
      </el-table-column>
      <el-table-column
        prop="outgoingAndWarehousingType"
        min-width="100"
        :show-overflow-tooltip="true"
        label="出入库类型">
        <template slot-scope="scope">
          <span v-if="type === -1">{{filterStatus(scope.row.outgoingAndWarehousingType,outInType)}}</span>
          <span v-else>{{filterStatus(scope.row.outgoingAndWarehousingType,storeOutInType)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentUnit"
        min-width="100"
        label="往来单位">
      </el-table-column>
      <el-table-column
        prop="outgoingAndWarehousingQuantity"
        min-width="100"
        label="出入库数量">
        <template slot-scope="scope">
          <span>
            {{scope.row.outgoingAndWarehousingQuantity}}<span v-if="details.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="inventoryBalance"
        min-width="100"
        label="库存结余">
        <template slot-scope="scope">
          <span>
            {{scope.row.inventoryBalance}}<span v-if="details.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="costUnitPrice"
        min-width="100"
        label="成本单价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
      </el-table-column>
      <el-table-column
        prop="totalCostPrice"
        min-width="100"
        label="成本总价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </el-dialog>
</template>
<script>
import { inOutDetail } from '@/service/stock'
import gtTimeRange from '@/components/gt-time-range'
import { outInType,storeOutInType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  data(){
    return{
      outInType,
      storeOutInType,
      filterStatus,
      dataList: [],
      details: {},
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataListLoading: false,
      visible: false,
      id: null,
      outInDetails:{
        startTime: null,
        endTime: null,
      },
    }
  },
  created () {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  components:{
    gtTimeRange,gtPagination
  },
  methods:{
    init(row,type){
      this.visible = true
      this.details = row
      this.type = type
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await inOutDetail({
        page:this.currentPage,
        size:this.pageSize,
        companyId: this.details.companyId ? this.details.companyId : null,
        storeId: this.details.storeId ? this.details.storeId :null,
        productId: this.details.productId,
        skuId: this.details.skuId,
        startTimeString:this.outInDetails.startTime ? moment(this.outInDetails.startTime).format("YYYY-MM-DD HH:mm:ss") : null,
        endTimeString:this.outInDetails.endTime ? moment(this.outInDetails.endTime).format("YYYY-MM-DD HH:mm:ss") : null,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            outgoingAndWarehousingQuantity:item.productType == 'BULK' ? item.outgoingAndWarehousingQuantity/1000 : item.outgoingAndWarehousingQuantity,//出入库数量
            inventoryBalance:item.productType == 'BULK' ? item.inventoryBalance/1000 : item.inventoryBalance,//库存结余
            costUnitPrice:this.priceNum(item.costUnitPrice),
            totalCostPrice:this.priceNum(item.totalCostPrice)
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
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
        this.$refs['outInDetails'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>


<style scoped>
.toptitle {
  margin-bottom: 15px;
  color: #72716F;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
  width: 100%;
}
.tip{
  margin-right: 20px;
}
.stockview .el-dialog__body {
  padding-top: 10px!important;
}
.inputs1 input {
  width: 100%!important;
}
.el-table__row .inputs1 {
  padding-left: 0!important;
}
</style>
