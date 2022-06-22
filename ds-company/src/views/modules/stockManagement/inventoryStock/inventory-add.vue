<template>
  <div class="mod-store inventory">
    <el-card class="mode-store-table" style="padding-bottom: 15px;">
      <el-form :model="inventory" class="mode-form-line1" :inline="true" ref="inventory-form" :rules="dataFormRules">
        <el-form-item label="操作人" prop="operator">
          <el-select
            v-model="inventory.operator"
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
          <el-input type="textarea" v-model="inventory.remark" style="width: 300px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="selectGoods"></el-input>
        <el-button type="primary" style="display:inline" @click="selectGoods">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="outGoing">保存</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
      </div>
      <!-- table列表 -->
      <el-table
        :data="inventory.goodsList"
        border
        ref="editTable"
        :highlight-current-row='true'
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;margin-top:5px;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barcode"
          width="150"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="120"
          :show-overflow-tooltip="true"
          label="规格">
        </el-table-column>
        <el-table-column
          prop="brandName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="costPrice"
          min-width="90"
          :show-overflow-tooltip="true"
          label="成本价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.costPrice)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="零售价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.retailPrice)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          min-width="120"
          :show-overflow-tooltip="true"
          label="当前库存">
          <template slot-scope="scope">
            <span>
              {{scope.row.quantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkQuantity"
          min-width="120"
          label="盘点数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-if="scope.row.productType == 'BULK'" v-model="scope.row.checkQuantity" maxlength="8"></el-input>
            <el-input class="inputs1" v-else v-model.number="scope.row.checkQuantity" maxlength="8"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="adjustQuantity"
          min-width="120"
          :show-overflow-tooltip="true"
          label="调整数量">
          <template slot-scope="scope">
            <span :class="{'red': scope.row.quantity - scope.row.checkQuantity < 0,'green': scope.row.quantity - scope.row.checkQuantity > 0,}">
              {{ scope.row.quantity | getInventoryStatus(scope.row.checkQuantity, 'num')}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盘点状态">
          <template slot-scope="scope">
            <span :class="{
              'red': scope.row.quantity - scope.row.checkQuantity < 0,
              'green': scope.row.quantity - scope.row.checkQuantity > 0,
            }">{{ scope.row.quantity | getInventoryStatus(scope.row.checkQuantity, 'text')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="category1Name"
          width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          width="100"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column> -->
      </el-table>
    </el-card>
    <gt-select-goods ref="selectgoods" @refreshData="changeGoods"/>
  </div>
</template>
<script>
import * as api from '@/service/stock'
import { getStoreList } from '@/service/systore'
import gtSelectGoods from './select-goods-modal'
import { limitInputName} from '@/utils/validate'
import { getStaffList } from '@/service/staffManagement'
import { getStore } from '@/utils/storage'
import NP from 'number-precision'
export default {
  name: 'stockManagement-inventory-add',
  components: {
    gtSelectGoods
  },
  data(){
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }
    return{
      operatorList:[],
      editTable:[],
      id: '',
      dataListLoading: false,
      inventory: {
        remark: '',
        operator:null,
        goodsList: []
      },
      bindAdd:'',
      storeList: [],
      dataFormRules: {
        remark: [{validator: validateRemark, trigger: 'blur' }],
        operator:[{required: true, message:'操作人必填',trigger: 'blur'}],
      }
    }
  },
  created(){
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    const { id = '' } = this.$route.query
    this.id = id
    // 获取所属门店
    if(this.isAuth('stock:company:company:select')){
      this.getStoreList()
    }
    if (id && this.isAuth('company:checkStock:detail')) {
      // 获取盘点单详情
      this.getDetail(id)
    }
    //操作人
    this.getStaffList()
  },
  filters: {
    // 获取盘点状态 stockQuantity 库存数量, checkQuantity盘点数量
    getInventoryStatus(stockQuantity = 0, checkQuantity, type) {
      if (checkQuantity || checkQuantity === 0) {
        if (NP.minus(stockQuantity,checkQuantity) > 0) {
          return type === 'text' ? '盘亏' : NP.minus(checkQuantity,stockQuantity)
        } else if (NP.minus(stockQuantity,checkQuantity) === 0) {
          return  type === 'text' ? '正常' : 0
        } else {
          return type === 'text' ? '盘盈' : NP.minus(checkQuantity,stockQuantity)
        }
      } else {
        return '--'
      }
    }
  },
  methods:{
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.$message.error('获取门店列表失败')
      }
    },
    // 获取选中商品的列表
    changeGoods(list) {
      let originalList = []
      for(let i = 0; i < list.length; i++){
        const item = list[i]
        const originalItem = this.inventory.goodsList.find(ele => ele.skuId === item.skuId)
        if (originalItem) {
          originalList.push(originalItem)
        } else {
          originalList.push(item)
        }
      }
      this.inventory.goodsList = originalList
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
    },

    // 生成调整单
    generateAdjust() {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定生成调整单',
        confirm: async () => {

          const { data } = await api.generateJustify()
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('生成调整单成功')
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 获取盘点单详情
    async getDetail(id) {
      const { data } = await api.getInventoryDetail(id)
      if (data.code === 0) {
        const goodLists = data.data.items.map(item => {
          return {
            ...item,
            quantity:item.productType == 'BULK' ? item.stockQuantity / 1000 : item.stockQuantity,//当前库存
            checkQuantity:item.productType == 'BULK' ? item.checkQuantity / 1000 : item.checkQuantity,//盘点数量
          }
        })
        this.inventory.goodsList = goodLists
        this.inventory.remark = data.data.remark
        this.newOperator = data.data.operator
      } else {
        this.$message.error('获取盘点单详情失败')
      }
      //操作人
      this.getStaffList()
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
        const operator = this.newOperator ? this.newOperator : this.operatorList.find(ele => ele.phone === phone)
        if (operator) {
          this.inventory.operator = operator
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    // 获取商品
    async selectGoods() {
      this.dataListLoading = true
      const { data } = await api.getStockList({
        key:this.bindAdd,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        if (data.data.total === 1) {
          let oldList = []
          oldList = data.data.records
          const myItem = oldList[0]
          const index = _.findIndex(this.inventory.goodsList, (item) => {
            return item.productId == myItem.productId && item.skuId == myItem.skuId
          })
          if (index === -1) {
            this.inventory.goodsList.push(myItem)
            this.$nextTick(() => {
              this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
            })
            this.bindAdd = ''
          } else {
            this.$message.warning('已添加过该商品！')
            this.$refs.editTable.setCurrentRow(this.inventory.goodsList[index],true)
            this.$refs.editTable.bodyWrapper.scrollTop = 49 * index;
            this.bindAdd = ''
          }
        }else if(data.data.total === 0){
          this.$message.warning("没有找到对应数据")
        }else{
          this.$nextTick(() => {
            this.$refs.selectgoods.init(this.inventory.goodsList,'',this.bindAdd)
          })
        }
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //获取商品
    // selectGoods(){
    //   this.$nextTick(() => {
    //     this.$refs.selectgoods.init(this.inventory.goodsList,'',this.bindAdd)
    //   })
    // },
    // 删除
    deleteStock(index, id){
      this.inventory.goodsList.splice(index, 1)
    },
    // 校验保存信息
    checkInfo(){
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '盘点数量必填，值在0到99999之间,且散称类商品最多只能输入三位有效小数'
      const flag = this.inventory.goodsList.some(item => {
        if (reg.test(item.checkQuantity)) {
          if((item.checkQuantity).toString().indexOf('.') != -1){
            //不能输入两个小数点
            let len = 0
            let arr = (item.checkQuantity).toString().split("")
            arr.forEach((item) => {
              if(item == '.'){
                len++
              }
            })
            if(len > 1){
              return true
            }
          }
          if (Number(item.checkQuantity) > 99999 || Number(item.checkQuantity) < 0) {
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
    // 创建、 修改盘点单
    outGoing() {
      if(this.inventory.goodsList&&this.inventory.goodsList.length>0){
        this.$refs['inventory-form'].validate(async (valid) => {
          if (valid && !this.checkInfo()) {
            let items = []
            this.inventory.goodsList.forEach(item => {
              items.push({
                ...item,
                adjustQuantity: item.productType == 'BULK' ? (item.checkQuantity - item.quantity) * 1000 : (item.checkQuantity - item.quantity),//调整数量
                stockQuantity: item.productType == 'BULK' ? item.quantity * 1000 : item.quantity//库存数量
              })
            })
            let form = {
              id: this.id,
              items: items.map(item => {
                return{
                  ...item,
                  quantity:item.productType == 'BULK' ? item.quantity * 1000 : item.quantity,//当前库存
                  checkQuantity:item.productType == 'BULK' ? item.checkQuantity * 1000 : item.checkQuantity,//盘点数量
                }
              }),
              remark: this.inventory.remark,
              operatorId: this.inventory.operator ? this.inventory.operator.userId : null,
              operator: this.inventory.operator ? this.inventory.operator.name : null,
              operatorPhone: this.inventory.operator ? this.inventory.operator.phone : null,
            }
            const { data } = this.id ? await api.updateInventory({
              ...form,
              timeSku: new Date().getTime()
            }) : await api.createInventory({
              ...form,
              timeSku: new Date().getTime()
            })
            if(data.code == 0){
              this.$router.push({name: 'stockManagement-inventoryStock-inventoryManagement'})
            } else if (data.code == -2) {
              this.$message.error('请勿重复提交！')
            }else{
              this.$message.error(data.msg)
            }
          }
        })
      }else{
        this.$message.warning("请选择盘点商品")
      }
    }
  }
}
</script>

<style lang="scss">
.mod-store.inventory{
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
