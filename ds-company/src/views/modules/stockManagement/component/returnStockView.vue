<template>
  <el-dialog
    title="退货单详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="page-approve-modal">
    <el-form ref="return-form" class="form-show" label-width="110px">
      <el-form-item label="退货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="退货时间">
        <span class="itemInput">{{details.createTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="关联单号">
        <span class="itemInput">{{details.linkOrderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="入库时间">
        <span class="itemInput">{{details.inStockTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="供应商">
        <span class="itemInput">{{details.supplier || '--'}}</span>
      </el-form-item>
      <el-form-item label="联系人">
        <span class="itemInput">{{details.linkman || '--'}} / {{details.phone || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}} / {{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark|| '--'}}</span>
      </el-form-item>
    </el-form>
    <!-- <div class="toptitle">
      <el-row>
        <el-col :span="12">退货单号：{{details.orderNo || '--'}}</el-col>
        <el-col :span="12">退货时间：{{details.createTime || '--'}}</el-col>
        <el-col :span="12">入库单号：{{details.companyInStockNo || '--'}}</el-col>
        <el-col :span="12">入库时间：{{details.inStockTime || '--'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">供应商：{{details.supplier || '--'}}</el-col>
        <el-col :span="12">联系人：{{details.linkman || '--'}}</el-col>
        <el-col :span="12">操作人：{{details.operator || '--'}}</el-col>
        <el-col :span="12">备注：{{details.remark || '--'}}</el-col>
      </el-row>
    </div> -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      show-summary
      :summary-method="summary"
      max-height="360"
      class="all-count-table"
      style="width: 100%; min-height: 300px;">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        min-width="120"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="barcode"
        min-width="120"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="spec"
        width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="退货数量">
      </el-table-column>
			<el-table-column
				prop="nowPurchasePrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="退货价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span v-if="scope.row.nowPurchasePrice !== null">{{Number(priceNum(scope.row.nowPurchasePrice)).toFixed(2)}}</span>
          <span v-else> -- </span>
        </template>
			</el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import moment from 'moment'
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
export default {
  data(){
    return{
      dataList: [],
      storeList:[],
      moment,
      dataListLoading: false,
      visible: false,
      details:{},
    }
  },
  created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取是否为二代店
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    init(row){
      this.visible = true
      this.details = row
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReturnStockDetail(this.details.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.items.map(item => {
          return{
            ...item,
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//退货数量
          }
        })
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const quantityList = data.map(ele => ele.quantity)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 5) {
        // if (index === 4 || index === 5) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr,flag) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                // if (index === 4) {
                //   return prev + curr
                // } else {
                  return NP.plus(prev, NP.times(curr, quantityList[flag]))
                // }
              } else {
                return prev
              }
            }, 0)
            // if (index === 4) {
            //   sums[index] = tempValue || 0
            // }else{
              sums[index] = this.priceNum(tempValue) || 0
            // }
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
  }
}
</script>

<style lang="scss">
.page-approve-modal{
	.out-select{
		margin-left: -40px;
    .el-input--medium .el-input__inner {
      height: 33px;
      line-height: 33px;
      width: 155px;
    }
	}
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
}
</style>

