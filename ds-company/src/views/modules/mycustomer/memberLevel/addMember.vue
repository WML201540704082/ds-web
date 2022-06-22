<template>
  <el-dialog
    :title="id?'编辑会员等级':'新增会员等级'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="50%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="会员等级名称" class="gt-input-tip large" prop='vipName'>
        <el-input v-model="sendObj.vipName" placeholder="请输入会员等级的名称" maxlength="10"><span slot="prefix" >*名称限制10个字符以内（支持汉字、数字、字母）</span></el-input>
      </el-form-item>
      <el-form-item label="会员优惠折扣" class="gt-input-tip" prop="vipDiscount">
        <el-input v-model="sendObj.vipDiscount" placeholder="请输入会员等级的折扣" >
          <span slot="prefix" >%</span>
        </el-input>
      </el-form-item>
      <el-form-item label="自动升级规则" prop="upgtadeRule">
        <span style="font-size: 12px;">当顾客{{text}}达到</span><el-input class="ruleWidth" maxlength="7" v-model="sendObj.upgtadeRule" ></el-input><span style="font-size: 12px;">{{unit}}时，自动升级到该等级</span>
      </el-form-item>
      <el-form-item label="该等级有效期" prop="levelValid">
        <el-radio-group v-model="sendObj.levelValid">
            <el-radio :label="'MAX'" :value="'MAX'">永久</el-radio>
            <el-radio :label="'ONEY'" :value="'ONEY'">1年</el-radio>
            <el-radio :label="'MONTH'" :value="'MONTH'">月</el-radio>
            <span class="ruleWidth" v-if="sendObj.levelValid=='MONTH'"><el-input style="display:initial" maxlength="9" v-model="sendObj.month"></el-input><span style="font-size: 12px;margin-left: 5px;">个月</span></span>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="保级条件" prop="postAum">
        <span style="font-size: 12px;">顾客在该等级效期内的{{text}}达</span><el-input class="ruleWidth" maxlength="7" v-model="sendObj.postAum" ></el-input><span style="font-size: 12px;">{{unit}}时，到期后自动延期一个效期。</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {validatenull,commissionRange,limitInputName} from '@/utils/validate'
