<template>
  <el-dialog
    title="结算历史"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="stockview">
    <el-form ref="instock-form" class="form-show" label-width="110px">
      <el-form-item label="入库单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="入库时间">
        <span class="itemInput">{{details.createTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="进货价小计">
        <span class="itemInput">{{this.priceNum(details.nowPurchasePriceAmount) || '--'}}元</span>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      show-summary
      class="all-count-table"
      :summary-method="summary"
      max-height="360"
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
        prop="createTime"
        min-width="180"
        :show-overflow-tooltip="true"
        label="结算时间">
      </el-table-column>
      <el-table-column
        prop="settleAmount"
        min-width="120"
        :show-overflow-tooltip="true"
        label="结算金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.settleAmount)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        min-width="100"
        :show-overflow-tooltip="true"
        label="结算状态">
        <template slot-scope="scope">
          <span>{{filterStatus(scope.row.status, setStatus)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import NP from 'number-precision'
import { filterStatus } from '@/utils'
import { setStatus } from '@/utils/dict'
export default {
  data(){
    return{
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null,
      filterStatus,
      setStatus,
    }
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
      const { data } = await api.getSettlementRecords(this.details.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 2) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = this.priceNum(tempValue)
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

<style scoped>
.toptitle {
  margin: 15px 0;
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
.confirm{
  float: right;
  margin-right: 20px;
}
</style>
