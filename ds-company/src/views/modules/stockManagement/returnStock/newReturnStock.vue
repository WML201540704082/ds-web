<template>
  <div class="mod-store customers">
    <el-card>
      <gt-subtitle title="单据信息" style="display: block;"/>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules">
        <el-form-item label="供应商:" prop="supplier">
            <span class="itemInput">{{goodsAdd.supplier || '--'}}</span>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkman">
          <span class="itemInput">{{`${goodsAdd.linkman || '--'}/${goodsAdd.phone || '--'}`}}</span>
        </el-form-item>
        <el-form-item label="操作人:" prop="operator">
          <el-select
            v-model="goodsAdd.operator"
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
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="goodsAdd.remark" style="width: 300px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="table-container">
        <el-table
          :data="selectedList"
          border
          v-loading="dataListLoading"
          :stripe="true"
          show-summary
          class="all-count-table"
          :summary-method="summary"
          height = "300px"
          style="width: 100%;">
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
						label="退货数量">
						<template slot-scope="scope">
							<el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.quantity" maxlength="9"></el-input>
              <el-input class="inputs1" v-else v-model.number="scope.row.quantity" maxlength="9"></el-input>
						</template>
					</el-table-column>
					<el-table-column
						prop="buyQuantity"
						min-width="120"
						label="采购数量">
            <template slot-scope="scope">
              <span>
                {{scope.row.buyQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
              </span>
            </template>
					</el-table-column>
					<el-table-column
						prop="givenQuantity"
						min-width="120"
						label="赠送数量">
            <template slot-scope="scope">
              <span>
                {{scope.row.givenQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
              </span>
            </template>
					</el-table-column>
					<el-table-column
						prop="stockQuantity"
						min-width="100"
						label="库存">
            <template slot-scope="scope">
            <span>
              {{scope.row.stockQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
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
            min-width="100"
            :show-overflow-tooltip="true"
            label="规格">
          </el-table-column>
					<el-table-column
						prop="nowPurchasePrice"
						min-width="120"
						:show-overflow-tooltip="true"
						label="进货价"
            v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
            <template slot-scope="scope">
              <span>{{priceNum(scope.row.nowPurchasePrice)}}</span>
            </template>
					</el-table-column>
          <!-- <el-table-column
            prop="batchNo"
            min-width="120"
            label="商品批次">
          </el-table-column> -->
        </el-table>
      </div>
			<div class="gt-form-bottom-submit" style="margin-bottom: 20px;">
				<gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
				<gt-button size="large" :loading="$store.state.loading.global" @click.native="handleUpdate" txt="确认退货"/>
			</div>
    </el-card>
  </div>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { getStore } from '@/utils/storage'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import { commissionRange } from '@/utils/validate'
import * as api from '@/service/stock'
export default {
  name: 'stockManagement-returnStock-newReturnStock',
  data(){
    return{
      idx:null,
      dataListLoading: false,
      storeList:[],
      operatorList:[],
      selectedList: [],
      goodsAdd:{
        operator:null
      },
      stockRules:{
        operator:[{required: true, message:'操作人必填',trigger: 'blur'}],
      }
    }
  },
  components: {
    gtSubtitle
  },
  async created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取企业名称及是否为二代店
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    await this.getStaffList()
    let id = this.$route.query.returnId
    if(id){
      this.idx = id
      await this.getDetails(id)
    }
  },
  methods:{
    // 获取企业入库单详情
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getinStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        const operator = this.operatorList.find(ele => ele.phone === data.data.operatorPhone)
        this.goodsAdd = {
          ...data.data,
          operator
        }
        this.selectedList = data.data.items.map(item => {
          return{
            ...item,
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//退货数量
            stockQuantity:item.productType == 'BULK' ? item.stockQuantity/1000 : item.stockQuantity,//库存
            buyQuantity: item.productType == 'BULK' ? item.buyQuantity / 1000 : item.buyQuantity,//采购数量
            givenQuantity: item.productType == 'BULK' ? item.givenQuantity / 1000 : item.givenQuantity,//赠送数量
          }
        })
      } else {
        this.selectedList = []
        this.$message.error(data.msg)
      }
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const quantityList = data.map(ele => ele.quantity)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 9) {
        // if (index === 2 || index === 9) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr,flag) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                // if (index === 2) {
                //   return prev + curr
                // } else {
                  return NP.plus(prev, NP.times(curr, quantityList[flag]))
                // }
              } else {
                return prev
              }
            }, 0)
            // if (index === 2) {
            //   sums[index] = tempValue
            // } else {
              sums[index] = this.priceNum(tempValue)
            // }
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    // 获取操作人-员工列表
    async getStaffList() {
      this.dataListLoading = true
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
        type: 'COMPANY',
        status: 'ENABLE'
      })
      if (data.code === 0) {
        this.operatorList = data.data.records
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 删除
    deleteStock(index){
      this.selectedList.splice(index,1)
    },
		//校验退货保存信息
		checkReturnInfo(){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '退货数量必填，数量大于0小于等于库存值,且散称类商品最多只能输入三位有效小数'
      const flag = this.selectedList.some((item, index) => {
        if (reg.test(item.quantity)) {
          if((item.quantity).toString().indexOf('.') != -1){
            //不能输入两个小数点
            let len = 0
            let arr = (item.quantity).toString().split("")
            arr.forEach((item) => {
              if(item == '.'){
                len++
              }
            })
            if(len > 1){
              return true
            }
          }
          if (Number(item.quantity) > Math.abs(item.stockQuantity) || Number(item.quantity) <= 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
      if (flag) {
        this.$message.warning(msg)
      }
      return flag
    },
    //退货单保存
    save(){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkReturnInfo()) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              console.log(this.goodsAdd)
              const { data } = await api.newAddReturn({
                ...this.goodsAdd,
                timeSku: new Date().getTime(),
                companyInStockId: this.goodsAdd.id,
                companyInStockNo: this.goodsAdd.orderNo,
                items:this.selectedList.map(item => {
                  return{
                    ...item,
                    costPrice:item.nowPurchasePrice,
                    quantity:item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//退货数量
                    buyQuantity: item.productType == 'BULK' ? item.buyQuantity * 1000 : item.buyQuantity,
                    givenQuantity: item.productType == 'BULK' ? item.givenQuantity * 1000 : item.givenQuantity
                  }
                }),
                id:this.idx,
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
              })
              if(data.code == 0){
                this.$router.push({name:'stockManagement-returnStock-returnStockList'})
              }else if (data.code == -2) {
                this.$message.error('请勿重复提交！')
              }else{
                this.$message.error(data.msg)
              }
            }
          })
        }
      }else{
        this.$message.warning('请先选择商品')
      }
    },
    // 保存
    async handleUpdate(){
      this.$easyConfirm.show({
        title: '提示',
        content:`确认退货后,该入库单不可再次发起退货`,
        confirm: async () => {
          this.save()
          this.$easyConfirm.hide()
          this.$emit('refreshDataList')
          // this.inStockstatus = REFUNDED
        }
      })
    },
  }
}
</script>
<style lang="scss">
.mod-store.customers{
  .el-table{
    .inputs1.el-input{
      padding: 0 !important;
      .el-input__inner{
        width: 100% !important;
      }
    }
  }
}
</style>
