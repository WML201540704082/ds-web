<template>
  <el-dialog
    title="库存详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="50%"
    class="stockview">
    <div class="toptitle">
      <!-- 商品名称、条码、规格 -->
      <span class="tip">{{details.productName || '--'}}</span>
      <span class="tip">{{details.barcode || '--'}}</span>
      <span class="tip">{{details.spec || '--'}}</span>
    </div>
    <!-- <div class="toptitle">
      <span class="tip">企业库存：{{details.quantity || 0}}</span>
      <span class="tip">总库存：{{details.storeSumQuantity || 0}}</span>
    </div> -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      max-height="360"
      style="width: 100%; min-height: 300px;">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeName"
        min-width="120"
        :show-overflow-tooltip="true"
        label="门店名称">
      </el-table-column>
      <el-table-column
        prop="quantity"
        min-width="120"
        :show-overflow-tooltip="true"
        label="库存">
        <template slot-scope="scope">
          <span>
            {{details.productType == 'BULK' ? scope.row.quantity / 1000 : scope.row.quantity }}<span v-if="details.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="consignQuantity"
        min-width="120"
        :show-overflow-tooltip="true"
        label="寄存库存">
      </el-table-column>
      <el-table-column
        prop="inTransitQuantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="在途库存">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
export default {
  data(){
    return{
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null
    }
  },
  methods:{
    init(row){
      this.visible = true
      this.details = row
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.findStoreStock(this.details.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        // data.data.unshift({
        //   inTransitQuantity:this.details.inTransitQuantity,
        //   quantity:this.details.quantity,
        //   storeName:'企业总部'
        // })
        this.dataList = data.data
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
  }
}
</script>


<style scoped>
.toptitle {
  margin-bottom: 15px;
  color: #72716F;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
  width: 100%;
}
.tip{
  margin-right: 20px;
}
.stockview .el-dialog__body {
  padding-top: 10px!important;
}
.inputs1 input {
  width: 100%!important;
}
.el-table__row .inputs1 {
  padding-left: 0!important;
}
</style>
