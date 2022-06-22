<template>
  <el-dialog
    title="查看物流信息"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="30%"
    class="stockview">
    <el-form :model="logistics" ref="logistics">
      <!-- <el-form-item label="物流公司" prop="logisticsCompany">
         <span class="itemInput">{{logistics.logisticsCompany}}</span>
      </el-form-item>
      <el-form-item label="物流单号" prop="logisticsNumber">
        <span class="itemInput">{{logistics.logisticsNumber}}</span>
      </el-form-item> -->
    </el-form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { logisticsCompany } from '@/utils/dict'
export default {
  data(){
    return{
      logisticsCompany,
      visible: false,
      logistics:{
        logisticsCompany: null,
        logisticsNumber: null
      },
    }
  },
  methods:{
    init(logisticsCompany,logisticsNumber){
      this.visible = true
      this.logistics = {
        'logisticsCompany':logisticsCompany,
        'logisticsNumber':logisticsNumber
      }
    },
  }
}
</script>

<style>
.toptitle {
  margin-bottom: 15px;
  color: #72716F;
  font-size: 14px;
  font-weight: 700;
}
.stockview .el-dialog__body {
  padding-top: 10px!important;
}
.el-table__row .inputs1 {
  padding-left: 0!important;
}
</style>

