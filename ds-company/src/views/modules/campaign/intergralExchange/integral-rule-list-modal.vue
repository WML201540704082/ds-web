<template>
  <el-dialog
    title="积分规则"
    :close-on-click-modal="false"
    width="600px"
    class="intergral-rule-list-modal"
    :visible.sync="visible"
    append-to-body>
    <el-form ref="intergral-rule-modal-form" :rules="dataFormRules" :model="details">
      <el-form-item prop="rule">
        <el-radio-group class="block-radio" @change="changeIntegral" v-model="details.rule">
          <el-radio label="AMOUNT">
            <span class="block-radio-label">固定积分值</span>
            <el-form-item class="form-item-inline" prop="amountValue">
              <el-input v-model="details.amountValue" class="inputs1"/>
              分
            </el-form-item>
          </el-radio>
          <el-radio label="SCALE" style="margin-top: 30px;">
            <span class="block-radio-label">实收金额百分比</span>
            <el-form-item class="form-item-inline" prop="scaleValue">
              <el-input v-model="details.scaleValue" class="inputs1"/>
              %
            </el-form-item>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0; text-align:center; width: 100%;" class="theme-color">（固定积分和订单实收金额无关，仅和商品有关）</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit" :loading="$store.state.loading.global">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addIntegralPlan, updateIntegralPlan } from '@/service/integral'
import { priceRange } from '@/utils/validate'
export default {
  data () {
    const validatePrice = (rule, value, callback) => {
      const reg = /^\d+$/
      if (this.details.rule === 'AMOUNT') {
        if (value || value == 0) {
          if (!reg.test(value)) {
            callback(new Error('请输入0-9999的正整数！'))
          } else if (value < 0 || value > 9999){
            callback(new Error('请输入0-9999的正整数！'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入固定积分值！'))
        }
      } else {
        callback()
      }
    }

    const validatePercentage = (rule, value, callback) => {
      const reg = /^\d+$/
      if (this.details.rule === 'SCALE') {
        if (value) {
          if (!priceRange(value, 100, 0)) {
            callback(new Error('请输入0-100数字，最多保留小数点后两位'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入实收金额百分比！'))
        }
      } else {
        callback()
      }
    }

    return {
      visible: false,
      details: {
        id: null,
        rule: 'AMOUNT',
        amountValue: null,
        scaleValue: null
      },
      dataFormRules: {
        amountValue:[{validator: validatePrice, trigger: 'blur' }],
        scaleValue:[{validator: validatePercentage, trigger: 'blur' }],
      }
    }
  },
  methods: {
    async init (data) {
      this.visible = true
      if (data) {
        this.details = {
          id: data.id,
          rule: data.rule,
          amountValue: data.rule === 'AMOUNT' ? data.val : null,
          scaleValue: data.rule === 'SCALE' ? this.priceNum(data.val) : null
        }
      } else {
        this.details = {
          id: null,
          rule: 'AMOUNT',
          amountValue: null,
          scaleValue: null
        }
      }
    },

    // 改变积分
    changeIntegral() {
      this.$refs['intergral-rule-modal-form'].clearValidate()
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['intergral-rule-modal-form'].validate(async (valid) => {
        if (valid) {
          const val = this.details.rule === 'AMOUNT' ? this.details.amountValue : this.details.scaleValue
          let ruleStr = ''
          if (this.details.rule === 'AMOUNT') {
            ruleStr = '固定值' + val + '分'
          } else if (this.details.rule === 'SCALE') {
            ruleStr = '商品实收金额 * ' + val + '%'
          }
          const query = {
            id: this.details.id,
            rule: this.details.rule,
            name: ruleStr,
            val: this.details.rule === 'AMOUNT' ? this.details.amountValue : this.priceNum(this.details.scaleValue, 'out')
          }
          const { data } = this.details.id ? await updateIntegralPlan(query) : await addIntegralPlan(query)
          if (data.code === 0) {
            this.$emit('refreshRuleList')
            this.visible = false
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
.intergral-rule-list-modal{
  .form-item-inline{
    display: inline-block;
    margin-bottom: 0;
    .el-form-item__content{
      line-height: 20px;
    }
    .inputs1{
      display: inline-block;
      padding: 0 !important;
      width: 100px;
      .el-input__inner{
        width: 100px;
        margin-left: 0 !important;
      }
    }
  }
  .block-radio{
    width: 100%;
    .block-radio-label{
      display: inline-block;
      text-align: left;
      width: 120px;
    }
    .el-input__inner, .el-radio__label{
      font-size: 14px;
      width: 200px;
    }
    .el-radio{
      display: block;
      text-align: center;
      margin-bottom: 15px;
      margin-left: 0;
    }
  }
}
</style>

