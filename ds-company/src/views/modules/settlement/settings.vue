<template>
  <el-dialog
    :close-on-click-modal="false"
    title="佣金结算设置"
    :visible.sync="visible"
    width="50%"
    class="commission-container"
    append-to-body>
    <p>佣金提现金额设置： 单笔申请提现最低金额<el-input class="setting-input" v-model="form.amount"></el-input>元</p>
    <p>【说明】</p>
    <p>1. 佣金结算设置将对该企业下的所有社区拼团活动生效，请谨慎填写</p>
    <p>2. 佣金结算设置的修改仅生效于在修改保存时间之后产生的佣金提现申请，不作用于修改时间之前的佣金提现</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCommissionSetting, editCommission } from '@/service/setting'
import { priceRange } from '@/utils/validate'
export default {
  data() {
    return {
      visible: false,
      form: {
        id: null,
        amount: null,
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      // 获取设置详情
      this.getCommission()
    },
    async getCommission() {
      const { data } = await getCommissionSetting()
      if (data.code === 0) {
        this.form = data.data
      }else{
        this.$message.error(data.msg)
      }
    },

    // 提交佣金结算设置
    async dataFormSubmit() {
      if (this.form.amount && priceRange(this.form.amount)) {
        const { data } = await editCommission(this.form)
        if (data.code === 0) {
          this.visible = false
        } else {
          this.$message.error(data.msg)
        }
      } else {
        this.$message.warning('请输入正确的金额')
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
