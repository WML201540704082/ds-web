<template>
  <div class="mod-store customers">
      <el-form label-width="100px"  :model="goodsAdd" inline='true' ref="goodsAdd" :rules="stockRules">
          <el-card style="margin-bottom: 10px;">
         <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="goodsAdd.storeId" filterable placeholder="请选择门店" clearable>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="goodsAdd.start"
            :end-time-value="goodsAdd.end"
            end-time-prop="end"
            valueFormat="yyyy-MM-dd"
            type="date"
            @changeStartValue="value => goodsAdd.start = value"
            @changeEndValue="value => goodsAdd.end = value"
          ></gt-time-range>
        </el-form-item>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global"  @click.native="QueryList">查询</el-button>
        </span>
        </el-card>
       <el-card style="margin-bottom: 10px;">
        <el-form-item label="总销售额  " prop="sale">
          <el-input type="text" :disabled="true" v-model="sale" style="width: 180px;" autosize placeholder="工作台的销售额"></el-input>
        </el-form-item>
        <el-form-item label="富有收款" prop="transactionAmount">
          <el-input type="text" :disabled="true" v-model="transactionAmount" style="width: 180px;" autosize placeholder="富友实收金额"></el-input>
        </el-form-item>
        <el-form-item label="富有结算" prop="settlementAmount">
          <el-input type="text" :disabled="true" v-model="settlementAmount" style="width: 180px;" autosize placeholder="富友结算金额"></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="operator" >
          <el-select
            v-model="goodsAdd.operator"
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
       </el-card>
       <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
        <el-form-item label="财务结算金额" prop="financialSettlementAmount" style="display: block !important">
          <el-input type="text"   v-model="goodsAdd.financialSettlementAmount" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item label="上传凭证" prop="certificates" style="display: block !important">
          <gt-image-upload :names="4" :multiple="true" :max=3 :more-real="imgList" tip="（单张大小不超过5M，最多3张）"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input  type="textarea" v-model="goodsAdd.remark" style="width: 300px;" :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
        </el-form-item>
         <div class="alter_input_inner"> 
        <span style="text-align: center;display:block;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleUpdate">保存</el-button>
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="handleSave">保存并审核</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
         </div>
       </el-card>
    </el-form>
  </div>
