<template>
  <el-dialog
    title="修改购物卡余额"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="intergralObj" :rules="intergralObjRule" ref="intergralObj" label-width="120px">
      <el-form-item label="操作类型" prop='operateType'>
        <el-radio-group v-model="intergralObj.operateType" @change="reset">
          <el-radio :label="'INCREASE'" :value="'INCREASE'">手动增加</el-radio>
          <el-radio :label="'REDUCE'" :value="'REDUCE'">手动扣减</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="变动金额" prop="intergral">
        <el-input v-model="intergralObj.intergral"></el-input>
      </el-form-item>
      <el-form-item label="当前余额" prop="currentIntergral">
        <span class="itemInput">{{intergralObj.currentIntergral}}</span>
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
import { shoppingCardModify } from '@/service/mycustomer'
export default {
  data(){
    const isChange = (rule ,value,callback)=>{
      if(value>0){
        if(this.intergralObj.operateType=='INCREASE'){
          if(!commissionRange(value, 999999,'normal')){
            callback(new Error('请输入小于等于999999的变动金额(最多保留小数点后两位)'))
          }else{
            callback()
          }
        }else{
          if(!commissionRange(value, this.intergralObj.currentIntergral,'normal')){
            callback(new Error('请输入小于等于当前余额的变动金额(最多保留小数点后两位)'))
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
        operateType: 'INCREASE',
        intergral: null,
      },
      intergralObjRule:{
        intergral: [{required: true,message:'请选输入变动余额'},
          {validator:isChange,trigger: 'change'}],
      }
    }
  },
  methods:{
    init(customerId,cardId,amount){
      this.customerIds = customerId
      this.cardId = cardId
      this.intergralObj.currentIntergral = amount
      this.visible = true
      this.intergralObj.intergral = null
    },
    reset(value){
      this.intergralObj.intergral = null
    },
    sendButton(){
      this.$refs['intergralObj'].validate(async (valid) => {
        if (valid) {
          const {data} = await shoppingCardModify({
            operateType: this.intergralObj.operateType,
            customerId: this.customerIds,
            cardId: this.cardId,
            changeAmount:this.priceNum(this.intergralObj.intergral,'out'),
            // amount:this.intergralObj.operateType=='INCREASE' ? this.priceNum(this.intergralObj.currentIntergral + this.intergralObj.intergral,'out') 
            //                                      : this.priceNum(this.intergralObj.currentIntergral - this.intergralObj.intergral,'out')
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


