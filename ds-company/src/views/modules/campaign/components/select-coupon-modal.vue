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
      label="优惠券名称">
    </el-table-column>
    <el-table-column
      prop="type"
      align="center"
      min-width="120"
      :show-overflow-tooltip="true"
      label="优惠券类型">
        <template slot-scope="scope">
        <span>{{filterStatus(scope.row.type, couponType)}}</span>
        </template>
    </el-table-column>
    <el-table-column
        prop="typeRule"
        min-width="150"
        :show-overflow-tooltip="true"
        label="优惠价值">
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
        <span v-if="scope.row.expiryDateType=='DAY'">自发放之日起 {{scope.row.effectiveDay}}天</span>
        <span v-else>{{scope.row.effectiveBeginDate}}至{{scope.row.effectiveEndDate}}</span>
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
import { getCouponSelectOptions } from '@/service/campaign'
import {validatenull} from '@/utils/validate'
import { couponType } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  data () {
    return {
      couponType,
      filterStatus,
      visible: false,
      currentInfo: null,
      dataList: [],
      dataListLoading: false,
      selectedObj: {},
      changePage: false,
      couponids: null,
    }
  },

  methods: {
      
    async init (items) {
      this.visible = true
      this.changePage = true
      this.dataListLoading = true
      this.couponids = items.id
      this.selectedObj=items
      console.log(this.couponids)
      // 查询商品列表
      this.getGoodsList()
      this.dataListLoading = false
    },
    // 绑定选中的数据
    clickChange (item) {
      this.currentInfo = item.id
      this.selectedObj=item
    },
    handleClick(val){
      this.activeName = val
      this.getGoodsList(val)
    },
    // 获取商品列表
    async getGoodsList(type) {
      const data = await getCouponSelectOptions({
        keyword: ''
      })
      if(this.couponids){
        this.currentInfo = this.couponids
      }
      this.dataList = data
     
    },
    
    // 表单提交
    dataFormSubmit () {
      if(!validatenull(this.selectedObj)){
        this.$emit('refreshData', this.selectedObj)
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
