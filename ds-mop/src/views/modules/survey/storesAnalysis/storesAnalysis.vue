<template>
  <section>
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectAnalysis" style="float:left;">
        <el-radio-button label="storeGrowth">门店增长</el-radio-button>
        <el-radio-button label="storeDistrict">门店地域归属</el-radio-button>
        <el-radio-button label="loginAnalysis">POS登录分析</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-store-growth v-if="selectAnalysis=='storeGrowth'"/>
    <gt-store-district v-if="selectAnalysis=='storeDistrict'"/>
    <gt-login-analysis v-if="selectAnalysis=='loginAnalysis'"/>
  </section>
</template>
<script>
import gtStoreGrowth from './storeGrowth'
import gtStoreDistrict from './storeDistrict'
import gtLoginAnalysis from './loginAnalysis'
export default {
  name:'survey-storesAnalysis-storesAnalysis',
  components: {
    gtStoreGrowth,
    gtStoreDistrict,
    gtLoginAnalysis
  },
  data(){
    return{
      selectAnalysis:'storeGrowth'
    }
  }
}
</script>