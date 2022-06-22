<template>
  <el-dialog
    title="设置微信营销"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="选择活动" prop="activityId">
        <el-select v-model="sendObj.activityId" placeholder="请输入活动关键词" filterable clearable>
          <el-option v-for="item in campaignList" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCustomerwechat } from '@/service/mycustomer'
import {getactivitySelect} from '@/service/activity'
export default {
  data(){
    return{
      visible: false,
      campaignList:[],
      remark: null,
      customerIds:null,
      sendObj:{
        activityId: null,
      },
      key: '',
      sendObjRule:{
        activityId: [{required: true,message:'请先选择活动'}],
      }
    }
  },
  methods:{
    init(ids){
      this.customerIds = ids
      this.visible = true
      this.sendObj.activityId = null
      this.key=''
      this.selectOption()
    },
    // 获取活动下拉
    async selectOption(){
      const {data} = await getactivitySelect({
        name: this.key
      })
      if (data && data.code === 0) {
        this.campaignList = data.data
      } else {
        this.campaignList = []
      }
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          const data = await getCustomerwechat({
            activityId:this.sendObj.activityId,
            customerIds: this.customerIds
          })
          this.$message.success('微信活动设置成功')
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


