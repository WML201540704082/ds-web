<template>
  <section class="gt-time-range">
    <el-form-item :prop="startTimeProp">
      <el-date-picker
        :type="type"
        :placeholder="startTimePlaceholder"
        :editable="false"
        :value-format="valueFormat"
        v-model="startTimeTempValue"
        @change="onChangeStartTime"
        :clearable="false"
        default-time="00:00:00"
        :disabled="disabled"
        style="width: 100%;"
        :picker-options="{
          disabledDate: disableStartTime
        }"
      ></el-date-picker>
    </el-form-item>
    <span class="line">至</span>
    <el-form-item :prop="endTimeProp">
      <el-date-picker
        :type="type"
        :placeholder="endTimePlaceholder"
        :value-format="valueFormat"
        :disabled="disabled"
        :clearable="false"
        :editable="false"
        v-model="endTimeTempValue"
        @change="onChangeEndTime"
        default-time="23:59:59"
        style="width: 100%;"
        :picker-options="{
          disabledDate: disableEndTime
        }"
      ></el-date-picker>
    </el-form-item>
  </section>
</template>
<script>
import moment from 'moment'
export default {
  name: 'gt-time-range',
  data() {
    return {
      startTimeTempValue: this.startTimeValue,
      endTimeTempValue: this.endTimeValue
    }
  },
  props: {
    limitBeforeToday: {
      type: String,
      default: null
    },
    limitAfterToday: {
      type: String,
      default: null
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    startTimeProp: {
      type: String
    },
    startTimePlaceholder: {
      type: String,
      default: '选择开始时间'
    },
    startTimeValue: {
      require:true
    },
    endTimeProp: {
      type: String
    },
    endTimePlaceholder: {
      type: String,
      default: '选择结束时间'
    },
    endTimeValue: {
      require: true
    },
    type: {
      type: String,
      default: 'datetime'
    }
  },
  methods: {
    onChangeStartTime(value) {
      this.$emit('changeStartValue', value)
    },
    onChangeEndTime(value) {
      if (this.type === 'date' && this.valueFormat === 'timestamp') {
        this.$emit('changeEndValue', value + 3600 * 24 * 1000 - 1000)
      } else {
        this.$emit('changeEndValue', value)
      }
    },
    // 开始日期的禁用日期
    disableStartTime(currentTime) {
      if (this.limitBeforeToday && moment(this.limitBeforeToday || '').isAfter(currentTime)) {
        return true
      } else if (this.endTimeTempValue && moment(currentTime).isAfter(this.endTimeTempValue, 'day')) {
        return true
      } else {
        return false
      }
    },
    // 结束日期的禁用日期
    disableEndTime(currentTime) {
      if (this.limitAfterToday && moment(this.limitAfterToday || '').isBefore(currentTime)) {
        return true
      } else if (this.startTimeTempValue && moment(currentTime).isBefore(this.startTimeTempValue, 'day')) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    startTimeValue(n, o) {
      this.startTimeTempValue = n
    },
    endTimeValue(n, o) {
      this.endTimeTempValue = n
    }
  }
}
</script>
<style lang="scss">
.gt-time-range{
  .el-form-item {
    margin-right: 10px;
  }
  .line{
    margin-right: 10px;
  }
}
</style>
