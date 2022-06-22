<template>
  <div class="mod-store newGroup">
    <el-card>
      <el-form :model="newGroupSales" :inline="true" class="mode-form-line1" label-width="80px" ref="newGroupSales" :rules="groupSalesRules" >
        <el-form-item label="客户" class="receiveBottom" prop="custName">
          <el-input v-model="newGroupSales.custName" placeholder="请输入收货单位" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select
            v-model="newGroupSales.operator"
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
          <el-input type="textarea" v-model="newGroupSales.remark" style="width: 300px;" :maxlength="200" autosize></el-input>
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
        v-loading="dataListLoading"
        :stripe="true"
        ref="editTable"
        :highlight-current-row='true'
        class="all-count-table"
        v-table-height
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
            <el-button class="nopadding" type="text" size="small" @click="deleteGrouSales(scope.$index,scope.row)">删除</el-button>
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
          prop="productPrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="单价">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model="scope.row.productPrice" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="productNum"
          min-width="120"
          label="数量">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model.number="scope.row.productNum" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="productAmt"
          min-width="100"
          :show-overflow-tooltip="true"
          label="金额">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.productPrice,scope.row.productNum) || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip">合计数量：{{totalAmount}}</span>
        <span class="sum_tip">合计金额：{{totalPrice}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect"/>
    </el-card>
  </div>
</template>
<script>
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '@/views/modules/stockManagement/component/inventoryGoodsAdd'
import { commissionRange,priceRange  } from '@/utils/validate'
import * as api from '@/service/order'
import { getStockList } from '@/service/stock'
import _ from 'lodash'
import { getStore } from '@/utils/storage'
export default {
  name: 'order-groupSales-newGroupSalesOrder',
  data(){
    return{
      NP,
      operatorList:[],
      selectedList: [],
      editTable:[],
      dataListLoading:false,
			newGroupSales:{
        operator:null
      },
      bindAdd:'',
      groupSalesRules:{
        custName:[{required: true, message: '客户必填',trigger: 'blur'}],
        operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
      }
    }
  },
  components: {
    gtGoodsAdd
  },
  computed: {
    //合计数量
    totalAmount(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.productNum)
        })
      }
      return total
    },
    //合计金额
    totalPrice(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.productNum) {
            total = NP.plus(NP.times((item.productPrice || 0), (item.productNum || 0)), total)
          }
        })
      }
      return total
    },
  },
  async created(){
    let id = this.$route.query.id
    //操作人
    await this.getStaffList()
    //编辑获取详情
    if(id){
      this.idx = id
      await this.getDetails(id)
    }
  },
  methods:{
    // 获取数据列表
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getGroupBuyDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.selectedList = data.data.groupBuyOrderItemList.map(item => {
          return {
            ...item,
            productPrice: this.priceNum(item.productPrice),
            productAmt: this.priceNum(item.productAmt),
          }
        })
        this.newGroupSales = {
          ...data.data,
          operator:{
            userId:data.data.operatorId,
            name:data.data.operator
          }
        }
      } else {
        this.selectedList = []
        this.$message.warning(data.msg)
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
            productPrice: 0,
            productNum: 0
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
        type: 'COMPANY'
      })
      if (data.code === 0) {
        this.operatorList = data.data.records
        const phone = getStore({name: 'company-userName'})
        const operator = this.operatorList.find(ele => ele.phone === phone)
        if (operator) {
          this.newGroupSales.operator = operator
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取商品列表
    async goodsSelect() {
      this.dataListLoading = true
      // 查询适用门店下商品
      const { data } = await getStockList({
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
              productPrice: 0,
              productNum: 0
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
            this.$refs.goodsAddSelect.init('',this.selectedList,this.bindAdd)
          })
        }
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 删除
    deleteGrouSales(index,row){
      this.selectedList.splice(index,1)
    },
		//校验单价
		checkUnitPrice(){
      let reg = /^[0-9]+$/
      let msg = '单价必填，且在0.00~499999.99之间，最多保留小数点后两位'
      const flag = this.selectedList.some((item, index) => {
        if (!priceRange(item.productPrice,499999.99, 0)) {
          return true
        } else {
          return false
        }
      })
      if (flag) {
        this.$message.warning(msg)
      }
      return flag
    },
		//校验数量
		checkQuantity(){
      let reg = /^[0-9]+$/
      let msg = '数量必填，且只能输入正整数，数量小于999999'
      const flag = this.selectedList.some((item, index) => {
        if (reg.test(item.productNum)) {
          if (Number(item.productNum) > 999999 || Number(item.productNum) < 1) {
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
		//校验总价
		checkProductAmt(){
      let reg = /^[0-9]+$/
      let msg = '合计金额不能超过两千万'
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.productNum) {
            total = NP.plus(NP.times((item.productPrice || 0), (item.productNum || 0)), total)
          }
        })
      }
      const flag = total > 20000000
      if (flag) {
        this.$message.warning(msg)
      }
      return flag
		},
    // 保存
    async handleUpdate(){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkQuantity() && !this.checkUnitPrice() && !this.checkProductAmt()) {
          this.$refs['newGroupSales'].validate(async (valid) => {
            if (valid) {
              let form ={
                ...this.newGroupSales,
                'groupBuyOrderItemList':this.selectedList.map((item,index) => {
                  return{
                    ...item,
                    snum: index + 1,
                    productPrice: this.priceNum(item.productPrice,'out') || 0,
                    productAmt: this.priceNum(NP.times(item.productPrice,item.productNum),'out') || 0,
                  }
                }),
                'id': this.idx,
                operatorId: this.newGroupSales.operator ? this.newGroupSales.operator.userId : null,
                operator: this.newGroupSales.operator ? this.newGroupSales.operator.name : null,
                operatorPhone: this.newGroupSales.operator ? this.newGroupSales.operator.phone : null,
                productNumTol: this.totalAmount,
                amtTol:this.priceNum(this.totalPrice,'out') || 0,
              }
              const { data } = await api.addAndupdateGroupBuy(form)
              if(data.code == 0){
                this.$router.push({name:'order-groupSales-groupSalesList'})
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
.mod-store.newGroup{
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

