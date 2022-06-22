<template>
  <el-card class="mode-store-table mode-store-table1">
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="SETTLE_AMOUNT">已结算</el-radio-button>
        <el-radio-button label="AMOUNT_TO_BE_SETTLE">待结算</el-radio-button>
        <el-radio-button label="CANCEL_AMOUNT">已取消</el-radio-button>
      </el-radio-group>
      <span style="float: right">
        <el-select v-model="MOm" placeholder="请选择订单来源" @change="changeVal1" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in MomType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
    </div>
    <gt-commission-group :customerid="id" :types="activeName" :orderSource="MOm" />
  </el-card>
</template>
<script>
import gtCommissionGroup from './commissionGroup'
import { MomType } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  components:{ gtCommissionGroup },
  data(){
    return{
      id: null,
      activeName: '',
      MomType,
      MOm: ''
    }
  },
  props:{
    cardtype:{
      type:String
    }
  },
  created(){
    const {obj} = this.$route.query
    this.id = obj.id
  },
  methods:{
    changeVal(val){
      this.activeName = val
      var obj = {
        orderSource: this.MOm,
        orderStatus:this.activeName
      }
      this.$emit('updateObj',obj)
    },
    changeVal1(val){
      this.MOm = val
      var obj = {
        orderSource: this.MOm,
        orderStatus:this.activeName
      }
      this.$emit('updateObj',obj)
    }
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
</style>


