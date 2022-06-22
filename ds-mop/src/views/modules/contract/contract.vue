<template>
    <div class="mod-store mop_company_shortmessage">
        <el-card>
            <!-- 查询条件 -->
            <el-form :model="contract" :inline="true" :link="true" ref="contract" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
                <el-form-item label="企业名称" prop='companyId'>
                    <el-select v-model="contract.companyId" placeholder="请选择企业" clearable>
                        <el-option  label="全部" value="" ></el-option>
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售姓名" prop='salerName'>
                    <el-input v-model="contract.salerName" placeholder="请输入销售姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="合同来源" prop='contractOrigin'>
                    <el-select v-model="contract.contractOrigin" placeholder="请选择合同来源" clearable>
                        <el-option  label="全部" value="" ></el-option>
                        <el-option
                            v-for="item in contractOriginList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠类型" prop='discountType'>
                    <el-select v-model="contract.discountType" placeholder="请选择优惠类型" clearable>
                        <el-option  label="全部" value="" ></el-option>
                        <el-option
                            v-for="item in offerTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同/订单状态" prop='contractState'>
                    <el-select v-model="contract.contractState" placeholder="请选择合同/订单状态" clearable>
                        <el-option  label="全部" value="" ></el-option>
                        <el-option
                            v-for="item in contractStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约时间">
                    <gt-time-range
                        start-time-prop="signStartTime"
                        :start-time-value="contract.signStartTime"
                        :end-time-value="contract.signEndTime"
                        end-time-prop="signEndTime"
                        @changeStartValue="value => contract.signStartTime = value"
                        @changeEndValue="value => contract.signEndTime = value">
                    </gt-time-range>
                </el-form-item>
                <el-form-item style="display: inline-block;float: right;">
                    <gt-button type="search" @click.native="resetForm('search')"/>
                    <gt-button type="reset" @click.native="resetForm('reset')"/>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- table列表 -->
        <el-card class="mode-store-table">
            <span class="info">
                <span>企业:{{info.companys}}家</span>
                <span>合同金额:{{info.contractAllMoney}}</span>
                <span>实付总额:{{info.acturePayMoney}}</span>
            </span>
            <gt-button type="export" @click.native="() => exportExcel()"/>
            <el-table
                :data="dataList"
                border
                v-loading="dataListLoading"
                :stripe="true"
                v-table-height
                style="width: 100%;">
                <el-table-column
                    prop="index"
                    width="55"
                    label="序号">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="100"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button class="nopadding" type="text" size="small" @click="contractViewOrAuditHandle(scope.row.id)">查看</el-button>
                        <span v-if="scope.row.state === 'UN_AUDIT'">|</span>
                        <el-button v-if="scope.row.state === 'UN_AUDIT'" class="nopadding" type="text" size="small" @click="contractViewOrAuditHandle(scope.row.id)">审核</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="contractOrigin"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="合同来源">
                    <template slot-scope="scope">
                        <span>{{scope.row.contractOrigin === '线下销售' ? '线下销售' : '线上订阅'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="contractNo"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="合同编号">
                </el-table-column>
                <el-table-column
                    prop="signCity"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="签约城市">
                </el-table-column>
                <el-table-column
                    prop="salerName"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="销售姓名">
                </el-table-column>
                <el-table-column
                    prop="enterpriseNo"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="企业编号">
                </el-table-column>
                <el-table-column
                    prop="enterpriseName"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="企业名称">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="所在省">
                </el-table-column>
                <el-table-column
                    prop="position"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="所在城市">
                </el-table-column>
                <el-table-column
                    prop="contractMoney"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="合同金额">
                </el-table-column>
                <el-table-column
                    prop="actualPay"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="实付金额">
                </el-table-column>
                <el-table-column
                    prop="payWay"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="支付方式">
                    <template slot-scope="scope">
                        <span>{{scope.row.payWay === 'ALIPAY' ? '支付宝' :
                                scope.row.payWay === 'WECHAT' ? '微信' :
                                scope.row.payWay === 'CASH' ? '现金' :
                                scope.row.payWay === 'CARD' ? '储蓄卡' :'其他'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discountMoney"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="优惠金额">
                </el-table-column>
                <el-table-column
                    prop="signDate"
                    min-width="120"
                    :show-overflow-tooltip="true"
                    label="签约/下单时间">
                </el-table-column>
                <el-table-column
                    prop="state"
                    min-width="120"
                    :show-overflow-tooltip="true"
                    label="合同/订单状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.state === 'DRAFT' ? '草稿' :
                                scope.row.state === 'UN_AUDIT' ? '未审核' :
                                scope.row.state === 'APPROVAL' ? '审核通过' :'驳回'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <gt-pagination :isorder="1" :total="totalPages" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
        </el-card>
    </div>
</template>

<script>
import { contractStatusList,contractOriginList } from '@/utils/dict'
import { fileDownload } from '@/utils'
import gtButton from '@/components/gt-button'
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
import { getContractList,getCompanyList } from '@/service/contract'
import * as api from '@/service/contract'
export default {
  data(){
    return{
      contractOriginList,
      offerTypeList:[],
      contractStatusList,
      info: {},

      companyList:[],
      dataList: [],
      dataListLoading: false,
      totalPages: 0,
      pageSize: 20,
      currentPage: 0,
      contract:{},
      companyId:[],//企业名称
    }
  },
  components: {
    gtPagination,gtTimeRange,gtButton
  },
  created () {
    this.getDataList(),
    this.getCompanyList()
    this.countAll()
    // this.init()
  },
  methods:{
    // 获取统计数据
    async countAll(){
      const data = await this.$http({
        url: this.$http.adornUrl('/cm/contract/statics',true),
        method: 'post',
        data: this.$http.adornData(data)
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          this.info = data.data
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getContractList({
        ...this.contract,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.content
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 获取企业下拉列表
    async getCompanyList() {
      const { data } = await getCompanyList({
        pageSize:10000,
        currentPage: 1
      })
      if (data.code === 0) {
        this.companyList = data.data.records
      } else {
        this.companyList = []
        this.$message.error('获取企业列表失败')
      }
    },
    // 工作人员业绩导出
    async exportExcel() {
      // const { data, headers } = await api.exportExcel({
      //     ...this.staff,
      //     page: this.currentPage,
      //     size: this.pageSize
      // })
      // fileDownload(data, '员工业绩.xls')
    },
    // 查看/审核
    contractViewOrAuditHandle (id){
      this.$router.push({name:'contract-view-or-audit',query:{id}})
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['contract'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
    .info {
        margin-bottom: 10px;
        float: left;
        span {
            margin-right: 5px;
        }
    }
</style>
