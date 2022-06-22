<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="groupSalesView">
    <el-form ref="shopping-form" class="form-show" label-width="80px">
      <el-form-item label="销售单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="销售时间">
        <span class="itemInput">{{details.orderTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="客户">
        <span class="itemInput">{{details.custName || '--'}}</span>
      </el-form-item>
      <el-form-item label="支付状态">
        <span class="itemInput">{{details.payStatus === 'UNPAY' ? '未支付' : '已支付'}}</span>
      </el-form-item>
      <el-form-item label="支付方式">
        <span class="itemInput">{{filterStatus(details.payType, payType) || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}}/{{details.operatorPhone || '--'}}</span>
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
      class="all-count-table"
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
        prop="spec"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品规格">
      </el-table-column>
      <el-table-column
        prop="productPrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="单价">
      </el-table-column>
      <el-table-column
        prop="productNum"
        min-width="100"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="productAmt"
        min-width="120"
        :show-overflow-tooltip="true"
        label="金额">
      </el-table-column>
    </el-table>
    <div class="toptitle">
      <span class="tip">
        <span>合计数量：{{details.productNumTol || '--'}}</span>
        <span>合计金额：{{details.amtTol || '--'}}</span>
      </span>
    </div>
    <span slot="footer" class="dialog-footer" >
      <el-button type="primary" @click="goPrint(id)">打印单据</el-button>
    </span>
    <groupSales-output :details="details"/>
  </el-dialog>
</template>
<script>
import * as api from '@/service/order'
import NP from 'number-precision'
import groupSalesOutput from './groupSalesOutput'
import { payType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import printJS from 'print-js'
export default {
  name: 'groupSalesDetail',
  data(){
    return{
      payType,
      filterStatus,
      type:'',
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null,
      printLoading: false,
      shoppingDetail:{
        checkRemarks:null
      }
    }
  },
  components: {
    groupSalesOutput
  },
  computed: {
    //合计数量
    totalAmount(){
      let total = 0
      if (this.dataList && this.dataList.length > 0) {
        this.dataList.forEach(item => {
          total = NP.plus(total,item.productNum)
        })
      }
      return total
    },
    //合计金额
    totalPrice(){
      let total = 0
      if (this.dataList && this.dataList.length > 0) {
        this.dataList.forEach(item => {
          if (item.productNum) {
            total = NP.plus(NP.times((item.productPrice || 0), (item.productNum || 0)), total)
          }
        })
      }
      return total
    },
  },
  methods:{
    init(id){
      this.visible = true
      this.id = id
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getGroupBuyDetail(this.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = {
          ...data.data,
          amtTol:this.priceNum(data.data.amtTol),
        }
        this.dataList = data.data.groupBuyOrderItemList.map(item => {
          return{
            ...item,
            productPrice:this.priceNum(item.productPrice),
            productAmt:this.priceNum(item.productAmt),
          }
        })
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
    // 打印
    goPrint(id) {
      // this.printLoading = true
      this.$nextTick(() => {
        document.getElementById('order-groupSales').style = 'display: block;'
        printJS({printable: 'order-groupSales',  type: 'html', css: './static/print.css'})
        document.getElementById('order-groupSales').style = 'display: none;'
        // this.printLoading = false
      })
    },
  }
}
</script>
