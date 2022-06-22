<template>
  <section class="page-desk">
    <el-card class="card">
      <div class="item-title">常用功能</div>
      <el-row>
        <el-col :span="6" v-show="isAuthMenu(item.isauth) && (item.id != 2 || (item.id == 2 && storeRoleName === '店长'))" :key="item.id" v-for="item in goListOne">
          <div class="item-container first-line" @click="goList(item.router)" v-if="selfBusinessFlag == false ? item.id!=2 :item.id">
            <icon-svg :name="item.icon" class="item-icon theme-color"></icon-svg>
            {{item.name}}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card">
      <div class="item-title">重要提醒</div>
      <el-row>
        <el-col v-show="isAuthMenu(item.isauth)" :span="8" :key="item.id" v-for="item in goListTwo">
          <div class="item-container second" @click="goList(item.router, item.params)">
            {{item.name}}: <span class="itam-value theme-color" style="margin-left:8px;">{{item.value}}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card" v-if="storeRoleName === '店长'">
      <div class="item-title max-title">
        <div style="float: left;">运营分析报告</div>
        <el-form class="filter-container">
          <el-tooltip placement="top">
            <div slot="content" style="width: 360px;">
              总销售额：零售订单金额 + 礼品卡订单金额 - 退货单金额<br/>
              <br/>
              毛利：总销售额 - 成本<br/>
              <br/>
              销售订单数：零售订单 + 礼品卡订单 + 退货单的订单数<br/>
              <br/>
              总充值金额：充值订单金额 - 充值退款金额<br/>
              <br/>
              储值卡订单数：充值订单 + 充值退款订单数量<br/>
              <br/>
              记账：收入 - 支出<br/>
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          <el-radio-group v-model="date" :disabled="turnoverLoading" @change="changeDate" size="small">
            <el-radio label="yesterday" border>昨天</el-radio>
            <el-radio label="today" border>今天</el-radio>
            <el-radio label="last" border>上月</el-radio>
            <el-radio label="month" border>本月</el-radio>
          </el-radio-group>
          <icon-svg v-show="!datePicker" name="desk-plus" class="item-icon date-change-ctr" @click.native="showDatePicker"></icon-svg>
          <el-form-item v-show="datePicker" class="gt-inline-item customer-date-picker">
            <gt-time-range
              start-time-prop="effectiveBeginDate"
              :start-time-value="start"
              :end-time-value="end"
              end-time-prop="effectiveEndDate"
              valueFormat="yyyy-MM-dd"
              @changeStartValue="value => dateRange(value, 'start')"
              @changeEndValue="value => dateRange(value, 'end')"
              type="date"
            ></gt-time-range>
          </el-form-item>
        </el-form>

      </div>
      <el-row class="maintain" v-loading="turnoverLoading">
        <el-col class="item-info">
          <el-tooltip placement="top">
            <div slot="content">
              <div>零售订单：{{priceNum(turnoverData.retail)}}</div>
              <br/>
              <div>礼品卡订单：{{priceNum(turnoverData.statCard)}}</div>
              <br/>
              <div>退货订单：-{{priceNum(turnoverData.refund)}}</div>
              <br/>
            </div>
            <div class="item-value theme-color">
              {{priceNum(turnoverData.turnover) || 0}}
            </div>
          </el-tooltip>
          <div class="item-label">总销售额(元)</div>
        </el-col>
        <el-col class="item-info" v-if="hasAuthorization"><div class="item-value theme-color">{{priceNum(turnoverData.profit) || 0}}</div><div class="item-label">毛利(元)</div></el-col>
        <el-col class="item-info"><div class="item-value theme-color">{{turnoverData.orders || 0}}</div><div class="item-label">销售笔数</div></el-col>
        <el-col class="item-info">
          <el-tooltip placement="top">
            <div slot="content">
              <div>充值订单：{{priceNum(turnoverData.recharge)}}</div>
              <br/>
              <div>充值退款订单：-{{priceNum(turnoverData.refundRecharge)}}</div>
              <br/>
            </div>
            <div class="item-value theme-color">{{priceNum(turnoverData.recharge - turnoverData.refundRecharge) || 0}}</div>
          </el-tooltip>
          <div class="item-label">总充值金额（元）</div>
        </el-col>
        <el-col class="item-info"><div class="item-value theme-color">{{turnoverData.rechargeOrders + turnoverData.refundRechargeOrders}}</div><div class="item-label">充值笔数</div></el-col>
        <el-col class="item-info" style="border-right: 0;">
          <el-tooltip placement="top">
            <div slot="content">
              <div>收入：{{priceNum(turnoverData.revenueAmount)}}</div>
              <br/>
              <div>支出：-{{priceNum(turnoverData.expendAmount)}}</div>
              <br/>
            </div>
            <div class="item-value theme-color">{{priceNum(turnoverData.revenueAmount - turnoverData.expendAmount)}}</div>
          </el-tooltip>
          <div class="item-label">记账(元)</div>
        </el-col>
      </el-row>
      <div class="item-title max-title" style="margin-top: 30px;">
        <el-form class="filter-container">
          <el-radio-group v-model="month" :disabled="chartLoading" @change="changeMonth" size="small">
            <el-radio label="lastMonth" border>上月</el-radio>
            <el-radio label="currentMonth" border>本月</el-radio>
          </el-radio-group>
          <icon-svg v-show="!monthPicker" name="desk-plus" class="item-icon date-change-ctr" @click.native="showMonthPicker"></icon-svg>
          <el-form-item v-show="monthPicker" class="gt-inline-item customer-date-picker">
            <gt-time-range
              start-time-prop="effectiveBeginMonth"
              :start-time-value="startMonth"
              :end-time-value="endMonth"
              valueFormat="yyyy-MM"
              end-time-prop="effectiveEndMonth"
              @changeStartValue="value => monthRange(value, 'startMonth')"
              @changeEndValue="value => monthRange(value, 'endMonth')"
              type="month"
            ></gt-time-range>
          </el-form-item>
        </el-form>
      </div>
      <section v-loading="chartLoading">
        <el-row style="margin: 10px 0 15px;">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right: 10px;">
            <div class="sub-title">交易历史</div>
            <div class="chart-border">
              <div id="trade_history" class="trade-history my-echart"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-left: 10px;">
            <div class="sub-title">
              商品大类销售分析
              <el-tooltip placement="top" content="在统计时间内，各商品大类的销售额、毛利的统计及占比">
                <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <div class="chart-operate">
                <div class="operate-label" @click="() => changeChart('pie')"><icon-svg :class="{'theme-color': chartType === 'pie'}" name="pie"/></div>
                <div class="operate-label" @click="() => changeChart('bar')"><icon-svg :class="{'theme-color': chartType === 'bar'}" name="columnar"/></div>
              </div>
            </div>
            <div class="chart-border">
              <div id="category_bar" v-show="chartType === 'bar'" class="category-bar my-echart"></div>
              <div id="category_pie" v-show="chartType === 'pie'" class="category-pie my-echart"></div>
              <el-row class="bar-title" v-show="chartType === 'pie'">
                <el-col :span="hasAuthorization ? 12 : 24">
                  销售额占比
                </el-col>
                <el-col v-if="hasAuthorization" :span="12">
                  毛利占比
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin:  30px 0 15px;">
          <div class="sub-title">
            商品销量排名
            <span class="theme-color" style="float:right;cursor:pointer;" @click="moreRanking()">查看更多销售状况分析>></span>
          </div>
          <el-col :span="12" style="padding: 0 5px;">
            <div class="chart-border rank-container">
              <div class="salesRank">
                畅销TOP50
                <div class="sales-list" v-if="skusDesc && skusDesc.length > 0">
                  <gt-sku-bar :total="countTotal" :price="item.netSale" :infoleft="`${item.productName} ${item.barcode || ''} ${item.spec || '默认规格'} ${item.firstCategory ? item.firstCategory + '>' + item.category: ''}`" :count="item.netCount" :index="index" :key="index" v-for="(item, index) in skusDesc" />
                </div>
                <div class="list-empty" v-else>暂无数据</div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" style="padding-left: 10px;">
            <div class="chart-border rank-container">
              <div class="salesRank">
                滞销TOP50
                <div class="sales-list" v-if="skusAsc && skusAsc.length > 0">
                  <gt-sku-bar :total="countTotal" :price="item.netSale" :infoleft="`${item.productName} ${item.barcode || ''} ${item.spec || '默认规格'} ${item.firstCategory ? item.firstCategory + '>' + item.category: ''}`" :count="item.netCount" :index="index" :key="index" v-for="(item, index) in skusAsc" />
                </div>
                <div class="list-empty" v-else>暂无数据</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin:  30px 0 15px;">
          <el-col :span="12" style="padding: 0 5px;">
            <div class="sub-title">
              顾客增长
              <el-tooltip placement="top" content="统计时间内，门店顾客增长趋势">
                <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <div style="float:right;">总数<span class="theme-color">{{customerData.all}}</span></div>
            </div>
            <div class="chart-border">
              <div id="customer_history" class="trade-history my-echart"></div>
            </div>
          </el-col>
          <el-col :span="12" style="padding-left: 10px;">
            <div class="sub-title">
              员工业绩
              <el-tooltip placement="top" content="统计时间内，销售业绩排名前10位的员工">
                <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </div>
            <div class="chart-border list-container">
              <div v-if="employeeDatas && employeeDatas.length > 0">
                <div v-if="moment(start).month() === moment(end).month()">
                  <gt-process :infoleft="`${staff.name}/${staff.phone}`" :inforight="staff.storeName" :key="staff.id" unit="销售业绩/指标" :value="priceNum(staff.performance)" :total="priceNum(staff.indicator)" v-for="staff in employeeDatas" />
                </div>
                <div v-else>
                  <gt-process :infoleft="`${staff.name}/${staff.phone}`" :inforight="staff.storeName" :key="staff.id" unit="销售业绩" :value="priceNum(staff.performance)" :total="priceNum(staff.performance)" v-for="staff in employeeDatas" />
                </div>
              </div>
              <div class="list-empty" v-else>暂无数据</div>
            </div>
          </el-col>
        </el-row>
      </section>
    </el-card>
  </section>
