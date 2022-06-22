<template>
  <el-dialog
    :title="type === 'in' ? '入库' : '查看'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="stockview">
    <el-form ref="instock-form" class="form-show" label-width="110px">
      <el-form-item label="入库商品归属" v-if="details.ownership">
        <span class="itemInput">{{filterStatus(details.ownership, goodsBelonging)}}</span>
      </el-form-item>
      <el-form-item label="入库单号">
        <span class="itemInput">{{details.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="入库时间" v-show="type === 'view'">
        <span class="itemInput">{{details.inStockTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人">
        <span class="itemInput">{{details.operator || '--'}}/{{details.operatorPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="出库单位" v-if="details.outName">
        <span class="itemInput">{{details.outName || '--'}}</span>
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
        prop="costPrice"
        min-width="100"
        label="成本价"
        v-if="storeRoleName === '店长' && hasAuthorization">
        <template slot-scope="scope">
          <span v-if="scope.row.costPrice !== null">{{ priceNum(scope.row.costPrice)}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="retailPrice"
        min-width="100"
        :show-overflow-tooltip="true"
        label="零售价">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.retailPrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="category1Name"
        min-width="100"
        label="一级分类">
      </el-table-column>
      <el-table-column
        prop="category2Name"
        min-width="100"
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
        label="入库数量">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" >
      <el-button v-show="type === 'in'" @click="cancel()">取消</el-button>
      <el-button :loading="confirmLoading" type="primary" v-show="type === 'in'" @click="sureInStock(id)">确认入库</el-button>
      <el-button :loading="confirmLoading" type="primary" @click="goPrint(id)">{{type === 'in' ? '入库并打印' : '打印单据'}}</el-button>
      <!-- <el-checkbox style="margin-left: 20px;" v-model="showCostPrice" label="显示成本价"></el-checkbox> -->
    </span>
    <instockOutput :details="details" :list="dataList" :show="showCostPrice"/>
  </el-dialog>
</template>
<script>
import { goodsBelonging } from '@/utils/dict'
import { filterStatus } from '@/utils'
import * as api from '@/service/stock'
import instockOutput from './instockOutput'
import printJS from 'print-js'
import NP from 'number-precision'
export default {
  data(){
    return{
      type:'',
      storeRoleName: '',
      hasAuthorization: false,
      goodsBelonging,
      filterStatus,
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null,
      confirmLoading: false,
      showCostPrice: false
    }
  },
  created(){
    const { storeRoleName = '', hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
  },
  components: {
    instockOutput
  },
  methods:{
    init(ids, type){
      this.visible = true
      this.id = ids
      this.showCostPrice = false
      this.type = type
      this.getDataList()
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
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//入库数量
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
      const quantityList = data.map(ele => ele.quantity || 0)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property === 'costPrice' || column.property === 'retailPrice') {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr,flag) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return NP.plus(prev, NP.times(curr, quantityList[flag]))
              } else {
                return prev
              }
            }, 0)
            sums[index] = this.priceNum(tempValue)
          } else {
            sums[index] = ''
          }
        } 
        // else if (column.property === 'quantity') {
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
      return sums
    },
    // 入库并打印
    goPrint(id) {
      if (this.type === 'in') {
        this.sureInStock(id, () => {
          document.getElementById('store-instock').style = 'display: block;'
          printJS({printable: 'store-instock', type: 'html', css: './static/print.css'})
          document.getElementById('store-instock').style = 'display: none;'
        })
      } else {
        document.getElementById('store-instock').style = 'display: block;'
        printJS({printable: 'store-instock', type: 'html', css: './static/print.css'})
        document.getElementById('store-instock').style = 'display: none;'
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

