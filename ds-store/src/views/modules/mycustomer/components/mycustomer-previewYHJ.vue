<template>
  <el-card class="mode-store-table mode-store-table1">
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="-1">全部</el-radio-button>
        <el-radio-button label="1">已使用</el-radio-button>
        <el-radio-button label="0">未使用</el-radio-button>
        <el-radio-button label="2">已过期</el-radio-button>
      </el-radio-group>
    </div>
    <gt-customerlist :customerid="id" :types="activeName" />
  </el-card>
</template>
<script>
import gtCustomerlist from './mycustomer-yhjList'
export default {
  components:{ gtCustomerlist },
  data(){
    return{
      id: null,
      activeName: '-1',
    }
  },
  props:{
    cardtype:{
      type:String
    }
  },
  created(){
    const { id } = this.$route.query
    this.id = id
  },
  methods:{
    changeVal(val){
      this.activeName = val
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


