<template>
  <section class="page-integral-rule-list">
    <!-- table列表 -->
    <gt-border-button type="create" v-show="type === 'edit'" class="gt-table-create" txt="新增积分规则" @click.native="() => addOrUpdateRule()"/>
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
      <el-table-column
        width="100"
        v-if="type === 'edit'"
        label="操作">
        <template slot-scope="scope">
          <el-button class="nopadding" type="text" size="small" @click="addOrUpdateRule(scope.row)">编辑</el-button>
          <span >|</span>
          <el-button class="nopadding" type="text" size="small" @click="deleteRule(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        width="300"
        label="积分规则">
      </el-table-column>
    </el-table>
    <integral-rule-list-modal ref="addOrUpdate" @refreshRuleList="init"/>
  </section>
</template>
<script>
import integralRuleListModal from './integral-rule-list-modal'
import { integralPlanSelect, deleteIntegralPlan } from '@/service/integral'
export default {
  name: 'page-integral-rule-list',
  data () {
    return {
      dataList: [],
      dataListLoading: false
    }
  },

  props: {
    type: String
  },

  components: {
    integralRuleListModal
  },

  created() {
    // 获取积分规则
    this.init()
  },
  methods: {
    // get integral rule
    async init() {
      this.dataListLoading = true
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        this.dataList = data.data
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    async addOrUpdateRule(item) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(item)
      })
    },

    deleteRule(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该积分规则？',
        confirm: async () => {
          const { data } = await deleteIntegralPlan(id)
          if (data.code === 0) {
            this.$message.success('删除成功！')
            this.init()
          } else {
            this.$message.error(data.msg)
          }
          this.$easyConfirm.hide()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.page-integral-rule-list{

}
</style>

