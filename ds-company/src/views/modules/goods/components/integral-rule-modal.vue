<template>
  <el-dialog
    :close-on-click-modal="false"
    title="批量设置"
    :visible.sync="visible"
    width="30%"
    append-to-body>
    <el-form ref="integral-rule-form" label-width="110px" :rules="dataFormRules" :model="form">
      <el-form-item label="积分规则" prop="planId">
        <el-select v-model="form.planId" placeholder="请选择积分规则" clearable>
          <el-option label="无" value=""></el-option>
          <el-option
            v-for="item in rules"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit" :loading="$store.state.loading.global">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setGoodesIntegral } from '@/service/goods'
import { integralPlanSelect } from '@/service/integral'
export default {
  name: 'goods-integral-rule-modal',
  data() {
    return {
      id: '',
      visible: false,
      goods: [],
      rules: [],
      form: {
        planId: ''
      },
      dataFormRules: {
        // planId: [{required: true, message: '请选择积分规则', trigger: 'blur'}],
      }
    }
  },
  methods: {
    init(goods) {
      this.visible = true
      this.goods = goods
      this.form = {
        planId: ''
      }
      this.getIntegralRule()
    },
    // 获取积分规则
    async getIntegralRule() {
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        this.rules = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    dataFormSubmit() {
      this.$refs['integral-rule-form'].validate(async (valid) => {
        if (valid) {
          const { data } = await setGoodesIntegral({
            productIds: this.goods,
            planId: this.form.planId
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
