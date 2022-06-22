<template>
  <el-dialog
    :close-on-click-modal="false"
    title="分账提现金额设置"
    :visible.sync="visible"
    width="50%"
    class="commission-container"
    append-to-body>
    <p>商户提现金额设置： 单笔申请分账提现最低金额<el-input class="setting-input" v-model="form.minAmt"></el-input>元</p>
    <p>【说明】</p>
    <p>1. 提现金额设置的修改仅生效于在修改保存时间之后产生的提现申请，不作用于修改时间之前的提现。</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getConfigBussWithdrawSet, getConfigView } from '@/service/settlement'
import { priceRange } from '@/utils/validate'
export default {
  data() {
    return {
      visible: false,
      form: {
        id: null,
        minAmt: null,
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      // 获取设置详情
      this.getConfigView()
    },
    async getConfigView() {
      const { data } = await getConfigView()
      if (data.code === 0) {
        this.form = {
          ...data.data,
          minAmt: this.priceNum(data.data&&data.data.minAmt)
        }
        
      }else{
        this.$message.error(data.msg)
      }
    },

    // 提交佣金结算设置
    async dataFormSubmit() {
      let reg= /^[0-9]+$/
      if (this.form.minAmt && reg.test(this.form.minAmt)) {
        if(this.form.minAmt>=500&&this.form.minAmt<=99999){
          const { data } = await getConfigBussWithdrawSet({
            id: this.form.id,
            minAmt: this.priceNum(this.form.minAmt,'out')
          })
          if (data.code === 0) {
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        }else{
          this.$message.warning('提现金额应设定为（500-99999）')
        }
        
      } else {
        this.$message.warning('请输入正整数的金额')
      }
    }
  }
}
</script>
<style lang="scss">
.commission-container{
  .setting-input{
    width: 100px;
    margin: 0 5px;
    display: inline-block;
    .el-input__inner{
      width: 100px;
    }
  }
}
</style>
