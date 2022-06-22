<template>
  <el-dialog
    :title="'确认'"
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
      <el-form-item label="订货对象">
        <span class="itemInput">{{details.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
      </el-form-item>
      <el-form-item label="审核说明">
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
        v-if="storeRoleName === '店长'"
				label="订货价">
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
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="订货数量">
      </el-table-column>
    </el-table>
    <el-form ref="form" label-width="120px" :model="form" :rules="formRules">
      <el-form-item label="打款凭证：" prop="pics"  class="spec-pic">
        <gt-image-upload :names="0" :more-real="form.pics" tip="(最多上传3张，大小不超过5M)" :multiple="true" :max="3"/>
      </el-form-item>
    </el-form>
    <span slot="footer"  class="dialog-footer">
      <el-button  @click="save()">订单确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { filterStatus } from '@/utils'
import { stockStatus } from '@/utils/dict'
import gtImageUpload from "@/components/gt-image-upload"
import moment from 'moment'
import NP from 'number-precision'
export default {
  data(){
    return{
      storeRoleName:'',
      hasAuthorization: '',
      filterStatus,
      stockStatus,
      dataList: [],
      moment,
      dataListLoading: false,
      visible: false,
      details:{},
      form:{
        pics:[]
      },
      formRules:{
        pics:[{required: true, message: '打款凭证必填',trigger: 'blur'}],
      }
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
  components: {
    gtImageUpload
  },
  methods:{
    init(id){
      this.visible = true
      // this.$nextTick(() => {
        this.form.pics = []
      // })
      this.getDataList(id)
    },
    save(){
      if (this.form.pics.length == 0) {
        this.$message.warning('打款凭证必填')
        return
      }
      this.$easyConfirm.show({
        title: '提示',
        content: '确定要确认订货信息吗？', 
          confirm: async () => {
            const { data } = await api.getConfirmStockDetail({
              id:this.details.id,
              receiptImg:this.form.pics.map(item => item.url).join(','),
            })
            if (data.code == 0) {
                this.$message.success('确认成功')
                this.$easyConfirm.hide()
                this.visible = false
            } else {
              this.$message.error(data.msg)
              this.$easyConfirm.hide()
              this.visible = false
          }
        }
      })
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
  .spec-pic{
    .fileCon{
      padding-left: 0 !important;
      min-height: 50px;
      .list{
        margin: 0;
        margin-top: 10px;
        min-height: 50px;
        padding: 0 !important;
        & > div{
          width: 50px;
          height: 50px;
        }
        .el-loading-spinner{
          padding: 0 !important;
          .circular{
            margin: 10px 0 0 2px;
            width: 20px;
            height: 20px;
          }
        }
        .add{
          margin: 0;
          margin-left: 10px;
          .close{
            padding: 0 !important;
          }
          .el-upload-card{
            width: 48px !important;
            height: 48px !important;
            line-height: 48px !important;
          }
        }
      }
    }
    & > div{
      padding: 0 !important;
    }
  }
}
</style>

