<template>
<el-dialog
  :title="!dataForm.categoryId ? '添加子分类' : '修改子分类'"
  :close-on-click-modal="false"
  class="subcategory-add-or-update"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label="一级分类" prop="firstCategoryId">
      <span class="itemInput">{{dataForm.firstCategoryName}}</span>
    </el-form-item>
    <el-form-item label="子分类名称" prop="categoryName" class="gt-input-tip">
      <el-input v-model="dataForm.categoryName" placeholder="请输入子分类名称"></el-input>
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
import { limitInputName } from '@/utils/validate'
export default {
  name: 'subcategory-add-or-update',
  data () {
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,20) == 1) {
        callback(new Error('商品名称不能超过10个汉字'))
      } else{
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        categoryId: null,
        firstCategoryId: null,
        firstCategoryName: null,
        // commission: 0,
        categoryName: null
      },
      dataRule: {
        categoryName: [{required: true, message: '请输入子分类名称'}, {validator: validateName, trigger: 'blur' }],
      }
    }
  },

  methods: {
    async init (data) {
      this.dataForm = data
      this.visible = true
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let result = null
          let params = {
            id: this.dataForm.categoryId,
            name: this.dataForm.categoryName,
            parentId: this.dataForm.firstCategoryId
          }
          if (this.dataForm.categoryId) {
            result = await api.updataSubCategory(params)
          } else {
            result = await api.addSubCategory(params)
          }
          const { data } = result
          if (data.code === 0) {
            this.visible = false
            this.$emit('refreshSubcategory', data.data.id)
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
.goods-brand-commission-dailog{
  .gt-input-tip.small{
    .el-input__inner{
      width: 100px;
    }
    .el-input__prefix{
      left: 110px;
    }
  }
}
</style>

