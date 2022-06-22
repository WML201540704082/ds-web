<template>
  <el-dialog
    title="审核"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" ref="sendObj" label-width="120px">
      <el-form-item label="审核结果" prop="status">
        <el-radio-group v-model="sendObj.status">
          <el-radio :label="'PASS'" :value="'PASS'">通过</el-radio>
          <el-radio :label="'REFUSE'" :value="'REFUSE'">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="auditDescription">
        <el-input type="textarea" v-model="sendObj.auditDescription" maxlength='50'></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getauditBill } from '@/service/setting'
export default {
  data(){
    return{
      visible: false,
      id:null,
      sendObj:{
        status: null,
        auditDescription: null
      },
      sendObjRules:{
        status:[{required: true, message: '请选择审核结果', trigger: 'change'}]
      }
    }
  },
  methods:{
    init(id){
      this.visible = true
      this.id = id
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          const {data} = await getauditBill({
            ...this.sendObj,
            id: this.id
          })
          if(data.code == 0){
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
<style>
.el-textarea.is-disabled .el-textarea__inner {
  resize: none;
}
</style>


