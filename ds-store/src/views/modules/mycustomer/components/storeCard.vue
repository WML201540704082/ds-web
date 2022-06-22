<template>
  <el-card class="mode-store-table mode-store-table1">
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button v-for="item in recordType" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <span class="ups">储值卡余额：{{Number(priceNum(rechargeval)).toFixed(2) || 0}}</span>
    </div>
    <gt-czklist :customerid="id" :types="activeName" />
  </el-card>
</template>
<script>
import gtCzklist from './mycustomer-czkList'
import { cardRecordSearch } from '@/service/mycustomer'
import {recordType} from '@/utils/dict'
export default {
  components:{ gtCzklist },
  data(){
    return{
      recordType,
      id: null,
      activeName: '',
      rechargeval: 0
    }
  },
  props:['cardtype'],
  created(){
    const { id } = this.$route.query
    this.id = id
    this.update()
  },
  methods:{
    changeVal(val){
      this.activeName = val
      this.update()
    },
    // 更新余额
    async update(){
      const {data} = await cardRecordSearch(this.id)
      if(data.code == 0){
        this.rechargeval = data.data.amount || 0
        console.log('update')
      }else{
        this.$message.error(data.msg)
      }
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


