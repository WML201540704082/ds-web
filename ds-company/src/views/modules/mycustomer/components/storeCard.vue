<template>
  <el-card class="mode-store-table mode-store-table1">
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button v-for="item in recordType" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <span class="ups">储值卡余额：{{Number(priceNum(intergralVal)).toFixed(2) || 0}}<span class="update theme-color"  v-if="companyRoleName==='超级管理员'"   @click="updateIntergral">修改</span></span>
    </div>
    <gt-czklist ref="gtCzklist" :customerid="id" :types="activeName" />
    <gt-recharge-list v-if="intergralVisible" ref="customerintergral" @refreshDataList="initData()"/>
  </el-card>
</template>
<script>
import gtCzklist from './mycustomer-czkList'
import gtRechargeList from './updateMoney'
import { cardRecordSearch } from '@/service/mycustomer'
import {recordType} from '@/utils/dict'
export default {
  components:{ gtCzklist,gtRechargeList },
  data(){
    return{
      recordType,
      intergralVisible: false,
      id: null,
      activeName: '',
      intergralVal: 0,
      companyRoleName: null
    }
  },
  created(){
    const { id } = this.$route.query
    this.id = id
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    this.update()
  },
  methods:{
    changeVal(val){
      this.activeName = val
      this.update()
    },
    initData(){
      this.update()
      this.$nextTick(() => {
        this.$refs.gtCzklist.getDataList(this.activeName)
      })
    },
    // 更新余额
    async update(){
      const {data} = await cardRecordSearch(this.id)
      if(data.code == 0){
        this.intergralVal = data.data.amount || 0
        console.log('update')
      }else{
        this.$message.error(data.msg)
      }
    },
    // 修改
    updateIntergral(){
      this.intergralVisible = true
      this.$nextTick(() => {
        this.$refs.customerintergral.init(this.id,this.intergralVal)
      })
    },
  }
}
</script>
<style lang="scss">
  .mode-store-table1 {
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    .el-radio-button__inner{
      font-size: 12px;
    }
  }
  .mode-store-table1 .el-card__body {
    padding: 0!important;
  }
  span.ups {
    float: right;
    font-size: 16px;
    margin: 0 15px;
    .update {
      cursor: pointer;
      margin-left: 15px;
      margin-top: 3px;
      font-size: 12px;
      text-decoration: underline;
    }
  }
</style>


