<template>
  <div class="mod-store stock-add">
    <el-card>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules" >
        <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="goodsAdd.supplier"
            placeholder="请选择" clearable
            filterable
            value-key="id"
            :remote-method="getSupplierlist"
            @change="getContact">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item">
            </el-option>
            <span class="goods-spec-create" style="cursor:pointer;" @click="newSupplier">
              <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
              新增供应商
            </span>
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
          prop="buyQuantity"
          min-width="120"
          label="采购数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.buyQuantity" maxlength="9"></el-input>
            <el-input class="inputs1" v-else v-model.number="scope.row.buyQuantity" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="givenQuantity"
          min-width="120"
          label="赠送数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.givenQuantity" maxlength="9"></el-input>
            <el-input class="inputs1" v-else v-model.number="scope.row.givenQuantity" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="oldPurchasePrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="原进货价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{scope.row.oldPurchasePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nowPurchasePrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="现进货价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model="scope.row.nowPurchasePrice" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="oldWholesalePrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="原配送价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{scope.row.oldWholesalePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nowWholesalePrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="现配送价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model="scope.row.nowWholesalePrice" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="subtotal"
          min-width="120"
          :show-overflow-tooltip="true"
          label="现进货价小计"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.buyQuantity,scope.row.nowPurchasePrice) || 0 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="batchNo"
          min-width="120"
          label="商品批次">
          <template slot-scope="scope">
            <el-input class="inputs1" v-model="scope.row.batchNo" maxlength="50"></el-input>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="newStore == 'false'">合计采购数量：{{totalInAmount}}</span>
        <span class="sum_tip" v-if="newStore == 'false'">合计赠送数量：{{totalGivenAmount}}</span>
        <span class="sum_tip">合计现进货价：{{totalCost}}</span>
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect"/>
    </el-card>
    <gt-newSupplier v-if="newSupplierVisible" ref="newSupplier" is-published @refreshDataList="getSupplierlist"/>
  </div>
