<template>
  <el-dialog
    title="退货"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="returnStock">
    <el-form :model="details" ref="returnStock" class="form-show" label-width="110px">
      <el-form-item label="供货商">
        <span class="itemInput">{{details.supplier || '--'}}</span>
      </el-form-item>
      <el-form-item label="联系人">
        <span class="itemInput">{{details.linkman || '--'}}/{{details.phone || '--'}}</span>
      </el-form-item>
			<el-form-item label="操作人:" prop="operator">
				<el-select
					v-model="details.operator"
					placeholder="请选择" clearable
					filterable
          value-key="userId"
					reserve-keyword>
					<el-option
						v-for="item in operatorList"
						:key="item.userId"
						:label="item.name"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
				<el-form-item label="备注" prop="statusRemark">
			<el-input type="textarea" v-model="details.statusRemark" style="width: 300px;" :maxlength="200" autosize></el-input>
		</el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height = "300px"
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
				prop="operate"
				min-width="60"
				label="操作">
				<template slot-scope="scope">
					<el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index)">删除</el-button>
				</template>
			</el-table-column>
      <el-table-column
        prop="quantity"
        min-width="120"
        :show-overflow-tooltip="true"
        label="退货数量">
				<template slot-scope="scope">
					<el-input class="inputs1"  v-model.number="scope.row.quantity" maxlength="9"></el-input>
				</template>
      </el-table-column>
      <el-table-column
        prop="buyQuantity"
        min-width="120"
        :show-overflow-tooltip="true"
        label="采购数量">
      </el-table-column>
      <el-table-column
        prop="givenQuantity"
        min-width="120"
        :show-overflow-tooltip="true"
        label="赠送数量">
      </el-table-column>
			<el-table-column
				prop="inventory"
				min-width="100"
        :show-overflow-tooltip="true"
				label="库存">
			</el-table-column>
			<el-table-column
				prop="brandName"
				min-width="100"
				:show-overflow-tooltip="true"
				label="商品品牌">
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
        prop="nowPurchasePrice"
        min-width="100"
        label="进货价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.nowPurchasePrice)}}</span>
        </template>
      </el-table-column>
				<el-table-column
					prop="batchNo"
					min-width="120"
					label="商品批次">
				</el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" >
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="sureInStock()">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { getStaffList } from '@/service/staffManagement'
import { getStore } from '@/utils/storage'
export default {
  data(){
    return{
      operatorList:[],
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null
    }
  },
  async created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取是否为二代店
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    async init(row){
      //获取操作人员工列表
      await this.getStaffList()
      this.visible = true
      this.row = row
      await this.getDataList()
    },
    // 获取操作人-员工列表
    async getStaffList() {
      this.dataListLoading = true
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
        type: 'COMPANY'
      })
      if (data.code === 0) {
        this.operatorList = data.data.records
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getinStockDetail(this.row.id)
      this.dataListLoading = false
      const operator = this.operatorList.find(ele => ele.phone === phone)
      if (data && data.code === 0) {
        this.details = {
          ...data.data,
          operator: operator
        }
        this.dataList = this.details.items
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
    //取消
    cancel(){
      this.visible = false
    },
    // 保存
    async sureInStock(){
      this.$refs['returnStock'].validate(async (valid) => {
        if (valid) {
          const { data } = await api.newAddReturn({
            ...this.details,
            operatorId: this.details.operator ? this.details.operator.userId : null,
            operator: this.details.operator ? this.details.operator.name : null,
            operatorPhone: this.details.operator ? this.details.operator.phone : null,
          })
          if(data.code == 0){
            this.$router.push({name:'stockManagement-outgoingList'})
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 删除
    deleteStock(index){
      this.dataList.splice(index,1)
    },
  }
}
</script>

<style lang="scss">
.returnStock{
	.returnStock .el-dialog__body {
		padding-top: 10px!important;
	}
	.inputs1.el-input--medium{
		.el-input__inner {
			height: 33px;
			line-height: 33px;
			width: 80px;
		}
	}
	.el-table__row .inputs1 {
		padding-left: 0!important;
	}
	.confirm{
		float: right;
		margin-right: 20px;
	}
}
</style>
