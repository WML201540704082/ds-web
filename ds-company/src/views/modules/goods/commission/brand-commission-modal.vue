<template>
<el-dialog
  :title="!dataForm.id ? '新增' : '修改'"
  :close-on-click-modal="false"
  class="goods-brand-commission-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label="商品大类" prop="firstCategoryId">
      <el-select v-model="dataForm.firstCategoryId" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
        <el-option
          v-for="item in mainCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品品牌" prop="brandIds">
      <el-select multiple filterable v-model="dataForm.brandIds" placeholder="请选择商品品牌" clearable>
        <el-option
          v-for="item in brands"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="categoryIds" label="商品小类">
      <el-select multiple v-model="dataForm.categoryIds" placeholder="请选择二级分类" clearable>
        <el-option
          v-for="item in subCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="提成方式" prop="commissionType">
      <el-radio-group v-model="dataForm.commissionType">
        <el-radio label="RATIO">按比例</el-radio>
        <el-radio label="FIXED_AMOUNT">按固定金额</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="提成值" prop="commission" class="gt-input-tip small">
      <el-input v-model="dataForm.commission" placeholder="提成值"><span slot="prefix"><span class="unit">{{dataForm.commissionType === 'RATIO' ? '%' : '元'}}</span></span></el-input>
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
  name: 'brand-commission-modal',
  data () {
    const commission = (rule, value, callback) => {
      // var CS = /^[0-9]+$/
      // if (!CS.test(value) || value === 0) {
      //   callback(new Error('只能输入正整数'))
      // }else if(value > 100){
      //   callback(new Error('最大支持100'))
      // }else{
      //   callback()
      // }
      if (this.dataForm.commissionType === 'RATIO' && !priceRange(value, 100, 0)) {
        callback(new Error('请输入0-100数字，最多保留小数点后两位'))
      } else if(this.dataForm.commissionType === 'FIXED_AMOUNT' && !priceRange(value, 1000, 0)) {
        callback(new Error('请输入0-1000数字，最多保留小数点后两位'))
      }else {
        callback()
      }
    }
    return {
      visible: false,
      mainCategory: [], // 大类的下拉框
      brands: [], // 品牌列表
      subCategory: [], // 子类的下拉框
      dataForm: {
        id: null,
        firstCategoryId: null,
        categoryIds: [],
        brandIds: [],
        commissionType: 'RATIO',
        commission: null
      },
      dataRule: {
        firstCategoryId: [{required: true, message: '请选择商品大类'}],
        brandIds: [{required: true, message: '请选择商品品牌'}],
        commissionType: [{required: true, message: '请选择提成类型'}],
        commission: [{required: true, message: '请填写提成值', trigger: 'blur'}, {validator:commission,trigger: 'blur'}]
      }
    }
  },

  methods: {
    async init (data) {
      if (data!='add') {
        const firstCategoryId = data.firstCategory ? data.firstCategory.id : null
        this.dataForm = {
          id: data.id,
          firstCategoryId,
          categoryIds: data.categoryIds ? data.categoryIds.split(',').map(item => parseInt(item)) : [],
          brandIds: data.brandIds.split(',').map(item => parseInt(item)),
          commissionType: data.commissionType,
          commission: this.priceNum(data.commission)
        }
        if (firstCategoryId) {
          this.getSubCategoryList(firstCategoryId, 'init')
        }
      }else{
        this.dataForm= {
          id: null,
          firstCategoryId: null,
          commissionType: 'RATIO',
          categoryIds: [],
          brandIds: [],
          commission: null
        }
      }
      this.getMainCategoryList()
      this.getBrandList()
      this.visible = true
    },

    // 获取父类
    async getMainCategoryList() {
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainCategory = data.records
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取品牌
    async getBrandList() {
      const { data } = await api.brandsList()
      if (data.code === 0) {
        this.brands = data.data
      } else {
        this.brands = []
        this.$message.error(data.msg)
      }
    },

    // 获取子类
    async getSubCategoryList(id, type) {
      if (!type) {
        this.dataForm.categoryIds = []
      }
      this.subCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        } else {
          this.$message.error(data.msg)
        }
      }
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          // // 品牌
          // let brandName = []
          // this.brands.forEach(item => {
          //   if (this.dataForm.brandId.indexOf(item.id) > -1) {
          //     brandName.push(item.brandName)
          //   }
          // })

          // 商品小类
          // let categorys = []
          // if (this.dataForm.categoryIds && this.dataForm.categoryIds.length > 0) {
          //   this.subCategory.forEach(item => {
          //     if (this.dataForm.categoryIds.indexOf(item.id) > -1) {
          //       categorys.push(item.name)
          //     }
          //   })
          // }

          // 商品大类
          // let firstCategory = this.mainCategory.find(item => item.id == this.dataForm.firstCategoryId).name

          let result = null
          if (this.dataForm.id) {
            result = await api.editBrandPercent({
              ...this.dataForm,
              commission: this.priceNum(this.dataForm.commission, 'out'),
            })

          } else {
            result = await api.addBrandPercent({
              ...this.dataForm,
              commission: this.priceNum(this.dataForm.commission, 'out')
            })
          }
          const { data } = result
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

