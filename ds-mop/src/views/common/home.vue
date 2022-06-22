<template>
  <div id="desk">
    <div class="allBox">
      <div class="listY desk-cygn">数据统计</div>
      <div class="listY1">
        <div class="listBox"   v-for="item in goLists" :key="item.id" v-show="isAuthMenu(item.isauth)||item.isauth==''"  @mouseover="overShow(item.id)" @mouseout="outHide()" @click="goList(item.router,item.type)">
          <span class="imgs">
            <img :src="'static/img/desk/'+item.img+'.png'" alt="" v-if="activeid!=item.id">
            <img :src="'static/img/desk/'+item.activeImg+'.png'" v-else />
          </span>
          <span class="imgTitle">
            <div class="name">{{item.name}}
              <el-tooltip placement="top" effect="dark" :content="item.content" v-if="item.isExit">
                <img class="answer" src="static/img/desk/answer1.png" v-if="activeid!=item.id" />
                <img class="answer" src="static/img/desk/answer2.png" v-else />
              </el-tooltip>
            </div>
            <div class="title" v-if="item.tabYuan == 'tradingFlow' && baseinfo.tradingFlow" style="color:#FC5A3D; overflow: hidden;margin-top: 0;" >
              <span style="margin: 5px 0 0 2px;float:left;" v-show="baseinfo.tradingFlow < 0">-</span><DigitRoll ref='digitroll' :rollDigits="baseinfo.tradingFlowInt" :flipStra = "flipStra3" />
              <div style="margin: 5px 0 0 2px; float:left;">.{{baseinfo.tradingFlowFloat}}元</div>
            </div>
            <div class="title" v-if="item.tabYuan == 'companyCount'">{{baseinfo.companyCount}}家</div>
            <div class="title" v-if="item.tabYuan == 'storeCount'">{{baseinfo.storeCount}}间</div>
            <!-- <div class="title" v-if="item.tabYuan == 'pendingCheck'">{{baseinfo.pendingCheck}}笔</div> -->
            <div class="title" v-if="item.tabYuan == 'pendingCompany'">{{baseinfo.pendingCompany}}家</div>
            <div class="title" v-if="item.tabYuan == 'pendingStore'">{{baseinfo.pendingStore}}间</div>
            <div class="title" v-if="item.tabYuan == 'shortmessage'">{{checkNum}}个</div>
            <div class="title" v-if="item.tabYuan == 'activi'">{{checkNumActivi}}个</div>

          </span>
        </div>
      </div>
    </div>

    <!-- 销售概况 -->
    <div class="desk-xsgk mod-demo-echarts">
      <div class="desk-cygn">运营趋势图
         <el-tooltip placement="top" effect="dark" content="最近7天数据趋势">
          <img class="answer" src="static/img/desk/answer.png" />
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="11">
          <div id="J_chartLineBox" class="chart-box"></div>
        </el-col>

        <el-col :span="11" style="float: left;margin-left: 10px;">
          <div id="J_chartLineBox1" class="chart-box"></div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import echarts from 'echarts'
import DigitRoll from '@huoyu/vue-digitroll'

