<template>
  <el-dialog
    title= '查看'
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="stockview">
    <el-form ref="request-stock-form" class="form-show" label-width="110px">
      <el-form-item label="订货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="订货时间">
        <span class="itemInput">{{details.createTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="订货对象">
        <span class="itemInput">{{details.targetStoreName || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}}/{{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
      </el-form-item>
      <el-form-item label="审核说明">
        <span class="itemInput">{{details.rejectCause || '--'}}</span>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      max-height="360"
      show-summary
      class="all-count-table"
      :summary-method="summary"
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
        label="订货价"
        v-if="storeRoleName === '店长' && hasAuthorization">
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
          <span>{{priceNum(scope.row.retailPrice)}}</span>
        </template>
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
        :show-overflow-tooltip="true"
        v-if="this.details.status !== 'CHECK_PENDING' && this.details.status !== 'REJECT'"
        label="出货数量">
      </el-table-column>
      <el-table-column
        prop="storeName"
        min-width="100"
        :show-overflow-tooltip="true"
        v-if="this.details.status !== 'CHECK_PENDING' && this.details.status !== 'REJECT'"
        label="出货单位">
      </el-table-column>
    </el-table>
    <el-form ref="form" label-width="120px" :model="form">
      <el-form-item label="打款凭证：">
        <span v-if="form.pics&&form.pics.length>0">
          <div class="view-img" v-for='(item, index) in form.pics' :key="index">
            <img class="theme-border" style="width:50px;height:50px" :src="'http://'+item" alt="" @click="openImgPic('innerPic',item)">
          </div>
        </span>
        <span v-else class="itemInput">--</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" >
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
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
      hasAuthorization: false,
      filterStatus,
      stockStatus,
      dataList: [],
      moment,
      form:{
        pics:[]
      },
      showImgPic: null,
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
  methods:{
    init(id,type){
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        this.form.pics = []
      })
      this.getDataList(id,type)
    },
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.form[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.form.pics = data.data.receiptImg ? data.data.receiptImg.split(',') : []
        this.dataList = data.data.items.map(item => {
          return{
            ...item,
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//订货数量
            outQuantity: item.productType == 'BULK' ? item.outQuantity / 1000 : item.outQuantity,//出货数量
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
      const outQuantityList = data.map(ele => ele.outQuantity || 0)
      const quantityList = data.map(ele => ele.quantity || 0)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        //已入库，待确认收货，待出库
        if (this.details.status ==='FINISH' || this.details.status ==='TAKE_PENDING' || this.details.status ==='CHECK_FINISH') {
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

