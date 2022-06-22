<template>
  <el-dialog
    :close-on-click-modal="false"
    title="编辑价格"
    :visible.sync="visible"
    width="34%"
    append-to-body
    class="stockWarning">
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="dataFormRules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice" v-if="storeRoleName === '店长' && hasAuthorization">
          <el-input v-model="form.costPrice" :maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="form.retailPrice" :maxlength="9"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateStorePrice } from '@/service/goods'
import { priceRange } from '@/utils/validate'
export default {
  data() {
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99)) {
          callback(new Error('请输入0.01-499999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      id: '',
      visible: false,
      form:{
        name:'',
        costPrice : null,
        retailPrice:null,
      },
      storeRoleName: "",
      dataFormRules:{
        name:[{required: true, message: '请填写商品名称'}],
        costPrice:[{required: true, message: '请填写商品成本价'}, {validator: validatePrice, trigger: 'blur' }],
        retailPrice: [{required: true, message: '请填写商品销售价'}, {validator: validatePrice, trigger: 'blur' }],
      },
    }
  },
  async created(){
    const { storeId,companyId,storeRoleName = "",hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeId = storeId
    this.companyId = companyId
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
  },
  methods: {
    init(id,name,costPrice,retailPrice) {
      this.id = id
      this.name = name
      this.costPrice = costPrice
      this.retailPrice = retailPrice
      this.form.name = null
      this.form.costPrice = null
      this.form.retailPrice = null
      this.visible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.form.name = this.name
        this.form.costPrice = this.priceNum(this.costPrice)
        this.form.retailPrice = this.priceNum(this.retailPrice)
      })
    },
    async save() {
     this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const { data } = await updateStorePrice({
            companyId:this.companyId,
            productId: this.id,
            name: this.form.name,
            costPrice: this.priceNum(this.form.costPrice,'out'),
            retailPrice: this.priceNum(this.form.retailPrice,'out'),
            storeId:this.storeId
          })
          if(data.code == 0){
            this.$message.success('修改成功')
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .stockWarning{
    .el-input {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 69%;
    }
  }
</style>
