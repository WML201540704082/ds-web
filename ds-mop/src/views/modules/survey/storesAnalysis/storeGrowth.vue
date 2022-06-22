<template>
  <section class="page-storeGrowth">
    <el-card class="card">
      <div class="item-title">昨日数据</div>
      <el-row class="maintain">
        <el-col class="item-info"><div class="item-label">新增门店数</div><span class="item-value">{{yesterDayResp.newIncreaseStore || 0}}</span>间</el-col>
        <el-col class="item-info"><div class="item-label">正常营业门店数</div><span class="item-value">{{yesterDayResp.normalStore || 0}}</span>间</el-col>
        <el-col class="item-info"><div class="item-label">门店净登录数</div><span class="item-value">{{yesterDayResp.unitLoginQuantity || 0}}</span>次</el-col>
        <el-col class="item-info"><div class="item-label">门店总登录数</div><span class="item-value">{{yesterDayResp.totalLoginQuantity || 0}}</span>次</el-col>
      </el-row>
    </el-card>
    <el-card class="mode-store-table">
      <div class="item-title max-title">
        <el-form class="filter-container">
          <!-- <el-radio-group v-model="selectSearch" size="small">
            <el-radio-button label="newAdd">新增门店数</el-radio-button>
            <el-radio-button label="normalBusiness">正常营业门店数</el-radio-button>
            <el-radio-button label="storeLogin">门店净登录数</el-radio-button>
            <el-radio-button label="storeAllLogin">门店总登录数</el-radio-button>
          </el-radio-group> -->
          <span>搜索时间：</span>
          <el-select v-model="value" placeholder="请选择" @change="changeDate">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-form-item class="gt-inline-item customer-date-picker">
            <gt-time-range
              start-time-prop="effectiveBeginDate"
              :start-time-value="start"
              :end-time-value="end"
              valueFormat="yyyy-MM-dd"
              end-time-prop="effectiveEndDate"
              @changeStartValue="value => dateRange(value,'start')"
              @changeEndValue="value => dateRange(value,'end')"
              type="date"
              :limitBeforeToday="sixMonth"
              :limitAfterToday="currentDate"
            ></gt-time-range>
          </el-form-item>
        </el-form>
      </div>
      <div id="store_growth" class="my-echart"></div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;margin-top:10px">
        <el-table-column
          prop="time"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="newIncreaseStore"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="新增门店数">
        </el-table-column>
        <el-table-column
          prop="normalStore"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="正常营业门店数">
        </el-table-column>
        <el-table-column
          prop="unitLoginQuantity"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店净登录数">
        </el-table-column>
        <el-table-column
          prop="totalLoginQuantity"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店总登录数">
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>
<script>
import echarts from 'echarts'
import moment from 'moment'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/survey'
export default {
  name:'survey-storesAnalysis-storeGrowth',
  data(){
    return{
      chartLoading: false,
      dataListLoading:false,
      // selectSearch:'newAdd',
      moment,
      start: moment().subtract(29,'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      // 门店增长值
      storeGrowthNum: [],
      dataList:[],
      yesterDayResp:[],
      options: [{
        value: 'month',
        label: '近30天'
      }, {
        value: 'helfMonth',
        label: '近15天'
      }, {
        value: 'week',
        label: '近7天'
      }],
      value:'month',
      sixMonth:moment().subtract(6,'months').format('YYYY-MM-DD'),
      currentDate:moment().subtract(0,'days').format('YYYY-MM-DD')
    }
  },
  components:{
    gtTimeRange
  },
  mounted() {
    window.addEventListener('resize', () =>{
      this.growthRecords.resize()
    })
  },
  created(){
    //获取数据
    this.getDataList()
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth }
    }
  },
  methods:{
    // 选择日期
    changeDate(value) {
      let start = ''
      let end = ''
      switch(value) {
      case 'month':
        start = moment().subtract(29,'days')
        end = moment()
        break
      case 'helfMonth':
        start = moment().subtract(14,'days')
        end = moment()
        break
      case 'week':
        start = moment().subtract(6,'days')
        end = moment()
        break
      }
      this.start = start.format('YYYY-MM-DD')
      this.end = end.format('YYYY-MM-DD')
      // 数据列表
      this.getDataList()
    },
    //获取数据详情
    async getDataList(){
      const { data } = await api.getStoreIncrease({
        startTime:this.start,
        endTime:this.end,
      })
      if (data.code === 0) {
        this.dataList = data.data.list
        this.yesterDayResp = data.data.yesterDayResp
        this.storeGrowthGraph()
      } else {
        this.dataList = []
        this.yesterDayResp = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 门店增长图
    storeGrowthGraph () {
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#ef6c00', '#6382c1','#FF0000','#28FF28'],
        legend: {
          top: 10,
          right: 20,
          data:['新增门店数','正常营业门店数','门店净登录数','门店总登录数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          top: 50,
          containLabel: true
        },
        xAxis: {
          name: '时间',
          type: 'category',
          boundaryGap: false,
          //横坐标-时间
          data: this.dataList.map(item => item.time),
          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        },
        yAxis: [{
          name: '值',
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#72716F'
            }
          }
        }],
        series: [
          {
            name:'新增门店数',
            type:'line',
            data:this.dataList.map(item => item.newIncreaseStore),
          },{
            name:'正常营业门店数',
            type:'line',
            data:this.dataList.map(item => item.normalStore),
          },{
            name:'门店净登录数',
            type:'line',
            data:this.dataList.map(item => item.unitLoginQuantity),
          },{
            name:'门店总登录数',
            type:'line',
            data:this.dataList.map(item => item.totalLoginQuantity),
          },
        ]
      }
      this.growthRecords = echarts.init(document.getElementById('store_growth'))
      this.growthRecords.setOption(option)
      window.onresize = () => {
        this.growthRecords.resize()
      }
    },
    // 改变时间段
    dateRange(value, type) {
      if (type === 'start') {
        this.start = value
      } else if (type === 'end') {
        this.end = value
      }
      if (this.start && this.end) {
        this.getDataList()
      }
    },
  },
  watch: {
    documentWidth(val) {
      if (this.growthRecords) {
        this.growthRecords.resize()
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
.page-storeGrowth{
  .card {
    margin-bottom: 15px;
  }
  .item-title {
    font-size: 16px;
    color: #535353;
    &.max-title{
      line-height: 32px;
      overflow: hidden;
    }
  }
  .maintain{
    background-color: #f7f7f7;
    padding: 20px;
    margin: 8px 0;
    border-radius: 10px;
    text-align: center;
    .item-info{
      width: 16.6%;
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
  .filter-container{
    float:left;
    overflow: hidden;
    height: 40px;
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
  .my-echart{
    min-height: 300px;
    width: 100%;
  }
}
</style>