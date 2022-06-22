<template>
  <div class="output-page-bill" id="company-total-outstock">
    <div class="title">{{companyName}}出库单</div>
    <div class="float-row">
      <div class="col-3" v-if="details.orderNo">出库单号： {{details.orderNo}}</div>
      <!-- <div class="col-3" v-if="details.reqStockOrderNo">订货单号： {{details.reqStockOrderNo}}</div> -->
      <div class="col-3" v-if="details.linkOrderNo">关联单号： {{details.linkOrderNo}}</div>
      <div class="col-3" v-if="details.storeName">收货单位： {{details.storeName}}</div>
      <div class="col-3" v-if="details.status">出库状态： {{details.status}}</div>
      <div class="col-6" v-if="details.time">出库时间： {{details.time}}</div>
    </div>
    <table class="output-table">
      <thead>
        <th class="table-title">序号</th>
        <th class="table-title">出库时间</th>
        <th class="table-title">出库单号</th>
        <th class="table-title" v-if="newStore == 'false'">出库数量</th>
        <th class="table-title" v-if="newStore == 'false'">配送总额</th-->
        <th class="table-title">目的门店</th>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in details.list">
          <td>{{index + 1}}</td>
          <td>{{item.outStockTime || '-'}}</td>
          <td>{{item.orderNo}}</td>
          <td v-if="newStore == 'false'">{{item.amount}}</td>
          <td v-if="newStore == 'false'">{{item.wholesalePriceAmount ? priceNum(item.wholesalePriceAmount) : 0}}</td-->
          <td>{{item.storeName || '-'}}</td>
        </tr>
        <tr>
          <td class="last-item status" :colspan="6" v-if="newStore == 'false'">合计出库数量：{{totalCount}}  合计配送总额：{{totalAmount}}</td>
          <!--td class="last-item status" :colspan="6" v-else>合计配送总额：{{totalAmount}}</td-->
        </tr>
      </tbody>
    </table>
    <div class="time">打印时间: {{moment().format('YYYY-MM-DD HH:mm:ss')}}</div>
  </div>
</template>
<script>
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'stockMangement-outstock-total-output',
  data() {
    return {
      NP,
      moment,
      companyName: ''
    }
  },
  props: {
    details: Object
  },
  created() {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取企业名称及是否为二代店
    const { companyName = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyName = companyName
    this.newStore = newStore
  },

  computed: {
    totalCount() {
      let count = 0
      if (this.details.list && this.details.list.length > 0) {
        console.log(this.details.list)
        this.details.list.forEach(item => {
          count = NP.plus(item.amount, count)
        })
      }
      return count
    },
    totalAmount() {
      let amount = 0
      if (this.details.list && this.details.list.length > 0) {
        this.details.list.forEach(item => {
          // amount = NP.plus(NP.times(NP.divide(item.wholesalePriceAmount || 0, 100), item.amount), amount)
          amount = NP.plus(NP.divide(item.wholesalePriceAmount || 0, 100), amount)
        })
      }
      return amount
    }
  }
}
</script>
