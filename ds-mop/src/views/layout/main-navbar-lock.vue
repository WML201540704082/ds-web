<template>
  <el-dialog
    title="设置锁屏密码"
    width="30%"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setStore } from '@/utils/storage'
import { clearLoginInfo } from '@/utils'
export default {
  // props: ['visible'],
  data () {
    return {
      visible: false,
      dataForm: {
        password: '',
      },
      dataRule: {
        password: [{
          required: true
        }]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setStore({
            name: 'lock-password',
            content: this.dataForm.password,
            type: 'session'
          })
          // this.$emit('updateVisible')
          this.$router.push({name: 'lock'})
        }
      })
    },
  },
  // mounted() {
  //   this.$refs['dataForm'].resetFields()
  // },
}
</script>

