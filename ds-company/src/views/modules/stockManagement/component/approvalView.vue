<template>
  <el-dialog
    :title="type === 'view' ? '查看' : (status === 'CHECK_PENDING' ? '(销管)审核' : '(财务)审核')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="page-approve-modal">
    <el-form ref="request-stock-form" class="form-show" label-width="110px">
      <el-form-item label="订货单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="订货时间">
        <span class="itemInput">{{details.createTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="订货门店">
        <span class="itemInput">{{details.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      show-summary
      class="all-count-table"
      v-if="hackReset"
      :summary-method="summary"
      max-height="360"
      style="width: 100%; min-height: 200px;">
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
        label="操作"
        v-if="companyRoleName=='销管' && type == 'approval'">
        <template slot-scope="scope">
          <el-button class="nopadding" type="text" size="small" @click="deleteDataList(scope.row.id)">删除</el-button>
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
      v-if="newStore == 'true'"
        prop="jdyCode"
        min-width="120"
        :show-overflow-tooltip="true"
        label="精斗云编码">
        </el-table-column>
       <el-table-column
        v-if="newStore == 'true'"
        prop="newCode"
        width="100"
        :show-overflow-tooltip="true"
        label="商品自编码">
      </el-table-column>
      <el-table-column
        prop="spec"
        width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
			<el-table-column
				prop="wholesalePrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="配送价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <el-input v-if="companyRoleName=='销管' && type === 'approval'" class="inputs1" v-model="scope.row.wholesalePrice" maxlength="9"></el-input>
          <span v-else>{{scope.row.wholesalePrice}}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span v-if="scope.row.retailPrice !== null">{{scope.row.retailPrice.toFixed(2)}}</span>
          <span v-else> -- </span>
        </template>
			</el-table-column>
			<el-table-column
				prop="category1Name"
				min-width="100"
				:show-overflow-tooltip="true"
				label="一级分类">
			</el-table-column>
			<el-table-column
				prop="category2Name"
				min-width="100"
				:show-overflow-tooltip="true"
				label="二级分类">
			</el-table-column>
      <el-table-column
        prop="brandName"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="quantity"
        min-width="100"
        :show-overflow-tooltip="true"
        label="订货数量">
        <template slot-scope="scope">
          <el-input class="inputs1" v-if="status === 'CHECK_PENDING' && scope.row.productType == 'BULK'" v-model="scope.row.quantity" maxlength="9"></el-input>
          <el-input class="inputs1" v-else-if="status === 'CHECK_PENDING' && scope.row.productType != 'BULK'" v-model.number="scope.row.quantity" maxlength="9"></el-input>
          <span v-else>
            {{ scope.row.quantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeId"
        width="100"
        label="出库单位">
        <template slot-scope="scope">
          <!-- <el-select
            class="out-select"
            v-if="status === 'CHECK_PENDING'"
            v-model="scope.row.storeId"
            placeholder="请选择" clearable
            @change="val => changeSelect(val, scope.$index)"
            filterable
            reserve-keyword>
            <el-option  label="企业总部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span v-else>{{scope.row.storeName}}</span> -->
          <span>{{'企业总部'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stockQuantity"
        min-width="100"
        v-if="type === 'approval'"
        label="库存">
        <template slot-scope="scope">
          <span>
            {{ scope.row.stockQuantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="outQuantity"
        min-width="120"
        v-if="details.status !== 'REJECT'"
        label="出货数量">
				<template slot-scope="scope">
          <!-- <el-input class="inputs1" v-if="status === 'CHECK_PENDING' && scope.row.productType == 'BULK'" v-model="scope.row.outQuantity" maxlength="9"></el-input>
          <el-input class="inputs1" v-else-if="status === 'CHECK_PENDING' && scope.row.productType != 'BULK'" v-model.number="scope.row.outQuantity" maxlength="9"></el-input>
          <span v-else> -->
          <span>
            {{scope.row.quantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
				prop="remark"
				min-width="230"
				:show-overflow-tooltip="true"
				label="备注">
        <template slot-scope="scope">
          <el-input v-if="companyRoleName=='销管' && type === 'approval'" v-model="scope.row.remark" maxlength="50"></el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
			</el-table-column>
    </el-table>
    <el-form ref="form" label-width="120px" :model="form">
      <el-form-item label="打款凭证：">
        <span v-if="form.pics&&form.pics.length>0">
          <div class="view-img" v-for='(item, index) in form.pics' :key="index">
            <img class="theme-border" style="width:50px;height:50px" :src="'http://'+item" alt="" @click="openImgPic('innerPic',item)">
          </div>
        </span>
        <span v-else class="itemInput">--</span>
      </el-form-item>
      <el-form-item label="审核说明：" prop="rejectCause">
        <el-input v-if="type == 'approval'" type="textarea" v-model="form.rejectCause" style="width: 300px;" :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
        <span class="itemInput" v-else>{{details.rejectCause || '--'}}</span>
      </el-form-item>
      <el-form-item v-if="newStore == 'true'" label="物流金额：" prop="logisticsAmount" >
        <el-input class="itemInput" v-model="logisticsAmount" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="companyRoleName =='财务' && newStore == 'true'" label="门店订货合计金额：" prop="storeSum">
        <span class="itemInput" >{{storeSum}}</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="type==='approval'">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="approval(true)">通过</el-button>
      <el-button type="primary" @click="approval(false)">拒绝</el-button>
    </span>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { getStoreList } from '@/service/systore'
import { filterStatus } from '@/utils'
import { stockStatus } from '@/utils/dict'
import moment from 'moment'
import _ from 'lodash'
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
export default {
  data(){
    return{
      NP,
      type:'',
      quantity:null,
      filterStatus,
      stockStatus,
      dataList: [],
      storeList:[],
      moment,
      dataListLoading: false,
      hackReset:true,
      visible: false,
      details:{},
      form:{
        rejectCause: null,
        pics:[]
      },
      showImgPic: null,
      stockListLoading:false,
      stockList:[],
      companyRoleName:null,
      logisticsAmount:'',
      storeSum:''
    }
  },
  created(){
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  watch:{
    visible(o,n){
      this.$parent.getDataList()
    }
  },
  methods:{
    // 获取企业库存列表
    async getStockList() {
      this.stockListLoading = true
      const { data } = await api.getStockListAndSum({
        storeId:'',
        size: 100000,
        page: 0
      })
      if (data.code === 0) {
        this.stockList = data.data.page.records.map(item => {
          return{
            productId:item.productId,
            useQuantity:item.useQuantity
          }
        })
        this.getDataList(this.id)
      } else {
        this.stockList = []
        this.$message.error(data.msg)
      }
      this.stockListLoading = false
    },
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.form[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(this.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.details.logisticsAmount=data.data.logisticsAmount
        this.form.pics = data.data.receiptImg ? data.data.receiptImg.split(',') : []
        if (this.type === 'approval') {
          this.dataList = data.data.items.map(item => {
            return {
              ...item,
              quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//订货数量
              oldQuantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//一开始的订货数量
              stockQuantity: item.productType == 'BULK' ? (item.stockQuantity) / 1000 : item.stockQuantity,//库存
              outQuantity: item.productType == 'BULK' ? ((item.outQuantity || item.quantity) / 1000) : (item.outQuantity || item.quantity),//出货数量
              storeId:'',
              productCostPrice: this.priceNum(item.productCostPrice),
              wholesalePrice: this.priceNum(item.wholesalePrice),
              retailPrice: this.priceNum(item.retailPrice),
            }
          })
          //for (let i = 0; i < this.stockList.length; i++) {
           // for (let j = 0; j < this.dataList.length; j++) {
             // if (this.stockList[i].productId == this.dataList[j].productId) {
              //  this.dataList[j].stockQuantity = this.companyRoleName == '财务'? (this.dataList[j].productType == 'BULK' ? (NP.plus(this.stockList[i].useQuantity,(this.dataList[j].quantity*1000)))/1000 : (NP.plus(this.stockList[i].useQuantity,this.dataList[j].quantity))) : this.dataList[j].productType == 'BULK' ? this.stockList[i].useQuantity/1000 : this.stockList[i].useQuantity
             // }
            //}
          //}
        } else {
          this.dataList = data.data.items.map(item => {
            return {
              ...item,
              quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//订货数量
              oldQuantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//一开始的订货数量
              stockQuantity: item.productType == 'BULK' ? (item.stockQuantity) / 1000 : item.stockQuantity,//库存
              outQuantity: item.productType == 'BULK' ? ((item.outQuantity || item.quantity) / 1000) : (item.outQuantity || item.quantity),//出货数量
              storeId:'',
              productCostPrice: this.priceNum(item.productCostPrice),
              wholesalePrice: this.priceNum(item.wholesalePrice),
              retailPrice: this.priceNum(item.retailPrice)
            }
          })
        }
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    // 删除
    deleteDataList(ids){
      if (this.dataList.length == 1) {
        this.$message.warning('只有一条商品详情不能删除')
        return
      }
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除商品吗',
        confirm: async () => {
          const { data } = await api.reqStockDelete(ids)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    async changeSelect(storeId,index){
      if (storeId == '') {
        const { data } = await api.getStoreOrCompanyStockDetail({
          skuId:this.dataList[index].skuId,
          productId:this.dataList[index].productId,
        })
        if (data.code === 0) {
          this.dataList[index].stockQuantity  = this.dataList[index].productType == 'BULK' ? ((data.data.useQuantity || data.data.quantity)/1000) : (data.data.useQuantity || data.data.quantity)
        }
      }else{
        const { data } = await api.getStoreOrCompanyStockDetail({
          storeId,
          skuId:this.dataList[index].skuId,
          productId:this.dataList[index].productId,
        })
        if (data.code === 0) {
          this.dataList[index].stockQuantity  = this.dataList[index].productType == 'BULK' ? ((data.data.useQuantity || data.data.quantity)/1000) : (data.data.useQuantity || data.data.quantity)
        }
      }
    },
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        // 过滤掉当前门店
        this.storeList = data.data.filter(store => this.details.storeId !== store.id)
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    async init(id,type,status){
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
      // 获取企业库存列表
      this.getStockList()
      this.form.rejectCause = null
      this.id = id
      this.visible = true
      this.type = type
      this.status = status
      await this.getDataList(id)
      // await this.getStorelist()
    },
    //校验
    //校验必填且散称类商品最多只能输入三位有效小数
    checkInfo1(status){
      if (!status) {
        return false
      }
      let reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
      let msg = '订货数量必填，且散称类商品最多只能输入三位有效小数'
      const flag = this.dataList.some((item, index) => {
        if (item.quantity != '' || item.quantity != ' ' || reg.test(item.quantity)) {
          return false
        } else {
          return true
        }
      })
      if (flag) {
        this.$message.warning(msg)
      }
      return flag
    },
    //校验大于0小于等于门店提交的订货数量
    checkInfo2(status){
      if (!status) {
        return false
      }
      let msg = '订货数量需大于0小于等于门店提交的订货数量'
      const flag = this.dataList.some((item, index) => {
        if (Number(item.quantity) > Number(item.oldQuantity) || Number(item.quantity) <= 0) {
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
    //大于0小于等于可用库存
    checkInfo3(status){
      if (!status) {
        return false
      }
      let msg = '订货数量需大于0小于等于可用库存的值'
      const flag = this.dataList.some((item, index) => {
        if (Number(item.quantity) > Number(item.stockQuantity)) {
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

    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const outQuantityList = data.map(ele => ele.quantity)
      let storeSum = 0;
      let logisticsAmount = 0;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property === 'wholesalePrice' || column.property === 'retailPrice') {
        // if (index === 4 || index === 5 || index === 12) {
          
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr,flag) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                // if (index === 12) {
                //   return prev + curr
                // } else {
                  // this.logisticsAmount = NP.plus(prev, NP.times(outQuantityList[flag], curr))
                  return NP.plus(prev, NP.times(outQuantityList[flag], curr))



                // }
              } else {
                return prev
              }
            }, 0)
            // if (index !== 12) {
            //   sums[index] = this.priceNum(tempValue)
            // } else {
              sums[index] = tempValue
            // }
          } else {
            sums[index] = ''
          }
        }
        // else if (column.property === 'quantity' || column.property === 'outQuantity') {
        //   const values = data.map(item => Number(item[column.property]))
        //   if (!values.every(value => isNaN(value))) {
        //     const tempValue = values.reduce((prev, curr) => {
        //       const value = Number(curr)
        //       if (!isNaN(value)) {
        //         return prev + curr
        //       } else {
        //         return prev
        //       }
        //     }, 0)
        //     sums[index] = tempValue
        //   } else {
        //     sums[index] = ''
        //   } 
        // }
      })
      if(this.type === 'approval' && this.companyRoleName !='财务'){
        if(sums[7]>=2000){
          storeSum = sums[7]
          logisticsAmount = 0;
        } else {
          logisticsAmount = Number(sums[7]*0.06).toFixed(2);
          storeSum = NP.plus(Number(sums[7]),logisticsAmount)
       } 
      } else
       if(sums[6]>=2000){
          storeSum = sums[6]
          logisticsAmount = 0;
        }else {
          storeSum = sums[6]
         logisticsAmount = Number(sums[6]*0.06).toFixed(2);
         storeSum = NP.plus(Number(sums[6]),logisticsAmount)
       }
      this.logisticsAmount = logisticsAmount;
      this.storeSum = storeSum;
      return sums
    },
    // 审批
    async approval(flag){
      if (this.dataList && this.dataList.length>0 && this.companyRoleName == '销管') {
        if (!flag && !this.form.rejectCause) {
          this.$message.warning('拒绝时审核原因必填！') 
        } else {
          if (!this.checkInfo1(flag) && !this.checkInfo2(flag) && !this.checkInfo3(flag)) {
            const {data} = flag ? await api.checkReqStock({
              id:this.details.id,
              rejectCause:this.form.rejectCause,
              logisticsAmount:this.logisticsAmount*100,
              items:this.dataList.map(ele =>{
                const sname = this.storeList.find(item => item.id == ele.storeId)
                return {
                  ...ele,
                  storeName:sname ? sname.name : '企业总部',
                  quantity: ele.productType == 'BULK' ? ele.quantity * 1000 : ele.quantity,//订货数量
                  stockQuantity: ele.productType == 'BULK' ? ele.stockQuantity * 1000 : ele.stockQuantity,//库存
                  // outQuantity: ele.productType == 'BULK' ? ((ele.outQuantity || ele.quantity) * 1000) : (ele.outQuantity || ele.quantity),//出货数量
                  outQuantity: ele.productType == 'BULK' ? ((ele.quantity || ele.quantity) * 1000) : ele.quantity,//出货数量
                  productCostPrice:this.priceNum(ele.productCostPrice,'out'),
                  wholesalePrice:this.priceNum(ele.wholesalePrice,'out'),
                  retailPrice:this.priceNum(ele.retailPrice,'out')
                }
              })
            }): await api.rejectReqStock({
              id:this.details.id,
              rejectCause:this.form.rejectCause
            })
            if (data.code === 0) {
              this.$message.success(flag?'审核成功':'已拒绝')
              this.visible = false
              this.$emit('refreshDataList', this.getDataList)
            } else {
              this.$message.error(data.msg)
            }
          } 
        }
      }else if (this.dataList && this.dataList.length>0 && this.companyRoleName == '财务') {
        if (!flag && !this.form.rejectCause) {
          this.$message.warning('拒绝时审核原因必填！') 
        } else {
          if (!this.checkInfo1(flag)) {
            const {data} = flag ? await api.checkReqStock({
              id:this.details.id,
              rejectCause:this.form.rejectCause,
              items:this.dataList.map(ele =>{
                const sname = this.storeList.find(item => item.id == ele.storeId)
                return {
                  ...ele,
                  storeName:sname ? sname.name : '企业总部',
                  quantity: ele.productType == 'BULK' ? ele.quantity * 1000 : ele.quantity,//订货数量
                  stockQuantity: ele.productType == 'BULK' ? ele.stockQuantity * 1000 : ele.stockQuantity,//库存
                  // outQuantity: ele.productType == 'BULK' ? ((ele.outQuantity || ele.quantity) * 1000) : (ele.outQuantity || ele.quantity),//出货数量
                  outQuantity: ele.productType == 'BULK' ? ((ele.quantity || ele.quantity) * 1000) : ele.quantity,//出货数量
                  productCostPrice:this.priceNum(ele.productCostPrice,'out'),
                  wholesalePrice:this.priceNum(ele.wholesalePrice,'out'),
                  retailPrice:this.priceNum(ele.retailPrice,'out')
                }
              })
            }): await api.rejectReqStock({
              id:this.details.id,
              rejectCause:this.form.rejectCause
            })
            if (data.code === 0) {
              this.$message.success(flag?'审核成功':'已拒绝')
              this.visible = false
              this.$emit('refreshDataList', this.getDataList)
            } else {
              this.$message.error(data.msg)
            }
          } 
        }
      }else{
        this.$message.warning('审核数据不能为空！') 
      }
    },
  }
}
</script>

<style lang="scss">
.page-approve-modal{
	.out-select{
		margin-left: -40px;
    .el-input--medium .el-input__inner {
      height: 33px;
      line-height: 33px;
      width: 155px;
    }
	}
  .toptitle {
    margin-bottom: 15px;
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    width: 100%;
  }
  .tip{
    margin-right: 20px;
  }
  .stockview .el-dialog__body {
    padding-top: 10px!important;
  }
  .inputs1 input {
    width: 100%!important;
  }
  .el-table__row .inputs1 {
    padding-left: 0!important;
  }
}
</style>

