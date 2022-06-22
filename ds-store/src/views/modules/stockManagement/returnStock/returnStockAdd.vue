<template>
  <div class="mod-store returnstock">
    <el-card>
      <el-form :model="goodsAdd" :inline="true" class="mode-form-line1" ref="goodsAdd" :rules="stockRules">
        <div  v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
          <el-form-item  label="原入库单" prop="instockOrder">
            <el-button @click="goodsInputSelect" >引用入库单</el-button>
          </el-form-item>
          <el-form-item>
            <span>原入库单号：{{instockList.inStockOrderNo || '--'}}</span>
          </el-form-item>
          <el-form-item>
            <span>入库商品类型：{{filterStatus(instockList.ownership, goodsBelonging) || '--'}}</span>
          </el-form-item>
           <el-form-item>
            <span>出库单位：{{instockList.outName || '--'}}</span>
          </el-form-item>
           <el-form-item>
            <span>入库时间{{instockList.inStockTime || '--'}}</span>
          </el-form-item>
        </div>
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
          <el-input type="textarea" v-model="goodsAdd.remark" style="width: 300px;" :maxlength="200" placeholder="请输入退货原因" clearable autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate">保存</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
      </div>
      <div v-else>
        <span style="float:right;padding-right:20px;padding-bottom: 10px">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate">保存</el-button>
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
          label="成本价"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
          <span>{{ (storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') ? (idx ? scope.row.wholesalePrice : scope.row.costPrice) : scope.row.costPrice }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          label="零售价">
        </el-table-column>
         <el-table-column
          prop="inStockQuantity"
          min-width="100"
          label="入库数量"
          v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
        </el-table-column>
        <el-table-column
          v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'"
          min-width="100"
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
          label="成本价小计"
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span>{{ NP.times(scope.row.quantity,((storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') ? (idx ? scope.row.wholesalePrice : scope.row.costPrice) : scope.row.costPrice)) || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'">合计退货数量：{{totalReturnAmount}}</span>
        <!-- <span class="sum_tip" v-if="storeRoleName === '店长' && hasAuthorization">合计成本价：{{totalCostPrice}}</span> -->
      </div>
      <gt-goods-add ref="goodsAddSelect" @changeSelect="getSelect" type="instockList"/>
    </el-card>
    <gt-goods-input-visit ref="goodsInputVisit" @changeSelect="getInputSelect"/>
  </div>
</template>
<script>
import { goodsBelonging } from '@/utils/dict'
import { filterStatus } from '@/utils'
import gtGoodsInputVisit from '../component/goodsInputVisit'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import gtGoodsAdd from '../component/inventoryGoodsAdd'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import { getUserInfoData } from '@/service/setinfo'
export default {
  name:'stockManagement-returnStock-returnStockAdd',
  data(){
    return{
      instockId:'',
      instockList:{
       orderNo:'',
       ownership:'',
       outName:'',
       inStockTime:'',
       supplier:'',
      },
      goodsBelonging,
      filterStatus,
      NP,
      operatorList:[],
      dataListLoading: false,
      hasAuthorization: false,
      selectedList: [],
      editTable:[],
      storeRoleName: '',
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
    gtGoodsAdd,
    gtGoodsInputVisit
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
    //合计成本价
    totalCostPrice() {
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
  },
  async created(){
    let id = this.$route.query.id
    if(id){
      this.idx = id
      this.getDetails(id)
    }
    //获取companyId and storeId
    const { companyId = '', storeId = '', } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.companyId = companyId
    this.storeId = storeId
    //限制成本价显示
    const { storeRoleName = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
    //操作人
    this.getStaffList()
    //获取userName
    this.detail()
  },
  methods:{
    // 获取数据列表
    async getDetails(id) {
      this.dataListLoading = true
      const { data } = await api.getReturnStockDetail({
        id:this.idx,
        withCurrentStock:true,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.selectedList = data.data.items.map(item => {
          return{
            ...item,
            wholesalePrice: this.priceNum(item.wholesalePrice),
            productCostPrice: this.priceNum(item.productCostPrice),
            costPrice: this.priceNum(item.costPrice),
            retailPrice: this.priceNum(item.retailPrice),
            currentStock: item.productType == 'BULK' ? ((item.currentStock || 0) / 1000) : (item.currentStock || 0),
            // oldStockQuantity: item.productType == 'BULK' ? ((item.oldStockQuantity || 0) / 1000) : (item.oldStockQuantity || 0),
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//退货数量
            inStockQuantity: item.productType == 'BULK' ? item.inStockQuantity / 1000 : item.inStockQuantity,//入库数量
          }
        })
        this.instockList.orderNo=data.data.orderNo
        this.instockList.inStockOrderNo = data.data.inStockOrderNo//原入库单号
        this.instockList.ownership=data.data.ownership
        this.instockList.inStockTime=data.data.inStockTime
        this.instockList.outName=data.data.outName
        this.goodsAdd = {
          ...data.data,
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
            oldStockQuantity: item.quantity || 0,
            costPrice: this.priceNum(item.costPrice),
            retailPrice: this.priceNum(item.retailPrice),
            quantity: 0
          })
        }
      }
      this.selectedList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
      if(this.storeType =='NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL'){
        this.selectedList.map(item=>{
            item.productCostPrice=this.priceNum(this.instockList.items.map(item=>item.productCostPrice));
            item.costPrice=this.priceNum(this.instockList.items.map(item=>item.costPrice));
            item.quantity=this.instockList.items.map(item=>item.quantity);
            return item;
        })
        
      }
    },

    //监听入库单list变化
    getInputSelect(list){
      debugger
      this.instockList = list
      this.instockList.inStockOrderNo = list.orderNo
      this.selectedList = list.items.map(item=>{
        return{
            ...item,
            productCostPrice: this.priceNum(item.productCostPrice),
            costPrice: this.priceNum(item.costPrice),
            retailPrice: this.priceNum(item.retailPrice),
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,
            inStockQuantity : item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,
            linkId:this.instockList.linkId,
            linkOrderNo:this.instockList.linkOrderNo
          }
      })
    },
    //引用入库单
    async goodsInputSelect(){
    this.$nextTick(() => {
      this.$refs.goodsInputVisit.init()
    })
  },
    //获取userName
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
              productCostPrice: this.priceNum(item.productCostPrice),
              costPrice: this.priceNum(item.costPrice),
              retailPrice: this.priceNum(item.retailPrice),
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
            this.$refs.goodsAddSelect.init(this.goodsAdd.storeId,this.selectedList,this.bindAdd)
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
    },
		//校验退货数量
		checkReturnInfo(){
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
          if(this.storeType != 'NEW_RETAIL_AND_DRINK' && this.storeType != 'NEW_RETAIL'){
            if (Number(item.quantity) <= 0 || Number(item.quantity) > Number(item.oldStockQuantity)
             || Number(item.quantity) > Number(item.currentStock)) {
            return true
            } else {
              return false
            }
          }else{
            if(Number(item.quantity) <= 0 || Number(item.quantity) > Number(item.inStockQuantity)){
              return true
            } else {
              return false
            }
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
      if(this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL'){
        if(this.selectedList.length==0){
          this.$message.warning("请引入原入库单")
          return false
        }
      }
      if(this.selectedList&&this.selectedList.length>0){
        if (!this.checkReturnInfo()) {
          this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              const { data } = !this.idx ? await api.newAddReturn({
                ownership:this.instockList.ownership ? this.instockList.ownership : null,
                supplier:this.instockList.supplier ? this.instockList.supplier : null,
                ...this.goodsAdd,
                inStockOrderNo:this.instockList.orderNo ? this.instockList.orderNo : null,
                outName:this.instockList.outName ? this.instockList.outName : null,
                inStockTime:this.instockList.inStockTime ? this.instockList.inStockTime : null,
                timeSku: this.union_id,
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                items:this.selectedList.map(item => {
                  return {
                    ...item,
                    productCostPrice: ((this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') && this.idx) ? this.priceNum(item.wholesalePrice,'out') : this.priceNum(item.costPrice,'out'),
                    costPrice: (this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') ? (this.idx ? this.priceNum(item.wholesalePrice,'out') : this.priceNum(item.costPrice,'out')) : this.priceNum(item.costPrice,'out'),
                    retailPrice: this.priceNum(item.retailPrice,'out'),
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//退货数量
                    inStockQuantity: item.productType == 'BULK' ? item.inStockQuantity * 1000 : item.inStockQuantity,//入库数量
                    currentStock: item.productType == 'BULK' ? item.currentStock * 1000 : item.currentStock,//退货数量
                  }
                })
              }) : await api.updateReturn({
                ownership:this.instockList.ownership ? this.instockList.ownership : null,
                supplier:this.instockList.supplier ? this.instockList.supplier : null,
                ...this.goodsAdd,
                inStockOrderNo:this.instockList.orderNo ? this.instockList.orderNo : null,
                outName:this.instockList.outName ? this.instockList.outName : null,
                inStockTime:this.instockList.inStockTime ? this.instockList.inStockTime : null,
                timeSku: new Date().getTime(),
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone: this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                items:this.selectedList.map(item => {
                  return {
                    ...item,
                    productCostPrice: ((this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') && item.linkId && item.linkOrderNo) ? this.priceNum(item.costPrice,'out') : this.priceNum(item.costPrice,'out'),
                    costPrice: (this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') ? ((item.linkId && item.linkOrderNo) ? this.priceNum(item.costPrice,'out') : this.priceNum(item.costPrice,'out')) : this.priceNum(item.costPrice,'out'),
                    retailPrice: this.priceNum(item.retailPrice,'out'),
                    quantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//退货数量
                    inStockQuantity: item.productType == 'BULK' ? item.inStockQuantity * 1000 : item.inStockQuantity,//入库数量
                    currentStock: item.productType == 'BULK' ? item.currentStock * 1000 : item.currentStock,//退货数量
                  }
                })
              })
              if(data.code == 0){
                this.$router.push({name:'stockManagement-returnStock-returnStockList'})
              } else if (data.code == -2) {
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
