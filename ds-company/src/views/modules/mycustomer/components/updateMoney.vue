<template>
  <el-dialog
    title="修改储值卡余额"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="intergralObj" :rules="intergralObjRule" ref="intergralObj" label-width="120px">
      <el-form-item label="操作类型" prop='type'>
        <el-radio-group v-model="intergralObj.type" @change="reset">
          <el-radio :label="'ADD'" :value="'ADD'">手动增加</el-radio>
          <el-radio :label="'SUB'" :value="'SUB'">手动扣减</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="变动金额" prop="intergral">
        <el-input v-model="intergralObj.intergral"></el-input>
      </el-form-item>
      <el-form-item label="当前余额" prop="currentIntergral">
        <span class="itemInput">{{Number(priceNum(intergralObj.currentIntergral)).toFixed(2)}}</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {commissionRange} from '@/utils/validate'
import { cardRecordModify } from '@/service/mycustomer'
export default {
  data(){
    const isChange = (rule ,value,callback)=>{
      if(value>0){
        if(this.intergralObj.type=='ADD'){
          if(!commissionRange(value, 999999,'normal')){
            callback(new Error('请输入小于等于999999的变动余额(最多保留小数点后两位)'))
          }else{
            callback()
          }
        }else{
          if(!commissionRange(value, this.priceNum(this.intergralObj.currentIntergral),'normal')){
            callback(new Error('请输入小于等于当前余额的变动余额(最多保留小数点后两位)'))
          }else{
            callback()
          }
        }
        
      }else{
        callback(new Error('不得小于等于0'))
      }

    }

    return{
      visible: false,
      campaignList:[],
      remark: null,
      customerIds:null,
      
      intergralObj:{
        currentIntergral: null,
        type: 'ADD',
        intergral: null,
      },
      intergralObjRule:{
        intergral: [{required: true,message:'请选输入变动余额'},
          {validator:isChange,trigger: 'change'}],
      }
    }
  },
  methods:{
    init(ids,intergral){
      this.customerIds = ids
      this.intergralObj.currentIntergral = intergral
      this.visible = true
      this.intergralObj.intergral = null
    },
    reset(value){
      this.intergralObj.intergral = null
    },
    sendButton(){
      this.$refs['intergralObj'].validate(async (valid) => {
        if (valid) {
          const {data} = await cardRecordModify({
            customerId: this.customerIds,
            val:this.intergralObj.type=='ADD'?this.priceNum(this.intergralObj.intergral,'out'):'-'+this.priceNum(this.intergralObj.intergral,'out'),
          })
          if(data.code == 0){
            this.$message.success('储值卡余额修改成功')
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }
        }
      })

    }
  }
}
</script>


