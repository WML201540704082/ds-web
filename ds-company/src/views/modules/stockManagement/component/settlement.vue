<template>
  <el-dialog
    title="入库结算单"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="70%"
    class="dialog-instock-settlement">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      show-summary
      class="all-count-table"
      :summary-method="summary"
      max-height="300"
      style="width: 100%; min-height: 240px;">
      <el-table-column
        prop="index"
        min-width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        min-width="180"
        :show-overflow-tooltip="true"
        label="入库单号">
      </el-table-column>
      <el-table-column
        prop="inStockTime"
        min-width="180"
        :show-overflow-tooltip="true"
        label="入库时间">
      </el-table-column>
      <el-table-column
        prop="returnStoreName"
        min-width="150"
        :show-overflow-tooltip="true"
        label="出库单位">
        <template slot-scope="scope">
          <span>{{scope.row.type === 'PURCHASE' ? scope.row.supplier :
                  scope.row.type === 'REFUND' ? scope.row.returnStoreName : '--'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nowPurchasePriceAmount"
        min-width="120"
        :show-overflow-tooltip="true"
        label="进货价小计">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.nowPurchasePriceAmount) || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="finishAmount"
        min-width="130"
        label="已结金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.finishAmount)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="settlement"
        min-width="130"
        label="结算状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.settlement, setStatus)}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="settleAmount"
        min-width="120"
        label="本次结算金额">
        <template slot-scope="scope">
          <el-input class="inputs1"  v-model="scope.row.settleAmount"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="settlement" :inline="true" class="mode-form-line1" ref="settlement" :rules="setRules" >
      <div class="left">
        <div>
          <span style="font-size: 12px;font-weight: 600;">上传结算凭证</span>
          <span>(最多上传10张)</span>
          <span style="font-size: 12px;font-weight: 600;">：</span>
        </div>
        <el-form-item class="staff-header" prop="picList">
          <gt-image-upload  :names="0" :multiple="true" :max=10 :more-real="settlement.picList" :cb="value => settlement.picList = value" tip="照片大小不超过5M" />
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item label="操作人" prop="operator">
          <el-select
            v-model="settlement.operator"
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
          <el-input type="textarea" v-model="settlement.remark" style="width: 500px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="save(true)">部分结算完成</el-button>
      <el-button type="primary" @click="save(false)">结算完成</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { inStockstatus,setStatus } from '@/utils/dict'
import { validatenull, commissionRange} from '@/utils/validate'
import { filterStatus } from '@/utils'
import { getStaffList } from '@/service/staffManagement'
import { getStore } from '@/utils/storage'
import gtImageUpload from '@/components/gt-image-upload'
export default {
  name:'stockManagement-warehousingList-settlement',
  components:{
    gtImageUpload
  },
  data(){
    return{
      filterStatus,
      inStockstatus,
      setStatus,
      id:null,
      type:'',
      dataList: [],
      operatorList:[],
      details: {},
      dataListLoading: false,
      visible: false,
      settlement:{
        operator:null,
        picList:[],
      },
      setRules:{
        operator:[{required: true, message:'操作人必填',trigger: 'blur'}],
      }
    }
  },
  created(){
    //操作人
    this.getStaffList()
  },
  methods:{
    init(list){
      this.visible = true
      const tempArr = list.filter(o=>{
        return o.settlement != 'FINISH'
      })
      this.dataList = tempArr
    },
    // 自定义合计算法
    summary(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 4 || index === 5 || index === 7) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            const tempValue = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index === 4 || index === 5) {
              sums[index] = this.priceNum(tempValue)
            }else{
              sums[index] = tempValue
            }
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    // 获取操作人-员工列表
    async getStaffList() {
      this.dataListLoading = true
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
        type: 'COMPANY'
      })
      if (data.code === 0) {
        this.operatorList = data.data.records
        const phone = getStore({name: 'company-userName'})
        const operator = this.operatorList.find(ele => ele.phone === phone)
        if (operator) {
          this.settlement.operator = operator
          // this.goodsAdd.operator = operator.name
          // this.goodsAdd.operatorPhone = phone
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
    checkInfo(){
      var flag = false
      for(var i in this.dataList){
        if (this.dataList[i].settleAmount) {
          if (this.dataList[i].settleAmount < 0 || this.dataList[i].settleAmount > 99999.99) {
            this.$message.warning('本次结算金额应在0到99999.99之间')
            flag = false
            break
          } else {
            flag= true
          } 
        }else{
          this.$message.warning('本次结算金额必填！')
          flag=false
        }
      }
      return flag
    },
    //取消
    cancel(){
      this.visible = false
    },
    // 保存 
    async save(flag){
      if (this.dataList && this.dataList.length>0) {
        if (this.checkInfo()) {
          this.$refs['settlement'].validate(async (valid) => {
            if (valid) {
              let records = this.dataList.map(item => {
                return {
                  settleAmount: item.settleAmount*100,
                  companyInStockId: item.id,
                }
              })
              let certificates = this.settlement.picList.map(item =>{
                return {
                  file: item.url,
                  fileName:''
                }
              })
              if (flag) {
                const { data } = await api.settleInStock({
                  records,
                  operatorId: this.settlement.operator ? this.settlement.operator.userId : null,
                  operator: this.settlement.operator ? this.settlement.operator.name : null,
                  operatorPhone: this.settlement.operator ? this.settlement.operator.phone : null,
                  remark:this.settlement.remark,
                  certificates,
                  })
                if(data.code == 0){
                  this.visible = false
                  this.$emit('refreshDataList')
                }else{
                  this.$message.error(data.msg)
                }                
              }else{
                this.$easyConfirm.show({
                  title: '提示',
                  content: '结算完成后，该结算单包含的所有入库单的结算状态均会变为“结算完成”，且不可再次发起结算。您确认结算完成吗？',
                  confirm: async () => {
                    const { data } = await api.fullSettleInStock({
                      records,
                      operatorId: this.settlement.operator ? this.settlement.operator.userId : null,
                      operator: this.settlement.operator ? this.settlement.operator.name : null,
                      operatorPhone: this.settlement.operator ? this.settlement.operator.phone : null,
                      remark:this.settlement.remark,
                      certificates,
                      })
                    if(data.code == 0){
                      this.visible = false
                      this.$easyConfirm.hide()
                      this.$emit('refreshDataList')
                    }else{
                      this.$message.error(data.msg)
                    }
                  }
                })                
              }
            }
          })
        }
      }else{
        this.$message.warning('请先选择结算单')
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-instock-settlement{
  .toptitle {
    margin-bottom: 15px;
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    margin-right: 50px;
  }
  .stockview .el-dialog__body {
    padding-top: 10px!important;
  }
  .inputs1 {
    .el-input__inner{
      width: 100%!important;
    }
  }
  .el-table__row .inputs1 {
    padding-left: 0!important;
  }
  .left{
    width:100%;
    overflow:auto;
  }
  .right{
    width:100%;
    overflow:auto;
  }
}
</style>

