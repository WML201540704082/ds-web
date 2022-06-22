<template>
  <el-card class="page-storeDistrict">
    <div class="update-date">更新日期：{{start}}</div>
    <section v-loading="chartLoading">
      <el-row style="margin: 10px 0 15px;">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right: 10px;">
          <div id="main" style="width: 100%;height:500px;"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right: 10px;">
          <el-table
            :data="dataList"
            border
            v-loading="provinceDataLoading"
            :stripe="true"
            v-table-height
            style="width: 80%;margin-left:50px;margin-top:60px;">
            <el-table-column
              prop="area"
              min-width="100"
              :show-overflow-tooltip="true"
              label="地域">
            </el-table-column>
            <el-table-column
              prop="storeQuantity"
              :show-overflow-tooltip="true"
              min-width="100"
              label="门店数">
            </el-table-column>
            <el-table-column
              prop="percent"
              min-width="100"
              :show-overflow-tooltip="true"
              label="占比">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="padding-right: 20px;">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right: 10px;">
        <el-select style="float: right;margin-top:-30px" v-model="provinceId" @change="changeProvince" placeholder="请选择省">
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
          <div id="city" style="width: 100%;height:500px;"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right: 10px;">
          <el-table
            :data="cityDataListDetails"
            border
            v-loading="cityDataLoading"
            :stripe="true"
            v-table-height
            style="width: 80%;margin-left:60px;margin-top:60px;">
            <el-table-column
              prop="area"
              min-width="100"
              :show-overflow-tooltip="true"
              label="地域">
            </el-table-column>
            <el-table-column
              prop="storeQuantity"
              :show-overflow-tooltip="true"
              min-width="100"
              label="门店数">
            </el-table-column>
            <el-table-column
              prop="percent"
              min-width="100"
              :show-overflow-tooltip="true"
              label="占比">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
  </el-card>