import { addorupdateLevel,levelDetail } from '@/service/mycustomer'
export default {
  data(){

    const validateName = (rule, value, callback) => {
      if (limitInputName(value,10,'yes') == 1) {
        callback(new Error('请输入10个字符以内（支持汉字、数字、字母）'))
      } else{
        callback()
      }
    }

    const isValidate = (rule ,value,callback)=>{
      var CS = /^[0-9]+$/
      if(value == 'MONTH'&&(!CS.test(this.sendObj.month)||Number(this.sendObj.month)==0)){
        callback(new Error('请输入月份,且大于等于1'))
      }else{
        callback()
      }
    }

    const isChange = (rule ,value,callback)=>{
      if(value>=0){
        if(!commissionRange(value, 100,'normal')){
          callback(new Error('请输入小于等于100%(最多保留小数点后两位)'))
        }else{
          callback()
        }
      }else{
        callback(new Error('不得小于0'))
      }

    }

    const orderNo = (rule, value, callback) => {
      var CS = /^[0-9]+$/
      if (!CS.test(value)||Number(value)<=0) {
        callback(new Error('只能输入大于0的正整数'))
      }else{
        callback()
      }
    }
    const orderNo1 = (rule, value, callback) => {
      var CS = /^[0-9]+$/
      if (!CS.test(value)||Number(value)<0) {
        callback(new Error('只能输入大于等于0的正整数'))
      }else{
        callback()
      }
    }
    return{
      dataList: [],
      len: 0,
      visible: false,
      id: null,
      text:'累计现金消费',
      unit:'元',
      sendObj:{
        vipName: null,
        vipDiscount:null,
        upgtadeRule: null,
        levelValid: null,
        month: null,
        postAum: null,
      },
      index: null,
      sendObjRule:{
        vipName: [{required: true,message:'请输入会员等级的名称',trigger: 'change'},
          {validator:validateName,trigger: 'change'}],
        vipDiscount: [{required: true,message:'请输入会员等级的折扣',trigger: 'change'},
          {validator:isChange,trigger: 'change'}],
        upgtadeRule: [{required: true,message:'请输入自动升级规则',trigger: 'change'},
          {validator:orderNo,trigger: 'change'}],
        levelValid: [{required: true,message:'请选择该等级有效期',trigger: 'change'},
          {validator:isValidate,trigger: 'blur'}],
        postAum: [{required: true,message:'请输入保级金额',trigger: 'change'},
          {validator:orderNo1,trigger: 'blur'}],
      }
    }
  },
  methods:{
    init(ids,dataList = [],index=0,type=2){
      this.visible = true
      this.sendObj = {}
      this.dataList = dataList
      this.len = dataList.length
      this.index = index
      // 获等级详情
      this.id = ids
      if(ids){
        this.getlevelDetail(ids)
      }
      if(type == 1){
        this.text = '累计积分'
        this.unit = ''
      }else if(type==2){
        this.text = '累计现金消费'
        this.unit = '元'
      }else{
        this.text = '累计充值金额'
        this.unit = '元'
      }
    },
    // 改变值
    async getlevelDetail(id){
      const {data} = await levelDetail(id)
      if(data.code == 0){
        this.sendObj = {
          ...data.data,
          postAum: this.priceNum(data.data.postAum),
          upgtadeRule:this.priceNum(data.data.upgtadeRule)
        }

      }else{
        this.$message.error(data.msg)
      }
    },
    // 校验数据
    checkInfo(sendObj){
      if(this.len >0){
        // 当前数据
        console.log(this.index)
        console.log(this.dataList)
        var index
        if(this.id){
          index = this.index
          if(index == 0){
            var currentAmount = Math.abs(sendObj.upgtadeRule)+Math.abs(sendObj.postAum)
            if(this.dataList[index+1]){
              if(!validatenull(this.dataList[index+1].upgtadeRule)){
                if(Math.abs(this.priceNum(this.dataList[index+1].upgtadeRule))<=currentAmount){
                  this.$message.warning('VIP'+(index+2)+'的自动升级规则值应大于VIP'+(index+1)+'的自动升级规则值+VIP'+(index+1)+'的保级条件值')
                  return false
                }else{
                  return true
                }
              }else{
                return true
              }
            }else{
              return true
            }
          }else{
            // 上一个
            var prevAmount = Math.abs(this.priceNum(this.dataList[index-1].upgtadeRule))+Math.abs(this.priceNum(this.dataList[index-1].postAum))
            if(Math.abs(sendObj.upgtadeRule)<=prevAmount){
              this.$message.warning('VIP'+(index+1)+'的自动升级规则值应大于VIP'+(index)+'的自动升级规则值+VIP'+(index)+'的保级条件值')
              return false
            }else{
              if(this.dataList[index+1]){
                
                if(!validatenull(this.dataList[index+1].upgtadeRule)){
                  // 下一个
                  var nextAmount = Math.abs(this.priceNum(this.dataList[index+1].upgtadeRule))
                  if(Math.abs(sendObj.upgtadeRule)+Math.abs(sendObj.postAum)>=nextAmount){
                    this.$message.warning('VIP'+(index+2)+'的自动升级规则值应大于VIP'+(index+1)+'的自动升级规则值+VIP'+(index+1)+'的保级条件值')
                    return false
                  }else{
                    return true
                  }
                }else{
                  return true
                }
                

              }else{
                return true
              }
            }

          }

        }else{
          index = this.len
          if(index!=0){
            var allAmount = Math.abs(this.priceNum(this.dataList[index-1].upgtadeRule))+Math.abs(this.priceNum(this.dataList[index-1].postAum))
            if(Math.abs(sendObj.upgtadeRule)<=allAmount){
              this.$message.warning('VIP'+(index+1)+'的自动升级规则值应大于VIP'+(index)+'的自动升级规则值+VIP'+(index)+'的保级条件值')
              return false
            }else{
              return true
            }
          }else{
            return true
          }
        }
      }else{
        return true
      }
     
    },
    // 保存时去重
    isRepeats(array1){
      var flag = false
      if(array1.length >0){
        for(var i in array1){
          if(array1[this.index].vipName&&(array1[this.index].vipName === this.sendObj.vipName)&&this.id){
            flag = true
          }else{
            if(array1[i].vipName === this.sendObj.vipName){
              this.$message.warning('不能输入相同的会员等级名称')
              flag = false
              break
            }else{
              flag = true
            }
          }
        }
      }else{
        flag = true
      }
      return flag
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          if(this.checkInfo(this.sendObj)&&this.isRepeats(this.dataList)){
            const {data} = await addorupdateLevel({
              id:this.id || null,
              ...this.sendObj,
              postAum: this.priceNum(this.sendObj.postAum,'out'),
              upgtadeRule:this.priceNum(this.sendObj.upgtadeRule,'out'),
              vipId: this.id?this.sendObj.vipId:'VIP'+(this.len+1)
            })
            if(data.code == 0){
              this.visible = false
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
            }
          }

        }
      })

    }
  }
}
</script>
<style >
.ruleWidth {
    margin: 0 10px;
    display: initial;
}
.ruleWidth input {
    width: 120px!important;
}
</style>