export default {
  name:'home',
  data(){
    return {
      activeid: null,
      goLists:[
        {'id': 1,'isauth':'company','name':'交易流水','tabYuan': 'tradingFlow','img':'zhu','activeImg':'zhu2','router':'','isExit': false},
        {'id': 2,'isauth':'company_list','name':'平台入驻企业','tabYuan': 'companyCount','img':'company1','activeImg':'company2','router':'company-company','isExit': false},
        {'id': 3,'isauth':'store','name':'平台入驻门店','tabYuan': 'storeCount','img':'store1','activeImg':'store2','router':'store-store','isExit': false},
        {'id': 4,'isauth':'company_list','name':'待审核企业','content':'待运营平台审核的新增企业','tabYuan': 'pendingCompany','img':'company1','activeImg':'company2','router':'company-company','type':'company','isExit': true},
        {'id': 5,'isauth':'store_list','name':'待审核门店','content':'待运营平台审核的新增门店','tabYuan': 'pendingStore','img':'store1','activeImg':'store2','router':'store-store','type':'store','isExit': true},
        {'id': 6,'isauth':'audit_activity','name':'待审核活动','content':'待运营平台审核的新增活动','tabYuan': 'activi','img':'company1','activeImg':'company2','router':'audit-activity','type':'activi','isExit': true},
        {'id': 7,'isauth':'audit_sms','name':'待审核短信','content':'待运营平台审核的新增短信','tabYuan': 'shortmessage','img':'store1','activeImg':'store2','router':'audit-shortmessage','type':'shortmessage','isExit': true},
      ],
      chartLine: null,
      chartLine1: null,
      baseinfo: {},
      storeDate: [],
      storeNum:[],
      tradingFlowDate:[],
      tradingFlowNum:[],
      maxStoreNum:'',
      maxTradingFlowNum:'',
      minTradingFlowNum:'',
      timeId: null,
      checkNumActivi: 0,
      checkNum: 0,
    }
  },
  components: {
    DigitRoll,
  },
  mounted () {
    this.init()
    this.tradingChange()
    this.countAll()
    this.getDataSum()
    this.timeId = setInterval(() => {
      this.init()
      this.tradingChange()
    },10000)

  },
  created(){
    if (this.chartLine) {
      this.chartLine.resize()
    }

    if (this.chartLine1) {
      this.chartLine1.resize()
    }
  },
  destroyed () {
    clearInterval(this.timeId)
    this.timeId = null
  },
  methods:{
    // 获取统计数据
    async countAll(){
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/countAll',true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          this.checkNumActivi = data.data.countNoCheck
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    // 获取审核数据
    async getDataSum() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/smsMarketing/statisticeNum',true),
        method: 'get'
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.checkNum = data.data.checkNum
        }
      })
    },
    tradingChange(){
      // 交易流水
      this.$http({
        url: this.$http.adornUrl('/order/salesData',true),
        method: 'get',
        params: this.$http.adornParams({
          days:7
        })
      }).then(({data}) => {
        if(data.code == 0){
          var tradingFlowChanges = data.data
          let arr1 = []
          let arr2 = []
          tradingFlowChanges.forEach(item => {
            arr1.push(item.date)
            arr2.push((item.turnover*1000)/(1000*1000*100))
          })
          this.tradingFlowDate = arr1
          this.tradingFlowNum = arr2
          this.minTradingFlowNum = Math.min.apply(null, this.tradingFlowNum)
          this.maxTradingFlowNum = Math.max.apply(null, this.tradingFlowNum)
          this.initChartLine2()
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    flipStra3(before, next) {
      if (next <= before) {
        return true
      }
      return false
    },
    init(){
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/workbench'),
        method: 'get',
      }).then(({data}) => {
        if(data.code == 0){
          const tradingFlowStr = Math.abs(data.data.tradingFlow).toString()
          this.baseinfo = {
            ...data.data,
            tradingFlow: this.priceNum(data.data.tradingFlow),
            tradingFlowInt: tradingFlowStr.substring(0, tradingFlowStr.length - 2),
            tradingFlowFloat: tradingFlowStr.substr(-2)
          }
          // 门店入驻数
          var storeChanges = data.data.storeChanges
          let arr1 = []
          let arr2 = []
          storeChanges.forEach(item => {
            arr1.push(item.date)
            arr2.push(item.storeCount)
          })
          this.storeDate = arr1
          this.storeNum = arr2
          this.maxStoreNum = Math.max.apply(null, this.storeNum)
          this.initChartLine()
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    overShow(ids){
      if(ids){
        this.activeid = ids
      }else{
        this.activeid = null
      }
    },
    outHide(){
      this.activeid = null
    },
    goList(url,statusQuery){
      if(statusQuery){
        if(statusQuery == 'company'){
          this.$router.push({name: url,params:{state:1}})
        }else if(statusQuery == 'store'){
          this.$router.push({name: url,params:{state:0}})
        }else if(statusQuery == 'activi'){
          this.$router.push({name: url,params:{state:'NOCHECK'}})
        }else if(statusQuery == 'shortmessage'){
          this.$router.push({name: url,params:{state:'CHECK'}})
        }
      }else{
        this.$router.push({name: url})
      }
    },
    // 入驻门店---折线图
    initChartLine () {
      var option = {
        'title': {
          'text': '入驻门店数（间）',
          'textStyle':{
            //文字颜色
            'color':'#424242',
            //字体风格,'normal','italic','oblique'
            'fontStyle':'normal',
            //字体粗细
            'fontWeight':'500',
            //字体系列
            'fontFamily':'sans-serif',
            //字体大小
            'fontSize':15
          }
        },
        'tooltip': {
          'trigger': 'axis',
          'axisPointer':{
            'lineStyle':{
              'color':'#ccc'
            }
          }
        },
        'legend': {
          // 'data': [ '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎' ]
        },
        'grid': {
          'left': '3%',
          'right': '4%',
          'bottom': '3%',
          'containLabel': true
        },
        'xAxis': [{
          'type': 'category',
          'boundaryGap': true,//从X轴0刻度开始就要设置为false
          'axisLine':{
            'lineStyle' :{
              'color': '#8E8E8E'
            }
          },
          'axisLabel': {
            'interval':0,
            'rotate':20
          },
          'data': this.storeDate
        }],
        'yAxis': [{
          // 'name': '(间)',
          'type': 'value',
          'axisLine':{
            'lineStyle' :{
              'color': '#8E8E8E'
            }
          },
          'splitLine':{//分隔线线变为虚线
            'lineStyle' :{
              'type': 'dashed'
            }
          }
        }],
        'series': [
          {
            'name': '门店数量',
            'type': 'line',
            'symbolSize':8,
            'stack': '总量',
            'smooth':0.3,//设置折线图的弧度 0-1
            'data': this.storeNum,
            'itemStyle' : {
              'normal' : {
                'color':'#FC5A3D', //改变折线点的颜色
                'borderColor': '#f58f23',
                'borderWidth': 1,
                'lineStyle':{
                  'width':4,//折线宽度
                  'color':'#FC5A3D' //改变折线颜色
                }
              }
            },
            'areaStyle': {
              'normal': {
                'color': '#FFF4EE' //改变区域颜色
              }
            },
          },
        ]
      }
      this.chartLine = echarts.init(document.getElementById('J_chartLineBox'))
      this.chartLine.setOption(option)
      window.addEventListener('resize', () => {
        this.chartLine.resize()
      })
    },


    // 交易流水---折线图
    initChartLine2 () {
      var option = {
        'title': {
          'text': '交易流水（千元）',
          'textStyle':{
            //文字颜色
            'color':'#424242',
            //字体风格,'normal','italic','oblique'
            'fontStyle':'normal',
            //字体粗细
            'fontWeight':'500',
            //字体系列
            'fontFamily':'sans-serif',
            //字体大小
            'fontSize':15
          }
        },
        'tooltip': {
          'trigger': 'axis',
          'axisPointer':{
            'lineStyle':{
              'color':'#ccc'
            }
          }
        },
        'legend': {
          // 'data': [ '邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎' ]
        },
        'grid': {
          'left': '3%',
          'right': '4%',
          'bottom': '3%',
          'containLabel': true
        },
        'xAxis': [{
          'type': 'category',
          'boundaryGap': true,//从X轴0刻度开始就要设置为false
          'axisLine':{
            'lineStyle' :{
              'color': '#8E8E8E'
            }
          },
          'axisLabel': {
            'interval':0,
            'rotate':20
          },
          'data': this.tradingFlowDate
        }],
        'yAxis': [{
          // 'name': '(千元)',
          'type': 'value',
          'min':0,
          // 'max':Math.ceil(this.maxTradingFlowNum),
          'axisLine':{
            'lineStyle' :{
              'color': '#8E8E8E'
            }
          },
          'splitLine':{//分隔线线变为虚线
            'lineStyle' :{
              'type': 'dashed'
            }
          }
        }],
        'series': [
          {
            'name': '交易流水',
            'type': 'line',
            'symbolSize':8,
            'stack': '总量',
            'smooth':0.3,//设置折线图的弧度 0-1
            'data': this.tradingFlowNum,
            'itemStyle' : {
              'normal' : {
                'color':'#FC5A3D', //改变折线点的颜色
                'borderColor': '#f58f23',
                'borderWidth': 1,
                'lineStyle':{
                  'width':4,//折线宽度
                  'color':'#FC5A3D' //改变折线颜色
                }
              }
            },
            'areaStyle': {
              'normal': {
                'color': '#FFF4EE' //改变区域颜色
              }
            },
          },
        ]
      }
      this.chartLine1 = echarts.init(document.getElementById('J_chartLineBox1'))
      this.chartLine1.setOption(option)
      window.addEventListener('resize', () => {
        this.chartLine1.resize()
      })
    },
  }
}
</script>

<style lang="scss">
 @import '~@/assets/scss/desk/resetIndex.scss';
 @import '~@/assets/scss/desk/index.scss';

  .desk-gutter {
    margin: 10px 0;
  }
  .d-roll-wrapper{
    margin: 0 !important;
    width: fit-content !important;
    float: left;
    .d-roll-list{
      display: block;
    }
  }
</style>