</template>
<script>
import moment from 'moment'
import echarts from 'echarts'
import * as api from '@/service/survey'
export default {
  name:'survey-storesAnalysis-storeDistrict',
  data(){
    return{
      chartLoading:false,
      provinceDataLoading:false,
      cityDataLoading:false,
      dataList:[],
      moment,
      start: moment().subtract(1,'days').format('YYYY-MM-DD'),
      provinceId: '',
      provinceName:'北京市',
      provinceList: [],
      cityDataList: [],
      cityDataListDetails:[]
    }
  },
  async created(){
    // 省选择下拉框
    await this.getProvinceList()
    // 获取省份数据
    this.getDataProvince()
    // 获取地级数据
    this.getDataCity()
  },
  mounted() {
    window.addEventListener('resize', () =>{
      this.myChart.resize()
      this.cityChart.resize()
    })
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth }
    }
  },
  methods:{
    // 获取省份数据
    async getDataProvince() {
      this.provinceDataLoading = true
      const { data } = await api.getProvinceInfo()
      if (data.code === 0) {
        this.dataList = data.data.filter(ele => {
          return ele.area
        })
        this.getChinaMap()
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.provinceDataLoading = false
    },
    // 获取地级数据
    async getDataCity() {
      this.cityDataLoading = true
      const { data } = await api.getCityInfo(this.provinceId)
      if (data.code === 0) {
        if (this.provinceName !== '台湾省') {
          this.cityDataList = data.data
          this.cityDataListDetails = this.cityDataList.filter(ele => {
            return ele.storeQuantity !== 0
          })   
        }else{
          data.data.unshift({
            area:'中国属钓鱼岛',
            percent:'0.00%',
            storeQuantity: 0
          })
          this.cityDataList = data.data
          this.cityDataListDetails = this.cityDataList.filter(ele => {
            return ele.storeQuantity !== 0
          })
        }
        this.getCityMap()
      } else {
        this.cityDataList = []
        this.$message.error(data.msg)
      }
      this.cityDataLoading = false
    },
    // 省级分布地图
    getChinaMap(){
      this.myChart = echarts.init(document.getElementById('main'))
      this.myChart.showLoading()
      $.get('/static/map/china.json', (geoJson) => {
        this.myChart.hideLoading()
        echarts.registerMap('china', geoJson)
        let originData = [
          {name: '台湾', value: 0, percent:'0%'},
          {name: '河北', value: 0, percent:'0%'},
          {name: '山西', value: 0, percent:'0%'},
          {name: '辽宁', value: 0, percent:'0%'},
          {name: '吉林', value: 0, percent:'0%'},
          {name: '黑龙江', value: 0, percent:'0%'},
          {name: '江苏', value: 0, percent:'0%'},
          {name: '浙江', value: 0, percent:'0%'},
          {name: '安徽', value: 0, percent:'0%'},
          {name: '福建', value: 0, percent:'0%'},
          {name: '江西', value: 0, percent:'0%'},
          {name: '山东', value: 0, percent:'0%'},
          {name: '河南', value: 0, percent:'0%'},
          {name: '湖北', value: 0, percent:'0%'},
          {name: '湖南', value: 0, percent:'0%'},
          {name: '广东', value: 0, percent:'0%'},
          {name: '海南', value: 0, percent:'0%'},
          {name: '四川', value: 0, percent:'0%'},
          {name: '贵州', value: 0, percent:'0%'},
          {name: '云南', value: 0, percent:'0%'},
          {name: '陕西', value: 0, percent:'0%'},
          {name: '甘肃', value: 0, percent:'0%'},
          {name: '青海', value: 0, percent:'0%'},
          {name: '新疆', value: 0, percent:'0%'},
          {name: '广西', value: 0, percent:'0%'},
          {name: '内蒙古', value: 0, percent:'0%'},
          {name: '宁夏', value: 0, percent:'0%'},
          {name: '西藏', value: 0, percent:'0%'},
          {name: '北京', value: 0, percent:'0%'},
          {name: '天津', value: 0, percent:'0%'},
          {name: '上海', value: 0, percent:'0%'},
          {name: '重庆', value: 0, percent:'0%'},
          {name: '香港', value: 0, percent:'0%'},
          {name: '澳门', value: 0,percent:'0%'}
        ]
        const data = this.dataList.map(item => {
          return{
            name:item.area,
            value:item.storeQuantity,
            percent:item.percent
          }
        })
        let hash=[]
        for (let index = 0; index < originData.length; index++) {
          const findItem = data.find(item => {
            return item.name === originData[index].name
          })
          if(findItem){
            hash.push(findItem)
          } else {
            hash.push(originData[index])
          }
        }
        const options = {
          title: {
            text: '省级分类',
          },
          tooltip: {
            trigger: 'item',
            // formatter: '{b}<br/>{c}<br/>{d}'
            formatter: function (params) {   //格式化函数
              return params.data.name+'：'+params.data.value+' ('+params.data.percent+')'
            },
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          visualMap: {
            min: 1,
            max: 30,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          series: [{
            name: '中国区域图',
            type: 'map',
            map: 'china', // 自定义扩展图表类型
            zoom: 1.2,
            label: {
              show: true
            },
            data: hash,
          }]
        }
        this.myChart.setOption(options)
        window.onresize = () => {
          this.myChart.resize()
        }
      })
    },
    // 地级分布地图
    getCityMap(){
      this.cityChart = echarts.init(document.getElementById('city'))
      this.cityChart.showLoading()
      if (this.provinceName !== '香港特别行政区' && this.provinceName !== '澳门特别行政区') {
        $.get('/static/map/province/' + this.provinceName + '.json', (geoJson) => {
          this.cityChart.hideLoading()
          echarts.registerMap('province', geoJson)
          const options = {
            title: {
              text: '地级分类',
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {   //格式化函数
                return params.data.name+'：'+params.data.value+' ('+params.data.percent+')'
              },
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
              }
            },
            visualMap: {
              min: 1,
              max: 30,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            series: [{
              name: '各省级区域图',
              type: 'map',
              map: 'province', // 自定义扩展图表类型
              zoom: 1.2,
              label: {
                show: true
              },
              data: this.cityDataList.filter(ele => {
                return ele.area
              }).map(item => {
                return{
                  name:item.area,
                  value:item.storeQuantity,
                  percent:item.percent
                }
              }),
            }]
          }
          this.cityChart.setOption(options)
          window.onresize = () => {
            this.cityChart.resize()
          }
        }) 
      }else if (this.provinceName === '香港特别行政区') {
        $.get('/static/map/province/香港特别行政区.json', (geoJson) => {
          this.cityChart.hideLoading()
          echarts.registerMap('province', geoJson)
          const options = {
            title: {
              text: '地级分类',
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {   //格式化函数
                return params.data.name+'：'+params.data.value+' ('+params.data.percent+')'
              },
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
              }
            },
            visualMap: {
              min: 1,
              max: 30,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            series: [{
              name: '香港特别行政区地域图',
              type: 'map',
              map: 'province', // 自定义扩展图表类型
              zoom: 1.2,
              label: {
                show: true
              },
              data: [
                {name: '中西区', value: 0, percent:'0%'},
                {name: '湾仔区', value: 0, percent:'0%'},
                {name: '东区', value: 0, percent:'0%'},
                {name: '南区', value: 0, percent:'0%'},
                {name: '油尖旺区', value: 0, percent:'0%'},
                {name: '深水埗区', value: 0, percent:'0%'},
                {name: '九龙城区', value: 0, percent:'0%'},
                {name: '黄大仙区', value: 0, percent:'0%'},
                {name: '观塘区', value: 0, percent:'0%'},
                {name: '葵青区', value: 0, percent:'0%'},
                {name: '荃湾区', value: 0, percent:'0%'},
                {name: '屯门区', value: 0, percent:'0%'},
                {name: '元朗区', value: 0, percent:'0%'},
                {name: '北区', value: 0, percent:'0%'},
                {name: '大埔区', value: 0, percent:'0%'},
                {name: '沙田区', value: 0, percent:'0%'},
                {name: '西贡区', value: 0, percent:'0%'},
                {name: '离岛区', value: 0, percent:'0%'}
              ],
            }]
          }
          this.cityChart.setOption(options)
          window.onresize = () => {
            this.cityChart.resize()
          }
        }) 
      }else{
        $.get('/static/map/province/澳门特别行政区.json', (geoJson) => {
          this.cityChart.hideLoading()
          echarts.registerMap('province', geoJson)
          const options = {
            title: {
              text: '地级分类',
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {   //格式化函数
                return params.data.name+'：'+params.data.value+' ('+params.data.percent+')'
              },
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
              }
            },
            visualMap: {
              min: 1,
              max: 30,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            series: [{
              name: '澳门特别行政区地域图',
              type: 'map',
              map: 'province', // 自定义扩展图表类型
              zoom: 1.2,
              label: {
                show: true
              },
              data: [
                {name: '花地玛堂区', value: 0},
                {name: '花王堂区', value: 0},
                {name: '望德堂区', value: 0},
                {name: '风顺堂区', value: 0},
                {name: '大堂区', value: 0},
                {name: '嘉模堂区', value: 0},
                {name: '路氹填海区', value: 0},
                {name: '圣方济各堂区', value: 0}
              ],
            }]
          }
          this.cityChart.setOption(options)
          window.onresize = () => {
            this.cityChart.resize()
          }
        }) 
      }
    },
    // 改变省
    changeProvince(value){
      this.provinceId = value
      this.provinceName = this.provinceList[value-1].name
      this.getDataCity()
    },
    // 获取省列表
    async getProvinceList(){
      const { data } = await this.$http({
        url: this.$http.adornUrl('/common/district/province'),
        method: 'get',
      })
      if (data && data.code === 0) {
        this.provinceList = data.data.filter(item => {
          return item.name !== '海外'
        })
        this.provinceId = this.provinceList && this.provinceList.length > 0 ? this.provinceList[0].id : ''
      } else {
        this.provinceList = []
        this.$message.error(data.msg)
      }
    }
  },
  watch: {
    documentWidth(val) {
      if (this.myChart && this.cityChart) {
        this.myChart.resize()
        this.cityChart.resize()
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
.page-storeDistrict{
  .update-date{
    font-size: 18px;
    padding: 10px 0;
  }
}
</style>