</template>
<script>
import gtProcess from '@/components/gt-process'
import echarts from 'echarts'
import moment from 'moment'
import gtTimeRange from '@/components/gt-time-range'
import NP from 'number-precision'
import gtSkuBar from '@/components/gt-sku-bar'
import { getWorkData, getRemind } from '@/service/workbench'
import * as api from '@/service/goods'
export default {
  data() {
    return {
      selfBusinessFlag:null,
      hasAuthorization: false,
      turnoverLoading: false,
      chartLoading: false,
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      storeRoleName: '',
      date: 'month',
      startMonth: moment().format('YYYY-MM'),
      endMonth: moment().format('YYYY-MM'),
      month: 'currentMonth',
      moment,
      // 营业信息汇总
      turnoverData: {},
      // 各门店销售额统计
      orderDatas: [],
      // 企业顾客统计
      customerData: {
        all: 0, // 新增顾客数量
        items: [] //按照门店统计
      },
      skusAsc: [],
      skusDesc: [],
      // 员工业绩统计
      employeeDatas: [],
      // 交易历史
      turnoverDataDays: [],
      // 商品大类
      saleDatas: [],
      // 商品大类分析
      saleRatioDatas: [],
      chartType: 'bar',
      datePicker: false,
      monthPicker: false,
      saleHistory: null,
      customerHistory: null,
      categorySale: null,
      categoryPie: null,
      goListOne: [
        {id:1,icon: 'desk-stock',isauth:'stock',router:'stockManagement-instock-interStockAdd',name:'新增入库单'},
        {id:2,icon: 'desk-goods',isauth:'goods',router:'goods-add-or-update',name:'商品新增'},
        {id:3,icon: 'desk-customer',isauth:'customer',router:'mycustomer-add-or-update',name:'新增顾客'},
        {id:4,icon: 'desk-order',isauth:'order',router:'order-retailOrder-order',name:'订单管理'}
      ],
      goListTwo: [
        {id:1,isauth:'order',router:'order-retailOrder-order', params: {stage: 'NOSHIP'}, name:'待发货订单', value: 0},
        // {id:2,isauth:'order',router:'order-returnOrder-order', params: {stage: 'WAIT_REFUND'},name:'待审核订单', value: 0},
        // {id:3,isauth:'order',router:'order-order',name:'预约订单', value: 0},
        {id:3,isauth:'stock',router:'stockManagement-stockManagement',name:'库存预警SKU', value: 0,params:{showStockWarn:'YES'}},
      ]
    }
  },
  components: {
    gtProcess,
    gtTimeRange,
    gtSkuBar
  },
  created() {
    this.getSelfBusiness()
    const { storeRoleName = '', hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    //上面的
    this.getTurnoverData()
    //下面的
    if (storeRoleName === '店长') {
      this.getChartData()
    }
    this.remind()
  },

  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth }
    },
  },
  mounted() {
    window.addEventListener('resize', () =>{
      if (this.saleHistory && this.categorySale && this.categoryPie && this.customerHistory) {
        this.saleHistory.resize()
        this.categorySale.resize()
        this.customerHistory.resize()
        this.categoryPie.resize()
      }
    })
  },
  methods: {
     //是否允许自营商品
    async getSelfBusiness(){
      const { data } = await  api.getSelfBusiness()
      if (data.code === 0) {
        console.log(data.data);
        this.selfBusinessFlag = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    //更多
    moreRanking(){
      this.$router.push({name: 'survey-salesAnalysis'})
    },
    // 切换柱状图和饼图
    changeChart(type) {
      this.chartType = type
      this.$nextTick(() => {
        if (this.categorySale && this.categoryPie) {
          this.categorySale.resize()
          this.categoryPie.resize()
        }
      })
    },

    // 改变时间段（上面的）
    dateRange(value, type) {
      if (type === 'start') {
        this.start = value
      } else if (type === 'end') {
        this.end = value
      }
      if (this.start && this.end) {
        this.getTurnoverData()
      }
    },

    // 改变时间段（下面的）
    monthRange(value, type) {
      if (type === 'startMonth') {
        this.startMonth = value
      } else if (type === 'endMonth') {
        this.endMonth = value
      }
      if (this.startMonth && this.endMonth) {
        this.getChartData()
      }
    },

    // 重要提醒
    async remind() {
      const { data } = await getRemind()
      if (data.code === 0) {
        this.goListTwo[0].value = data.data.waitShipments
        // this.goListTwo[1].value = data.data.waitReturnOrder
        // this.goListTwo[2].value = data.data.subscribe
        this.goListTwo[1].value = data.data.stockWarn
      } else {
        this.$message.error(data.msg)
      }
    },
    //下面的
    async getChartData() {
      this.chartLoading = true
      const { data } = await getWorkData({
        start: moment(this.startMonth).startOf('month').format('YYYY-MM-DD'),
        end: moment(this.endMonth).endOf('month').format('YYYY-MM-DD'),
        report:false,
      })
      if (data.code === 0) {

        /**
         * 列表汇总
         */
        // 各门店销售额统计
        this.orderDatas = data.data.orderDatas
        // 各门店顾客统计
        this.customerData = {
          all: 0,
          items: [],
          ...data.data.customerData
        }
        // 各门店顾客统计
        this.employeeDatas = data.data.employeeDatas

        //SKU畅销TOP50
        this.skusDesc = data.data.skusDesc
        //SKU滞销TOP50
        this.skusAsc = data.data.skusAsc
        // countTotal
        this.countTotal = data.data.skusDesc && data.data.skusDesc.length > 0 ? data.data.skusDesc[0].netCount : 1

        /**
         * 图表汇总
         */
        // 销售业绩
        this.turnoverDataDays = data.data.turnoverDataDays
        // 类别业绩
        this.saleDatas = data.data.saleDatas
        // 类别分析
        this.saleRatioDatas = data.data.saleRatioDatas

        this.initSaleHistory()
        this.initCategorySale()
        this.initCategoryPie()
        this.initCustomer()
      } else {
        this.$message.error(data.msg)
      }
      this.chartLoading = false
    },
    //上面的
    async getTurnoverData() {
      this.turnoverLoading = true
      const { data } = await getWorkData({
        start: this.start,
        end: this.end,
        report:true,
      })
      if (data.code === 0) {
        // 销售额汇总
        this.turnoverData = data.data.turnoverData
      } else {
        this.$message.error(data.msg)
      }
      this.turnoverLoading = false
    },

    // 切换成日期选择
    showDatePicker() {
      if (this.turnoverLoading) {
        return
      }
      if (!this.datePicker) {
        // this.start = null,
        // this.end = null,
        this.date = ''
      }
      this.datePicker = !this.datePicker
    },
    // 选择日期（上面的）
    changeDate(value) {
      this.datePicker = false
      let start = ''
      let end = ''
      switch(value) {
      case 'today':
        start = moment()
        end = moment()
        break
      case 'yesterday':
        start = moment().subtract(1, 'days')
        end = moment().subtract(1, 'days')
        break
      case 'month':
        start = moment().startOf('month')
        end = moment()
        break
      case 'last':
        start = moment().startOf('month').subtract(1, 'month')
        end = moment().endOf('month').subtract('month',1).endOf('month')
      default:
        break
      }
      this.start = start.format('YYYY-MM-DD')
      this.end = end.format('YYYY-MM-DD')
      this.getTurnoverData()
    },

    // 切换成月份选择
    showMonthPicker() {
      if (this.chartLoading) {
        return
      }
      if (!this.monthPicker) {
        this.month = ''
      }
      this.monthPicker = !this.monthPicker
    },
    // 选择日期（下面的）
    changeMonth(value) {
      this.monthPicker = false
      let start = ''
      let end = ''
      switch(value) {
      case 'currentMonth':
        start = moment()
        end = moment()
        break
      case 'lastMonth':
        start = moment().subtract(1, 'month')
        end = moment().subtract(1, 'month')
      default:
        break
      }
      this.startMonth = start.format('YYYY-MM')
      this.endMonth = end.format('YYYY-MM')
      this.getChartData()
    },

    // 交易历史
    initSaleHistory () {
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color: this.hasAuthorization ? ['#ef6c00', '#6382c1', '#f8c348'] : ['#ef6c00', '#f8c348'],
        legend: {
          top: 10,
          right: 20,
          data: this.hasAuthorization ? ['销售额','毛利', '交易订单数'] : ['销售额', '交易订单数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.turnoverDataDays.map(item => item.date),
          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        },
        yAxis: [{
          name: '金额(元)',
          type: 'value',

          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        }, {
          name: '单',
          type: 'value',
          splitLine:{
            show:false
          },

          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        }],
        series: this.hasAuthorization ? [
          {
            name:'销售额',
            type:'line',
            data:this.turnoverDataDays.map(item => this.priceNum(item.turnover)),
          },
          {
            name:'毛利',
            type:'line',
            data:this.turnoverDataDays.map(item => this.priceNum(item.profit)),
          }, {
            name:'交易订单数',
            type:'line',
            yAxisIndex: 1,
            data:this.turnoverDataDays.map(item => item.orders),
          }
        ] : [
          {
            name:'销售额',
            type:'line',
            data:this.turnoverDataDays.map(item => this.priceNum(item.turnover)),
          }, {
            name:'交易订单数',
            type:'line',
            yAxisIndex: 1,
            data:this.turnoverDataDays.map(item => item.orders),
          }
        ]
      }
      this.saleHistory = echarts.init(document.getElementById('trade_history'))
      this.saleHistory.setOption(option)
    },
    // 大类商品销售
    initCategorySale() {
      var option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        color: ['#ef6c00', '#6382c1'],
        legend: {
          top: 10,
          right: 20,
          data:this.hasAuthorization ? ['销售额','毛利'] : ['销售额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : this.saleDatas.map(item => item.categoryName),
            axisLabel: {
              interval:0,
              rotate:30,
              textStyle: {
                fontSize: 10,
                color: '#72716F',
              }
            }
          }
        ],
        yAxis : [
          {
            name: '金额(元)',
            type: 'value',

            axisLabel: {
              textStyle: {
                color: '#72716F'
              }
            }
          }
        ],
        series : this.hasAuthorization ? [
          {
            name:'销售额',
            type:'bar',
            barMaxWidth: 10,
            data: this.saleDatas.map(item => this.priceNum(item.sales))
          },
          {
            name:'毛利',
            type:'bar',
            barMaxWidth: 10,
            data: this.saleDatas.map(item => this.priceNum(item.profit))
          },
        ] : [
          {
            name:'销售额',
            type:'bar',
            barMaxWidth: 10,
            data: this.saleDatas.map(item => this.priceNum(item.sales))
          }
        ]
      }
      this.categorySale = echarts.init(document.getElementById('category_bar'))
      this.categorySale.setOption(option)
    },
    // 饼图
    initCategoryPie() {
      let series = [{
        name:'销售额',
        type:'pie',
        radius : 80,
        center : this.hasAuthorization ? ['25%', '50%'] : ['50%', '50%'],
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        data:this.saleDatas.map(item => {
          return {
            value: this.priceNum(item.sales),
            name: item.categoryName
          }
        })
      }]
      if (this.hasAuthorization) {
        series.push({
          name:'毛利',
          type:'pie',
          radius : 80,
          center : ['75%', '50%'],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          data: this.saleDatas.map(item => {
            return {
              value: item.profit > 0 ? this.priceNum(item.profit) : 0,
              name: item.categoryName
            }
          })
        })
      }
      let option = {
        tooltip : {
          trigger: 'item',
          formatter: '{b} <br/>{a} : {c}(元) <br/>占比 : {d}%'
        },
        legend: {
          x : 'center',
          y : 'bottom',
          bottom: 10,
          data: this.saleDatas.map(item => item.categoryName)
        },
        calculable : true,
        color: ['#ef6c00', '#f8c348', '#f7c0b3', '#ee789d', '#db4c2d', '#d17a01', '#bcd864', '#e9e6c3', '#61b5a9', '#6382c1', '#c4d1e3'],
        series
      }
      this.categoryPie = echarts.init(document.getElementById('category_pie'))
      this.categoryPie.setOption(option)
    },
    // 顾客增长
    initCustomer() {
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#109feb'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.customerData.items.map(item => item.date),
          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        },
        yAxis: [{
          name: '数量',
          type: 'value',

          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        }],
        series: [
          {
            name:'顾客',
            type:'line',
            data:this.customerData.items.map(item => item.addCount),
          }
        ]
      }
      this.customerHistory = echarts.init(document.getElementById('customer_history'))
      this.customerHistory.setOption(option)
    },

    // 页面跳转
    goList(url, params){
      this.$router.push({name:url, params})
    },
  },
  watch: {
    documentWidth(val) {
      if (this.saleHistory && this.categorySale && this.categoryPie && this.customerHistory) {
        this.saleHistory.resize()
        this.customerHistory.resize()
        this.categorySale.resize()
        this.categoryPie.resize()
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      console.log('移除resize')
    })
  },
}
</script>
<style lang="scss">
.page-desk{
  color: #aaa;
  .salesRank{
    font-size: 14px;
    margin: 10px 0;
    .sales-list{
      margin-top: 10px;
      height: 300px;
      overflow-y: scroll;
    }
  }
  .money {
    margin-top: 20px;
    span {
      margin-right: 15px;
      font-size: 15px;
    }
  }
  .item-title {
    font-size: 16px;
    color: #535353;
    &.max-title{
      line-height: 32px;
      overflow: hidden;
    }
  }
  .item-container{
    padding: 20px 0;
    border: 2px solid #f0f2f3;
    text-align: center;
    font-size: 16px;
    margin: 15px 10px;
    cursor: pointer;
    &.first-line{
      padding-top: 10px;
      color: #72716F;
    }
    &.second{
      font-size: 14px;
      padding: 10px;
      color: #72716F;
    }
    .item-icon{
      position: relative;
      top: 7px;
      margin-right: 16px;
      font-size: 30px;
    }
  }
  .card {
    margin-bottom: 15px;
  }
  .my-echart{
    width: 100%;
    height: 300px;
  }
  .chart-operate{
    position: absolute;
    right: 10px;
    top: -5px;
    .operate-label{
      width: 50px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      background-color: #fff;
      margin: 0 10px;
      margin-left: -15px;
      font-size:20px;
      cursor: pointer;
      float: right;
    }
  }
  .maintain{
    background-color: #f7f7f7;
    padding: 20px;
    margin: 8px 0;
    border-radius: 10px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .item-info{
      border-right: 1px solid #eaeaea;
      &:last-child{
        border-right: none;
      }
      .item-value{
        font-size: 28px;
        margin-bottom: 10px;
      }
      .item-label{
        font-size: 14px;
        color: #72716F;
      }
    }
  }
  .chart-border{
    position: relative;
    border: 2px solid #f0f2f3;
    min-height: 200px;
    border-radius: 10px;
    padding: 0 15px;
    .bar-title{
      position: absolute;
      width: 100%;
      top: 30px;
      left: 0;
      .el-col{
        text-align: center;
        font-size: 14px;
      }
    }
  }
  .sub-title{
    font-size: 14px;
    color: 666;
    margin-bottom: 15px;
  }
  .inner-content{
    margin-bottom: 10px;
    .content-label{
      font-weight: bold;
    }
  }
  .filter-container{
    height: 40px;
    float:right;
    overflow: hidden;
    .el-radio{
      border: none;
    }
    .el-radio__input{
      display: none;
    }
    .el-radio__label{
      padding-left: 5px;
    }
    .customer-date-picker{
      margin-left: 10px;
      width: 460px;
      float: right;
    }
  }

  .date-change-ctr{
    cursor: pointer;
    position: relative;
    top: 5px;
  }
  .list-container{
    height: 310px;
    overflow-y: scroll;
    .list-empty{
      margin-top: 50px;
      width: 100%;
      text-align: center;
    }
  }
  .rank-container{
    .list-empty{
      margin-top: 50px;
      width: 100%;
      text-align: center;
    }
  }

  .store-container{
    .store-item{
      padding: 15px 0;
      border-bottom: 1px solid #eaeaea;
      &:last-child{
        border-bottom: none;
      }
      .store-info{
        font-size: 14px;
        margin-bottom: 5px;
        overflow: hidden;
        .right {
          float: right;
        }
      }
      .store-owner{
        font-size: 12px;
      }
    }
  }
}
.info-left,.info-right,.unit-left,.unit-right {
  color: #72716F;
}
</style>
