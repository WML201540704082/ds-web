<template>
  <section>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-card>
        <el-form-item label="原密码" prop="password">
          <el-input type="password" v-model="dataForm.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" class="gt-input-tip">
          <el-input type="password" v-model="dataForm.newPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" class="gt-input-tip">
          <el-input id="pass" type="password" v-model="dataForm.confirmPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
        </el-form-item>
      </el-card>
    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" @click.native="dataFormSubmit" :loading="$store.state.loading.global" txt="保存"/>
    </div>
  </section>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import { password } from '@/utils/validate'
export default {
  data () {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        this.dataForm.confirmPassword = ''
        let inputelement=document.getElementById('pass')
        inputelement.focus()
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: password, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.$nextTick(() => {
        // 对该表单项进行重置，将其值重置为初始值并移除校验结果
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/company/sysUser/updatePassword'),
            method: 'post',
            data: this.$http.adornData({
              'oldPassword': this.dataForm.password,
              'newPassword': this.dataForm.newPassword,
              'verifyNewPassword': this.dataForm.confirmPassword
            })
          }).then((data) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$nextTick(() => {
                  this.mainTabs = []
                  clearLoginInfo()
                  this.$router.replace({ name: 'login' })
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>

