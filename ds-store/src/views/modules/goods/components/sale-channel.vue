<template>
  <el-dialog
    :close-on-click-modal="false"
    title="批量设置"
    :visible.sync="visible"
    width="30%"
    append-to-body>
    <el-form ref="sale-channel-form" label-width="110px" :rules="dataFormRules" :model="form">
      <el-form-item label="销售渠道" prop="sale">
        <el-checkbox-group v-model="form.sale">
          <el-checkbox
            v-for="item in saleChannel"
            :key="item.value"
            :label="item.value">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { changeSaleChannel } from '@/service/goods'
import { saleChannel } from '@/utils/dict'
export default {
  data() {
    return {
      id: '',
      visible: false,
      goods: [],
      saleChannel,
      form: {
        sale: []
      },
      dataFormRules: {
        sale: [{required: true, message: '请选择销售渠道', trigger: 'blur'}],
      }
    }
  },
  methods: {
    init(goods) {
      this.visible = true
      this.goods = goods
    },
    dataFormSubmit() {
      this.$refs['sale-channel-form'].validate(async (valid) => {
        if (valid) {
          const { data } = await changeSaleChannel({
            productIds: this.goods,
            saleChannel: this.form.sale.length === 2 ? 0 : this.form.sale.join(',')
          })
          if(data.code === 0){
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
