<template>
  <el-dialog
    title="查看明细"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
    <el-form ref="deposit-form" class="form-show" label-width="110px">
      <el-form-item label="寄存商品">
        <span class="itemInput">{{deposit.productName || '--'}}</span>
      </el-form-item>
      <el-form-item label="条形码">
        <span class="itemInput">{{deposit.barcode || '--'}}</span>
      </el-form-item>
      <el-form-item label="规格">
        <span class="itemInput">{{deposit.spec || '--'}}</span>
      </el-form-item>
      <el-form-item label="商品类型">
        <span class="itemInput">{{ deposit.productType === 'ENTITY' ? '零售类商品' : '服务类商品'}}</span>
      </el-form-item>
      <el-form-item label="库存余量">
        <span class="itemInput">{{deposit.stockQuantity || '--'}}</span>
      </el-form-item>
      <el-form-item label="寄存剩余数量">
        <span class="itemInput">{{deposit.balanceQuantity || '--'}}</span>
      </el-form-item>
    </el-form>
    <!-- table列表 -->
    <div class="mode-store-table">
      <el-table
        :data="deposit.items"
        border
        v-loading="dataListLoading"
        :stripe="true"
        class="all-count-table"
        max-height="360"
        style="width: 100%; min-height: 300px;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span>{{scope.row.customerName || '--'}} / {{scope.row.customerPhone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceQuantity"
          min-width="120"
          :show-overflow-tooltip="true"
          label="剩余数量">
        </el-table-column>
        <el-table-column
          prop="consignQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="寄存数量">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="寄存时间">
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getDepositDetail } from '@/service/stock'
import moment from 'moment'
import NP from 'number-precision'
export default {
  data () {
    return {
      deposit: {
        items: []
      },
      visible: false,
      dataListLoading: false,
      moment,
    }
  },

  methods: {
    init(item){
      this.deposit = {
        ...this.deposit,
        ...item
      }
      this.getDetail()
      this.visible = true
    },

    // 获取数据列表
    async getDetail() {
      this.dataListLoading = true
      const { data } = await getDepositDetail({
        skuId:this.deposit.skuId,
        page: 0,
        size: 10000
      })
      if (data.code === 0) {
        this.deposit.items = data.data.records
      } else {
        this.deposit = {
          items: []
        },
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
  }
}
</script>
<style scoped>

</style>


