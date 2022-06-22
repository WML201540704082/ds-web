<template>
  <el-card class="mode-store-table mode-store-table1">
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="NORMAL">使用中</el-radio-button>
        <el-radio-button label="USE">已用尽</el-radio-button>
        <el-radio-button label="INVALID">已过期</el-radio-button>
      </el-radio-group>
    </div>
    <gt-record-card :customerid="id" :types="activeName" />
  </el-card>
</template>
<script>
import gtRecordCard from './recordCard'
export default {
  components:{ gtRecordCard },
  data(){
    return{
      id: null,
      activeName: '',
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


