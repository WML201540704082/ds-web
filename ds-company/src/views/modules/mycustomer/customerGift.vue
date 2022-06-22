<template>
  <el-dialog
    title="发放礼品卡"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="礼品卡名称" prop="statCardId">
        <el-select v-model="sendObj.statCardId" placeholder="请选择礼品卡" filterable>
          <el-option v-for="item in giftCardList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">发放</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getstatCardSelectOption, sendCustomerStatCard } from '@/service/campaign'
export default {
  data(){
    return{
      visible: false,
      giftCardList:[],
      customerIds:null,
      sendObj:{
        statCardId: null,
      },
      key: '',
      sendObjRule:{
        statCardId: [{required: true,message:'请先选择礼品卡'}],
      }
    }
  },
  methods:{
    init(ids){
      this.customerIds = ids
      this.visible = true
      this.sendObj.statCardId = null
      this.key = ''
      this.getCountCard()
    },
    
    // 获取礼品卡
    async getCountCard(){
      const { data } = await getstatCardSelectOption({
        'keyword': this.key,
        'storeIds':null
      })
      if (data && data.code == 0) {
        this.giftCardList = data.data
      } else {
        this.giftCardList = []
        this.$message.warning(data.msg)
      }
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          const data = await sendCustomerStatCard({
            statCardId:this.sendObj.statCardId,
            customerIds: this.customerIds
          })
          this.$message.success('发送礼品卡成功')
          this.visible = false
          this.$emit('refreshDataList')

        }
      })

    }
  }
}
</script>
<style>
.el-textarea.is-disabled .el-textarea__inner {
  resize: none;
}
</style>


