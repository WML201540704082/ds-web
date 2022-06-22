<template>
<el-dialog
  title="门店结算信息"
  class="settlement-information-dailog"
  v-loading="dataListLoading"
  :visible.sync="visible"
  append-to-body>
  <el-table
        :data="form"
        border
        :stripe="true"
        v-table-height
        style="width: 100%;">
         <el-table-column
          prop="storeName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="settlementAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算金额(元)">
           <template slot-scope="scope"><span>{{priceNum(scope.row.settlementAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          prop="transactionAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="实收金额(元)">
          <template slot-scope="scope"><span>{{priceNum(scope.row.transactionAmount)}}</span></template>
        </el-table-column>
      </el-table>
</el-dialog>
</template>

<script>
import * as api from '@/service/goods'
import { settleAccounts } from '@/service/setting'
export default {
  name: 'settlement-information-modal',
  data () {
    return {
      visible: false,
      dataListLoading: false,
      form:[]
    }
  },
  

  methods: {
    init(liquidationDate) {
      this.visible = true
      this.liquidationDate = liquidationDate
      this.getDataList(liquidationDate)
    },
    async getDataList(liquidationDate) {
      this.dataListLoading = true
      const { data } = await settleAccounts(liquidationDate)
      if (data && data.code === 0) {
        this.form=data.data
        this.settlementAmount = data.data.map(item => item.settlementAmount).join(',')
        this.settlementAmount = this.priceNum(this.settlementAmount,'out')
        this.storeName = data.data.map(item => item.storeName).join(',')
        this.transactionAmount = data.data.map(item => item.transactionAmount).join(',')
        this.transactionAmount = this.priceNum(this.transactionAmount,'out')
        //this.form.salePrice = this.priceNum(data.data.salePrice).toFixed(1)
      } else {
        this.form = {}
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
  }
}
</script>
<style lang="scss">
.settlement-information-dailog{
  .operation{
    margin-bottom: 0;
    .tip{
      font-size: 14px;
      color: #c0c4cc;
      margin-left: 5px;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag {
    height: 36px;
    margin-bottom: 10px;
    line-height: 34px;
    font-size: 12px;
    color: #fff;
    .el-icon-close {
      font-size: 20px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: #fff;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    margin-bottom: 10px;
    height: 36px;
    line-height: 34px;
    padding: 0 20px !important;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-bottom: 10px;
    vertical-align: bottom;
    .el-input__inner{
      height: 36px !important;
      line-height: 34px;
    }
  }

}
</style>

