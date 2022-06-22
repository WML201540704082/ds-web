<template>
  <el-dialog
    :title="flag === 'view' ? '查看' : '出库'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="outgoingView">
    <el-form ref="outgoing-form" class="form-show" label-width="110px">
      <el-form-item label="出库单号">
        <span class="itemInput">{{outgoing.orderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="出库类型">
        <span class="itemInput">{{outgoing.outType == 'WHOLESALE' ? '配送出库' :
                                  outgoing.outType === 'WHOLESALES' ? '配送出库(订货)' :
                                  outgoing.outType === 'OTHER' ? '其他出库' : '采购退货'}}</span>
      </el-form-item>
      <el-form-item label="关联单号">
        <span class="itemInput">{{outgoing.linkOrderNo || '--'}}</span>
      </el-form-item>
      <el-form-item label="操作人/审核人">
        <span class="itemInput">{{`${outgoing.operator || '--'}/${outgoing.operatorPhone || '--'}`}}</span>
      </el-form-item>
      <el-form-item label="出库人">
        <span class="itemInput">{{`${outgoing.outStockEmployeeName || '--'}/${outgoing.outStockUser || '--'}`}}</span>
      </el-form-item>
      <el-form-item label="收货单位">
        <span class="itemInput">{{ outgoing.storeName || '--'}}</span>
      </el-form-item>
      <el-form-item label="物流公司" v-if="outgoing.outType === 'WHOLESALES' && flag == 'view' && newStore=='true'">
        <span class="itemInput">{{outgoing.logisticsCompany || '--'}}</span>
      </el-form-item>
      <el-form-item label="物流单号" v-if="outgoing.outType === 'WHOLESALES'&& flag == 'view' && newStore=='true'" >
        <span class="itemInput">{{outgoing.logisticsNumber || '--'}}</span>
      </el-form-item>
      <!--el-form-item label="物流公司" v-if="outgoing.outType === 'WHOLESALES' && flag != 'view'" prop="logisticsCompany" >
          <el-input v-model="outgoing.logisticsCompany" placeholder="请输入物流公司名称" ></el-input>
        </el-form-item>
        <el-form-item label="物流单号" v-if="outgoing.outType === 'WHOLESALES' && flag != 'view'" prop="logisticsNumber" >
          <el-input v-model="outgoing.logisticsNumber" placeholder="请输入物流单号" ></el-input>
        </el-form-item-->
      <el-form-item label="备注">
        <span class="itemInput">{{outgoing.remark || '--'}}</span>
      </el-form-item>
    </el-form>
    <!-- table列表 -->
    <div class="mode-store-table">
      <el-table
        :data="outgoing.items"
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
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
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
          v-if="newStore=='true'"
          prop="jdyCode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="精斗云编码">
        </el-table-column>
        <el-table-column
          prop="packingType"
          min-with="100"
          :show-overflow-tooltip="true"
          label="包装单位"
          v-if="newStore == 'true'">
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          min-width="100"
          label="成本价"
          v-if="newStore == 'false'">
          <template slot-scope="scope">
            <span v-if="outgoing.linkOrderNo && (outgoing.outType == 'WHOLESALE')">{{Number(priceNum(scope.row.productCostPrice)).toFixed(2)}}</span>
            <span v-else>{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wholesalePrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="配送价"
          v-if="newStore == 'false'">
          <template slot-scope="scope">
            <span v-if="scope.row.wholesalePrice !== null">{{Number(priceNum(scope.row.wholesalePrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="零售价"
          v-if="newStore == 'false'">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
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
        <!--el-table-column
          prop="nowStockQuantity"
          min-with="100"
          :show-overflow-tooltip="true"
          label="库存数量">
           <template slot-scope="scope">
            <span>
              {{ scope.row.nowStockQuantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column-->
        <el-table-column
          prop="quantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="出库数量">
          <template slot-scope="scope">
            <span>
              {{ scope.row.quantity }}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="150"
          :show-overflow-tooltip="true"
          label="备注"
          v-if="outgoing.outType === 'WHOLESALES'">
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="toptitle" >
      <span class="tip">合计数量：{{outgoing.amount || '--'}}</span>
      <span class="tip">合计成本价：{{priceNum(outgoing.costPriceAmount) || '--'}}</span>
      <span class="tip">合计零售价：{{priceNum(outgoing.retailPriceAmount) || '--'}}</span>
    </div> -->
    <div class="logistic">
      <el-form  ref="outgoing-logistics-form" label-width="110px" :rules="dataFormRules" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="flag === 'out'&& outgoing.outType === 'WHOLESALES'&& newStore=='true'"  label="物流公司" prop="logisticsCompany">
              <el-select v-model="form.logisticsCompany" placeholder="请输入物流公司">
                <el-option
                  v-for="item in logisticsComapny"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="flag === 'out'&& outgoing.outType === 'WHOLESALES'&& newStore=='true'"  label="物流单号" prop="logisticsNumber">
              <el-input v-model="form.logisticsNumber" placeholder="请输入物流单号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" >
      <el-button v-if="flag === 'out'" @click="visible = false">取消</el-button>
      <el-button :loading="confirmLoading" v-if="flag === 'out'" type="primary" @click="dataFormSubmit()">确认出库</el-button>
      <el-button :loading="confirmLoading" type="primary" @click="goPrint">{{flag === 'out' ? '出库并打印' : '打印单据'}}</el-button>
      <el-checkbox v-if="newStore == 'false'" style="margin-left: 20px;" v-model="showWholesalePrice" label="显示配送价"></el-checkbox>
    </span>
    <outstock-output :details="outgoing" :show="showWholesalePrice" />
  </el-dialog>
</template>

<script>
import { getOutgoingDetail,doOutgoing } from '@/service/stock'
import { logisticsComapny } from '@/utils/dict'
import moment from 'moment'
import outstockOutput from './outstockOutput'
import printJS from 'print-js'
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
export default {
  data () {
    return {
      flag:'',
      id: '',
      visible: false,
      outgoing: {
        items: []
      },
      logisticsComapny,
      form: {
        logisticsCompany: null,
        logisticsNumber: null
      },
      dataFormRules: {
         logisticsCompany: [{required: true, message: '请填写物流信息', trigger: 'blur'}],
         logisticsNumber: [{required: true, message: '请填写物流单号',  trigger: 'blur'}]
      },
      moment,
      showWholesalePrice: false,
      confirmLoading: false,
      dataListLoading: false
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
    outstockOutput
  },
  methods: {
    init(id, batchNumber,flag){
      this.visible = true
      this.showWholesalePrice = false,
      this.id = id
      this.flag = flag
      if(this.isAuth('company:outStock:detail')){
        this.getDetail()
      }
      if (flag === 'out') {
        this.$nextTick(() => {
          this.$refs['outgoing-logistics-form'].resetFields()
        })
      }
    },
    // 出库并打印
    goPrint() {
      if (this.flag === 'out') {
        this.dataFormSubmit(() => {
          document.getElementById('company-outstock').style = 'display: block;'
          printJS({printable: 'company-outstock',  type: 'html', css: './static/print.css'})
          document.getElementById('company-outstock').style = 'display: none;'
        })
      } else {
        document.getElementById('company-outstock').style = 'display: block;'
        printJS({printable: 'company-outstock',  type: 'html', css: './static/print.css'})
        document.getElementById('company-outstock').style = 'display: none;'
      }
    },
    // 获取数据列表
    async getDetail() {
      this.dataListLoading = true
      const { data } = await getOutgoingDetail({
        id:this.id,
        withCurrentStock:false
      })
      if (data.code === 0) {
        this.outgoing = data.data
        this.outgoing.items = this.outgoing.items.map(item => {
          return{
            ...item,
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,//出库数量
            nowStockQuantity: item.productType == 'BULK' ? item.nowStockQuantity / 1000 : item.nowStockQuantity,//可用库存
          }
        })
        // console.log(this.outgoing);
      } else {
        this.outgoing = {
          items: []
        },
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      const quantityList = data.map(ele => ele.quantity)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 5) {
        // if (index === 4 || index === 5 || index === 10) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr,flag) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                // if (index === 4 || index === 5) {
                  return NP.plus(prev, NP.times(curr, quantityList[flag]))
                // } else {
                //   return prev + curr
                // }
              } else {
                return prev
              }
            }, 0)
            // if (index === 4 || index === 5) {
              sums[index] = this.priceNum(tempValue)
            // } else {
            //   sums[index] = tempValue
            // }
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    dataFormSubmit(cb) {
      this.$refs['outgoing-logistics-form'].validate(async (valid) => {
        console.log( this.$refs['outgoing-logistics-form'])
        if (valid) {
          this.confirmLoading = true

          const { data } = await doOutgoing({
            id: this.id,
            logisticsCompany: this.form.logisticsCompany,
            logisticsNumber: this.form.logisticsNumber
          })
          if(data.code === 0){
            if (cb) {
              await this.getDetail(this.id)
              cb()
            }
            this.visible = false
            this.$emit('refreshDataList')

          }else{
            this.$message.error(data.msg)
          }
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.outgoingView{
  .toptitle {
    margin: 15px 0;
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    width: 100%;
  }
  .tip{
    display: inline;
    margin-right: 50px;
  }
  .logistic{
    margin-top: 20px;
    margin-bottom: -25px
  }
}
</style>
