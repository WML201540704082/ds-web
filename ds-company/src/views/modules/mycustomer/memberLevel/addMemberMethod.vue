<template>
  <el-dialog
    title="设置会员升级方式"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="intergralObj" :rules="intergralObjRule" ref="intergralObj" label-width="120px">
      <el-form-item label="升级方式" prop='type'>
        <el-radio-group v-model="intergralObj.type">
          <el-radio :label="'3'" :value="'3'" style="margin-bottom: 20px">按累计充值金额升级</el-radio>
          <br/>
          <el-radio :label="'2'" :value="'2'" style="margin-bottom: 20px">按累计现金消费升级</el-radio>
          <br/>
          <el-radio :label="'1'" :value="'1'">按累计积分升级</el-radio>
          <el-tooltip placement="top">
            <div slot="content">会员自动升级的积分获得途径：<br/>储值卡积分+礼品卡积分+订单积分，<br/>其他类型积分不参与自动升级规则计算</div>
            <img class="tip-icon" style="margin-left: 5px;margin-top: -5px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="font-size: 14px;color: red;text-align:center;">若会员升级规则类型不同,会员等级的自动升级规则会被清空,请确定是否继续?</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setSaveType } from '@/service/mycustomer'
export default {
  data(){
    return{
      visible: false,
      intergralObj:{
        type: '2',
      },
      intergralObjRule:{
        intergral: [{required: true,message:'请选择会员升级方式'}],
      }
    }
  },
  methods:{
    init(type){
      this.intergralObj.type = type
      this.visible = true
    },
    async sendButton(){
      const { data } = await setSaveType({id:this.intergralObj.type})
      if (data.code === 0) {
        this.$message.success('会员升级方式设置成功')
        this.$easyConfirm.hide()
        this.visible = false
        this.$emit('refreshDataList')
      } else {
        this.$easyConfirm.hide()
        this.$message.error(data.msg)
      }
    },
  }
}
</script>


