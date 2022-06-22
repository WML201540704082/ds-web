<template>
  <div class="output-page-bill" id="company-instock" style="display: none;">
    <div class="title">{{companyName}}入库单</div>
    <img class="barcode" id="barcode" />
    <div class="row">
      <div class="col-half">入库单号： {{details.orderNo || '--'}}</div>
      <div class="col-half">入库时间： {{details.inStockTime || '--'}}</div>
    </div>
    <div class="row">
      <div class="col-half">出库单位： {{details.returnStoreName || '--'}}</div>
      <!-- <div class="col-half">联系人 {{details.linkman || '--'}}/{{details.phone || '--'}}</div> -->
    </div>
    <table class="output-table">
      <thead>
        <th class="table-title">序号</th>
        <th class="table-title">商品名称</th>
        <th class="table-title">条码</th>
        <th class="table-title">规格</th>
        <th class="table-title" v-if="show">进货价</th>
        <th class="table-title" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">零售价</th>
        <th class="table-title">采购数量</th>
        <th class="table-title" v-if="show">进货总额</th>
        <th class="table-title" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">零售总额</th>
        <th class="table-title">赠送数量</th>
        <th class="table-title">入库数量</th>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in list">
          <td>{{index + 1}}</td>
          <td>{{item.productName}}</td>
          <td>{{item.barcode}}</td>
          <td>{{item.spec}}</td>
          <td v-if="show">{{priceNum(item.nowPurchasePrice)}}</td>
          <td v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{priceNum(item.retailPrice)}}</td>
          <td>{{item.buyQuantity}}</td>
          <td v-if="show">{{NP.times(priceNum(item.nowPurchasePrice), item.buyQuantity)}}</td>
          <td v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{NP.times(priceNum(item.retailPrice), item.buyQuantity)}}</td>
          <td>{{item.givenQuantity}}</td>
          <td>{{ item.productType == 'BULK' ? (item.quantity/1000) : item.quantity}}</td>
        </tr>
        <tr>
          <td class="last-item status" :colspan="show ? 5 : 4">状态：{{filterStatus(details.status, inStockstatus)}}</td>
          <td class="last-item" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">合计</td>
          <td class="last-item" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{newStore == 'false' ? totalCount : ''}}</td>
          <td v-if="show && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))" class="last-item">{{totalCost}}</td>
          <td class="last-item" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{totalAmount}}</td>
          <td class="last-item" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{newStore == 'false' ? totalGiven : ''}}</td>
          <td class="last-item" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">{{newStore == 'false' ? totalInstock : ''}}</td>
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
      <div class="col-half">操作人： {{details.operator || '--'}} / {{details.operatorPhone || '--'}}</div>
    </div>
    <div class="time">打印时间: {{moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
  </div>
</template>
<script>
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
import JsBarcode from 'jsbarcode'
import moment from 'moment'
import { inStockstatus } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  name: 'stockMangement-instockOutput',
  data() {
    return {
      NP,
      moment,
      filterStatus,
      inStockstatus,
      companyName: ''
    }
  },
  props: {
    details: Object,
    list: Array,
    show: Boolean
  },
  created() {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取是否为二代店
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
      if (this.list && this.list.length > 0) {
        this.list.forEach(item => {
          count = NP.plus(item.buyQuantity, count)
        })
      }
      return count
    },
    totalGiven() {
      let count = 0
      if (this.list && this.list.length > 0) {
        this.list.forEach(item => {
          count = NP.plus(item.givenQuantity, count)
        })
      }
      return count
    },
    totalInstock() {
      return NP.plus(this.totalGiven, this.totalCount)
    },
    totalAmount() {
      let amount = 0
      if (this.list && this.list.length > 0) {
        this.list.forEach(item => {
          amount = NP.plus(NP.times(NP.divide(item.retailPrice || 0, 100), item.buyQuantity),  amount)
        })
      }
      return amount
    },
    totalCost() {
      let amount = 0
      if (this.list && this.list.length > 0) {
        this.list.forEach(item => {
          amount = NP.plus(NP.times(NP.divide(item.nowPurchasePrice || 0, 100), item.buyQuantity), amount)
        })
      }
      return amount
    }
  }
}
</script>
