<template>
  <el-dialog
    :close-on-click-modal="false"
    title="库存预警设置"
    :visible.sync="visible"
    width="450px"
    append-to-body
    class="stockWarning">
    <div>
      <el-form ref="form" label-width="120px" :model="form">
        <el-form-item label="库存下限" prop="floor">
          <el-input v-model="form.floor"></el-input>
          <span v-if="productType == 'BULK'">kg</span>
        </el-form-item>
        <el-form-item label="库存上限" prop="ceiling">
          <el-input v-model="form.ceiling"></el-input>
          <span v-if="productType == 'BULK'">kg</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getStockUpdate } from '@/service/stock'
import { validatenull } from '@/utils/validate'
export default {
  data() {
    return {
      id: '',
      visible: false,
      form:{
        floor : null,
        ceiling:null,
      }
    }
  },
  methods: {
    init(id,floor,ceiling,productType) {
      this.id = id
      this.form.floor = floor
      this.form.ceiling = ceiling
      this.productType = productType
      this.visible = true
    },
    checkWarning(){
      if (Number(this.form.floor) > Number(this.form.ceiling)) {
        return true
      }else{
        return false
      }
    },
    async save() {
      if(!validatenull(this.form.floor)&&this.form.floor >=0 && 
        !validatenull(this.form.ceiling)&&this.form.ceiling >=0 && !this.checkWarning()){
        const res = await getStockUpdate({
          id: this.id,
          floor : this.productType == 'BULK' ? this.form.floor * 1000 : this.form.floor,
          ceiling : this.productType == 'BULK' ? this.form.ceiling * 1000 : this.form.ceiling,
        })
        this.visible = false
        this.$emit('refreshDataList')
      }else{
        this.$message.warning('库存预警不能为空且不得小于0,下限<上限')
      }
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
