<template>
  <div class="mod-store customers page-customer-list">
    <el-card>
      <gt-active-advance ref="activeAdvance"  @refreshSearch="getList"/>
    </el-card>
    <!-- 更多查询 -->
    <img class="more-icon"  @click="showFlag" :src="`static/img/mycustomer/${isFlag?'page-close.png': 'page-open.png'}`" />

    <!-- table列表 -->
    <el-card class="mode-store-table card1">
      <el-row class="resultInfo">
        <el-col :span="6" class="item-info"><div class="item-value theme-color">¥{{priceNum(allCount.totalAmount)}}</div>
        <div class="item-label">交易流水
          <el-tooltip placement="top">
            <div slot="content" style="width: 120px;">
              活动订单实付金额
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        </div>
        </el-col>
        <el-col :span="6" class="item-info"><div class="item-value theme-color">{{allCount.orders}}</div>
        <div class="item-label">交易单数
           <el-tooltip placement="top">
            <div slot="content" style="width: 680px;">
              【大转盘】：使用券下单的订单数（顾客到门店出示中奖券时，务必请在pos操作下单并且支付时使用优惠券核销，避免影响交易单数统计）
              【特卖/社区拼团】：下单支付成功的订单数
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        </div>
        </el-col>
        <el-col :span="6" class="item-info"><div class="item-value theme-color">{{allCount.click}}</div>
          <div class="item-label">点击
             <el-tooltip placement="top">
            <div slot="content" style="width: 120px;">
              云店点击活动的总次数
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          </div>
        </el-col>
        <el-col :span="6" class="item-info"><div class="item-value theme-color">{{allCount.conversion}}</div><div class="item-label">
            转化
           <el-tooltip placement="top">
            <div slot="content" style="width: 680px;">
              大转盘：活动中奖次数（有多少人次中奖，“谢谢参与”不计算转化）
              特卖/社区拼团：下单成功量（有多少人次订单支付成功）
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        </div>
        </el-col>
      </el-row>
      <gt-border-button class="gt-table-create" txt="下载查询结果" v-if="isAuth('store:customerCoupon:add')" type="bind" @click.native="downLoad()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="操作" v-if="isAuth('store:order:detail')">
          <template slot-scope="scope">
            <el-button class="nopadding" v-if="scope.row.status == 'NO_USE'&&scope.row.prizeType!='CUSTOMEIZE'" type="text" size="small" @click="delayHandle(scope.row.id)">延期</el-button>
            <span v-if="scope.row.status == 'NO_USE'&&scope.row.prizeType!='CUSTOMEIZE'">|</span>
            <el-button class="nopadding" v-if="scope.row.status == 'NO_USE'" type="text" size="small" @click="remsgHandle(scope.row.id)">补短信</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="orderType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单来源">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.orderType, orderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="paidAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="交易金额">
          <template slot-scope='scope'>
            <span>{{priceNum(scope.row.paidAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer"
          min-width="180"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span v-if="scope.row.customer">{{scope.row.customer}}/</span>
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activity"
          min-width="120"
          :show-overflow-tooltip="true"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="usedStoreName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="核销门店">
          <template slot-scope="scope">
            <span>{{scope.row.usedStoreName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activityType"
          min-width="120"
          :show-overflow-tooltip="true"
          label="活动类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.activityType, activeType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="couponCode"
          min-width="150"
          :show-overflow-tooltip="true"
          label="核销凭证">
          <template slot-scope="scope">
            <span v-if="scope.row.prize">{{(scope.row.prize).substring(4,(scope.row.prize).length) || '--'}}/</span>
            <span>{{scope.row.couponCode || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="120"
          :show-overflow-tooltip="true"
          label="类型/价值">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, zsType)}}/{{priceNum(scope.row.price) || '--'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="useTime"
          min-width="150"
          :show-overflow-tooltip="true"
          label="下单/核销时间">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, resultStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>

    <gt-delay ref="delay" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { resultStatus,activeType,orderType,zsType,worth } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import gtDelay from '../components/delay'
import * as api from '@/service/activity'
import { fileDownload } from '@/utils'
import gtActiveAdvance from '../components/activeResultAdvance'
export default {
  name:'campaign-wechatMarketing-activeResultList',
  data () {
    return {
      filterStatus,
      filterColor,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        activity: null,
        customer:'',
        activityType: '',
        status:'',
        startTime:null,
        endTime:null
      },
      allCount: {},
      resultStatus,
      activeType,
      orderType,
      zsType,
      worth,
      isFlag: false
    }
  },
  components: {
    gtPagination, gtActiveAdvance,gtDelay
  },
  created () {
    // 获取订单列表
    this.getDataList()
    this.getcount()
  },
  inject: ['exportList'],
  methods: {
    showFlag(){
      $('.button_check').toggle('1000')
      this.isFlag = !this.isFlag
    },
    async getcount(){
      const { data } = await api.getactivitycount({
        ...this.filterForm
      })

      if(data.code == 0){
        this.allCount = data.data
      }else{
        this.$message.error(data.msg)
      }

    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getactivityResult({
        page: this.currentPage,
        size: this.pageSize,
        ...this.filterForm
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }

    },
    // 延期
    delayHandle(id){
      this.$nextTick(() => {
        this.$refs.delay.init(id)
      })
    },
    // 补发短信
    remsgHandle(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '您确认向该顾客补发短信吗?',
        confirm: async () => {
          const { data } = await api.remsg(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('短信补发成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 下载查询结果
    async downLoad(){
      if(this.dataList.length>0){
        this.exportList(this.total, '活动运行结果', 'ACTIVITY_RESULT', this.filterForm, async () => {
          const { data } = await api.exportExcel({
            page: this.currentPage,
            size: this.pageSize,
            ...this.filterForm
          })
          fileDownload(data, '活动运行结果.xls')
        })
      }else{
        this.$message.warning('没有数据可以下载')
      }
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    getList(obj) {
      this.filterForm = obj.filterForm
      if (obj.type==='reset') {
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
      this.getcount()
    },
  }
}
</script>
<style lang="scss">
.page-customer-list{
  .more-icon{
    position: relative;
    top: -2px;
    width: 60px;
    left: calc(50% - 30px);
    cursor: pointer;
  }
}
.card1 .el-card__body {
  padding-top: 10px!important;
}
.resultInfo{
    background-color: #f7f7f7;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 10px;
    text-align: center;

    .item-info{
      border-right: 1px solid #eaeaea;
      &:last-child{
        border-right: none;
      }
      .item-value{
        font-size: 18px;
        margin-bottom: 3px;
      }
      .item-label{
        font-size: 14px;
        color: #72716F;
      }
    }
  }
</style>


