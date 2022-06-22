<template>
  <section class="com-pos-login">
    <div class="update-date">更新日期：{{date}}</div>
    <div id="provice_bar" class="chart-box"></div>
    <el-row style="padding-right: 20px;">
      <el-select class="province-select" v-model="provinceId" @change="changeProvince" placeholder="请选择省">
        <el-option
          v-for="item in provinceList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-row>

    <div id="city_bar" class="chart-box"></div>
  </section>
</template>
<script>
import { locations } from '@/utils'
import echarts from 'echarts'
import * as api from '@/service/analysis'
import moment from 'moment'
export default {
  name:'pos-login-bar',
  data () {
    return {
      date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      provinceId: '',
      provinceList: [],
      provinceData: [],
      cityData: [],
      proviceBar: null,
      cityBar: null
    }
  },
  async created () {
    await this.getProvinceList()
    this.getProvinceData()
    this.getCityData()
  },
  mounted() {
    window.addEventListener('resize', () =>{
      this.proviceBar.resize()
      this.cityBar.resize()
    })
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth }
    }
  },
  methods:{
    async getProvinceData(){
      const { data } = await api.getPosLoginProvince()
      if (data.code === 0) {
        this.provinceData = data.data
        this.initProviceBar()
      } else {
        this.provinceData = []
        this.$message.error(data.msg)
      }
    },
    async getCityData(){
      const { data } = await api.getPosLoginCity(this.provinceId)
      if (data.code === 0) {
        this.cityData = data.data
        this.initCityBar()
      } else {
        this.cityData = []
        this.$message.error(data.msg)
      }
    },
    initProviceBar(){
      const option = {
        title: {
          text: '省级分析',
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const currentItem = this.provinceData.find(item => {
              return item.area == params[0].name
            })
            if (params.length === 1) {
              if (params[0].seriesName === '登录') {
                return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 登录 ${currentItem.loginQuantity} <br/> 占比 : ${currentItem.percent}`
              } else {
                return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 异常 ${currentItem.unUsualQuantity}`
              }
            } else {
              return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 登录/异常 ${currentItem.loginQuantity}/${currentItem.unUsualQuantity} <br/> 占比 : ${currentItem.percent}`
            }

          }
        },
        legend: {
          data: ['登录', '异常']
        },
        xAxis: [
          {
            type: 'category',
            data: this.provinceData.map(item => item.area),
            axisLabel: {
              interval:0,
              rotate:40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataset: this.provinceData,
        series: [
          {
            name: '登录',
            type: 'bar',
            data: this.provinceData.map(item => item.loginQuantity),
          },
          {
            name: '异常',
            type: 'bar',
            data: this.provinceData.map(item => item.unUsualQuantity),
          }
        ]
      }
      this.proviceBar = echarts.init(document.getElementById('provice_bar'))
      this.proviceBar.setOption(option)
      window.addEventListener('resize', () => {
        this.proviceBar.resize()
      })
    },
    initCityBar(){
      const option = {
        title: {
          text: '地级分析',
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const currentItem = this.cityData.find(item => {
              return item.area == params[0].name
            })
            if (params.length === 1) {
              if (params[0].seriesName === '登录') {
                return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 登录 ${currentItem.loginQuantity} <br/> 占比 : ${currentItem.percent}`
              } else {
                return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 异常 ${currentItem.unUsualQuantity}`
              }
            } else {
              return `${currentItem.area}<br/> 用户：${currentItem.totalQuantity} <br/> 登录/异常 ${currentItem.loginQuantity}/${currentItem.unUsualQuantity} <br/> 占比 : ${currentItem.percent}`
            }
          }
        },
        legend: {
          data: ['登录', '异常']
        },
        xAxis: [
          {
            type: 'category',
            data: this.cityData.map(item => item.area),
            axisLabel: {
              interval:0,
              rotate:40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '登录',
            type: 'bar',
            data: this.cityData.map(item => item.loginQuantity),
          },
          {
            name: '异常',
            type: 'bar',
            data: this.cityData.map(item => item.unUsualQuantity),
          }
        ]
      }
      this.cityBar = echarts.init(document.getElementById('city_bar'))
      this.cityBar.setOption(option)
      window.addEventListener('resize', () => {
        this.cityBar.resize()
      })
    },
    // 改变省
    changeProvince(value){
      this.provinceId = value
      this.getCityData()
    },
    // 获取省列表
    async getProvinceList(){
      const { data } = await this.$http({
        url: this.$http.adornUrl('/common/district/province'),
        method: 'get',
      })
      if (data && data.code === 0) {
        this.provinceList = data.data
        this.provinceId = this.provinceList && this.provinceList.length > 0 ? this.provinceList[0].id : ''
      } else {
        this.provinceList = []
        this.$message.error(data.msg)
      }

    }
  },
  watch: {
    documentWidth(val) {
      if (this.proviceBar && this.cityBar) {
        this.proviceBar.resize()
        this.cityBar.resize()
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
<style lang="scss" scoped>
.com-pos-login{
  .update-date{
    font-size: 18px;
    padding: 10px 0;
  }
  width: 100%;
  .chart-box {
    min-height: 300px;
    width: 100%;
  }
  .province-select{
    float: right;
  }
}
</style>
