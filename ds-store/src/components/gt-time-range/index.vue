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
        default-time="00:00:00"
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
    startTimeProp: {
      type: String
    },
    startTimePlaceholder: {
      type: String,
      default: '选择开始时间'
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
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
      if (this.endTimeTempValue) {
        return moment(currentTime).isAfter(this.endTimeTempValue, 'day')
      }
      return false
    },
    // 结束日期的禁用日期
    disableEndTime(currentTime) {
      if (this.startTimeTempValue) {
        return moment(currentTime).isBefore(this.startTimeTempValue, 'day')
      }
      return false
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
