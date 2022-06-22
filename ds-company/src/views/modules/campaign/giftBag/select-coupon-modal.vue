<template>
<el-dialog
  title="选择优惠券"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    height="320"
    ref="couponTableList"
    @selection-change="handleSelectionChange"
    @row-dblclick="doubleClick"
    style="width: 100%;margin-top:-10px">
    <el-table-column
      type="selection"
      width="60">
    </el-table-column>
    <el-table-column
      prop="index"
      min-width="60"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      min-width="250"
      :show-overflow-tooltip="true"
      label="优惠券名称">
    </el-table-column>
    <el-table-column
      prop="type"
      align="center"
      min-width="120"
      :show-overflow-tooltip="true"
      label="优惠券类型">
      <template slot-scope="scope">
        <span>{{filterStatus(scope.row.type,couponType)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="rule"
      min-width="150"
      :show-overflow-tooltip="true"
      label="优惠价值">
      <template slot-scope="scope">
        <span>{{getRule(scope.row.type,scope.row.rule)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="storeRange"
      min-width="180"
      :show-overflow-tooltip="true"
      label="适用门店">
    </el-table-column>
    <el-table-column
      prop="effectiveBeginDate"
      min-width="360"
      :show-overflow-tooltip="true"
      label="有效日期">
      <template slot-scope="scope">
        <span v-if="scope.row.effectiveType=='DAY'">自发放之日起 {{scope.row.effectiveDay}}天</span>
        <span v-else>{{scope.row.effectiveBeginDate || '--'}}至{{scope.row.effectiveEndDate || '--'}}</span>
      </template>
    </el-table-column>
  </el-table>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { newPeopleCoupon } from '@/service/campaign'
import {validatenull} from '@/utils/validate'
import { couponType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import moment from 'moment'
import _ from 'lodash'
export default {
  data () {
    return {
      couponType,
      filterStatus,
      visible: false,
      currentInfo: null,
      dataList: [],
      dataListLoading: false,
      selectedList: [],
      couponids: null,
      changePage: true,
    }
  },

  methods: {
    async init (selectedList,newPeople,storeIds,storeRangeType) {
      this.storeIds = storeIds
      this.newPeople = newPeople
      this.visible = true
      this.dataListLoading = true
      this.selectedList = selectedList
      this.storeRangeType = storeRangeType
      this.changePage = true
      // 查询优惠券列表
      await this.getCouponList()
      this.dataListLoading = false
    },
    getRule(type, typeRule) {
      if (type !== null && type !== '' && type !== undefined && typeRule) {
        let ruleName = ''
        switch (type) {
        case 0:
          ruleName = typeRule + '折'
          break
        case 2:
          ruleName = '--'
          break
        case 1:
          const arr = typeRule.split(',')
          if (arr && arr.length === 2) {
            ruleName = `满${arr[0]}减${arr[1]}`
          } else if (arr.length === 1) {
            ruleName = `减${arr[0]}`
          } else {
            ruleName = '--'
          }
          break
        default:
          ruleName = '--'
        }
        return ruleName
      } else {
        return '--'
      }
    },
    // 获取优惠券列表
    async getCouponList() {
      const data = await newPeopleCoupon({
        storeIds: this.storeRangeType == 1 ? 'all' : this.storeIds,
        effectiveType:this.newPeople.effectiveType,
        beginDate:this.newPeople.effectiveType === 'FIXED' ? moment(moment(this.newPeople.beginDate).format('YYYY-MM-DD')+' 00:00:00').valueOf() : null,
        endDate:this.newPeople.effectiveType === 'FIXED' ? moment(moment(this.newPeople.endDate).format('YYYY-MM-DD')+' 23:59:59').valueOf() : null
      })
      this.dataList = data
      this.$nextTick(() => {
        if (this.selectedList && this.selectedList.length > 0) {
          this.selectedList.forEach(ele => {
            const currentRow = this.dataList.find(item => (ele.couponId == item.couponId))
            if (currentRow) {
              this.$refs.couponTableList.toggleRowSelection(currentRow)
            }
          })
        }
        this.changePage = false
      })
    },
    // 获取优惠券选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => (ele.couponId == item.couponId))
        })
        const select = newList.concat(pushList)
        this.selectedList = select
      }
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.couponTableList.toggleRowSelection(row)
    },
    // 表单提交
    dataFormSubmit () {
      if (this.selectedList.length > 10) {
        this.$message.warning("最多添加10张优惠券！")
        return
      }
      if(this.selectedList&&this.selectedList.length>0){
        this.$emit('refreshData', this.selectedList)
        this.visible = false
      }else{
        this.visible = true
        this.$message.warning('请先选择优惠券')
      }
    },
  }
}
</script>
<style lang="scss">
  .select-goods-dailog{
    .gt-pagination{
      text-align: right;
    }
  }
</style>
