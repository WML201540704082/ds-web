<template>
<el-dialog
  title="提示"
  :close-on-click-modal="false"
  class="basic-commission-tip"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item prop="categoryCommissionType">
      <el-radio-group v-model="dataForm.categoryCommissionType">
        <el-radio label="RATIO">仅更改按比例提成商品</el-radio>
        <el-radio label="ALL">更改该分类下的全部商品（包含按固定金额提成商品）</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import * as api from '@/service/goods'
import { priceRange} from '@/utils/validate'
export default {
  name: 'basic-commission-tip',
  data () {
    return {
      visible: false,
      dataForm: {
        categoryId: null,
        commission: null,
        categoryCommissionType: 'RATIO'
      },
      dataRule: {
        categoryCommissionType: [{required: true, message: '请填写提成值', trigger: 'blur'}]
      }
    }
  },

  methods: {
    async init (data) {
      this.dataForm = {
        ...this.dataForm,
        ...data
      }
      this.visible = true
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const { data } = await api.setPercent({
            ...this.dataForm,
            commission: this.priceNum(this.dataForm.commission, 'out')
          })
          if (data.code === 0) {
            this.visible = false
            this.$emit('refresh')
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">
.basic-commission-tip{
  .el-radio{
    display: block;
    margin: 10px 0;
    .el-radio__label{
      font-size: 14px;
    }
  }
  .el-radio+.el-radio{
    margin-left: 0;
  }
}
</style>

