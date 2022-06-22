<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    class="dialogFind"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" class="gt-input-tip">
        <el-input type="password" v-model="dataForm.newPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" class="gt-input-tip">
        <el-input id="pass" type="password" v-model="dataForm.confirmPassword"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import { getStore } from '@/utils/storage'
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
      userName: '',
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
  },
  computed: {
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    }
  },
  methods: {
    // 初始化
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.userName = getStore({name: 'mop-userName'})
        // 对该表单项进行重置，将其值重置为初始值并移除校验结果
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/mop/sysUser/updatePassword'),
            method: 'post',
            data: this.$http.adornData({
              'oldPassword': this.dataForm.password,
              'newPassword': this.dataForm.newPassword,
              'verifyNewPassword': this.dataForm.confirmPassword
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
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
            } else {
              this.$message.error(data.msg)
            }
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
  .el-dialog__header{
    text-align: center;
    border-bottom: 1px solid #f2f2f2;
    .el-dialog__title {
      color: #FC5A3D;
    }
  }
}
</style>

