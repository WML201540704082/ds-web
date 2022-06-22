<template>
  <div class="mod-store customers">
      <!-- 查询条件   -->
      <el-form :model="filterForm" :inline="true" ref='filterForm' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="活动类型" prop='activityType'>
          <el-select v-model="filterForm.activityType" placeholder="请选择活动类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeType"
              :key="item.value"
              v-show="item.value!='PAIDGIFT'"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop='activity'>
          <el-input v-model="filterForm.activity" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>

        <div style="display:none;" class="button_check">
          <el-form-item label="顾客" prop='customer'>
            <el-input v-model="filterForm.customer" placeholder="顾客姓名/手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop='status'>
            <el-select v-model="filterForm.status" placeholder="请选择订单状态" clearable>
                <el-option  label="全部" value="" ></el-option>
                <el-option
                v-for="item in resultStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <gt-time-range
                start-time-prop="startTime"
                :start-time-value="filterForm.startTime"
                :end-time-value="filterForm.endTime"
                end-time-prop="endTime"
                @changeStartValue="value => filterForm.startTime = value"
                @changeEndValue="value => filterForm.endTime = value"
            ></gt-time-range>
          </el-form-item>
        </div>
      </el-form>
  </div>
</template>

<script>
import { resultStatus,activeType} from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus } from '@/utils'
export default {
  data () {
    return {
      resultStatus,
      activeType,
      filterStatus,
      filterForm:{
        activity: null,
        commissionStatus: '',
        customer:'',
        activityType: '',
        status:'',
        startTime:null,
        endTime:null
      },
    }
  },
  components: {
    gtTimeRange
  },
  created () {
  },
  methods: {
    resetForm(type){
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
      }
      var obj = {
        'type': type,
        'filterForm': this.filterForm
      }
      this.$emit('refreshSearch',obj)
    }
  }
}
</script>
<style lang="scss">
</style>

