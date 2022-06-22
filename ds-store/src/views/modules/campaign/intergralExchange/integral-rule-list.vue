<template>
  <section class="page-integral-rule-list">
    <!-- table列表 -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading">
      <el-table-column
        prop="index"
        width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button class="nopadding" type="text" size="small" @click="addOrUpdateRule(scope.row)">编辑</el-button>
          <span >|</span>
          <el-button class="nopadding" type="text" size="small" @click="deleteRule(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="ruleStr"
        width="300"
        label="积分规则">
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import { integralPlanSelect } from '@/service/integral'
export default {
  name: 'page-integral-rule-list',
  data () {
    return {
      dataList: [],
      dataListLoading: false
    }
  },

  created() {
    // 获取积分规则
    this.init()
  },
  methods: {
    // get integral rule
    async init() {
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        const filterData = data.data.map(item => {
          let ruleStr = ''
          if (item.rule === 'AMOUNT') {
            ruleStr = '固定值' + item.val + '分'
          } else if (item.rule === 'SCALE') {
            ruleStr = '商品实收金额 * ' + item.val + '%'
          }
          return {
            ...item,
            ruleStr
          }
        })
        this.dataList = filterData
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.page-integral-rule-list{

}
</style>

