<template>
  <div class="output-page-bill" id="company-outstock" style="display: none;">
    <div class="title">{{companyName}}出库单</div>
    <img class="barcode" id="barcode" />
    <div class="row">
      <div class="col-half">出库单号： {{details.orderNo || '--'}}</div>
      <div class="col-half">出库时间： {{details.outStockTime || '--'}}</div>
    </div>
    <div class="row">
      <div class="col-half" v-if="details.linkOrderNo">关联单号： {{details.linkOrderNo}}</div>
      <div class="col-half" v-if="details.storeName">收货单位： {{details.storeName}}</div>
    </div>
    <table class="output-table">
      <thead>
        <th class="table-title">序号</th>
        <th class="table-title">商品名称</th>
        <th class="table-title">条码</th>
        <th class="table-title">包装单位</th>
        <th class="table-title">规格</th>
        <th class="table-title" v-if="show && newStore == 'false'">配送价</th>
        <th class="table-title" v-if="newStore == 'false'">零售价</th>
        <th class="table-title">出库数量</th>
        <th class="table-title" v-if="show && newStore == 'false'">配送总额</th>
        <th class="table-title" v-if="newStore == 'false'">零售总额</th>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in details.items">
          <td>{{index + 1}}</td>
          <td>{{item.productName}}</td>
          <td>{{item.barcode}}</td>
          <td>{{item.packingType}}</td>
          <td>{{item.spec}}</td>
          <td v-show="show && newStore == 'false'">{{priceNum(item.wholesalePrice)}}</td>
          <td v-if="newStore == 'false'">{{priceNum(item.retailPrice)}}</td>
          <td>{{item.quantity}}</td>
          <td v-show="show && newStore == 'false'">{{NP.times(priceNum(item.wholesalePrice), item.quantity)}}</td>
          <td v-if="newStore == 'false'">{{NP.times(priceNum(item.retailPrice), item.quantity)}}</td>
        </tr>
        <tr>
          <td class="last-item status" :colspan="(show || companyRoleName == '仓库') ? 5 : 5">状态：{{filterStatus(details.status, outGoingType)}}</td>
          <td v-if="newStore == 'false'" class="last-item">合计</td> 
          <td v-if="newStore == 'false'" class="last-item">{{totalCount}}</td>
          <td v-show="show && newStore == 'false'"  class="last-item">{{totalCost}}</td>
          <td v-if="newStore == 'false'" class="last-item">{{totalAmount}}</td>
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
      <div class="col-half" v-if="details.checkEmployeeName">审核人：{{`${details.checkEmployeeName || '--'}/${details.checkUser || '--'}`}}</div>
      <div class="col-half" v-if="details.checkTime">审核时间： {{details.checkTime}}</div>
    </div>
    <div class="row">
      <div class="col-half">操作人/审核人： {{details.operator || '--'}} / {{details.operatorPhone || '--'}}</div>
      <!-- <div class="col-half">物流信息： {{details.logisticsCompany || '--'}} / {{details.logisticsNumber || '--'}}</div> -->
    </div>
    <div class="row">
      <div class="col-half">出库人： {{details.outStockEmployeeName || '--'}} / {{details.outStockUser || '--'}}</div>
    </div>
    <div class="time">打印时间: {{moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
  </div>
</template>
<script>
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
import JsBarcode from 'jsbarcode'
import moment from 'moment'
import { outGoingType } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  name: 'stockMangement-outstockOutput',
  data() {
    return {
      NP,
      moment,
      filterStatus,
      outGoingType,
      companyName: ''
    }
  },
  props: {
    details: Object,
    show: Boolean
  },
  created() {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取企业名称
    const { companyName = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyName = companyName
    this.newStore = newStore
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
      if (this.details.items && this.details.items.length > 0) {
        this.details.items.forEach(item => {
          count = NP.plus(item.quantity, count)
        })
      }
      return count
    },
    totalAmount() {
      let amount = 0
      if (this.details.items && this.details.items.length > 0) {
        this.details.items.forEach(item => {
          amount = NP.plus(NP.times(NP.divide(item.retailPrice || 0, 100), item.quantity), amount)
        })
      }
      return amount
    },
    totalCost() {
      let amount = 0
      if (this.details.items && this.details.items.length > 0) {
        this.details.items.forEach(item => {
          amount = NP.plus(NP.times(NP.divide(item.wholesalePrice || 0, 100), item.quantity), amount)
        })
      }
      return amount
    }
  }
}
</script>
