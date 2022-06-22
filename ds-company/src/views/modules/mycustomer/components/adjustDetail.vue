<template>
   <el-dialog
    title="余额变动明细"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    class="cardDia"
    append-to-body>
    <div style="margin: 12px 0;margin-bottom: 20px;">
      <el-radio-group v-model="operateType" @change="changeVal">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="RECHARGE">充值</el-radio-button>
        <el-radio-button label="CONSUME">消费</el-radio-button>
        <el-radio-button label="REFUND">退款</el-radio-button>
        <el-radio-button label="ADJUST">手动调整</el-radio-button>
        <el-radio-button label="REFUND_RECHARGE">充值退款</el-radio-button>
      </el-radio-group>
    </div>
    <gt-adjust-detail-model :customerCardId="id" :types="operateType"/>
  </el-dialog>
</template>
<script>
import gtAdjustDetailModel from './adjustDetailModel'
export default {
  components:{ gtAdjustDetailModel },
  data(){
    return{
      visible: false,
      id: null,
      operateType: '',
    }
  },
  props:{
    cardtype:{
      type:String
    }
  },
  methods:{
    init(id){
      this.id = id
      this.visible = true
      this.operateType = ''
    },
    changeVal(val){
      this.operateType = val
    }
  }
}
</script>

<style>

.cardDia .el-dialog__body {
  padding-top: 10px!important;
}
</style>

