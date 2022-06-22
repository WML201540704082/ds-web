<template>
  <div class="mod-store returnstock">
    <el-card>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules">
        <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="goodsAdd.supplier"
            placeholder="请选择" clearable
            filterable
            value-key="id"
            :remote-method="getSupplierlist"
            @change="getContact">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <span class="linkmanInput">{{`${goodsAdd.bossName || '--'}/${goodsAdd.bossPhone || '--'}`}}</span>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
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
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate">保存</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
      </div>
      <el-table
        :data="selectedList"
        border
        ref="editTable"
        v-loading="dataListLoading"
        :stripe="true"
        class="all-count-table"
        v-table-height
        :highlight-current-row='true'
        style="width: 100%;margin-top:5px;">
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
            <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index,scope.row)">删除</el-button>
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
          prop="retailPrice"
          min-width="100"
          label="零售价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        </el-table-column>
        <el-table-column
          prop="oldStockQuantity"
          min-width="100"
          label="当前库存">
          <template slot-scope="scope">
            <span>
              {{ scope.row.oldStockQuantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nowPurchasePrice"
          min-width="120"
          label="退货价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model="scope.row.nowPurchasePrice" maxlength="9"></el-input>
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
          prop="subtotal"
          min-width="100"
          :show-overflow-tooltip="true"
          label="退货价小计"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.quantity,scope.row.nowPurchasePrice) || 0 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="batchNo"
          min-width="120"
          label="商品批次">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model.number="scope.row.batchNo" maxlength="25"></el-input>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="newStore == 'false'">合计退货数量：{{totalReturnAmount}}</span>
        <span class="sum_tip" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">合计退货价：{{totalNowPurchasePrice}}</span>
        <span class="sum_tip" v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">合计零售价：{{totalRetailPrice}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect"/>
    </el-card>
  </div>
</template>
<script>
import { getShoppingSupplierList } from '@/service/stock'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '../component/inventoryGoodsAdd'
import { commissionRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
export default {
  name:'stockManagement-returnStock-newReturnForm',
  data(){
    return{
      NP,
      supplierList:[],
      operatorList:[],
      editTable:[],
      dataListLoading: false,
      supplierLoading: false,
      selectedList: [],
			goodsAdd:{
        operator:null
      },
      bindAdd:'',
      stockRules:{
        operator:[{required: true, message:'操作人必填',trigger: 'blur'}],
      }
    }
  },
  components: {
    gtGoodsAdd
  },
  computed: {
    //合计退货数量
    totalReturnAmount(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.quantity)
        })
      }
      return total
    },
    //合计进货价
    totalNowPurchasePrice(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.quantity) {
            total = NP.plus(NP.times((item.nowPurchasePrice || 0), (item.quantity || 0)), total)
          }
        })
      }
      return total
    },
    //合计零售价
    totalRetailPrice() {
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.quantity) {
            total = NP.plus(NP.times((item.retailPrice || 0), (item.quantity || 0)), total)
          }
        })
      }
      return total
    },
  },
  async created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    //获取companyId和门店茶饮类型
    const { companyId = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    this.newStore = newStore
    // 获取供应商下拉列表
    this.getSupplierlist()

    //操作人
    this.getStaffList()
  },
  methods:{
    // 获取供应商下拉列表
    async getSupplierlist(key){
      this.supplierLoading = true
      const { data } = await getShoppingSupplierList()
      if(data && data.code ==0){
        this.supplierList = data.data
      }else{
        this.supplierList =[]
      }
      this.supplierLoading = false
    },

    getContact(val) {
      if (!val) {
        this.goodsAdd.bossName = '--',
        this.goodsAdd.bossPhone = '--'
      }
      const supplier = this.supplierList.find(ele => ele.id === val.id)
      if (supplier) {
        this.goodsAdd.bossName = supplier.bossName
        this.goodsAdd.bossPhone = supplier.bossPhone
      }
    },

    // 监听list变化
    getSelect(list) {
      /**
       * 数据转换
       */
      let originalList = []
      for(let i = 0; i < list.length; i++){
        const item = list[i]
        const originalItem = this.selectedList.find(ele => ele.skuId === item.skuId)
        if (originalItem) {
          originalList.push(originalItem)
        }else{
          originalList.push({
            ...item,
            oldStockQuantity: item.productType == 'BULK' ? ((item.quantity || 0) / 1000) : (item.quantity || 0),
            retailPrice: this.priceNum(item.retailPrice),
            nowPurchasePrice: item.nowPurchasePrice ? this.priceNum(item.nowPurchasePrice) : this.priceNum(item.costPrice),
            quantity: 0
          })
        }
      }
      this.selectedList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
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
        const phone = getStore({name: 'company-userName'})
        const operator = this.operatorList.find(ele => ele.phone === phone)
        if (operator) {
          this.goodsAdd.operator = operator
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取商品
    async goodsSelect() {
      this.dataListLoading = true
      const { data } = await api.getStockList({
          key:this.bindAdd,
          size: this.pageSize,
          page: this.currentPage
        })
      if (data.code === 0) {
        if (data.data.total === 1) {
          let oldList = []
          oldList = data.data.records.map(item => {
            return{
            ...item,
              oldStockQuantity: item.quantity || 0,
              retailPrice: this.priceNum(item.retailPrice),
              nowPurchasePrice: item.nowPurchasePrice ? this.priceNum(item.nowPurchasePrice) : this.priceNum(item.costPrice),
              quantity: 0,
              oldStockQuantity: item.productType == 'BULK' ? (item.quantity/1000) : item.quantity,
            }
          })
          const myItem = oldList[0]
          const index = _.findIndex(this.selectedList, (item) => {
            return item.productId == myItem.productId && item.skuId == myItem.skuId
          })
          if (index === -1) {
            this.selectedList.push(myItem)
            this.$nextTick(() => {
              this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
            })
            this.bindAdd = ''
          } else {
            this.$message.warning('已添加过该商品！')
            this.$refs.editTable.setCurrentRow(this.selectedList[index],true)
            this.$refs.editTable.bodyWrapper.scrollTop = 49 * index;
            this.bindAdd = ''
          }
        }else if(data.data.total === 0){
          this.$message.warning("没有找到对应数据")
        }else{
          this.$nextTick(() => {
            this.$refs.goodsAddSelect.init(this.goodsAdd.storeId,this.selectedList,this.bindAdd)
          })
        }
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //获取商品
    // goodsSelect(){
    //   this.$nextTick(() => {
    //     this.$refs.goodsAddSelect.init(this.goodsAdd.storeId,this.selectedList,this.bindAdd)
    //   })
    // },
    // 删除
    deleteStock(index,row){
      this.selectedList.splice(index,1)
      // this.$refs.goodsAddSelect.deleteSign(row)
    },
		//校验出库保存信息--退货数量
		checkReturnInfo1(){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '退货数量必填，大于0小于等于当前库存值，且散称类商品最多只能输入三位有效小数'
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
          if (Number(item.quantity) <= 0 || Number(item.quantity) > Math.abs(item.oldStockQuantity)) {
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
		//校验出库保存信息--退货价
		checkReturnInfo2(){
      let msg = '退货价必填，且为0.00-99999.99的价格数字'
      const flag = this.selectedList.some((item, index) => {
        if (item.nowPurchasePrice) {
          if (item.nowPurchasePrice < 0 || item.nowPurchasePrice >100000) {
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
    // 保存
    async handleUpdate(){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkReturnInfo1() && !this.checkReturnInfo2()) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              const { data } = await api.newAddReturn({
                ...this.goodsAdd,
                timeSku: new Date().getTime(),
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                linkman:this.goodsAdd.bossName,
                phone:this.goodsAdd.bossPhone,
                supplierId: this.goodsAdd.supplier ? this.goodsAdd.supplier.id :null,
                supplier: this.goodsAdd.supplier ? this.goodsAdd.supplier.companyName :null,
                items:this.selectedList.map(item => {
                  return {
                    ...item,
                    nowPurchasePrice: this.priceNum(item.nowPurchasePrice, 'out'),
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity//退货数量
                  }
                })
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
  }
}
</script>
<style lang="scss">
.mod-store.returnstock{
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
