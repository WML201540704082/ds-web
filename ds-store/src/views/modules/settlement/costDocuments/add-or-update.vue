<template>
  <section
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-card style="position: relative">
      <img v-if="dataForm.id" alt="审核状态" class="cost-audit-status" :src="`static/img/settlement/cost-audit-wait.png`"/>
      <el-form :model="dataForm" ref="dataForm" :rules="dataFormRules" label-width="100px">
        <!-- 编辑页面有的-门店编号 -->
        <el-form-item label="单据编号" prop="billCode">
          <el-input v-model="dataForm.billCode" maxlength="10" clearable></el-input>
        </el-form-item>
        <el-form-item label="来往单位" prop="customerStoreId">
          <el-select v-model="dataForm.customerStoreId" placeholder="请选择来往单位" clearable  @change="changeStore">
            <el-option
            v-for="item in storeCustomerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择费用类型" clearable >
            <el-option
            v-for="item in costType"
            :key="item.label"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="dataForm.amount" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="费用描述" prop='description'>
          <el-input type="textarea" v-model="dataForm.description" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="发生时间" class="customerBirthday" prop="occurTime">
          <el-date-picker type='date' :editable='false' value-format='yyyy-MM-dd'  v-model="dataForm.occurTime" placeholder="请选择发生时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" v-if="dataForm.id" prop="proposerName">
            <span class="itemInput">{{dataForm.proposerName}}</span>
        </el-form-item>
        <el-form-item label="申请人所在门店" prop="storeName"  v-if="dataForm.id">
            <span class="itemInput">{{dataForm.storeName }}</span>
        </el-form-item>
        <el-form-item label="附件" prop="filePic">
          <gt-image-upload :names="4" :multiple="true" :max=3 :more-real="imgList" tip="（单张大小不超过5M，最多3张）"/>
        </el-form-item>

      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="dataFormSubmit" :loading="$store.state.loading.global" txt="保存"/>
    </div>
  </section>
</template>

<script>
import gtImageUpload from '@/components/gt-image-upload'
import { costType, costStatus } from '@/utils/dict'
import { validatenull,priceRange } from '@/utils/validate'
import { getStore } from '@/utils/storage'
import * as api from '@/service/setting'
import moment from 'moment'
export default {
  name: 'settlement-cost-add',
  components: { gtImageUpload },
  data () {
    const isNum = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 99999.99, 0)) {
          callback(new Error('请输入0.00-99999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const isNumbers =(rule,value,callback)=>{
      let reg= /^[0-9]+$/
      if(!validatenull(value)&&!reg.test(value)){
        return callback(new Error('请输入正整数'))
      }else{
        if(value.length==10){
          return callback()
        }else{
          return callback(new Error('请输入为10位正整数'))
        }
      }
    }
    return {
      imgList:[], //暂存图
      costType,
      costStatus,
      loading: false,
      dataForm: {
        id: 0,
        billCode: null,
        customerStoreId: null,
        customerStoreName: null,
        type: 'COST',
        amount: null,
        description: null,
        occurTime: moment().format('YYYY-MM-DD'),
        filePic: null,
        proposerName: null,
        storeName: null
      },
      storeCustomerList:[],
      dataFormRules:{
        billCode:[{required: true, message: '请输入单据编号', trigger: 'change'},
          {validator:isNumbers,trigger: 'change'}],
        customerStoreId:[{required: true, message: '请选择来往单位', trigger: 'change'}],
        type:[{required: true, message: '请选择费用类型', trigger: 'change'}],
        amount:[{required: true, message: '请输入金额', trigger: 'change'},
          {validator:isNum,trigger: 'change'}],
        occurTime:[{required: true, message: '请选择发生时间', trigger: 'change'}]
      }
    }
  },
  created(){
    this.dataForm.id = this.$route.query.id || ''
    this.getCode()
    this.getStoreCustomerList()
    this.init(this.$route.query.id)
  },
  methods: {
    async getCode(){
      const {data} = await api.getBillCode()
      if(data.code == 0){
        this.dataForm.billCode = data.data
      }else{
        this.$message.error('生成单据编号失败')
      }
    },
    changeStore(val){
      this.storeCustomerList.map(o=>{
        if(val == o.id){
          this.dataForm.customerStoreName = o.name
        }
      })
    },
    updatePicUrl:function(imgoBJ){
      this.dataForm[imgoBJ.str] = imgoBJ.value
    },
    // 客户列表
    async getStoreCustomerList(){
      const {data} = await api.getStoreCustomerList()
      if(data.code == 0){
        this.storeCustomerList = data.data
      }else{
        this.$message.error(data.msg)
      }
    },
    async init (id) {
      if (id) {
        const {data} = await api.getCostDetail({id:id})
        if(data.code == 0){
          this.dataForm = {
            ...data.data,
            amount: this.priceNum(data.data.amount)
          }
          if(data.data.filePic){
            this.imgList = JSON.parse(data.data.filePic) || []
          }else{
            this.imgList = []
          }
        }else{
          this.$message.error(data.msg)
        }
      }
    },
    // 表单提交
    dataFormSubmit (submit) {
      var data = {
        ...this.dataForm,
        amount: this.priceNum(this.dataForm.amount,'out'),
        filePic: JSON.stringify(this.imgList) || null,
      }
      console.log(data)
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          const { data } = await api.getCostAdd({
            ...this.dataForm,
            amount: this.priceNum(this.dataForm.amount,'out'),
            filePic: JSON.stringify(this.imgList) || null,
          })
          this.loading = false
          if(data.code == 0){
            this.$router.push({name:'settlement-costDocuments-list'})
          }else{
            this.$message.error(data.msg)
          }
        } else {
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.customerBirthday {
  .el-input__icon{
    margin-right: 42px;
  }
}
.el-date-editor.el-input__inner{
  padding-bottom: 0;
  padding-top: 0;
  height: 33px;
  line-height: 33px;
  .el-range-separator{
    width: 10%;
  }
}
.dialog-footer-inner {
  width: 100%;
  display: block;
  margin: 20px 0;
  text-align: center;
}
.el-select {
  width: auto!important;
}
.locations {
  .el-input__inner {
    width: 300px!important;
  }
}
.storeNames input {
  padding-left:15px!important;
}
.cost-audit-status{
  width: 100px;
  position: absolute;
  top: 50px;
  right: 50px;
}

.el-form-item__error1 {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
