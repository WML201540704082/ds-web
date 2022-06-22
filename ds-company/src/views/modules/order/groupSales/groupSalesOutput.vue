<template>
  <div class="output-page-bill" id="order-groupSales" style="display: none;">
    <div class="title">{{companyName}}批发团购销售单</div>
    <img class="barcode" id="barcode" />
    <div class="row">
      <div class="col-half">销售单号： {{details.orderNo || '--'}}</div>
      <div class="col-half">销售时间： {{details.orderTime || '--'}}</div>
    </div>
    <div class="row">
      <div class="col-half">客户名称： {{details.custName || '--'}}</div>
    </div>
    <table class="output-table">
      <thead>
        <th class="table-title">序号</th>
        <th class="table-title">商品名称</th>
        <th class="table-title">条码</th>
        <th class="table-title">规格</th>
        <th class="table-title">单价</th>
        <th class="table-title">数量</th>
        <th class="table-title">金额</th>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in details.groupBuyOrderItemList">
          <td>{{index + 1}}</td>
          <td>{{item.productName}}</td>
          <td>{{item.barcode}}</td>
          <td>{{item.spec}}</td>
          <td>{{priceNum(item.productPrice)}}</td>
          <td>{{item.productNum}}</td>
          <td>{{NP.times(priceNum(item.productPrice), item.productNum)}}</td>
        </tr>
        <tr>
          <td class="last-item status" :colspan="4">
            状态：{{details.payStatus === 'UNPAY' ? '未支付' : '已支付'}}&nbsp;&nbsp;
            支付方式：{{filterStatus(details.payType, payType) || '--'}}
          </td>
          <td class="last-item">合计</td>
          <td class="last-item">{{totalCount}}</td>
          <td class="last-item">{{totalAmount}}</td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col-half">备注：{{details.remark || '--'}}</div>
    </div>
    <div class="row" v-if="details.remark && details.remark.length >= 80">
      <div class="col-half"></div>
    </div>
    <div class="row" v-if="details.remark && details.remark.length >= 160">
      <div class="col-half"></div>
    </div>
    <div class="row">
      <div class="col-half">操作人：{{details.operator || '--'}} / {{details.operatorPhone || '--'}}</div>
    </div>
    <!-- <div class="row">
      <div class="col-half" v-if="details.checkEmployeeName">审核人：{{`${details.checkEmployeeName || '--'}/${details.checkUser || '--'}`}}</div>
    </div> -->
    <div class="time">打印时间: {{moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
  </div>
</template>
<script>
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
import JsBarcode from 'jsbarcode'
import { filterStatus } from '@/utils'
import { payType } from '@/utils/dict'
import moment from 'moment'
export default {
  name: 'order-groupSalesOutput',
  data() {
    return {
      filterStatus,
      payType,
      NP,
      moment,
      companyName: ''
    }
  },
  props: {
    details: Object,
  },
  created() {
    const { companyName = '' } = getStore({name: 'commenInfo'})
    this.companyName = companyName

    console.log(this.details)

  },

  watch: {
    'details.orderNo': function(n, o){
      JsBarcode('#barcode', n, {
        height:40,
        displayValue: false
      })
    }
  },
  computed: {
    totalCount() {
      let count = 0
      if (this.details.groupBuyOrderItemList && this.details.groupBuyOrderItemList.length > 0) {
        this.details.groupBuyOrderItemList.forEach(item => {
          count = NP.plus(item.productNum, count)
        })
      }
      return count
    },
    totalAmount() {
      let amount = 0
      if (this.details.groupBuyOrderItemList && this.details.groupBuyOrderItemList.length > 0) {
        this.details.groupBuyOrderItemList.forEach(item => {
          amount = NP.plus(NP.times(NP.divide(item.productPrice || 0, 100), item.productNum), amount)
        })
      }
      return amount
    },
  }
}
</script>
