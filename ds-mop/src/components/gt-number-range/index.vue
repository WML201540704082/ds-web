<template>
  <el-form :model="rangeData" ref="numberRangeForm" :rules="dynamicRules" class="gt-number-range">
    <el-form-item prop="minAmount" ref="start-ref" class="min-input">
      <el-input v-model="rangeData.minAmount" :maxlength="8" placeholder="起始搜索值" @change="getStart"/>
    </el-form-item>
    <span class="tip" v-if="type == 'customer'">人</span>
    <span class="tip" v-else-if="type == 'per'">%</span>
    <span class="tip" v-else></span>
    <span class="line">-</span>
    <el-form-item prop="maxAmount" ref="end-ref" class="min-input">
      <el-input v-model="rangeData.maxAmount" :maxlength="8" placeholder="终止搜索值" @change="getEnd"/>
    </el-form-item>
    <span class="tip" v-if="type == 'customer'">人</span>
    <span class="tip" v-else-if="type == 'per'">%</span>
    <span class="tip" v-else></span>
  </el-form>
</template>
<script>
import { priceRange } from '@/utils/validate'
export default {
  name: 'gt-number-range',
  data() {
    const validateStart = (rule, value, callback) => {
      // this.$refs['numberRangeForm'].clearValidate(['maxAmount'])
      var reg = /^([1-9][0-9]*)$/
      if (value || value ==0) {
        if (this.type == 'customer') {
          if(reg.test(value) || (value == 0)) {
            if (this.rangeData.maxAmount && value > this.rangeData.maxAmount) {
              callback(new Error('最小值不能大于最大值'))
            }else if (value > 10000) {
              callback(new Error('请输入小于10000的正整数'))
            } else {
              callback()
            }
          }else{
            callback(new Error('请输入大于等于零的正整数'))
          }
        } else {
          if(reg.test(value) || (value == 0)) {
            if (this.rangeData.maxAmount && value > this.rangeData.maxAmount) {
              callback(new Error('最小值不能大于最大值'))
            }else if (value > 100) {
              callback(new Error('请输入小于100的正整数'))
            } else {
              callback()
            }
          }else{
            callback(new Error('请输入大于等于零的正整数'))
          }
        }
      } else {
        callback()
      }
    }

    const validateEnd = (rule, value, callback) => {
      // this.$refs['numberRangeForm'].clearValidate(['minAmount'])
      var reg = /^([1-9][0-9]*)$/
      if (value || value ==0) {
        if (this.type == 'customer') {
          if(reg.test(value) || (value == 0)) {
            if (this.rangeData.minAmount && value < this.rangeData.minAmount) {
              callback(new Error('最大值不能小于最小值'))
            }else if (value > 10000) {
              callback(new Error('请输入小于10000的正整数'))
            } else {
              callback()
            }
          }else{
            callback(new Error('请输入大于等于零的正整数'))
          } 
        } else {
          if(reg.test(value) || (value == 0)) {
            if (this.rangeData.minAmount && value < this.rangeData.minAmount) {
              callback(new Error('最大值不能小于最小值'))
            }else if (value > 100) {
              callback(new Error('请输入小于100的正整数'))
            } else {
              callback()
            }
          }else{
            callback(new Error('请输入大于等于零的正整数'))
          } 
        }
      }else{
        callback()
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
  props:{
    type: {
      type: String,
      default: null
    },
  },
  methods: {
    refresh() {
      this.$refs['numberRangeForm'].resetFields()
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
      this.$refs['numberRangeForm'].validate((valid) => {
        if (valid) {
          cb()
        }
      })
    }
  },
}
</script>
<style lang="scss">
.gt-number-range{
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
