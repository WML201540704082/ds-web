<template>
  <div class="mod-store instock">
    <el-card>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules">
        <el-form-item label="入库商品归属" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'" label-width="110px" prop="ownership">
          <el-select v-model="goodsAdd.ownership" @change="changeOwnership" placeholder="请选择入库商品归属" clearable>
            <el-option
              v-for="item in (inStockFlag ? goodsBelonging : NoStoreGoodsBelonging)"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <span v-if="goodsAdd.ownership == 'STORE'" style="color:red;position: absolute;top: 70px;left: 326px;">*</span>
        <el-form-item label="供应商" label-width="85px" prop="supplier">
          <el-input v-model="goodsAdd.supplier" placeholder="请填写供应商" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'"></el-input>
          <el-select
            v-model="goodsAdd.supplier"
            placeholder="请选择" clearable
            filterable
            v-else-if="(storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') && goodsAdd.ownership == 'STORE'"
            value-key="id"
            :remote-method="getSupplierlist">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
            <span class="goods-spec-create" style="cursor:pointer;" @click="newSupplier">
              <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
              新增供应商
            </span>
          </el-select>
          <span v-else class="itemInput">企业总部</span>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="goodsAdd.linkman" placeholder="请填写联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="goodsAdd.phone" :maxlength="11" placeholder="请输入11位手机号码"></el-input>
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
          <el-input type="textarea" v-model="goodsAdd.remark" style="width: 280px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate(true)">仅保存</el-button>
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate(false)">保存并入库</el-button>
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
            <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          min-width="120"
          label="入库数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.quantity" maxlength="8"></el-input>
            <el-input class="inputs1" v-else v-model.number="scope.row.quantity" maxlength="8"></el-input>
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
          prop="productCostPrice"
          min-width="100"
          label="成本价"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span v-if="scope.row.productCostPrice !== null">{{scope.row.productCostPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subtotal"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本价小计"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.quantity,scope.row.productCostPrice) || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">合计入库数量：{{totalInAmount}}</span>
        <span class="sum_tip" v-if="storeRoleName === '店长' && hasAuthorization">合计成本价：{{totalCostPrice}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect" type="instock"/>
    </el-card>
    <gt-newSupplier v-if="newSupplierVisible" ref="newSupplier" is-published @refreshDataList="getSupplierlist"/>
  </div>
</template>
<script>
import { goodsBelonging,NoStoreGoodsBelonging } from '@/utils/dict'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '../component/inventoryGoodsAdd'
import { commissionRange,validatenull,isMobile,priceRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getUserInfoData } from '@/service/setinfo'
import gtNewSupplier from '@/views/modules/settings/supplier/newSupplier'
export default {
  name:'stockManagement-instock-interStockAdd',
  data(){
    const phones = (rule,value,callback)=>{
      if(!validatenull(value)&&!isMobile(value)){
        callback(new Error('请输入正确的手机号码'))
      }else{
        callback()
      }
    }
    const validateSupplier = (rule, value, callback) => {
      if (this.goodsAdd.ownership == 'STORE') {
        if (!this.goodsAdd.supplier) {
          callback(new Error('供应商必填'))
        } else {
          callback()
        }
      } else{
        callback()
      }
    }
    return{
      NP,
      hasAuthorization: false,
      dataListLoading: false,
      newSupplierVisible:false,
      inStockFlag:false,
      supplierList:[],
      operatorList:[],
      selectedList: [],
      editTable:[],
      storeRoleName: '',
      goodsBelonging,
      NoStoreGoodsBelonging,
      goodsAdd:{
        ownership:'',
        operator:null,
        phone:null,
        supplier:'',
      },
      bindAdd:'',
      stockRules:{
        ownership:[{required: true, message: '入库商品归属必选',trigger: 'blur'}],
        operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
        supplier:[{validator: validateSupplier, message: '供应商必填',trigger: 'blur'}],
        phone:[{validator: phones,trigger: 'blur'}],
      }
    }
  },
  components: {
    gtGoodsAdd,gtNewSupplier
  },
  computed: {
    //合计入库数量
    totalInAmount(){
      let total =0
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
            total = NP.plus(NP.times((item.productCostPrice || 0), (item.quantity || 0)), total)
          }
        })
      }
      return total
    },
  },
  created(){
    let id = this.$route.query.id
    if(id){
      this.idx = id
      this.getDetails(id)
    }
    const { storeRoleName = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
    if (this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') {
      this.goodsAdd.ownership = 'COMPANY'
    } else {
      this.goodsAdd.ownership = ''
    }
    // 获取门店是否能自营商品入库的设置
    this.getInStockFlag()
    // 获取供应商下拉列表
    this.getSupplierlist()
    this.getStaffList()
    this.detail()
  },
  methods:{
    // 获取数据列表
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getinStockDetail(id)
      if (data && data.code === 0) {
        this.selectedList = data.data.items.map(item => {
          return{
            ...item,
            productCostPrice:this.priceNum(item.productCostPrice),
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//入库数量
          }
        })
        this.goodsAdd = {
          ...data.data,
          settlementAmount: this.priceNum(data.data.settlementAmount)
        }
        // this.$refs.goodsAddSelect.init('', this.selectedList)
      } else {
        this.selectedList = []
        this.$message.warning(data.msg)
      }
      this.dataListLoading = false
    },
    // 获取门店是否能自营商品入库的设置
    async getInStockFlag(){
      const { data } = await api.getInStockFlag()
      if (data && data.code === 0) {
        this.inStockFlag = data.data
      } else {
        this.inStockFlag = false
        this.$message.warning(data.msg)
      }
    },
    changeOwnership(){
      this.goodsAdd.supplier = null
      this.selectedList = []
      this.$nextTick(() => {
        this.$refs['goodsAdd'].clearValidate()
      })
    },
    // 获取供应商下拉列表
    async getSupplierlist(){
      this.supplierLoading = true
      const { data } = await api.relateSupplierList()
      if(data && data.code ==0){
        this.supplierList = data.data.records
      }else{
        this.supplierList =[]
      }
      this.supplierLoading = false
    },
    //新增供应商
    newSupplier(){
      this.newSupplierVisible = true
      this.$nextTick(() => {
        this.$refs.newSupplier.init()
      })
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
            productCostPrice: this.goodsAdd.ownership == 'COMPANY' ? this.priceNum(item.wholesalePrice) : this.priceNum(item.productCostPrice),
            quantity: 0
          })
        }
      }
      this.selectedList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
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
          this.goodsAdd.operator = operator
          // this.goodsAdd.operator = operator.name
          // this.goodsAdd.operatorPhone = phone
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
          ownership: this.goodsAdd.ownership == 'STORE' ? 'STORE' : this.goodsAdd.ownership == 'COMPANY' ? 'COMPANY' : '',
          size: this.pageSize,
          page: this.currentPage
        })
      if (data.code === 0) {
        if (data.data.total === 1) {
          let oldList = []
          oldList = data.data.records.map(item => {
            return{
              ...item,
              productCostPrice: this.priceNum(item.productCostPrice) || 0,
              quantity: 0
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
            this.$refs.goodsAddSelect.init('',this.selectedList,this.bindAdd,'',this.goodsAdd.ownership)
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

    // 校验入库保存信息--购买数量
    checkInterNum(type){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '入库数量必填，数量大于0且小于等于99999,且散称类商品最多只能输入三位有效小数'
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
          if (Number(item.quantity) > 99999 || Number(item.quantity) <= 0 || item.quantity == null) {
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
        if (!this.checkInterNum()) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              let form ={
                ...this.goodsAdd,
                timeSku: new Date().getTime(),
                'id': this.idx,
                'items':this.selectedList.map(item =>{
                  return{
                    ...item,
                    costPrice: this.priceNum(item.productCostPrice,'out'),
                    productCostPrice: this.priceNum(item.productCostPrice,'out'),
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//入库数量
                  }
                }),
                supplierId: this.goodsAdd.supplier ? this.goodsAdd.supplier.id : null,
                supplier: (this.storeType != 'NEW_RETAIL_AND_DRINK' && this.storeType != 'NEW_RETAIL') ? this.goodsAdd.supplier : (this.goodsAdd.ownership == 'STORE' ? this.goodsAdd.supplier.name : '企业总部'),
                settlementAmount: this.priceNum(this.goodsAdd.settlementAmount, 'out'),
                quantity:this.goodsAdd.buyQuantity + this.goodsAdd.givenQuantity,
                operatorId: this.goodsAdd.operator.userId,
                operator:this.goodsAdd.operator.name,
                operatorPhone:this.goodsAdd.operator.phone
              }
              const { data } = flag ? await api.addAndupdateInStock(form) : await api.saveAndInStock(form)
              if(data.code == 0){
                this.$router.push({name:'stockManagement-instock-inStockList'})
              } else if (data.code === -2) {
                this.$message.error('请勿重复提交！')
              } else{
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
.mod-store.instock{
  .el-table{
    .inputs1.el-input{
      padding: 0 !important;
      .el-input__inner{
        width: 100% !important;
        margin-left: -12px;
      }
    }
  }
}
</style>
