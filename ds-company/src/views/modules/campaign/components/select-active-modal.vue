<template>
<el-dialog
  title="选择活动"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-radio-group v-model="activeName" @change="handleClick" style="margin-bottom: 10px;">
    <el-radio-button label="">全部</el-radio-button>
    <el-radio-button label="SPECIAL">特卖活动</el-radio-button>
    <el-radio-button label="TURN">大转盘抽奖</el-radio-button>
    <el-radio-button label="GROUP">社区拼团</el-radio-button>
  </el-radio-group>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    max-height="360"
    ref="goodsTableList"
    @current-change="clickChange"
    style="width: 100%;min-height: 300px;">
    <el-table-column
      label="选择"
      width="120px">
      <template slot-scope="scope">
        <el-radio  v-model="currentInfo" :label="scope.row.id"><i></i></el-radio>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      min-width="250"
      :show-overflow-tooltip="true"
      label="活动名称">
      <template slot-scope="scope">
        <span>{{scope.row.title}}-{{filterStatus(scope.row.type,activeType)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      align="center"
      min-width="120"
      :show-overflow-tooltip="true"
      label="状态">
      <template slot-scope="scope">
        <span>{{filterStatus(scope.row.status,activeStatus)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="creatTime"
      min-width="150"
      :show-overflow-tooltip="true"
      label="活动日期">
      <template slot-scope="scope">
        <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
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
import {validatenull} from '@/utils/validate'
import { activeStatus,activeType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import * as api from '@/service/activity'
export default {
  data () {
    return {
      activeName: '',
      activeStatus,
      activeType,
      filterStatus,
      visible: false,
      currentInfo: null,
      dataList: [],
      dataListLoading: false,
      selectedObj: {},
      changePage: false,
      activityids: null,
    }
  },
  methods: {
    async init (items) {
      this.visible = true
      this.changePage = true
      this.dataListLoading = true
      this.activityids = items.id
      this.selectedObj=items
      // 查询商品列表
      if(this.isAuth('company:product:list')){
        this.getGoodsList()
      }
      this.dataListLoading = false
    },
    // 绑定选中的数据
    clickChange (item) {
      if (item) {
        this.currentInfo = item.id
        this.selectedObj=item
      }
    },
    handleClick(val){
      this.activeName = val
      this.getGoodsList(val)
    },
    // 获取商品列表
    async getGoodsList(type) {
      const { data } = await api.getactivityList({
        type: type,
        status:'PROCESSING',
      })
      if (data.code === 0) {
        if(this.activityids){
          this.currentInfo = this.activityids
        }
        if (validatenull(type)) {
          const tempArr = data.data.filter(o=>{
            return o.type != 'PAIDGIFT'
          })
          this.dataList = tempArr
        } else {
          this.dataList = data.data
        }
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },
    // 表单提交
    dataFormSubmit () {
      if(!validatenull(this.selectedObj)){
        this.$emit('refreshData', this.selectedObj)
        this.visible = false
        this.currentInfo = null
      }else{
        // this.visible = true
        this.$message.warning('请先选择活动')
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
