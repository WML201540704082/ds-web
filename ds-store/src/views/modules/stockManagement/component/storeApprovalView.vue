<template>
  <el-dialog
    :title="type === 'view' ? '查看' : '审核'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="mod-store_customers">
    <el-form ref="request-stock-form" class="form-show" label-width="110px">
      <el-form-item label="订货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="订货时间">
        <span class="itemInput">{{details.createTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="发起门店">
        <span class="itemInput">{{details.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
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
        prop="newCode"
        width="100"
        :show-overflow-tooltip="true"
        label="商品自编码">
      </el-table-column>
      <el-table-column
        prop="spec"
        width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
			<el-table-column
				prop="productCostPrice"
				min-width="100"
				:show-overflow-tooltip="true"
        v-if="storeRoleName === '店长' && hasAuthorization"
				label="成本价">
        <template slot-scope="scope">
          <span v-if="scope.row.productCostPrice !== null">{{ priceNum(scope.row.productCostPrice)}}</span>
          <span v-else>--</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价">
        <template slot-scope="scope">
          <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
          <span v-else> -- </span>
        </template>
			</el-table-column>
      <el-table-column
        prop="stockQuantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="库存数量">
      </el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="订货数量">
      </el-table-column>
      <el-table-column
        prop="outQuantity"
        min-width="100"
        label="出货数量">
				<template slot-scope="scope">
          <el-input class="inputs1" v-if="type === 'approval' && scope.row.productType == 'BULK'" v-model="scope.row.outQuantity" maxlength="8"></el-input>
          <el-input class="inputs1" v-else-if="type === 'approval' && scope.row.productType != 'BULK'" v-model.number="scope.row.outQuantity" maxlength="8"></el-input>
          <span v-else>{{scope.row.outQuantity}}</span>
				</template>
      </el-table-column>
    </el-table>
    <span slot="footer" v-if="type==='approval'" class="dialog-footer" >
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="approval(true)">通过</el-button>
      <el-button type="primary" @click="approval(false)">拒绝</el-button>
    </span>
    <span slot="footer" v-else class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { filterStatus } from '@/utils'
import { stockStatus } from '@/utils/dict'
import moment from 'moment'
import NP from 'number-precision'
export default {
  data(){
    return{
      type:'',
      storeRoleName:'',
      hasAuthorization: '',
      filterStatus,
      stockStatus,
      dataList: [],
      moment,
      dataListLoading: false,
      visible: false,
      details:{},
    }
  },
  created () {
    const { storeRoleName = '', hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
  },
  watch:{
    visible(o,n){
      this.$parent.getDataList()
    }
  },
  methods:{
    init(id,type){
      this.visible = true
      this.type = type
      this.getDataList(id,type)
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const outQuantityList = data.map(ele => ele.outQuantity || 0)
      const quantityList = data.map(ele => ele.quantity || 0)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        //已完成，待确认收货
        if (this.details.status ==='FINISH' || this.details.status ==='TAKE_PENDING' ||
            this.details.status ==='CHECK_FINISH') {
          if (column.property === 'productCostPrice' || column.property === 'retailPrice') {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              const tempValue = values.reduce((prev, curr,flag) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return NP.plus(prev, NP.times(curr, outQuantityList[flag]))
                } else {
                  return prev
                }
              }, 0)
              sums[index] = this.priceNum(tempValue)
            } else {
              sums[index] = ''
            }
          }
        }else{
          if (column.property === 'productCostPrice' || column.property === 'retailPrice') {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              const tempValue = values.reduce((prev, curr,flag) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return NP.plus(prev, NP.times(curr, quantityList[flag]))
                } else {
                  return prev
                }
              }, 0)
              sums[index] = this.priceNum(tempValue)
            } else {
              sums[index] = ''
            }
          }
        }
        //订货数量，出货数量
        // if (column.property === 'quantity' || column.property === 'outQuantity') {
        //   const values = data.map(item => Number(item[column.property]))
        //   if (!values.every(value => isNaN(value))) {
        //     const tempValue = values.reduce((prev, curr) => {
        //       const value = Number(curr)
        //       if (!isNaN(value)) {
        //         return prev + curr
        //       } else {
        //         return prev
        //       }
        //     }, 0)
        //     sums[index] = tempValue
        //   } else {
        //     sums[index] = ''
        //   }
        // }
      })
      return sums
    },
    checkInfo(status){
      if (!status) {
        return false
      }
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '出货数量必填，数量大于0小于等于库存数和请货数,且散称类商品最多只能输入三位有效小数'
      const flag = this.dataList.some((item, index) => {
        if (reg.test(item.outQuantity)) {
          if (Number(item.outQuantity) > Number(item.stockQuantity) ||
              Number(item.outQuantity) > Number(item.quantity) || Number(item.outQuantity) <= 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
      if (flag) {
        this.$message.warning(msg)
      }
      return flag
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = data.data.items.map(item => {
          return{
            ...item,
            stockQuantity: item.productType == 'BULK' ? item.stockQuantity / 1000 : item.stockQuantity,//库存数量
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//订货数量
            outQuantity: item.productType == 'BULK' ? item.outQuantity / 1000 : item.outQuantity,//出货数量
          }
        })
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }

    },
    // 审批
    async approval(flag){
      if (this.dataList && this.dataList.length>0) {
        if (!this.checkInfo(flag)) {
          const { data } = flag? await api.checkReqStock({
            id: this.details.id,
            item: this.dataList.map(item => {
              return{
                ...item,
                quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//订货数量
                outQuantity: item.productType == 'BULK' ? item.outQuantity * 1000 : item.outQuantity,//出货数量
              }
            })
          }): await api.rejectReqStock({
            id: this.details.id,
            item: this.dataList
          })
          if (data.code === 0) {
            this.$message.success(flag?'审核成功':'拒绝成功')
            this.visible = false
            this.$emit('refreshDataList', this.getDataList)
          } else {
            this.$message.error(data.msg)
          }
        }
      }
    },
  }
}
</script>

<style lang="scss">
.mod-store_customers{
  .el-table{
    .inputs1.el-input{
      padding: 0 !important;
      .el-input__inner{
        width: 100% !important;
        margin-left: -12px;
      }
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

