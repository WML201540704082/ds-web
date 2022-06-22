<template>
  <el-dialog
    :close-on-click-modal="false"
    title="出库类型选择"
    :visible.sync="visible"
    width="450px"
    append-to-body>
    <div>
      <el-form ref="form" label-width="120px" :model="form">
        <el-form-item label="出库类型" prop='outType'>
          <el-select v-model="form.outType" placeholder="请选择出库类型" clearable>
            <el-option
              v-for="item in outType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { outType } from '@/utils/dict'
export default {
  data() {
    return {
      outType,
      visible: false,
      form:{},
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    async save() {
      if(this.form.outType){
        this.visible = false
        this.$emit('refreshDataList')
      }else{
        this.$message.warning('请选择出库类型')
      }
    }
  }
}
</script>
