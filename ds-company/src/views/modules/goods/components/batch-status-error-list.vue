<template>
<el-dialog
  title="批量修改商品状态"
  :close-on-click-modal="false"
  class="goods-batch-error-list"
  width="80%"
  :visible.sync="visible"
  append-to-body>
  <div class="tip">共选择<span class="theme-color">{{total}}</span>条商品数据， 批量禁用成功<span class="theme-color">{{total - products.length}}</span>个，剩余<span class="theme-color">{{products.length}}</span>条操作失败，说明如下：</div>
  <el-table
    :data="products"
    border
    :stripe="true"
    ref="goodsTableList"
    style="width: 100%;">
    <el-table-column
      prop="index"
      width="60"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="barcodes"
      min-width="120"
      :show-overflow-tooltip="true"
      label="商品条码">
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      min-width="150"
      :show-overflow-tooltip="true"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="reason"
      min-width="150"
      :show-overflow-tooltip="true"
      label="原因说明">
    </el-table-column>
  </el-table>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="visible = false">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { batchStatus } from '@/service/goods'
export default {
  name: 'goods-batch-status-dailog',
  data () {
    return {
      visible: false,
      total: 0,
      products: [], // 需要修改的产品
    }
  },

  methods: {
    async init (total, products) {
      this.visible = true
      this.total = total
      this.products = products
    }
  }
}
</script>
<style lang="scss">
.goods-batch-error-list{
  .tip{
    font-size: 14px;
    margin: 10px 0;
  }

}
</style>

