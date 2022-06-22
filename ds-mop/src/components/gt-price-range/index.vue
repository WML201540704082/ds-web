<template>
  <el-form :model="rangeData" ref="priceRangeForm" :rules="dynamicRules" class="gt-price-range">
    <el-form-item prop="minAmount" ref="start-ref" class="min-input">
      <el-input v-model="rangeData.minAmount" :maxlength="15" placeholder="起始价格" @change="getStart"/>
    </el-form-item>
    <span class="tip">元</span>
    <span class="line">-</span>
    <el-form-item prop="maxAmount" ref="end-ref" class="min-input">
      <el-input v-model="rangeData.maxAmount" :maxlength="15" placeholder="终止价格" @change="getEnd"/>
    </el-form-item>
    <span class="tip">元</span>
  </el-form>
</template>
<script>
import { priceRange, twoDecimal } from '@/utils/validate'
export default {
  name: 'gt-price-range',
  data() {
    const validateStart = (rule, value, callback) => {
      this.$refs['priceRangeForm'].clearValidate(['maxAmount'])
      if (twoDecimal(value)) {
        if (this.rangeData.maxAmount) {
          if (!priceRange(value, this.rangeData.maxAmount, 0)) {
            callback(new Error('价格有误！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        if (value) {
          callback(new Error('请输入两位小数'))
        } else {
          callback()
        }
      }
    }

    const validateEnd = (rule, value, callback) => {
      this.$refs['priceRangeForm'].clearValidate(['minAmount'])
      if (twoDecimal(value)) {
        if (this.rangeData.minAmount) {
          if (!priceRange(value, 99999.99, this.rangeData.minAmount)) {
            if (value > 99999.99) {
              callback(new Error('最大值99999.99！'))
            } else {
              callback(new Error('价格有误! '))
            }
          } else {
            callback()
          }
        } else if (value > 99999.99) {
          callback(new Error('最大值99999.99！'))
        } else {
          callback()
        }
      } else {
        if (value) {
          callback(new Error('请输入两位小数'))
        } else {
          callback()
        }
      }
    }
    return {
      dynamicRules: {
        minAmount: [{validator: validateStart, trigger: 'blur'}],
        maxAmount: [{validator: validateEnd, trigger: 'blur'}],
      },
      rangeData: {
        minAmount: null,
        maxAmount: null
      }
    }
  },
  methods: {
    refresh() {
      this.$refs['priceRangeForm'].resetFields()
      this.$emit('startValueEvent', null)
      this.$emit('endValueEvent', null)
    },
    getStart(value) {
      this.$emit('startValueEvent', value)
    },
    getEnd(value) {
      this.$emit('endValueEvent', value)
    },
    validate(cb) {
      this.$refs['priceRangeForm'].validate((valid) => {
        if (valid) {
          cb()
        }
      })
    }
  },
}
</script>
<style lang="scss">
.gt-price-range{
  .el-form-item {
    margin-right: 2px;
  }
  .min-input{
    .el-input--medium .el-input__inner {
      width: 120px;
    }
  }
  .line{
    margin: 0 5px;
  }
  .tip{
    font-size: 12px;
  }
}
</style>
