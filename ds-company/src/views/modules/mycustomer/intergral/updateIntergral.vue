<template>
  <el-dialog
    title="修改积分"
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
      <el-form-item label="变动积分" prop="intergral">
        <el-input v-model="intergralObj.intergral"></el-input>
      </el-form-item>
      <el-form-item label="当前积分" prop="currentIntergral">
        <span class="itemInput">{{intergralObj.currentIntergral}}</span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" rows="3" v-model="intergralObj.remark" placeholder="请输入备注内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { integralModify } from '@/service/mycustomer'
import { limitInputName } from '@/utils/validate'
export default {
  data(){
    const isChange = (rule ,value,callback)=>{
      if(value>0){
        var CS = /^[0-9]+$/
        if (CS.test(value)) {
          if(this.intergralObj.type=='ADD'){
            if(value>999999){
              callback(new Error('请输入小于等于999999的变动积分'))
            }else{
              callback()
            }
          }else{
            if(this.intergralObj.currentIntergral<value){
              callback(new Error('请输入小于等于当前积分的变动积分'))
            }else{
              callback()
            }
          }
        }else{
          callback(new Error('只能输入正整数'))
        }
      }else{
        callback(new Error('不得小于等于0'))
      }
    }

    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,100) == 1) {
        callback(new Error('备注不能超过50个汉字'))
      } else{
        callback()
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
        remark: null
      },
      intergralObjRule:{
        intergral: [{required: true,message:'请选输入变动积分'},
          {validator:isChange,trigger: 'change'}],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      }
    }
  },
  methods:{
    init(ids,intergral){
      console.log(intergral)
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
          const {data} = await integralModify({
            customerId: this.customerIds,
            val:this.intergralObj.type=='ADD'?this.intergralObj.intergral:'-'+this.intergralObj.intergral,
            remark:this.intergralObj.remark
          })
          if(data.code == 0){
            this.$message.success('积分修改成功')
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }
        }
      })

    },
  }
}
</script>


