<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
    <el-form ref="justify-form" class="form-show" label-width="110px">
      <el-form-item label="调整单号">
        <span class="itemInput">{{justify.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="批次号">
        <span class="itemInput">{{justify.batchNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="调整人">
        <span class="itemInput">{{`${justify.adjustEmployeeName || '--'}/${justify.adjustUser || '--'}`}}</span>
      </el-form-item>
      <el-form-item label="调整时间">
        <span class="itemInput">{{justify.adjustTime || '--'}}</span>
      </el-form-item>
    </el-form>
    <!-- table列表 -->
    <div class="mode-store-table">
      <el-table
        :data="justify.items"
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
          prop="barcode"
          min-width="160"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="category1Name"
          min-width="120"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          min-width="120"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column>
        <el-table-column
          prop="brandName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="库存数量">
        </el-table-column>
        <el-table-column
          prop="checkQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="盘点数量">
        </el-table-column>
        <el-table-column
          prop="adjustQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="盈亏数量">
          <template slot-scope="scope">
            <span :class="{'red': scope.row.adjustQuantity > 0, 'green': scope.row.adjustQuantity < 0}">{{scope.row.adjustQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profitlossMoney"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盈亏金额(售价)">
          <template slot-scope="scope">
            <span v-if="scope.row.profitlossMoney !== null">{{Number(priceNum(scope.row.profitlossMoney)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkMoney"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盘点金额(售价)">
          <template slot-scope="scope">
            <span v-if="scope.row.checkMoney !== null">{{Number(priceNum(scope.row.checkMoney)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getJustifyDetail } from '@/service/stock'
export default {
  data () {
    return {
      id: '',
      visible: false,
      justify: {
        items: []
      },
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
    }
  },
  methods: {
    init(id){
      this.visible = true
      this.id = id
      if (this.isAuth('store:adjustStock:detail')) {
        this.getDataList()
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getJustifyDetail(this.id)
      if (data.code === 0) {
        this.justify = data.data
        this.justify.items = this.justify.items.map(item => {
          return{
            ...item,
            stockQuantity: item.productType == 'BULK' ? item.stockQuantity / 1000 : item.stockQuantity,//库存数量
            checkQuantity: item.productType == 'BULK' ? item.checkQuantity / 1000 : item.checkQuantity,//盘点数量
            adjustQuantity: item.productType == 'BULK' ? item.adjustQuantity / 1000 : item.adjustQuantity,//盈亏数量
            profitlossMoney: item.productType == 'BULK' ? item.profitlossMoney / 1000 : item.profitlossMoney,//盈亏金额(售价)
            checkMoney: item.productType == 'BULK' ? item.checkMoney / 1000 : item.checkMoney,//盘点金额(售价)
          }
        })
      } else {
        this.justify = {
          items: []
        },
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    }
  }
}
</script>
