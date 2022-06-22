<template>
<el-dialog
  title="批发团购支付"
  :close-on-click-modal="false"
  class="group_sales_pay"
  :visible.sync="visible"
  width="450px"
  append-to-body>
  <el-form :model="payForm" ref="payForm" label-width="100px" :rules="dataRule">
    <el-form-item label="总金额" prop='amtTol'>
      <span>￥{{payForm.amtTol}}</span>
    </el-form-item>
    <el-form-item label="支付方式" prop='payType'>
      <el-select v-model="payForm.payType" placeholder="请选择支付状态" clearable>
        <el-option
          v-for="item in payType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button :loading="$store.state.loading.global" type="primary" @click="payFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import * as api from '@/service/order'
import { payType } from '@/utils/dict'
export default {
  name: 'goods-brand-setting-modal',
  data () {
    return {
      visible: false,
      payType,
      payForm: {
        payType:'MONEY',
      },
      dataRule: {
        payType: [{ required: true, message: '请选择输入方式', trigger: 'blur' }]
      }
    }
  },

  methods: {
    init (id,amtTol) {
      this.id = id
      this.payForm.amtTol = amtTol
      this.visible = true
    },
    // 表单提交
    payFormSubmit () {
      this.$refs['payForm'].validate(async (valid) => {
        if (valid) {
          const { data } = await api.groupBuyUpdate({
            id:this.id,
            ...this.payForm,
          })
          if (data.code === 0) {
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
  }
}
</script>

