<template>
  <section>
    <el-row class="location-depart">
      <el-col :span="5">
        <el-select v-model="province" value-key="cityId" placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceList" :label="item.cityName" :key="item.cityId" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="city" value-key="cityId" placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityList" :label="item.cityName" :key="item.cityId" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="district" value-key="cityId" placeholder="请选择区/县">
          <el-option v-for="item in districtList" :label="item.cityName" :key="item.cityId" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </section>

</template>
<script>
export default {
  name: 'gt-fuyou-location',
  data() {
    return {
      province: null,
      provinceList: [],
      city: null,
      cityList: [],
      district: null,
      districtList: [],
      // hasInit: false
    }
  },
  props: {
    provinceId: {
      default: null
    },
    cityId: {
      default: null
    },
    districtId: {
      default: null
    }
  },
  methods: {
    async init(value) {
      if (this.provinceList.length === 0) {
        const { data } = await this.$http({
          url: this.$http.adornUrl('/subaccount/city', false, 'fuyou'),
          method: 'get',
          params: this.$http.adornParams({
            cityType: 1
          })
        })
        this.provinceList = data.data
      }
      // 获取props，进行初始化
      if (this.provinceId) {
        const provinceSelectList = this.provinceList.filter(element => {
          return element.cityId == this.provinceId
        })
        this.province = provinceSelectList && provinceSelectList.length > 0 ? provinceSelectList[0] : null
        // 获取城市列表
        await this.getCityList(this.provinceId)
      }

      // city
      if (this.cityId) {
        const citySelectList = this.cityList.filter(element => {
          return element.cityId == this.cityId
        })
        this.city = citySelectList && citySelectList.length > 0 ? citySelectList[0] : null
        // 获取地区列表
        await this.getDistrictList(this.cityId)
      }

      // district
      if (this.districtId) {
        const districtSelectList = this.districtList.filter(element => {
          return element.cityId == this.districtId
        })
        this.district = districtSelectList && districtSelectList.length > 0 ? districtSelectList[0] : null
      }
      // this.hasInit = true
    },
    changeProvince(value) {
      this.getCityList(value.cityId)
      this.city = null
      this.district = null
      this.districtList = []
    },
    changeCity(value) {
      this.getDistrictList(value.cityId)
      this.district = null
    },
    async getCityList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/subaccount/city', false, 'fuyou'),
        method: 'get',
        params: this.$http.adornParams({
          cityType: 2,
          parCityId: id
        })
      })
      if (data.code === '0000') {
        this.cityList = data.data
      } else {
        this.$message.error('获取城市列表出错！')
      }
    },
    async getDistrictList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/subaccount/city', false, 'fuyou'),
        method: 'get',
        params: this.$http.adornParams({
          cityType: 3,
          parCityId: id
        })
      })
      if (data.code === '0000') {
        this.districtList = data.data
      } else {
        this.$message.error('获取区县列表出错！')
      }
    },
    refresh(){
      this.provinceId = null
      this.cityId = null
      this.districtId = null
      this.province = null
      this.city = null
      this.district = null
      this.provinceList = []
      this.cityList = []
      this.districtList = []
      this.init()
    }
  },
  created(){
    this.init()
  },
  watch: {
    async provinceId(n, o) {
      if (n && !o) {
        this.init()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .location-depart{
    .el-col{
      width: 200px;
      margin-right: 10px;
      &:last-child{
        padding-right: 0;
      }
    }
  }
</style>
