<template>
  <el-dialog
    title="下架原因"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="下架原因" prop="stopReason">
        <el-input type="textarea" v-model="sendObj.stopReason"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data(){
    return{
      visible: false,
      id:null,
      sendObj:{
        stopReason: null,
      },
      sendObjRule:{
        stopReason: [{required: true,message:'请先输入下架原因'}],
      }
    }
  },
  methods:{
    init(ids){
      this.id = ids
      this.visible = true
      this.sendObj.stopReason = null
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          this.$easyConfirm.show({
            title: '提示',
            content: '您确定要强制下架此活动吗？',
            confirm: async () => {
              const data = await this.$http({
                url: this.$http.adornUrl('/activity/terminate',true),
                method: 'post',
                data: this.$http.adornData({
                  id: this.id,
                  stopReason: this.sendObj.stopReason
                })
              }).then(({data}) => {
                if(data.code == 0){
                  this.$message.success('下架成功')
                  this.visible = false
                  this.$emit('refreshDataList')
                }else{
                  this.$message.error(data.msg)
                }
              })
            }
          })
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


