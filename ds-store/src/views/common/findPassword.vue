<template>
  <el-dialog
    title="找回密码"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="dialogFind"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="verificationCode">
        <el-input v-model="dataForm.verificationCode" class ="verCode" placeholder="请输入短信验证码" style="width: 200px;float: left;"></el-input>
        <gt-getvarcode :phone="dataForm.phone" style="float: left;margin-right: 5px;margin-left: 5px;" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" class="gt-input-tip">
        <el-input type="password" v-model="dataForm.newPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="verifyNewPassword" class="gt-input-tip">
        <el-input id="pass" type="password" v-model="dataForm.verifyNewPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
      </el-form-item>
    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" @click.native="dataFormSubmit" txt="保存"/>
    </div>
  </el-dialog>
</template>
<script>
import { isphone, password } from '@/utils/validate'
import gtGetvarcode from '@/components/gt-getvarcode'
export default {
  components: { gtGetvarcode },
  data(){
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        this.dataForm.verifyNewPassword = ''
        let inputelement=document.getElementById('pass')
        inputelement.focus()
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return{
      visible: false,
      dataForm: {
        phone: null,
        verificationCode: null,
        newPassword: null,
        verifyNewPassword: null
      },
      dataRule: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: isphone, trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: password, trigger: 'blur' }
        ],
        verifyNewPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' },
          { validator: password, trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    init(){
      this.visible = true
      this.$nextTick(() => {
        // 对该表单项进行重置，将其值重置为初始值并移除校验结果
        this.$refs['dataForm'].resetFields()
      })
    },
    dataFormSubmit(){
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/sysUser/resetPassword'),
            method: 'post',
            data: this.$http.adornData({
              'newPassword': this.dataForm.newPassword,
              'phone': this.dataForm.phone,
              'verificationCode': this.dataForm.verificationCode,
              'verifyNewPassword': this.dataForm.verifyNewPassword,
            })
          }).then((data)=>{
            this.$message.success('密码重置成功！')
            this.visible = false
            // this.$emit('refreshDataList')
          })

        }
      })

    }
  }
}
</script>
<style lang="scss">
.dialogFind {
  .el-dialog {
    width: 576px;
  }
}
</style>


