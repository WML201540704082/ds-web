<template>
  <div class="mod-store outstock">
    <el-card>
      <el-form :model="outStockAdd" :inline="true" class="mode-form-line1" label-width="80px" ref="outStockAdd" :rules="stockRules" >
        <el-form-item label="出库类型" prop='outType'>
          <el-select v-model="outStockAdd.outType" placeholder="请选择出库类型" clearable>
            <el-option
              v-for="item in outType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货单位" class="receiveBottom" prop="targetStoreId" v-if="this.outStockAdd.outType === 'ALLOT'">
          <el-select
            v-model="outStockAdd.targetStoreId"
            placeholder="请选择" clearable
            filterable
            reserve-keyword>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select
            v-model="outStockAdd.operator"
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
          <el-input type="textarea" v-model="outStockAdd.remark" style="width: 290px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate(true)">保存</el-button>
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate(false)">保存并出库</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
      </div>
      <el-table
        :data="selectedList"
        border
        ref="editTable"
        :highlight-current-row='true'
        v-loading="dataListLoading"
        :stripe="true"
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
          prop="costPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本价"
          v-if="storeRoleName === '店长' && hasAuthorization">
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价">
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="当前库存">
          <template slot-scope="scope">
            <span>
              {{ scope.row.currentStock ? scope.row.currentStock : scope.row.oldStockQuantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          min-width="120"
          label="出库数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.quantity" maxlength="8"></el-input>
            <el-input class="inputs1" v-else v-model.number="scope.row.quantity" maxlength="8"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="subtotal"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本价小计"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.quantity,scope.row.costPrice) || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">合计出库数量：{{totalOutAmount}}</span>
        <span class="sum_tip" v-if="storeRoleName === '店长' && hasAuthorization">合计成本价：{{totalCostPrice}}</span>
        <span class="sum_tip">合计零售价：{{totalRetailPrice}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect" type="outStock_allot"/>
    </el-card>
  </div>
</template>
<script>
import { outType } from '@/utils/dict'
import { getStoreList } from '@/service/systore'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '../component/inventoryGoodsAdd'
import { commissionRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getUserInfoData } from '@/service/setinfo'
export default {
  name: 'stockManagement-outstock-outStockAdd',
  data(){
    const validateDiscount = (rule, value, callback) => {
      if (value) {
        if (!commissionRange(value, '', 'MAX')) {
          callback(new Error('请输入大于等于0的数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      NP,
      outType,
      storeList:[],
      storeRoleName: '',
      hasAuthorization: false,
      operatorList:[],
      selectedList: [],
      editTable:[],
      dataListLoading:false,
			outStockAdd:{
        operator:null,
      },
      bindAdd:'',
      stockRules:{
        outType:[{required: true, message: '出库类型必填',trigger: 'blur'}],
        targetStoreId:[{required: true, message: '收货单位必填',trigger: 'blur'}],
        operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
      }
    }
  },
  components: {
    gtGoodsAdd
  },
  computed: {
    //合计出库数量
    totalOutAmount(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.quantity)
        })
      }
      return total
    },
    //合计成本价
    totalCostPrice(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.quantity) {
            total = NP.plus(NP.times((item.costPrice || 0), (item.quantity || 0)), total)
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
    let id = this.$route.query.id
    if(id){
      this.idx = id
      this.getDetails(id)
    }else{
      // this.$nextTick(() => {
      //   this.$refs.goodsAddSelect.init('')
      // })
    }
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    const { storeRoleName = '', storeId = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.targetStoreId = storeId
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
    this.getStaffList()
    this.detail()
  },
  methods:{
    // 获取数据详情
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getOutgoingDetail({
        id:this.idx,
        withCurrentStock:true,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.selectedList = data.data.items.map(item => {
          return{
            ...item,
            costPrice: this.priceNum(item.costPrice) || 0,
            retailPrice: this.priceNum(item.retailPrice) || 0,
            currentStock: item.productType == 'BULK' ? item.currentStock / 1000 : item.currentStock,//当前库存
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//出库数量
          }
        })
        this.outStockAdd = {
          ...data.data,
          targetStoreId: data.data.outType === "ALLOT" ? data.data.targetStoreId : null,
        }
        // this.$refs.goodsAddSelect.init('', this.selectedList)
      } else {
        this.selectedList = []
        this.$message.warning(data.msg)
      }
    },
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        //过滤掉当前门店
        this.storeList = data.data.filter(store => this.targetStoreId !== store.id)
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
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
            oldStockQuantity: item.quantity || 0,
            costPrice: this.priceNum(item.costPrice) || 0,
            retailPrice: this.priceNum(item.retailPrice) || 0,
            quantity: 0
          })
        }
      }
      this.selectedList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
      // const tempList = list.map(item=> {
      //   return {
      //     ...item,
      //     oldStockQuantity: item.quantity || 0,
      //     quantity: null
      //   }
      // })
      // this.selectedList = tempList
    },
    async detail(){
      const { data } = await getUserInfoData()
      if(data&&data.code == 0){
        this.userName = data.data.userName
      }
    },
    // 获取操作人-员工列表
    async getStaffList() {
      this.dataListLoading = true
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
        status: 'ENABLE'
      })
      if (data.code === 0) {
        this.operatorList = data.data.records
        const phone = this.userName || {}
        const operator = this.operatorList.find(ele => ele.phone === phone)
        if (operator) {
          this.outStockAdd.operator = operator
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取商品
    async goodsSelect() {
      if (!this.outStockAdd.outType) {
        this.$message.warning('请先选择出库类型')
        return
      }
      this.dataListLoading = true
      const { data } = this.outStockAdd.outType === 'ALLOT' ? await api.getStockList({
          ownership:'COMPANY',
          key:this.bindAdd,
          size: this.pageSize,
          page: this.currentPage
        }) : await api.getStockList({
          key:this.bindAdd,
          size: this.pageSize,
          page: this.currentPage
        })
      if (data.code === 0) {
        if (data.data.total === 1) {
          debugger
          let oldList = []
          oldList = data.data.records.map(item => {
            return{
              ...item,
              oldStockQuantity: item.quantity || 0,
              costPrice: this.priceNum(item.costPrice) || 0,
              retailPrice: this.priceNum(item.retailPrice) || 0,
              quantity: 0,
              currentStock: item.productType == 'BULK' ? (item.quantity/1000) : item.quantity,
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
            this.$refs.goodsAddSelect.init('',this.selectedList,this.bindAdd,this.outStockAdd.outType)
          })
        }
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 删除
    deleteStock(index,row){
      this.selectedList.splice(index,1)
      // this.$refs.goodsAddSelect.deleteSign(row)
    },
		//校验出库保存信息
		checkOutInfo(){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '出库数量必填，数量大于0小于等于当前库存值,且散称类商品最多只能输入三位有效小数'
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
          if (Number(item.quantity) > Number(item.currentStock ? item .currentStock : item.oldStockQuantity) || Number(item.quantity) <= 0) {
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
    async handleUpdate(flag){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkOutInfo()) {
          this.$refs['outStockAdd'].validate(async (valid) => {
            if (valid) {
              const sname = this.storeList.find(ele => ele.id === this.outStockAdd.targetStoreId)
              let form ={
                ...this.outStockAdd,
                timeSku: new Date().getTime(),
                // targetStoreId:sname ? sname.id : null,
                // targetStoreName:sname ? sname.name : null,
                'id':this.idx,
                'items':this.selectedList.map(item => {
                  return{
                    ...item,
                    costPrice: this.priceNum(item.costPrice,'out') || 0,
                    retailPrice: this.priceNum(item.retailPrice,'out') || 0,
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//出库数量
                  }
                }),
                operatorId: this.outStockAdd.operator ? this.outStockAdd.operator.userId : null,
                operator: this.outStockAdd.operator ? this.outStockAdd.operator.name : null,
                operatorPhone: this.outStockAdd.operator ? this.outStockAdd.operator.phone : null,
                targetStoreId: this.outStockAdd.outType === "ALLOT" ? this.outStockAdd.targetStoreId : null,
                targetStoreName: this.outStockAdd.outType === "ALLOT" ? sname.name : null
              }
              const { data } = flag ? (!this.idx ? await api.newAddOutgoing(form) : await api.editOutgoing(form)) : await api.saveAndOutStock(form)
              if(data.code == 0){
                this.$router.push({name:'stockManagement-outstock-outgoingList'})
              } else if (data.code === -2) {
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
.mod-store.outstock{
  .mode-form-line1 .el-form-item {
    margin-top: 10px !important;
    margin-bottom: 5px !important;
  }
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
