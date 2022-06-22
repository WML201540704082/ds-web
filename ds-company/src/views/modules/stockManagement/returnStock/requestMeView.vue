<template>
  <el-dialog
    :title="type === 'view' ? '查看' : type === 'confirm' ? '确认收货' : '审核'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="page-approve-modal">
    <el-form ref="request-stock-form" class="form-show" label-width="110px">
      <el-form-item label="退货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="退货时间" v-if="details.status === 'TAKE_PENDING' || details.status === 'FINISH'">
        <span class="itemInput">{{details.returnTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="退货门店">
        <span class="itemInput">{{details.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}}/{{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
      </el-form-item>
      <!-- <el-form-item label="物流公司" v-if="details.status === 'TAKE_PENDING' || details.status === 'FINISH'">
        <span class="itemInput">{{details.logisticsCompany || '--'}}</span>
      </el-form-item>
      <el-form-item label="物流单号" v-if="details.status === 'TAKE_PENDING' || details.status === 'FINISH'">
        <span class="itemInput">{{details.logisticsNumber || '--'}}</span>
      </el-form-item> -->
    </el-form>
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
        width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
			<el-table-column
				prop="costPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="退货价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span>{{(newStore == 'true' ? priceNum(scope.row.wholesalePrice) : priceNum(scope.row.costPrice)).toFixed(2)}}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
          <span v-else> -- </span>
        </template>
			</el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="退货数量">
      </el-table-column>
    </el-table>
    <div class="sum_toptitle">
      <!-- <span class="sum_tip">合计数量：{{details.amount || '--'}}</span> -->
      <span v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')" class="sum_tip">合计退货价：{{priceNum(details.costPriceAmount) || '--'}}</span>
    </div>
    <span slot="footer" class="dialog-footer" v-if="type==='review'">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="review(true)">通过</el-button>
      <el-button type="primary" @click="review(false)">拒绝</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-if="type==='confirm'">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="confirmLoading" type="primary" @click="confirm">确认收货</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { filterStatus } from '@/utils'
import { stockStatus } from '@/utils/dict'
import { getStore } from '@/utils/storage'
import moment from 'moment'
import _ from 'lodash'
import NP from 'number-precision'
export default {
  data(){
    return{
      type:'',
      quantity:null,
      filterStatus,
      stockStatus,
      dataList: [],
      storeList:[],
      moment,
      dataListLoading: false,
      confirmLoading: false,
      visible: false,
      details:{},
    }
  },
  created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    async init(id,type){
      this.visible = true
      this.id = id
      this.type = type
      await this.getDataList(id)
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getStoreReturnStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = data.data.items.map(item => {
          return{
            ...item,
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//退货数量
          }
        })
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    // 去审核-通过or拒绝
    async review(flag){
      if (this.dataList && this.dataList.length>0) {
        const {data} = flag? await api.checkReturnStock(this.details.id)
        : await api.rejectReturnStock(this.details.id)
        if (data.code === 0) {
          this.$message.success(flag?'审核成功':'已拒绝')
          this.visible = false
          this.$emit('refreshDataList', this.getDataList)
        } else {
          this.$message.error(data.msg)
        }
      }
    },
    //查看确认收货
    async confirm(){
      if (this.dataList && this.dataList.length>0) {
        this.confirmLoading = true
        const {data} = await api.sureReturnStock(this.id)
        if (data.code === 0) {
          this.$message.success('已确认收货')
          this.visible = false
          this.$emit('refreshDataList', this.getDataList)
        } else {
          this.$message.error(data.msg)
        }
        this.confirmLoading = false
      }
    },
  }
}
</script>

<style lang="scss">
.page-approve-modal{
	.out-select{
		margin-left: -40px;
    .el-input--medium .el-input__inner {
      height: 33px;
      line-height: 33px;
      width: 155px;
    }
	}
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
}
</style>

