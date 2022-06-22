<template>
  <section>
    <el-row v-if="type==='depart'" class="location-depart">
      <el-col :span="5">
        <el-select v-model="province" value-key="id" placeholder="请选择省" @change="chengeProvice">
          <el-option  label="全部" value="" ></el-option>
          <el-option v-for="item in provinceList" :label="item.name" :key="item.id" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div v-else>级联</div>
  </section>

</template>
<script>
export default {
  name: 'gt-select-province',
  data() {
    return {
      province: '',
      provinceList: [],
    }
  },
  props: {
    provinceId: {
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
          selfHandleError: true,
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
      }
    },
    // 监听省份，传出去
    chengeProvice(value){
      this.$emit('proviceValue', value)
    },
    refresh(){
      this.provinceId = null
      this.province = null
      this.provinceList = []
      this.init()
    }
  },
  created(){
    this.init()
  },
  watch: {
    provinceId(n, o) {
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
      width: 150px;
      margin-right: 10px;
      &:last-child{
        padding-right: 0;
      }
    }
  }
</style>
