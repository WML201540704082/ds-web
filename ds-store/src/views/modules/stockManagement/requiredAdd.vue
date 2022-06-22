<template>
  <div class="mod-store customers">
    <el-card>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules">
        <el-form-item label="订货门店" prop="targetStoreId">
          <el-select
            v-model="goodsAdd.targetStoreId"
            placeholder="请选择" clearable
            :disabled="idx ? true :false"
            filterable>
            <el-option  label="企业总部" value="" ></el-option>
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
          <el-input type="textarea" v-model="goodsAdd.remark" style="width: 300px;" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" v-if="!goodsAdd.targetStoreId" :loading="$store.state.loading.global" @click.native="save">保存</el-button>
          <el-button type="primary" v-else :loading="$store.state.loading.global" @click.native="handleUpdate">保存</el-button>
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
          prop="quantity"
          min-width="120"
          label="订货数量">
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
          prop="wholesalePrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="订货价"
          v-if="storeRoleName === '店长' && hasAuthorization">
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="零售价">
        </el-table-column>
        <el-table-column
          prop="subtotal"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货价小计"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.quantity,scope.row.wholesalePrice) || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">合计订货数量：{{totalReqAmount}}</span>
        <span class="sum_tip" v-if="storeRoleName === '店长' && hasAuthorization">合计订货价：{{totalCostPrice}}</span>
        <span class="sum_tip">合计零售价：{{totalRetailPrice}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect" type="require"/>
    </el-card>
  </div>
</template>
<script>
import { getStoreList } from '@/service/systore'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from './component/inventoryGoodsAdd'
import { commissionRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import { getUserInfoData } from '@/service/setinfo'
import { getStoreCustomerList } from '@/service/setting'
export default {
  name:'stockManagement-requiredAdd',
  data(){
    return{
      NP,
      dataListLoading: false,
      storeRoleName: '',
      hasAuthorization: false,
      storeList:[],
      editTable:[],
      operatorList:[],
      selectedList: [],
      goodsAdd:{
        operator:null,
        targetStoreId:'',
        remark:''
      },
      bindAdd:'',
      stockRules:{
        operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
      }
    }
  },
  components: {
    gtGoodsAdd
  },
  computed: {
    //合计订货数量
    totalReqAmount(){
      let total =0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.quantity)
        })
      }
      return total
    },
    //合计订货价
    totalCostPrice(){
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.quantity) {
            total = NP.plus(NP.times((item.wholesalePrice || 0), (item.quantity || 0)), total)
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
  created(){
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    const { storeRoleName = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
    //获取详情
    let id = this.$route.query.id
    if(id){
      this.idx = id
      this.getDetails(id)
    }else{
      // this.$nextTick(() => {
      //   this.$refs.goodsAddSelect.init('')
      // })
    }
    //操作人
    this.getStaffList()
    //获取userName
    this.detail()
  },
  methods:{
    // async changeStore(val){
    //   this.$refs.goodsAddSelect.init(val)
    // },
    // 获取数据列表
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.selectedList = data.data.items.map(item =>{
          return{
            ...item,
            wholesalePrice:this.priceNum(item.wholesalePrice),
            retailPrice:this.priceNum(item.retailPrice),
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//订货数量
          }
        })
        this.goodsAdd = {
          ...data.data,
          targetStoreId:data.data.targetStoreId ? data.data.targetStoreId : '',
        }
        // this.$refs.goodsAddSelect.init('', this.selectedList)
      } else {
        this.selectedList = []
        this.$message.warning(data.msg)
      }

    },

    // 客户门店列表
    async getStorelist(){
      this.dataListLoading = true
      const {data} = await getStoreCustomerList()
      if(data.code == 0){
        this.storeList = data.data
      }else{
        this.storeList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    // 监听list变化
    getSelect(list) {
      let originalList = []
      for(let i = 0; i < list.length; i++){
        const item = list[i]
        const originalItem = this.selectedList.find(ele => ele.skuId === item.skuId)
        if (originalItem) {
          originalList.push(originalItem)
        }else{
          originalList.push({
            ...item,
            wholesalePrice: this.priceNum(item.wholesalePrice) || 0,
            retailPrice: this.priceNum(item.retailPrice) || 0,
            quantity: 0
          })
        }
      }
      this.selectedList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
      // this.selectedList = list.map(item =>{
      //   return{
      //     ...item,
      //     quantity: null
      //   }
      // })
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
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取商品
    async goodsSelect() {
      this.dataListLoading = true
      let info = null
      if (this.goodsAdd.targetStoreId) {
        info = await api.getStockList({
          storeId: this.goodsAdd.targetStoreId,
          key: this.bindAdd,
          size: this.pageSize,
          page: this.currentPage,
          ownership: 'COMPANY',
          hide: false
        })
      } else {
        info = await api.getCompanyStockList({
          key: this.bindAdd,
          size: this.pageSize,
          page: this.currentPage,
          hide: false
        })
      }
      const { data } = info
      if (data.code === 0) {
        if (data.data.total === 1) {
          let oldList = []
          oldList = data.data.records.map(item => {
            return{
              ...item,
              wholesalePrice: this.priceNum(item.wholesalePrice) || 0,
              retailPrice: this.priceNum(item.retailPrice) || 0,
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
            this.$refs.goodsAddSelect.init(this.goodsAdd.targetStoreId,this.selectedList,this.bindAdd)
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
    // 校验入库保存信息
    checkInfo(){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '订货数量必填，数量大于0小于100000,且散称类商品最多只能输入三位有效小数'
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
          if (Number(item.quantity) > 99999 || Number(item.quantity) < 0) {
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
    save(){
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定向企业总部订货吗？',
        confirm: async () => {
          this.handleUpdate()
          this.$easyConfirm.hide()
        }
      })
    },
    async handleUpdate(){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkInfo()) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              const tname = this.storeList.find(item => item.id == this.goodsAdd.targetStoreId)
              let form ={
                ...this.goodsAdd,
                timeSku: new Date().getTime(),
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                targetStoreName: tname ? tname.name : '企业总部',
                'id': this.idx,
                'items': this.selectedList.map(item => {
                  return{
                    ...item,
                    wholesalePrice: this.priceNum(item.wholesalePrice,'out'),
                    retailPrice: this.priceNum(item.retailPrice,'out'),
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//出库数量
                  }
                }),
              }
              const { data } = await api.addAndupdateReqStock(form)
              if(data.code == 0){
                this.$router.push({name:'stockManagement-requiredInventory'})
              } else if (data.code == -2) {
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
.mod-store.customers{
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
