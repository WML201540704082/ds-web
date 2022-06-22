<template>
  <el-dialog
    title="请货单审核"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
		width="60%"
    class="stockview">
    <div class="toptitle">
			<span>订货时间：{{details.createTime}}</span>
			<!-- <span>社区拼团活动名称：{{details.groupBuyName}}</span>
			<span>活动时间：{{moment(details.groupBuyBeginTime).format('YYYY-MM-DD HH:mm:ss')}} - {{moment(details.groupBuyEndTime).format('YYYY-MM-DD HH:mm:ss')}}</span> -->
      <span style="margin-left: 10px;">{{filterStatus(details.status, stockStatus)}}</span>
    </div>
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
      <!-- <el-table-column
        prop="productCode"
          width="220"
        :show-overflow-tooltip="true"
        label="商品代码">
      </el-table-column> -->
      <el-table-column
        prop="productName"
        min-width="120"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="barcode"
        min-width="120"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="spec"
        min-width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
			<el-table-column
				prop="costPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="成本价">
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价">
			</el-table-column>
			<el-table-column
				prop="firstCategory"
				min-width="100"
				:show-overflow-tooltip="true"
				label="一级分类">
			</el-table-column>
			<el-table-column
				prop="category"
				min-width="100"
				:show-overflow-tooltip="true"
				label="二级分类">
			</el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="订货数量">
      </el-table-column>
      <el-table-column
        prop="outQuantity"
        min-width="100"
        label="出货数量">
				<template slot-scope="scope">
					<el-input class="inputs1"  v-model.number="scope.row.outQuantity"></el-input>
				</template>
      </el-table-column>
    </el-table>
    <div class="confirm">
      <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="approval(id,true)">通过</el-button>
      <el-button type="primary" @click="approval(id,false)">拒绝</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { filterStatus } from '@/utils'
import { stockStatus } from '@/utils/dict'
import moment from 'moment'
export default {
  data(){
    return{
			id:'',
      filterStatus,
      stockStatus,
      dataList: [],
      moment,
      dataListLoading: false,
      visible: false,
      details:{},
    }
  },
  methods:{
    init(id){
      this.visible = true
      this.getDataList(id)
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = data.data.items
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }

    },
    //取消
    goBack(){
      history.go(-1)
    },
    // 审批
    approval(id,flag){
      this.$easyConfirm.show({
        title: '提示',
        content: flag?'确定审核通过该订货申请?':'确定要拒绝该订货申请',
        confirm: async () => {
          const {data} = flag? await api.checkReqStock(id): await api.rejectReqStock(id)
          console.log(data)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success(flag?'审核成功':'拒绝成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
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
.stockview .el-dialog__body {
  padding-top: 10px!important;
}
.inputs1 input {
  width: 100%!important;
}
.el-table__row .inputs1 {
  padding-left: 0!important;
}
.confirm{
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>

