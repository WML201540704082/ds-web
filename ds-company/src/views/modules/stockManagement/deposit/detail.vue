<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    append-to-body>
    <div style="margin-bottom:15px;">
      <el-row>
        <el-col :span="8" class="tip">商品名称：{{details.productName || '--'}}</el-col>
        <el-col :span="8" class="tip">所属分类：{{details.categoryFirstName}}-{{details.category}}</el-col>
        <el-col :span="8" class="tip">商品类型: {{details.typeName || '--'}}</el-col>
      </el-row>
      <el-row  v-if="details.type === 'ENTITY'">
        <el-col :span="8" class="tip" style="line-height: 30px;">条形码：{{details.barcord || '--'}}</el-col>
        <el-col :span="8" class="tip" style="line-height: 30px;">规格：{{details.productSpec || '--'}}</el-col>
      </el-row>
    </div>


    <!-- table列表 -->
    <div class="mode-store-table">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        show-summary
        class="all-count-table"
        :summary-method="summary"
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
          prop="storeName"
          :show-overflow-tooltip="true"
          label="寄存门店">
        </el-table-column>
        <el-table-column
          prop="balanceQuantity"
          :show-overflow-tooltip="true"
          label="寄存剩余数量">
        </el-table-column>
        <el-table-column
          prop="stockQuantity"
          :show-overflow-tooltip="true"
          label="库存余量">
          <template slot-scope="scope">
            <span :class="{'red': scope.row.stockQuantity > 0, 'green': scope.row.stockQuantity < 0}">{{scope.row.stockQuantity || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { depositDetail } from '@/service/goods'
export default {
  data () {
    return {
      id: '',
      dataList:[],
      details: {},
      visible: false,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
    }
  },
  methods: {
    init(row){
      this.skuId = row.skuId
      this.visible = true
      this.details = {
        ...row,
        typeName: row.productType === 'ENTITY' ? '零售类商品' : '服务类商品'
      }
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await depositDetail({
        skuId:this.skuId
      })
      if (data.code === 0) {
        this.dataList = data.data
      } else {
        this.dataList = [],
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 2 || index === 3) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = tempValue
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
  }
}
</script>
<style>
.toptitle {
  margin: 15px 0;
  color: #72716F;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
  width: 100%;
}
.tip{
  font-size: 14px;
  font-weight: 600;
}
</style>