</template>
<script>
import gtImageUpload from '@/components/gt-image-upload'
import gtTimeRange from "@/components/gt-time-range";
import { getStoreList } from '@/service/systore'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import { commissionRange,limitInputName,priceRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import { getUserInfoData } from '@/service/setinfo'
export default {
  name:'stockManagement-requiredAdd',
  data(){
    const validateDec = (rule, value, callback) => {
      if (!priceRange(value, 9999999999, 0)) {
        callback(new Error('请输入0-9999999999的数字，最多保留小数点后两位'))
      } else{
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,100) == 1) {
        callback(new Error('备注不能超过50个汉字'))
      } else{
        callback()
      }
    }
    return{
      gtType:false,
      type:null,
      start: null,
      end: null,
      storeNameAcc:null,
      storeId:null,
      financialSettlementAmount:'',
      settlementAmount:null,
      sale:null,
      transactionAmount:null,
      imgList:[], //暂存图
      innerPic: null,
      storeStatementSaleVO:[],
      NP,
      dataListLoading: false,
      storeRoleName: '',
      hasAuthorization: false,
      dataList:[],
      stockList:[],
      storeList:[],
      editTable:[],
      operatorList:[],
      selectedList: [],
      goodsAdd:{
          financialSettlementAmount:null,
          start: null,
          end: null,
          storeId:'',
           operator:null,
      },
      bindAdd:'',
      stockRules:{
        remark:[{validator: validateName, trigger: 'blur'}],
        operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
        storeId:[{required: true, message: '门店名称必填',trigger: 'blur'}],
        financialSettlementAmount:[{required: true, message: '财务结算金额必填'},{validator: validateDec, trigger: 'blur'}],
        start:[{required: true, message: '开始时间',trigger: 'blur'}],
        end:[{required: true, message: '结束时间',trigger: 'blur'}],
      }
    }
  },
  components: {
      gtTimeRange,gtImageUpload
  },
  created(){
   const { id } = this.$route.query
    // 获取详情
    if (id) {
      this.id = id
      this.updateFinance(id)
    }
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    //操作人
    this.getStaffList()
    //获取userName
    this.detail()
  },

  methods:{
      //保存已审核
    async handleSave(){
        this.$easyConfirm.show({
        title: '提示',
        content: '“您确定要审核单据吗”',
        confirm:() => {
              this.gtType=true
              this.handleUpdate()
              this.$easyConfirm.hide()
            }
        })
    },
    //编辑
    async updateFinance(id){
     const { data } = await api.viewFinance(id)
     debugger
      this.goodsAdd = {
        ...this.goodsAdd,
      }
      if(data.code == 0){
        this.details = data
        this.settlementAmount=this.priceNum(data.data.settlementAmount),
        this.sale=this.priceNum(data.data.sale),
        this.transactionAmount=this.priceNum(data.data.transactionAmount),
        this.storeNameAcc=data.data.storeNameAcc,
        this.imgList=data.data.certificates ? data.data.certificates.split(',').map(item => ({url:item})) : []
        this.goodsAdd = {
          ...data.data,
          financialSettlementAmount:this.priceNum(data.data.financialSettlementAmount),
          remark:data.data.remark,
          end:data.data.end,
          start:data.data.start,
          operator:data.data.operator,
          storeId:data.data.storeId,
        }
      }else{
        this.$message.error(data.msg)
      }
    },
    //查询
    async QueryList(){
      this.dataListLoading = true;
      const { data } = await api.getQureyList({
          start:this.goodsAdd.start,
          end:this.goodsAdd.end,
          storeId:this.goodsAdd.storeId,
      });
      this.dataListLoading = false;
      if(data){
          this.settlementAmount=this.priceNum(data.data.settlementAmount),
          this.sale=this.priceNum(data.data.sale),
          this.transactionAmount=this.priceNum(data.data.transactionAmount),
          this.goodsAdd.financialSettlementAmount=this.priceNum(data.data.settlementAmount)
      }else{
        this.goodsAdd = [];
        this.total = 0;
        this.$message.error(data.msg);
      }
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
        const operator = this.operatorList.find(ele => ele.phone === phone)
        if (operator&&!this.id) {
          this.goodsAdd.operator = operator
        }
      } else {
        this.operatorList = []
      }
      this.dataListLoading = false
    },
  // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        this.storeList = data.data
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    async detail(){
      const { data } = await getUserInfoData()
      if(data&&data.code == 0){
        this.userName = data.data.userName
      }
    },
    // 保存
    async handleUpdate(){
      if(this.goodsAdd){
        this.$refs['goodsAdd'].validate(async (valid) => {
            if (valid) {
              const tname = this.storeList.find(item => item.id == this.goodsAdd.storeId)
              let form ={
                ...this.goodsAdd,
                operatorId: this.goodsAdd.operator ? this.goodsAdd.operator.userId : null,
                operator: this.goodsAdd.operator ? this.goodsAdd.operator.name : null,
                operatorPhone:this.goodsAdd.operator ? this.goodsAdd.operator.phone : null,
                storeId:this.goodsAdd.storeId,
                storeNameAcc:tname ? tname.name : '',
                id: this.id,
                checked:this.gtType,
                end:this.goodsAdd.end,
                start:this.goodsAdd.start,
                certificates: this.imgList.map(item => item.url).join(',') || '',
                sale:this.priceNum(this.sale,'out'),
                transactionAmount:this.priceNum(this.transactionAmount,'out'),
                settlementAmount:this.priceNum(this.settlementAmount,'out'),
                financialSettlementAmount:this.priceNum(this.goodsAdd.financialSettlementAmount,'out')
              }
                if(this.id){
                  const { data } = await api.updateFinance(form)
                  if(data.code == 0){
                this.$router.push({name:'settings-financialSalesSettlement-list'})
              } else if (data.code == -2) {
                this.$message.error('请勿重复提交！')
              }else{
                this.$message.error(data.msg)
              }
            }
              else{
                  const { data } = await api.addAndupdateFinance(form)
                  if(data.code == 0){
                this.$router.push({name:'settings-financialSalesSettlement-list'})
              } else if (data.code == -2) {
                this.$message.error('请勿重复提交！')
              }else{
                this.$message.error(data.msg)
              }
            }
             
            }
        })
      }
    },
  }
}
</script>
<style lang="scss">
.mod-store.customers{
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