</template>
<script>
import { getShoppingSupplierList } from '@/service/stock'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '../component/inventoryGoodsAdd'
import { priceRange } from '@/utils/validate'
import * as api from '@/service/stock'
import _ from 'lodash'
import { getStore } from '@/utils/storage'
import gtNewSupplier from '@/views/modules/settings/supplier/newSupplier'
export default {
  name: 'stockManagement-instock-interStockAdd',
  data(){
    const validateDiscount = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99, 0)) {
          callback(new Error('请输入0-499999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      NP,
      supplierList:[],
      operatorList:[],
      editTable:[],
      dataListLoading: false,
      supplierLoading: false,
      newSupplierVisible:false,
      selectedList: [],
      firstRender: true,
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
    gtGoodsAdd,gtNewSupplier
  },
  computed: {
    //合计入库数量
    totalInAmount(){
      let total =0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.buyQuantity  || 0)
        })
      }
      return total
    },
    //合计赠送数量
    totalGivenAmount(){
      let total =0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total,item.givenQuantity || 0)
        })
      }
      return total
    },
    //合计现进货价
    totalCost() {
      let total = 0
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.nowPurchasePrice) {
            //现进货价*购买数量
            total = NP.plus(NP.times(Math.abs(item.nowPurchasePrice || 0), (item.buyQuantity || 0)), total)
          }
        })
      }
      return  total
    },
  },
  watch: {
    // totalCost(n, o) {
    //   if (!this.idx || (this.idx && !this.firstRender)) {
    //     this.goodsAdd.settlementAmount = n
    //   }
    //   this.firstRender = false
    // }
  },
  created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    //获取companyId和门店茶饮类型
    const { companyId = '',newStore = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    this.newStore = newStore
    // 获取供应商下拉列表
    this.getSupplierlist()
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
  },
  methods:{
    // 获取数据列表
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getinStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.selectedList = data.data.items.map(item => {
          return {
            ...item,
            oldPurchasePrice: this.priceNum(item.oldPurchasePrice),
            oldWholesalePrice: this.priceNum(item.oldWholesalePrice),
            nowPurchasePrice: item.nowPurchasePrice ? this.priceNum(item.nowPurchasePrice) : this.priceNum(item.productCostPrice),
            nowWholesalePrice: this.priceNum(item.nowWholesalePrice),
            buyQuantity: item.productType == 'BULK' ? item.buyQuantity / 1000 : item.buyQuantity,
            givenQuantity: item.productType == 'BULK' ? item.givenQuantity / 1000 : item.givenQuantity
          }
        })
        this.goodsAdd = {
          ...data.data,
        }
        // this.$refs.goodsAddSelect.init('', this.selectedList)
      } else {
        this.selectedList = []
        this.$message.warning(data.msg)
      }
    },
    // 获取联系人
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
    // 获取供应商下拉列表
    async getSupplierlist(){
      this.supplierLoading = true
      const { data } = await getShoppingSupplierList()
      if(data && data.code ==0){
        this.supplierList = data.data
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
    // 自定义合计算法
    // summary(param) {
      // const { columns, data } = param
      // const sums = []
      // const quantityList = data.map(ele => ele.buyQuantity)
      // console.log('qa', quantityList)
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '合计'
      //     return
      //   }
      //   if (index === 5 || index === 6 || index === 8) {
      //     const values = data.map(item => Number(item[column.property]))
      //     if (!values.every(value => isNaN(value))) {
      //       const tempValue = values.reduce((prev, curr, flag) => {
      //         const value = Number(curr)
      //         if (!isNaN(value)) {
      //           if (index === 5 || index === 6) {
      //             return prev + curr
      //           } else {
      //             return NP.plus(NP.times((quantityList[flag] || 0), curr), prev)
      //           }
      //         } else {
      //           return prev
      //         }
      //       }, 0)
      //       sums[index] = tempValue || 0
      //     } else {
      //       sums[index] = ''
      //     }
      //   }
      // })
      // return sums
    // },

    // 监听list变化
    async getSelect(list) {
      /**
       * 数据转换
       */
      let originalList = []
      for(let i = 0; i < list.length; i++){
        const item = list[i]
        const originalItem = this.selectedList.find(ele => ele.skuId === item.skuId)
        if (originalItem) {
          originalList.push(originalItem)
        } else {
          const { data } = await api.inStockFindItem({
            productId:item.productId,
            skuId:item.skuId
          })
          if (data.code === 0) {
            originalList.push({
              ...item,
              oldPurchasePrice: data.data ? this.priceNum(data.data.nowPurchasePrice).toFixed(2) : this.priceNum(item.productCostPrice).toFixed(2),
              oldWholesalePrice: data.data ? this.priceNum(data.data.nowWholesalePrice).toFixed(2) : this.priceNum(item.wholesalePrice).toFixed(2),
              // nowPurchasePrice: data.data ? this.priceNum(data.data.nowPurchasePrice) : 0,
              // nowWholesalePrice: data.data ? this.priceNum(data.data.nowWholesalePrice) : 0,
              nowPurchasePrice: this.priceNum(item.productCostPrice),
              // nowPurchasePrice: data.data ? this.priceNum(data.data.nowPurchasePrice) : this.priceNum(item.costPrice),
              nowWholesalePrice: this.priceNum(item.wholesalePrice),
              // nowWholesalePrice: data.data ? this.priceNum(data.data.nowWholesalePrice) : this.priceNum(item.wholesalePrice),
              givenQuantity:0,
              buyQuantity:0,
            })
          } else {
            this.$message.error(data.msg)
          }

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
              oldPurchasePrice: this.priceNum(item.productCostPrice).toFixed(2) || 0,
              oldWholesalePrice: this.priceNum(item.wholesalePrice).toFixed(2) || 0,
              nowPurchasePrice: this.priceNum(item.productCostPrice),
              nowWholesalePrice: this.priceNum(item.wholesalePrice),
              givenQuantity:0,
              buyQuantity:0,
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
    //获取商品
    // goodsSelect(){
    //   this.$nextTick(() => {
    //     this.$refs.goodsAddSelect.init('',this.selectedList,this.bindAdd)
    //   })
    // },
    // 删除
    deleteStock(index,row){
      this.selectedList.splice(index,1)
      // this.$refs.goodsAddSelect.deleteSign(row)
    },
    // 校验入库保存信息--购买数量
    checkInterNum(type){
      // /^\d+(\.\d+)?$/;
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = `${type === 'buyQuantity' ? '采购' : '赠送'}数量必填，数量大于等于0且小于等于99999,且散称类商品最多只能输入三位有效小数`
      const flag = this.selectedList.some((item, index) => {
        if (reg.test(item[type])) {
          if((item[type]).toString().indexOf('.') != -1){
            //不能输入两个小数点
            let len = 0
            let arr = (item[type]).toString().split("")
            arr.forEach((item) => {
              if(item == '.'){
                len++
              }
            })
            if(len > 1){
              return true
            }
          }
          if (Number(item[type]) > 99999 || Number(item[type]) < 0 || item[type] == null) {
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
    //校验同时为0
    checkBothNum(){
      let msg = `采购数量和赠送数量不能同时0`
      const flag = this.selectedList.some((item, index) => {
        if (item.buyQuantity === 0 && item.givenQuantity ===0) {
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
    // 校验入库保存信息--现进货价
    checkInterPrice(type){
      let msg = `${type === 'nowPurchasePrice' ? '现进货' : '现配送'}价请输入0.00-99999.99的价格数字，最多保留小数点后两位`
      const flag = this.selectedList.some((item, index) => {
        if (!priceRange(item[type], 99999.99, 0)) {
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

    // 保存
    async handleUpdate(flag){
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkBothNum() && !this.checkInterNum('buyQuantity') && !this.checkInterNum('givenQuantity') &&
            !this.checkInterPrice('nowPurchasePrice') && !this.checkInterPrice('nowWholesalePrice')) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              let form ={
                ...this.goodsAdd,
                'id': this.idx,
                'items':this.selectedList.map(item => {
                  return {
                    ...item,
                    oldPurchasePrice: this.priceNum(item.oldPurchasePrice || 0, ''),
                    oldWholesalePrice: this.priceNum(item.oldWholesalePrice || 0, ''),
                    nowPurchasePrice: this.priceNum(item.nowPurchasePrice || 0, ''),
                    nowWholesalePrice: this.priceNum(item.nowWholesalePrice || 0, ''),
                    buyQuantity: item.productType == 'BULK' ? item.buyQuantity * 1000 : item.buyQuantity,
                    givenQuantity: item.productType == 'BULK' ? item.givenQuantity * 1000 : item.givenQuantity
                  }
                }),
                quantity:this.goodsAdd.buyQuantity + this.goodsAdd.givenQuantity,
                linkman:this.goodsAdd.bossName,
                phone:this.goodsAdd.bossPhone,
                supplierId: this.goodsAdd.supplier ? this.goodsAdd.supplier.id : null,
                supplier: this.goodsAdd.supplier ? this.goodsAdd.supplier.companyName : null,
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                timeSku: new Date().getTime()
              }
              const { data } = flag ? await api.addAndupdateInStock(form) : await api.saveAndInStock(form)
              if(data.code == 0){
                this.$router.push({name:'stockManagement-instock-inStockList'})
              } else if (data.code === -2) {
                this.$message.error('请勿重复提交！')
              } else {
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
.mod-store.stock-add{
  .el-table{
    .inputs1.el-input{
      padding: 0 !important;
      .el-input__inner{
        width: 100% !important;
      }
    }
  }
}
.goods-spec-create{
  width: 100%;
  display: block;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  .create-img{
    width: 20px;
    margin-right: 5px;
  }
}
</style>
