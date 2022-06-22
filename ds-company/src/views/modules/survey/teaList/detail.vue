<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="teaview">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      v-table-height
      style="width: 100%;">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="feedInfo"
        min-width="120"
        :show-overflow-tooltip="true"
        label="加料信息">
      </el-table-column>
      <el-table-column
        prop="itemName"
        min-width="120"
        :show-overflow-tooltip="true"
        label="项目名">
      </el-table-column>
      <el-table-column
        prop="spec"
        min-width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="salePrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="销售价">
      </el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="itemAmount"
        min-width="100"
        :show-overflow-tooltip="true"
        label="小计">
      </el-table-column>
      <el-table-column
        prop="remark"
        min-width="100"
        :show-overflow-tooltip="true"
        label="口味">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getDrinkOrderDetails } from '@/service/survey'
export default {
  data(){
    return{
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null,
    }
  },
  methods:{
    async init(id){
      this.visible = true
      this.id = id
      await this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getDrinkOrderDetails(this.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = this.details.items.map(item => {
          return {
            ...item,
            feedInfo: JSON.parse(item.feedInfo).length == 1 ? JSON.parse(item.feedInfo).map(ele=>{
              return ele.feed
            }) : JSON.parse(item.feedInfo).map(ele=>{
              return ele.feed + ','
            }),
            salePrice: this.priceNum(item.salePrice),//销售价
            itemAmount: this.priceNum(item.itemAmount)//小计
          }
        })
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
  }
}
</script>