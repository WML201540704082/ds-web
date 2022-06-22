<template>
  <el-dialog
    title="入库结算单"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="70%"
    class="dailog-instock-settle">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
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
        prop="status"
        min-width="100"
        :show-overflow-tooltip="true"
        label="入库状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, inStockstatus)}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="settlementAmount"
        min-width="130"
        :show-overflow-tooltip="true"
        label="结算金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.settlementAmount)}}</span>
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
        prop="leftAmount"
        min-width="100"
        label="待结金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.leftAmount)}}</span>
        </template>
      </el-table-column>
        <el-table-column
          prop="settleAmount"
          min-width="120"
          label="本次结算金额">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model.number="scope.row.settleAmount"></el-input>
          </template>
        </el-table-column>
      <el-table-column
        prop="settlement"
        min-width="100"
        label="结算状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.settlement, setStatus)}}</span>
          </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '@/service/stock'
import { inStockstatus,setStatus } from '@/utils/dict'
import { validatenull, commissionRange} from '@/utils/validate'
import { filterStatus } from '@/utils'
export default {
  data(){
    return{
      filterStatus,
      inStockstatus,
      setStatus,
      id:null,
      type:'',
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
    }
  },
  methods:{
    init(list){
      this.visible = true
      const tempArr = list.filter(o=>{
        return o.settlement != 'FINISH'
      })
      this.dataList = tempArr
    },
    checkInfo(){
      var flag = false
      for(var i in this.dataList){
        if (!commissionRange(this.dataList[i].settleAmount, this.priceNum(this.dataList[i].leftAmount), 'normal')) {
          this.$message.warning('本次结算金额不可大于待结算金额，最多保留小数点后两位')
          flag = false
          break
        } else {
          flag= true
        }
      }
      return flag
    },
    //取消
    cancel(){
      this.visible = false
    },
    // 保存
    async save(){
      if (this.dataList && this.dataList.length>0) {
        if (this.checkInfo()) {
          let form = this.dataList.map(item => {
            return {
              settleAmount: this.priceNum(item.settleAmount, 'out'),
              storeInStockId: item.id,
            }
          })
          console.log(form)
          const { data } = await api.settleInStock(form)
          if(data.code == 0){
            this.visible = false
            this.$emit('refreshDataList')
            this.$message.success('结算成功')
          }else{
            this.$message.error(data.msg)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.dailog-instock-settle{
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
  .inputs1{
    .el-input__inner{
      width: 100%!important;
    }
  }
  .el-table__row .inputs1 {
    padding-left: 0!important;
  }
  .confirm{
    float: right;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>

