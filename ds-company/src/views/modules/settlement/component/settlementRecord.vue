<template>
  <el-dialog
    title="入库单结算记录"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="80%"
    class="settlementRecord">
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
        prop="companyInStock.orderNo"
        min-width="180"
        :show-overflow-tooltip="true"
        label="入库单号">
      </el-table-column>
      <el-table-column
        prop="companyInStock.createTime"
        min-width="180"
        :show-overflow-tooltip="true"
        label="入库时间">
      </el-table-column>
      <el-table-column
        prop="companyInStock.supplier"
        min-width="100"
        :show-overflow-tooltip="true"
        label="供应商">
      </el-table-column>
      <el-table-column
        prop="companyInStock.returnStoreName"
        min-width="150"
        :show-overflow-tooltip="true"
        label="退货单位">
        <template slot-scope="scope">
          <span>{{ scope.row.companyInStock.returnStoreName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyInStock.nowPurchasePriceAmount"
        min-width="100"
        :show-overflow-tooltip="true"
        label="进货价小计">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.companyInStock.nowPurchasePriceAmount) || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="finishAmount"
        min-width="100"
        label="已结金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.finishAmount)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        min-width="100"
        label="结算状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, setStatus)}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="settleAmount"
        min-width="120"
        label="本次结算金额">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.settleAmount)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="settlementRecord" class="form-show" label-width="110px">
      <div class="left"  v-if="details.certificates&&details.certificates.length>0">
        <div>
          <span style="font-size: 12px;font-weight: 600;">结算凭证</span>
        </div>
          <!-- <el-form-item v-for="(item, index) in details.certificates" :key="index" prop="picList" class="view-img" @click="openImgPic('innerPic',item.file)">
            <span class="itemInput">
              <img v-if="typeof item === 'string'" class="header-img" :src="'https://' + item.file" alt="图片"/>
              <img v-else class="header-img" :src="'https://' + item.file" alt="图片"/>
            </span>
          </el-form-item> -->
          <span class="view-img">
            <img v-for='(item, index) in details.certificates' :key="index" :src="'https://'+item.file" alt="" @click="openImgPic('innerPic',item.file)">
          </span>
          <!-- <span v-else class="itemInput">--</span> -->
      </div>
      <div class="right">
        <el-form-item label="操作人" prop="operator">
          <span class="itemInput">{{details.operator || '--'}}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="right_right">
          <span class="itemInput">{{details.remark || '--'}}</span>
        </el-form-item>
      </div>
    </el-form>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </el-dialog>
</template>
<script>
import * as api from '@/service/setting'
import NP from 'number-precision'
import { filterStatus } from '@/utils'
import { setStatus } from '@/utils/dict'
export default {
  data(){
    return{
      dataList: [],
      details: {},
      dataListLoading: false,
      visible: false,
      id: null,
      filterStatus,
      setStatus,
      showImgPic: null,
    }
  },
  components: {
    
  },
  methods:{
    init(id){
      this.visible = true
      this.id = id
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getSettleBillDetail(this.id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = data.data.records
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }

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
              sums[index] = this.priceNum(tempValue)
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.settlementRecord[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
  }
}
</script>

<style lang="scss">
.settlementRecord{
  .left{
    width:100%;
    overflow:auto;
  }
  .right{
    margin-left: -50px;
    margin-top: 10px;
    width:100%;
    overflow:auto;
    .right_right{
      display:inline-block;
      width: 100%;
    }
  }
  .view-img img{
    margin-top: 10px;
    width: 150px;
    height: 150px;
    border-radius: 5px;
    float: left;
    margin-right: 15px;
  }
  // .remark-view{
  //   width: 10px;
  //   height: 10px; 
  // }
}
</style>
