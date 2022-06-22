<template>
  <el-dialog
    title="退货单详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="page-returnStock-modal">
    <el-form ref="return-form" class="form-show" label-width="110px">
      <el-form-item label="原入库单号" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
        <span class="itemInput">{{details.inStockOrderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="出库单位" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
        <span class="itemInput">{{details.outName || '--'}}</span>
      </el-form-item>
      <el-form-item label="退货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="退货时间">
        <span class="itemInput">{{details.returnTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}} / {{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark|| '--'}}</span>
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
      class="all-count-table"
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
				min-width="100"
				:show-overflow-tooltip="true"
				label="成本价"
        v-if="storeRoleName === '店长' && hasAuthorization">
        <template slot-scope="scope">
          <span>{{ (storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') ? scope.row.wholesalePrice : scope.row.costPrice }}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价">
			</el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="退货数量">
      </el-table-column>
    </el-table>
    <div class="sum_toptitle">
      <!-- <span class="sum_tip">合计退货数量：{{details.amount || '--'}}</span> -->
      <span class="sum_tip" v-if="storeRoleName === '店长' && hasAuthorization && storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">合计成本价：{{priceNum(details.costPriceAmount) || '--'}}</span>
    </div>
    <span slot="footer" class="dialog-footer" >
      <el-button v-if="type === 'confirm'" @click="visible = false">取消</el-button>
      <el-button :loading="confirmLoading" v-if="type === 'confirm'" type="primary" @click="dataFormSubmit()">确认退货出库</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { logisticsComapny } from '@/utils/dict'
import moment from 'moment'
import NP from 'number-precision'
export default {
  name: 'stockManagement-returnStock-returnStockView',
  data(){
    return{
      type:'',
      hasAuthorization:false,
      dataList: [],
      storeList:[],
      moment,
      logisticsComapny,
      dataListLoading: false,
      confirmLoading:false,
      visible: false,
      details:{},
      form: {
        logisticsCompany: null,
        logisticsNumber: null
      },
    }
  },
  created(){
    //限制成本价显示
    const { storeRoleName = '', hasAuthorization ,storeType} = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
  },
  methods:{
    init(row,type){
      this.visible = true
      this.details = row
      this.id = row.id
      this.type = type
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReturnStockDetail({
        id:this.details.id,
        withCurrentStock:false
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.items.map(item => {
          return{
            ...item,
            productCostPrice: this.priceNum(item.productCostPrice),
            wholesalePrice: this.priceNum(item.wholesalePrice),
            costPrice: this.priceNum(item.costPrice),
            retailPrice: this.priceNum(item.retailPrice),
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//退货数量
          }
        })
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    async dataFormSubmit() {
      this.confirmLoading = true
      const { data } = await api.goReturnStock({
        id: this.id,
        ...this.form,
        items:this.dataList.map(item=>{
          return{
            ...item,
            costPrice: (this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') ? this.priceNum(item.wholesalePrice,'out') : this.priceNum(item.costPrice,'out')
          }
        })
      })
      if(data.code === 0){
        this.visible = false
        this.$emit('refreshDataList')
      }else{
        this.$message.error(data.msg)
      }
      this.confirmLoading = false
    }
  }
}
</script>

<style lang="scss">
.page-returnStock-modal{
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
  .logistic{
    margin-top: 20px;
    margin-bottom: -25px
  }
}
</style>

