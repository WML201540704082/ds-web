<template>
  <section>
    <el-row v-if="type==='depart'" class="location-depart">
      <el-col :span="5">
        <el-select v-model="province" value-key="id" placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceList" :label="item.name" :key="item.id" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="city" value-key="id" placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityList" :label="item.name" :key="item.id" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="district" value-key="id" placeholder="请选择区/县">
          <el-option v-for="item in districtList" :label="item.name" :key="item.id" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div v-else>级联</div>
  </section>

</template>
<script>
export default {
  name: 'gt-select-location',
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
    },
    type: {
      type: String,
      default: 'depart' // cascader
    }
  },
  methods: {
    async init(value) {
      if (this.provinceList.length === 0) {
        const { data } = await this.$http({
          url: this.$http.adornUrl('/common/district/province'),
          method: 'get',
        })
        this.provinceList = data.data
      }
      // 获取props，进行初始化
      if (this.provinceId) {
        const provinceSelectList = this.provinceList.filter(element => {
          return element.id == this.provinceId
        })
        this.province = provinceSelectList && provinceSelectList.length > 0 ? provinceSelectList[0] : null
        // 获取城市列表
        await this.getCityList(this.provinceId)
      }

      // city
      if (this.cityId) {
        const citySelectList = this.cityList.filter(element => {
          return element.id == this.cityId
        })
        this.city = citySelectList && citySelectList.length > 0 ? citySelectList[0] : null
        // 获取地区列表
        await this.getDistrictList(this.cityId)
      }

      // district
      if (this.districtId) {
        const districtSelectList = this.districtList.filter(element => {
          return element.id == this.districtId
        })
        this.district = districtSelectList && districtSelectList.length > 0 ? districtSelectList[0] : null
      }
      // this.hasInit = true
    },
    changeProvince(value) {
      this.getCityList(value.id)
      this.city = null
      this.district = null
      this.districtList = []
    },
    changeCity(value) {
      this.getDistrictList(value.id)
      this.district = null
    },
    async getCityList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/common/district/city/'+id),
        method: 'get',
      })
      if (data.code === 0) {
        this.cityList = data.data
      } else {
        this.$message.error('获取城市列表出错！')
      }
    },
    async getDistrictList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/common/district/district/'+id),
        method: 'get',
      })
      if (data.code === 0) {
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
