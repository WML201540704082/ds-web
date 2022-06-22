<template>
  <div class="mod-store survey-list-page">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="filter" :inline="true" ref='filter' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="时间">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="start"
            :start-time-value="filter.start"
            :end-time-value="filter.end"
            end-time-prop="end"
            @changeStartValue="value => filter.start = value"
            @changeEndValue="value => filter.end = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="所属企业" prop="companyId">
          <el-select v-model="filter.companyId" filterable placeholder="请选择企业" @change="getStoreList" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'>
          <el-select v-model="filter.storeId" placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table" v-loading="dataListLoading">
      <div class="maintain">
        <div class="item-info"><div class="item-value theme-color">￥ {{priceNum(info.paidAmount) || 0}}</div><div class="item-label">总销售额
          <el-tooltip placement="top">
            <div slot="content" style="width: 360px;">“零售订单” - “退货单” + “礼品卡订单”）中所有支付方式金额之和（实收之和）</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">{{info.totalOrders || 0}} 笔</div><div class="item-label">销售笔数
          <el-tooltip placement="top">
            <div slot="content">“零售订单”+“退货单”+“礼品卡订单”的查询结果订单数量之和（状态为“已完成&已退款”）</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">￥ {{priceNum(info.rechargeAmount) || 0}}</div><div class="item-label">总充值金额
          <el-tooltip placement="top">
            <div slot="content" style="width: 360px;">“充值订单”-“充值退款”中所有支付方式之和</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">{{info.rechargeOrders || 0}} 笔</div><div class="item-label">充值笔数
          <el-tooltip placement="top">
            <div slot="content">“充值订单”+“充值退款”数量之和</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">￥ {{priceNum(info.revenueAmount) || 0}}</div><div class="item-label">收入金额
          <el-tooltip placement="top">
            <div slot="content">记账中的“收入”金额之和</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">￥ {{priceNum(info.expendAmount) || 0}}</div><div class="item-label">支出金额
          <el-tooltip placement="top">
            <div slot="content">记账中的“支出”金额之和</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
        <div class="item-info"><div class="item-value theme-color">￥ {{priceNum(info.profit) || 0}}</div><div class="item-label">毛利
          <el-tooltip placement="top">
            <div slot="content">总销售额-销售成本+退货成本-礼品卡销售成本</div>
            <img class="answer" style="margin-left: 10px;" src="static/img/desk/answer.png" alt="" />
          </el-tooltip></div>
        </div>
      </div>
      <div class="table-list-item" :key="index" v-for="(item, index) in dataList">
        <div class="store-name">{{item.storeName}}</div>
        <el-table
          :data="item.salesData || []"
          border
          :stripe="true"
          show-summary
          :summary-method="summary"
          style="width: 100%;">
          <el-table-column
            prop="content"
            :show-overflow-tooltip="true"
            min-width="150"
            label="内容">
            <template slot-scope="scope">
              <span>{{filterName(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="survey"
            :show-overflow-tooltip="true"
            min-width="240"
            label="概况">
            <template slot-scope="scope">
              <span>{{filterSurvey(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cash"
            min-width="120"
            :show-overflow-tooltip="true"
            label="现金">
            <template slot-scope="scope">
              <span>{{ scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.cash)}` : priceNum(scope.row.cash)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="wechat"
            min-width="120"
            :show-overflow-tooltip="true"
            label="微信">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.wechat)}` : priceNum(scope.row.wechat)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alipay"
            :show-overflow-tooltip="true"
            min-width="120"
            label="支付宝">
            <template slot-scope="scope">
               <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.alipay)}` : priceNum(scope.row.alipay)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pwechat"
            min-width="120"
            :show-overflow-tooltip="true"
            label="个人微信">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.pwechat)}` : priceNum(scope.row.pwechat)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="palipay"
            :show-overflow-tooltip="true"
            min-width="120"
            label="个人支付宝">
            <template slot-scope="scope">
               <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.palipay)}` : priceNum(scope.row.palipay)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="card"
            min-width="120"
            :show-overflow-tooltip="true"
            label="储值卡">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.card)}` : priceNum(scope.row.card)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shoppingCard"
            min-width="120"
            :show-overflow-tooltip="true"
            label="购物卡">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.shoppingCard)}` : priceNum(scope.row.shoppingCard)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="swipe"
            min-width="120"
            :show-overflow-tooltip="true"
            label="刷卡">
            <template slot-scope="scope">
              <span>{{scope.row.type === 'WESHOP_REFUND' || scope.row.type === 'POS_REFUND' ||scope.row.type==='CARD_REFUND' || scope.row.type === 'POS_SHOPPING_CARD_REFUND' ? `-${priceNum(scope.row.swipe)}` : priceNum(scope.row.swipe)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import gtTimeRange from '@/components/gt-time-range'
import { number } from '@/utils'
import moment from 'moment'
export default {
  name:'survey-list',
  data () {
    return {
      number,
      dataList: [],
      dataListLoading: false,
      moment,
      info: {},
      companyList: [],
      storeList: [],
      filter:{
        companyId:'',
        storeId: '',
        start: null,
        end: null,
      }
    }
  },
  components: {
    gtTimeRange
  },
  async created () {
    this.filter.companyId = this.$route.query.companyId
    this.dataListLoading = true
    // 获取企业列表
    await this.getCompanyList()
    if (this.filter.companyId) {
      // 获取详情
      await this.getDataInfo()
      // 获取列表
      await this.getDataList()
      //获取门店列表
      await this.getStoreList(this.filter.companyId)
    }
    this.dataListLoading = false
  },
  methods: {
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
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
        const values = data.map(item => {
          if (item.type !== 'WESHOP_REFUND' && item.type !== 'POS_REFUND' && item.type !== 'CARD_REFUND' && item.type !== 'POS_SHOPPING_CARD_REFUND') {
            return Number(item[column.property])
          } else {
            return -Number(item[column.property])
          }
        })
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
      })
      return sums
    },
    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      this.filter.storeId = ''
      if (companyId) {
        const { data } = await this.$http({
          url: this.$http.adornUrl(`/baseinfo/mop/store/company/${companyId}`),
          method: 'get',
        })
        if (data && data.code === 0) {
          this.storeList = data.data
        } else {
          this.storeList = []
          this.$message.error(data.msg)
        }
      } else {
        this.storeList = []
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/company/stat/salesDetail'),
        method: 'get',
        params: this.$http.adornParams({
          ...this.filter,
          start: this.filter.start?moment(this.filter.start+' 00:00:00').valueOf():null,
          end:this.filter.end?moment(this.filter.end+' 23:59:59').valueOf(): null
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data || []
        } else {
          this.dataList = []
        }
      })
    },
    // 获取数据列表
    async getDataInfo() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/company/stat/salesInfo'),
        method: 'get',
        params: this.$http.adornParams({
          ...this.filter,
          start: this.filter.start?moment(this.filter.start+' 00:00:00').valueOf():null,
          end:this.filter.end?moment(this.filter.end+' 23:59:59').valueOf(): null
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.info = data.data
        } else {
          this.info = {}
        }
      })
    },
    // 筛选数组
    filterName(type) {
      let content = ''
      switch (type) {
      case 'WESHOP_ORDER':
        content = '商品销售（小程序）'
        break
      case 'POS_ORDER':
        content = '商品销售（POS）'
        break
      case 'WESAAS_ORDER':
        content = '移动开单'
        break
      case 'POS_RECHARGE':
        content = '储值卡充值（POS）'
        break
      case 'POS_STAT':
        content = '礼品卡销售（POS）'
        break
      case 'WESHOP_REFUND':
        content = '商品退货（小程序）'
        break
      case 'POS_REFUND':
        content = '商品退货（POS）'
        break
      case 'WESAAS_REFUND':
        content = '商品退款（店务助手）'
        break
      case 'CARD_REFUND':
        content = '储值卡充值退款（POS）'
        break
      case 'POS_SHOPPING_CARD_RECHARGE':
        content = '购物卡充值（POS）'
        break
      case 'POS_SHOPPING_CARD_REFUND':
        content = '购物卡退款（POS）'
        break
      default:
        content = '--'
        break
      }
      return content
    },

    // 显示内容
    filterSurvey(item) {
      let content = ''
      switch (item.type) {
      case 'WESHOP_ORDER':
        content = `金额:${this.priceNum(item.totalAmount)}元， 毛利:${this.priceNum(item.profit)}元， 单数:${item.orders}`
        break
      case 'POS_ORDER':
        content = `金额:${this.priceNum(item.totalAmount)}元， 毛利:${this.priceNum(item.profit)}元， 单数:${item.orders}`
        break
      case 'POS_RECHARGE':
        content = `充值:${this.priceNum(item.totalAmount)}，赠送:${this.priceNum(item.gift)}，单数:${item.orders}`
        break
      case 'POS_STAT':
        content = `金额:${this.priceNum(item.totalAmount)}，毛利:${this.priceNum(item.profit)}元，单数:${item.orders}`
        break
      case 'WESAAS_ORDER':
        content = `金额:${this.priceNum(item.totalAmount)}，毛利:${this.priceNum(item.profit)}元，单数:${item.orders}`
        break
      case 'WESHOP_REFUND':
        content = `金额:${this.priceNum(item.totalAmount)}，单数:${item.orders}`
        break
      case 'POS_REFUND':
        content = `金额:${this.priceNum(item.totalAmount)}，毛利:${this.priceNum(item.profit)}元，单数:${item.orders}`
        break
      case 'WESAAS_REFUND':
        content = `金额:${this.priceNum(item.totalAmount)}，单数:${item.orders}`
        break
      case 'CARD_REFUND':
        content = `金额:${this.priceNum(item.totalAmount)}，单数:${item.orders}`
        break
      case 'POS_SHOPPING_CARD_RECHARGE':
        content = `充值:${this.priceNum(item.totalAmount)}，赠送:${this.priceNum(item.gift)}，单数:${item.orders}`
        break
      case 'POS_SHOPPING_CARD_REFUND':
        content = `金额:${this.priceNum(item.totalAmount)}，单数:${item.orders}`
        break
      default:
        content = '--'
        break
      }
      return content
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['filter'].resetFields()
      }
      this.getDataList()
      this.getDataInfo()
    },
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/_variables.scss';

.survey-list-page{
  .answer {
    width: 18px;
    height: 18px;
  }
  .table-list-item{
    margin-bottom: 15px;
    .store-name{
      margin: 5px 0;
      font-size: 16px;
    }
  }
  .el-table{
    thead{
      .cell{
        line-height: 20px;
      }
    }
  }
  .has-gutter .cell{
    text-align: left;
    height: 36px;
    line-height: 36px;
    padding: 0 14px;
  }
  .maintain{
    display: flex;
    background-color: #f7f7f7;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 10px;
    text-align: center;
    justify-content: space-between;
    flex-direction: row;

    .item-info{
      border-right: 1px solid #eaeaea;
      width: 14%;
      &:last-child{
        border-right: none;
      }
      .item-value{
        font-size: 20px;
        margin-bottom: 10px;
      }
      .item-label{
        font-size: 14px;
        color: #72716F;
      }
      .theme-color {
        color: $--color-primary;
      }
    }
  }
}

</style>

