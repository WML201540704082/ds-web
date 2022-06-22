<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="pageType == 'create' ? '出库' : '查看物流信息'"
    :visible.sync="visible"
    width="70%"
    append-to-body>
    <div class="toptitle">
			<span class="tip">出库单号：{{details.orderNo}}</span>
			<span class="tip">订货单号：{{details.reqStockOrderNo || '--'}}</span>
      <span class="tip">审核人：{{details.name || '--'}}/{{details.phone || '--'}}</span>
      <span class="tip">审核时间：{{moment(details.groupBuyBeginTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}</span>
      <span class="tip">收货单位：{{details.storeName}}</span>
      <!-- <span class="tip">活动名称：{{details.activityName}}</span>
			<span class="tip">活动时间：{{moment(details.groupBuyBeginTime).format('YYYY-MM-DD HH:mm:ss')}} - {{moment(details.groupBuyEndTime).format('YYYY-MM-DD HH:mm:ss')}}</span> -->
    </div>
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
      <!-- <el-table-column
        prop="productCode"
          width="220"
        :show-overflow-tooltip="true"
        label="商品代码">
      </el-table-column> -->
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
        width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
			<el-table-column
				prop="costPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="成本价">
			</el-table-column>
			<el-table-column
				prop="retailPrice"
				min-width="100"
				:show-overflow-tooltip="true"
				label="零售价">
			</el-table-column>
			<el-table-column
				prop="firstCategory"
				min-width="100"
				:show-overflow-tooltip="true"
				label="一级分类">
			</el-table-column>
			<el-table-column
				prop="category"
				min-width="100"
				:show-overflow-tooltip="true"
				label="二级分类">
			</el-table-column>
      <el-table-column
        prop="outQuantity"
        min-width="100"
        label="出库数量">
      </el-table-column>
    </el-table>
    <div v-if="pageType === 'create'">
      <el-form ref="outgoing-logistics-form" label-width="110px" :rules="dataFormRules" :model="form">
        <!-- <el-form-item label="物流公司" prop="logisticsCompany">
          <el-select v-model="form.logisticsCompany" placeholder="请输入物流公司">
            <el-option
              v-for="item in logisticsComapny"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input v-model="form.logisticsNumber" placeholder="请输入物流单号"></el-input>
        </el-form-item> -->
      </el-form>
    </div>

    <div v-else>
      <!-- <el-form label-width="110px">
        <el-form-item label="物流公司">
          <span class="itemInput">{{form.logisticsCompany}}</span>
        </el-form-item>
        <el-form-item label="物流单号">
          <span class="itemInput">{{form.logisticsNumber}}</span>
        </el-form-item>
      </el-form> -->
    </div>
    <span v-if="pageType === 'create'" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确认出库</el-button>
    </span>
    <span v-else slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getOutgoingDetail, doOutgoing } from '@/service/stock'
import * as api from '@/service/stock'
import moment from 'moment'
import { logisticsComapny } from '@/utils/dict'
export default {
  data() {
    return {
      id: '',
      visible: false,
      dataList: [],
      moment,
      dataListLoading: false,
      details:{},
      pageType: 'create',
      logisticsComapny,
      form: {
        logisticsCompany: null,
        logisticsNumber: null
      },
      dataFormRules: {
        // logisticsCompany: [{required: true, message: '请填写物流信息', trigger: 'blur'}],
        // logisticsNumber: [{required: true, message: '请填写物流单号',  trigger: 'blur'}]
      }
    }
  },
  methods: {
    init(record) {
      const { id, status, logisticsCompany, logisticsNumber } = record
      this.id = id
      this.pageType = status === 'CHECK_FINISH' ? 'create' : 'view'
      this.visible = true
      if (this.pageType === 'create') {
        this.$nextTick(() => {
          this.$refs['outgoing-logistics-form'].resetFields()
        })
      } else {
        this.form.logisticsCompany = logisticsCompany,
        this.form.logisticsNumber = logisticsNumber
      }
      this.getDataList(id)
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await api.getReqStockDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.details = data.data
        this.dataList = data.data.items
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    dataFormSubmit() {
      this.$refs['outgoing-logistics-form'].validate(async (valid) => {
        if (valid) {
          const { data } = await doOutgoing({
            id: this.id,
            logisticsCompany: this.form.logisticsCompany,
            logisticsNumber: this.form.logisticsNumber
          })
          if(data.code === 0){
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }

        }
      })
    }
  }
}
</script>
<style>
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
</style>
