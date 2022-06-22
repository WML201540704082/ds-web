<template>
  <el-card>
    <el-form :model="linkList" :inline="true" ref='linkList' :rules="linkRules">
      <el-form-item label="企业名称" prop="companyId" style="display:block">
        <el-select v-model="linkList.companyId" @change="changeCompanyId" filterable placeholder="请选择企业">
          <!-- <el-option  label="全部" value="" ></el-option> -->
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeId" style="display:block">
        <el-select v-model="linkList.storeId" @change="changeStoreId" filterable placeholder="请选择门店">
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="类型" prop="type" style="display:block">
        <el-radio-group v-model="linkList.type" @change="changeType">
          <el-radio label="1">活动</el-radio>
          <el-radio label="2">商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动" prop="activityId" style="display:block" v-if="linkList.type == '1'">
        <el-select v-model="linkList.activityId" @change="changeActivity" filterable placeholder="请选择活动" clearable>
          <el-option
            v-for="item in activityList"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="goodsId" style="display:block" v-if="linkList.type == '2'">
        <el-select v-model="linkList.goodsId" @change="changeBarcode" filterable placeholder="请选择商品" clearable>
          <el-option
            v-for="item in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结果" prop="result" v-if="linkList.result">
        <span>{{linkList.result}}</span>
      </el-form-item>
    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" @click.native="submit()" txt="生成"/>
    </div>
  </el-card>
</template>
<script>
export default {
  name:'audit-activetyLinkQuery-list',
  data(){
    return{
      activityListLoading:false,
      companyList: [],
      storeList: [],
      activityList: [],
      goodsList: [],
      linkList:{
        type:'1',
        result:'',
        storeId:'',
        activityId:'',
        goodsId:''
      },
      linkRules:{
        companyId:[{required: true, message:'企业必选',trigger: 'blur'}],
        storeId:[{required: true, message:'门店必选',trigger: 'blur'}],
        type:[{required: true, message:'类型必选',trigger: 'blur'}],
        activityId:[{required: true, message:'活动必选',trigger: 'blur'}],
        goodsId:[{required: true, message:'商品必选',trigger: 'blur'}],
      }
    }
  },
  created(){
    //获取企业列表
    this.getCompanyList()
    //获取活动列表
    // this.getActivityList()
    //获取商品别表
    // this.getGoodsList()
  },
  methods:{
    //监听类型
    changeType(){
      this.linkList.result = ''
      this.linkList.activityId = ''
      this.linkList.goodsId = ''
    },
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
    },
    // 监听企业id
    changeCompanyId(val){
      this.linkList.companyId = val
      this.getStoreList()
      this.getActivityList()
      this.linkList.storeId = ''
      this.linkList.activityId = ''
      this.linkList.goodsId = ''
      this.linkList.result  = ''
      this.activityList = []
      this.goodsList = []
    },
    //监听门店id
    changeStoreId(val){
      this.linkList.storeId = val
      this.getGoodsList()
      this.getActivityList()
      this.linkList.activityId = ''
      this.linkList.goodsId = ''
      this.linkList.result  = ''
    },
    //监听Barcode
    changeBarcode(val){
      let barcodesStr  = this.goodsList.filter(item => item.id == val).map(item => item.barcodes)
      let barcodesArr = barcodesStr[0].split(',')
      this.linkList.barcode = barcodesArr[0]
      this.linkList.result  = ''
    },
    //监听活动
    changeActivity(val){
      this.linkList.result  = ''
    },
    // 获取门店下拉列表
    async getStoreList() {
      if (!this.linkList.companyId) {
        return
      }
      this.storeListLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1,
          companyId: this.linkList.companyId,
          status: 1
        })
      }).then(({data}) => {
        this.storeListLoading = false
        if (data && data.code === 0) {
          this.storeList = data.data.records
        } else {
          this.$message.error(data.msg)
          this.storeList = []
        }
      })
    },
    // 获取活动列表
    async getActivityList() {
      this.activityListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/list',true),
        method: 'get',
        params: this.$http.adornParams({
          size: 10000,
          page: 0,
          companyId: this.linkList.companyId,
          storeId: this.linkList.storeId
        })
      }).then(({data}) => {
        this.activityListLoading = false
        if (data && data.code === 0) {
          this.activityList = data.data.records.filter(item => (item.status == 'PROCESSING' && item.type != 'TURN'))
          this.total = data.data.total
        } else {
          this.activityList = []
          this.total = 0
        }
      })
    },
    //获取商品列表
    async getGoodsList(){
      const data = await this.$http({
        url: this.$http.adornUrl('/product/list',true),
        method: 'get',
        params: this.$http.adornParams({
          size: 10000,
          page: 0,
          companyId: this.linkList.companyId,
          storeId: this.linkList.storeId,
          saleChannel: -1
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.goodsList = data.data.records.filter(item => item.barcodes)
          this.total = data.data.total
        } else {
          this.goodsList = []
          this.total = 0
        }
      })
    },
    submit(){
      this.$refs['linkList'].validate(async (valid) => {
        // if (this.linkList.type == '2' && !this.linkList.barcode) {
        //   this.$message.warning('请选择有条码的商品')
        //   return
        // }
        if (valid) {
          this.linkList.result = this.linkList.type == '1' ? 
            'pages/specialDetails/specialDetails?storeid=' + this.linkList.storeId + '&detailid=' + this.linkList.activityId + '&form=special'
            : 'category/detail/detail?storeid=' + this.linkList.storeId + '&activityid=&customerid=&form=live&barcode=' + this.linkList.barcode
        }
      })
    },
  }
}
</script>