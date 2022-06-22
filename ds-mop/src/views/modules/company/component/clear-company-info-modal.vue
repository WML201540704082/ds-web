<template>
<el-dialog
  title="一键清空"
  :close-on-click-modal="false"
  :visible.sync="visible"
  v-if="visible"
  class="company-distribute-modal"
  width="80%"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
    <el-form-item class="id-form-item" label="数据类型" prop="type">
      <el-select placeholder="请选择数据类型" v-model="dataForm.type" clearable>
        <el-option label="企业商品数据" value="PRODUCT" ></el-option>
        <el-option label="企业顾客数据" disabled value="CUSTOMER" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="附件" prop="attachment">
      <gt-image-upload :realistStr="'attachment'" :names="1" :multiple="true" :max=1 :reallist="dataForm.attachment" :cb="value => dataForm.attachment = value" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="dataForm.remark" style="width: 300px;"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" v-loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import gtImageUpload from '@/components/gt-image-upload'
import { clearCompanyInfo } from '@/service/company'
import { limitInputName} from '@/utils/validate'
export default {
  data () {
    const validateIdentify = (rule, value, callback) => {
      if (!isIdentify(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }
    return {
      visible: false,
      submitLoading: false,
      companyInfo: null,
      dataForm: {
        companyId: null,
        type: 'PRODUCT',
        accessory: null,
        remark: null,
      },
      dataRule: {
        type: [{ required: true, message: '清空数据类型必填'}],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      }
    }
  },
  components: {
    gtImageUpload,
  },
  methods: {
    async init (companyData) {
      this.visible = true
      this.companyInfo = companyData
      this.dataForm = {
        companyId: companyData.id,
        type: 'PRODUCT',
        attachment: null,
        remark: null,
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$easyConfirm.show({
            title: '提示',
            content: '<div>商品一键清空会删除该企业下所有的商品信息，商品关联的库存信息也会被清除掉，且<span style="color: red;">操作不可恢复</span>，确定要继续操作吗？</div>',
            confirm: async () => {
              const { data } = await clearCompanyInfo({
                ...this.dataForm,
                companyNo: this.companyInfo.code,
                companyName: this.companyInfo.name
              })
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshData')
              } else {
                this.$message.error(data.msg)
              }
            }
          })

        }
      })
    }
  }
}
</script>
<style lang="scss">
.clear-company-info-modal{

}
</style>
