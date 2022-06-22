<template>
  <el-dialog
    title="社区拼团团长等级设置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    class="withdraw-amount-set-modal"
    width="650px">
    <div class="tables">
      <div class="wxtitle">温馨提示：社区拼团团长的粉丝数一旦设定不允许修改，请谨慎填写。</div>
      <div class="wxtitle1">
        <div class="set">
          <span class="borderNone">团长级别</span>
          <span>团长名称</span>
          <span class="spec-item">达到粉丝数下限（人）</span>
        </div>
        <div class="set">
          <span class="borderNone">1</span>
          <span>黑金</span>
          <span><el-input class="widthFixed" v-model="obj.blackGold" :disabled="!isF"></el-input></span>
        </div>
        <div class="set setborderNone">
          <span class="borderNone">2</span>
          <span>黄金</span>
          <span><el-input class="widthFixed" v-model="obj.gold" :disabled="!isF"></el-input></span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="isF">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {validatenull} from '@/utils/validate'
import {getheadRuleDetail,getaddHeadRule} from '@/service/activity'
export default {
  data(){
    return{
      visible: false,
      remark: null,
      obj:{
        blackGold: '',
        gold: ''
      },
      isF: false
    }
  },
  methods:{
    init(obj,isF){
      this.visible = true
      this.isF = isF
      if(obj){
        this.obj = obj
      }else{
        this.obj = {
          blackGold: null,
          gold: null
        }
      }
    },
    checkInfo(){
      let reg= /^[0-9]+$/
      if(!validatenull(Math.abs(this.obj.blackGold))){
        if(!reg.test(Math.abs(this.obj.blackGold))||Math.abs(this.obj.blackGold)<=0||Math.abs(this.obj.blackGold)> 20000000){
          this.$message.warning('黑金粉丝数量只能为正整数，且(0~20000000)之间，不包含0')
          return false
        }else{
          if(!validatenull(Math.abs(this.obj.gold))){
            if(!reg.test(Math.abs(this.obj.gold))||Math.abs(this.obj.gold)<=0||Math.abs(this.obj.gold)> 20000000){
              this.$message.warning('黄金粉丝数量只能为正整数，且(0~20000000)之间，不包含0')
              return false
            }else{
              if(Math.abs(this.obj.blackGold)<=Math.abs(this.obj.gold)){
                this.$message.warning('黑金必须大于黄金粉丝数量')
                return false
              }else{
                return true
              }
            }
          }else{
            this.$message.warning('黄金粉丝数量不得为空')
            return false
          }
        }
      }else{
        this.$message.warning('黑金粉丝数量不得为空')
        return false
      }
    },
    async sendButton(){
      if(this.checkInfo()){
        var {data} = await getaddHeadRule({
          'blackGold': this.obj.blackGold,
          'gold': this.obj.gold
        })
        if(data.code == 0){
          this.$message.success('团长等级设置成功')
          this.visible = false
          this.$emit('updateWithdrawal')
        }else{
          this.$message.error(data.msg)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.withdraw-amount-set-modal{
  .tables {
    text-align: center;
    .wxtitle {
      font-size: 12px;
      color: red;
    }
    .spec-item{
      white-space:nowrap;
      text-overflow:ellipsis;
    }
    .borderNone, .setborderNone {
      border: none!important;
    }
    .wxtitle1 {
      display: inline-block;
      margin-top: 15px;
      border: 1px solid #ddd;
      .set {
        height: 40px;
        border-bottom: 1px solid #ddd;
        span {
          width: 184px;
          display: inline-block;
          border-left: 1px solid #ddd;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 12px;
          color: #333;
        }
        .widthFixed {
          .el-input__inner {
            width: 130px!important;
            height: 25px!important;
          }
        }
      }
    }
  }
}

</style>

