<template>
  <div class="mod-store customers">
      <el-form label-width="100px"  :model="goodsAdd" inline='true' ref="goodsAdd" :rules="stockRules" :disabled="true">
          <el-card style="margin-bottom: 10px;">
     <el-form-item label="门店名称" prop='storeId'>
         <el-input type="text" :disabled="true" v-model="storeNameAcc" style="width: 180px;" autosize ></el-input>
        </el-form-item>
        <el-form-item label="销售时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="start"
            :end-time-value="end"
            end-time-prop="end"
            valueFormat="yyyy-MM-dd"
            type="date"
            @changeStartValue="value => start = value"
            @changeEndValue="value => end = value"
          ></gt-time-range>
        </el-form-item>
        </el-card>
       <el-card style="margin-bottom: 10px;">
        <el-form-item label="总销售额  " prop="sale ">
          <el-input type="text" :disabled="true" v-model="sale " style="width: 180px;" autosize ></el-input>
        </el-form-item>
        <el-form-item label="富有收款" prop="transactionAmount">
          <el-input type="text" :disabled="true" v-model="transactionAmount" style="width: 180px;" autosize></el-input>
        </el-form-item>
        <el-form-item label="富有结算" prop="settlementAmount">
          <el-input type="text" :disabled="true"  v-model="settlementAmount" style="width: 180px;" autosize></el-input>
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
          <el-input type="textarea" v-model="financialSettlementAmount"  style="width: 180px;" autosize>
          </el-input>
        </el-form-item>
        <el-form-item label="上传凭证" prop="certificates" style="display: block !important" >
          <span v-if="imgList&&imgList.length>0">
                <div class="view-img" v-for='(item, index) in imgList' :key="index">
                  <img class="theme-border"  :src="'http://'+item.url" alt="" @click="openImgPic('innerPic',item.url)">
                </div>
          </span>
          <span v-else class="itemInput">--</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input  type="textarea" v-model="remark" style="height:300px;"  ></el-input>
        </el-form-item>
       </el-card>
       <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
    </el-form>
  </div>
</template>
<script>
import gtImageUpload from '@/components/gt-image-upload'
import gtTimeRange from "@/components/gt-time-range";
import { getStoreList } from '@/service/systore'
import { getStaffList } from '@/service/staffManagement'
import NP from 'number-precision'
import { commissionRange } from '@/utils/validate'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import { getUserInfoData } from '@/service/setinfo'
export default {
  name:'stockManagement-requiredAdd',
  data(){
    return{
      showImgPic: null,
      type:null,
      storeNameAcc:null,
      financialSettlementAmount:null,
      storeId:null,
      storeName:null,
      remark:null,
      end:null,
      start:null,
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
          
          start: null,
          end: null,
          storeId:'',
      },
      bindAdd:'',
      stockRules:{
        // operator:[{required: true, message: '操作人必填',trigger: 'blur'}],
        storeId:[{required: true, message: '门店名称必填',trigger: 'blur'}],
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
      this.viewFinance(id)
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
        //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.dataForm[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    //获取详情
    async viewFinance(id){
      const { data } = await api.viewFinance(id)
      this.goodsAdd = {
        ...this.goodsAdd,
      }
      if(data.code == 0){
        this.details = data
        this.storeNameAcc=data.data.storeNameAcc,
        this.settlementAmount=this.priceNum(data.data.settlementAmount),
        this.sale=this.priceNum(data.data.sale),
        this.transactionAmount=this.priceNum(data.data.transactionAmount),
        this.financialSettlementAmount=this.priceNum(data.data.financialSettlementAmount),
        this.storeId=data.data.storeId,
        this.storeName=data.data.storeName,
        this.remark=data.data.remark,
        this.end=data.data.end,
        this.start=data.data.start,
        this.goodsAdd.operator=data.data.operator
        this.imgList=data.data.certificates ? data.data.certificates.split(',').map(item => ({url:item})) : []
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
         this.settlementAmount=data.data.settlementAmount,
          this.sale=data.data.sale,
          this.transactionAmount=data.data.transactionAmount,
         this.details = data
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
    .spec-pic{
    width: 50px;
    height: 50px;
  }
}
</style>
