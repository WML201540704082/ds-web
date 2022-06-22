<template>
  <el-dialog
    :title="type === 'bind' ? '绑定' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="40%">
    <el-form :model="bind_update" :rules="bindRule" ref="bind_update" label-width="120px">
      <el-form-item label="门店名称:" prop="name">
        <span class="itemInput">{{bind_update.name}}</span>
      </el-form-item>
      <el-form-item label="企业名称:" prop="companyName">
        <span class="itemInput">{{bind_update.companyName}}</span>
      </el-form-item>
      <el-form-item label="门店编码:" prop="code" v-if="type=='bind'">
        <el-input v-model="bind_update.code"></el-input>
      </el-form-item>
      <el-form-item label="原门店编码:" prop="yundingCode" v-if="type=='update'">
        <el-input :disabled="true" v-model="bind_update.yundingCode"></el-input>
      </el-form-item>
      <el-form-item label="新门店编码:" prop="code" v-if="type=='update'">
        <el-input v-model="bind_update.code"></el-input>
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
  name:'intelligent_bindOrUpdate',
  data(){
    const validateCode = (rule, value, callback) => {
      if (value) {
        if (value == this.bind_update.yundingCode) {
          callback(new Error('与原门店编码一致，请重新输入！'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请先输入门店编码'))
      }
    }
    return{
      type:'',
      visible: false,
      id:null,
      bind_update:{
        code: null,
      },
      bindRule:{
        code: [{required: true,message:'请先输入门店编码'},{validator:validateCode,trigger:'blur'}],
      }
    }
  },
  methods:{
    init(row,type){
      this.id = row.id
      this.bind_update.name = row.name
      this.bind_update.companyName = row.companyName
      this.bind_update.yundingCode = row.yundingCode
      this.bind_update.code = row.yundingCode || ''
      this.type = type
      this.visible = true
    },
    sendButton(){
      this.$refs['bind_update'].validate(async (valid) => {
        if (valid) {
          const data = await this.$http({
            url: this.$http.adornUrl('/yunding/store/bind',true),
            method: 'post',
            data: this.$http.adornData({
              add:this.type == 'bind' ? true : '',
              businessStoreId: this.id,
              code: this.bind_update.code
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$message.success('绑定成功')
              this.visible = false
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
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


