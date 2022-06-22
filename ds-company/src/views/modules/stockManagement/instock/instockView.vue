<template>
  <el-dialog
    :title="type === 'in' ? '入库' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="stockview">
    <el-form ref="instock-form" class="form-show" label-width="110px">
      <el-form-item label="入库单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="入库时间" v-show="type === 'view'">
        <span class="itemInput">{{details.inStockTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="关联单号">
        <span class="itemInput">{{details.linkOrderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}}/{{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="结算金额" v-if="details.settlement !== 'NOT'">
        <span class="itemInput">{{this.priceNum(details.finishAmount) || '--'}}元</span>
      </el-form-item>
      <el-form-item label="出库单位" v-if="details.outUnitName">
        <span class="itemInput">{{details.outUnitName || '--'}}</span>
      </el-form-item>
      <el-form-item label="联系人" v-if="details.linkman || details.phone">
        <span class="itemInput">{{details.linkman || '--'}}/{{details.phone || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{details.remark || '--'}}</span>
      </el-form-item>
      <!-- <el-form-item label="物流公司" v-if="details.storeReturnStockOrderNo">
        <span class="itemInput">{{details.logisticsCompany || '--'}}</span>
      </el-form-item>
      <el-form-item label="物流单号" v-if="details.storeReturnStockOrderNo">
        <span class="itemInput">{{details.logisticsNumber || '--'}}</span>
      </el-form-item> -->
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      show-summary
      v-if="needRefresh"
      class="all-count-table"
      :summary-method="summary"
      max-height="360"
      style="width: 100%; min-height: 300px;">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
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
        min-width="100"
        :label="details.storeReturnStockOrderNo ? '入库数量' : '采购数量'">
      </el-table-column>
      <el-table-column
        prop="givenQuantity"
        min-width="100"
        label="赠送数量"
        v-if="!details.storeReturnStockOrderNo">
      </el-table-column>
      <el-table-column
        prop="oldPurchasePrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="原进货价"
        v-if="!details.storeReturnStockOrderNo && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.oldPurchasePrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nowPurchasePrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="现进货价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.nowPurchasePrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldWholesalePrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="原配送价"
        v-if="!details.storeReturnStockOrderNo && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.oldWholesalePrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nowWholesalePrice"
        min-width="120"
        :show-overflow-tooltip="true"
        label="现配送价"
        v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.nowWholesalePrice)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="batchNo"
        min-width="120"
        label="商品批次"
        v-if="!details.storeReturnStockOrderNo">
      </el-table-column> -->
    </el-table>
    <span slot="footer" class="dialog-footer" >
      <el-button v-show="type === 'in'" @click="cancel()">取消</el-button>
      <el-button :loading="confirmLoading" type="primary" v-show="type === 'in'" @click="sureInStock(id)">确认入库</el-button>
      <el-button :loading="confirmLoading" type="primary" @click="goPrint(id)">{{type === 'in' ? '入库并打印' : '打印单据'}}</el-button>
      <el-checkbox v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')" style="margin-left: 20px;" v-model="showCostPrice" label="显示进货价"></el-checkbox>
    </span>
    <instockOutput :details="details" :list="dataList" :show="showCostPrice"/>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import instockOutput from './instockOutput'
import printJS from 'print-js'
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
export default {
  data(){
    return{
      type:'',
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      needRefresh:true,
      id: null,
      showCostPrice: false,
      confirmLoading: false
    }
  },
  created () {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  components: {
    instockOutput
  },
  methods:{
    async init(ids, type){
      this.visible = true
      this.showCostPrice = false,
      this.id = ids
      this.type = type
      this.needRefresh = false
      await this.getDataList()
      this.needRefresh = true
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getinStockDetail(this.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = this.details.items.map(item => {
          return {
            ...item,
            buyQuantity: item.productType == 'BULK' ? item.buyQuantity / 1000 : item.buyQuantity,
            givenQuantity: item.productType == 'BULK' ? item.givenQuantity / 1000 : item.givenQuantity
          }
        })
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }

    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const quantityList = data.map(ele => ele.buyQuantity)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (!this.details.storeReturnStockOrderNo) {
          if (index === 7) {
          // if (index === 4 || index === 5 || index === 7) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              const tempValue = values.reduce((prev, curr,flag) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  // if (index === 4 || index === 5) {
                  //   return prev + curr
                  // } else {
                    return NP.plus(prev, NP.times(curr, quantityList[flag]))
                  // }
                } else {
                  return prev
                }
              }, 0)
              // if (index === 4 || index === 5) {
              //   sums[index] = tempValue
              // } else {
                sums[index] = this.priceNum(tempValue)
              // }
            } else {
              sums[index] = ''
            }
          }
        }
        // else{
        //   if (index === 4 || index === 5) {
        //     const values = data.map(item => Number(item[column.property]))
        //     if (!values.every(value => isNaN(value))) {
        //       const tempValue = values.reduce((prev, curr,flag) => {
        //         const value = Number(curr)
        //         if (!isNaN(value)) {
        //           if (index === 4) {
        //             return prev + curr
        //           } else {
        //             return NP.plus(prev, NP.times(curr, quantityList[flag]))
        //           }
        //         } else {
        //           return prev
        //         }
        //       }, 0)
        //       if (index === 4) {
        //         sums[index] = tempValue
        //       } else {
        //         sums[index] = this.priceNum(tempValue)
        //       }
        //     } else {
        //       sums[index] = ''
        //     }
        //   }
        // }

      })
      return sums
    },
    // 入库并打印
    goPrint(id) {
      if (this.type === 'in') {
        this.sureInStock(id, () => {
          document.getElementById('company-instock').style = 'display: block;'
          printJS({printable: 'company-instock', type: 'html', css: './static/print.css'})
          document.getElementById('company-instock').style = 'display: none;'
        })
      } else {
        document.getElementById('company-instock').style = 'display: block;'
        printJS({printable: 'company-instock', type: 'html', css: './static/print.css'})
        document.getElementById('company-instock').style = 'display: none;'
      }

    },
    //取消
    cancel(){
      this.visible = false
    },
    // 确认入库
    async sureInStock(id, cb){
      this.confirmLoading = true
      const { data } = await api.sureinStock(id)
      if (data.code === 0) {
        if (cb) {
          await this.getDataList()
          cb()
        }
        this.$message.success('确认入库成功')
        this.visible = false
        this.$emit('refreshDataList')
      } else {
        this.$message.error(data.msg)
      }
      this.confirmLoading = false
    }
  }
}
</script>

<style scoped>
.toptitle {
  margin: 15px 0;
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
.confirm{
  float: right;
  margin-right: 20px;
}
</style>
