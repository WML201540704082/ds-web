<template>
  <el-dialog
    title="商品明细"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    class="stockview">
    <div class="package-name">商品包名称： {{packageName}}</div>
    <el-table
			:data="dataList"
			border
			v-loading="dataListLoading"
			:stripe="true"
			max-height="300"
			style="width: 100%;min-height: 300px;">
			<el-table-column
				prop="index"
				width="60"
				label="序号">
				<template slot-scope="scope">
					<span>{{scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="productName"
				min-width="250"
				:show-overflow-tooltip="true"
				label="商品名称">
			</el-table-column>
			<el-table-column
				prop="spec"
				width="140"
				:show-overflow-tooltip="true"
				label="商品规格">
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				width="240"
				:show-overflow-tooltip="true"
				label="零售价">
				<template slot-scope="scope">
					<span>{{priceNum(scope.row.retailPrice || 0)}}</span>
				</template>
			</el-table-column>
			<el-table-column
				prop="amount"
				width="150"
				label="数量">
			</el-table-column>
		</el-table>
		<div class="toptitle">商品总价：{{getTotal()}}元</div>
		<div class="toptitle">商品包价格：{{packPrice}}元</div>
  </el-dialog>
</template>
<script>
import { packageDetail } from '@/service/mycustomer'
import NP from 'number-precision'
export default {
  data(){
    return{
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      packageName: null,
      packPrice: 0,
      id: null
    }
  },
  methods:{
    init (packageItem) {
      const { productPackageId,  productPackage } = packageItem
      // this.getDataList(productPackageId)
      this.visible = true
      const { packName, packPrice, items = [] } = productPackage || {}
      this.dataList = items
      this.packageName = packName
      this.packPrice = NP.divide(packPrice, 100)
    },
    getTotal() {
      let total = 0
      if (this.dataList && this.dataList.length > 0) {
        this.dataList.forEach(item => {
          if (item.retailPrice) {
            total = NP.plus( NP.times(Number(item.retailPrice), (item.amount || 0)), total)
          }
        })
      }
      return total / 100
    },
    // 获取数据列表
    async getDataList(productPackageId) {
      this.dataListLoading = true
      const { data } = await packageDetail(productPackageId)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.items
        this.packageName = data.data.packName
        this.packPrice = NP.divide(data.data.packPrice, 100)
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
  }
}
</script>
<style scoped>
.toptitle {
	margin: 15px 0;
	color: #72716F;
	font-size: 14px;
	font-weight: 700;
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
.package-name{
  font-size: 16px;
  padding: 10px 0;
}
</style>

