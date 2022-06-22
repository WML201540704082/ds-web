<template>
  <section class="addactive"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="activeadd" ref="activeadd" :rules="activeaddaddRules" label-width="100px">
      <!-- 手机模板 -->
      <gt-specail-model :activeadd= "activeadd" />
      <!-- 右侧信息 -->
      <div class="rights">
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
          <div style="float: right;font-size: 15px;">状态：<span style="color: green">{{filterStatus(status,activeStatus)}}</span></div>
          <gt-base-info :activeadd= "activeadd"/>
        </el-card>

        <div v-if="type=='GROUP'">
          <gt-subtitle title="02. 设置团长佣金奖励" />
          <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <el-form-item label="设置模式" prop="commissionType">
              <el-radio-group v-model="activeadd.commissionType" @change="changeRadios" :disabled="true">
                <el-radio :label="'AMOUNT'" :value="'AMOUNT'">按商品金额(元)</el-radio>
                <el-radio :label="'PROPORTION' " :value="'PROPORTION'">按特卖价格比例(%)</el-radio>
              </el-radio-group>
            </el-form-item>
            <div>
              <el-table
                :data="activeadd.commissionRuleList"
                border
                :stripe="true"
                height="300"
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
                  prop="name"
                  min-width="250"
                  :show-overflow-tooltip="true"
                  label="商品名称">
                </el-table-column>
                <el-table-column
                  prop="price"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="特卖价格">
                  <template slot-scope="scope">
                    <span>{{priceNum(scope.row.price)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="productNumTol"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="商品数量">
                  <template slot-scope="scope">
                    <span>{{scope.row.productNumTol ? scope.row.productNumTol : '不限'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="佣金奖励">
                  <el-table-column
                    prop="blackGold"
                    min-width="150"
                    :label="'黑金'+dw">
                    <template slot-scope="scope">
                      <span v-if="activeadd.commissionType == 'AMOUNT'">{{priceNum(scope.row.blackGold)}}</span>
                      <span v-else>{{scope.row.blackGold}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="gold"
                    min-width="150"
                    :label="'黄金'+dw">
                    <template slot-scope="scope">
                      <span v-if="activeadd.commissionType == 'AMOUNT'">{{priceNum(scope.row.gold)}}</span>
                      <span v-else>{{scope.row.gold}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="normal"
                    min-width="150"
                    :label="'普通'+dw">
                    <template slot-scope="scope">
                      <span v-if="activeadd.commissionType == 'AMOUNT'">{{priceNum(scope.row.normal)}}</span>
                      <span v-else>{{scope.row.normal}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>

              </el-table>
            </div>
          </el-card>
        </div>
        <div v-else>
          <gt-subtitle title="02. 商品信息" />
          <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <el-table
              :data="activeadd.myProducts"
              border
              :stripe="true"
              height="300"
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
                prop="name"
                min-width="250"
                :show-overflow-tooltip="true"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="price"
                min-width="120"
                :show-overflow-tooltip="true"
                label="特卖价格">
                <template slot-scope="scope">
                  <span>{{priceNum(scope.row.price)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="productNumTol"
                min-width="120"
                :show-overflow-tooltip="true"
                label="商品数量">
                <template slot-scope="scope">
                  <span>{{scope.row.productNumTol ? scope.row.productNumTol : '不限'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <!-- 审核信息 -->
        <gt-subtitle title="03. 审核信息"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="审核信息" prop="result">
            <el-radio-group v-model="activeadd.result"  :disabled="edit==0">
              <el-radio v-for="item in audio" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核信息" prop="content">
            <el-input type="textarea" v-model="activeadd.content" :maxlength='200' v-if="edit!=0"></el-input>
            <span class="itemInput" v-else>{{activeadd.content}}</span>
          </el-form-item>
        </el-card>

         <!-- 下架原因 -->
        <gt-subtitle title="04. 下架原因" v-if="activeadd.stopReason"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;" v-if="activeadd.stopReason">
          <el-form-item label="下架原因" prop="stopReason">
            <span class="itemInput">{{activeadd.stopReason}}</span>
          </el-form-item>
        </el-card>
      </div>

    </el-form>
    <div class="gt-form-bottom-submit" v-if="edit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="submitCustomer(true)" :loading="$store.state.loading.global" txt="提交"/>
    </div>
  </section>
</template>
<script>
import {validatenull} from '@/utils/validate'
import { audio, activeStatus } from '@/utils/dict'
import gtBaseInfo from './components/baseinfo-modal'
import gtSpecailModel from './components/specailModal'
import gtSubtitle from '@/components/gt-sub-title'
import { filterStatus} from '@/utils'
export default {
  name:'specail-view',
  components:{ gtSubtitle, gtSpecailModel, gtBaseInfo},
  data(){
    return{
      dw:null,
      filterStatus,
      showImgPic: null,
      audio,
      activeStatus,
      loading: false,
      activeadd: {
        result: null,
        content: null,
        companyName: null,
        myProducts: [],
        storeList: []
      },
      gridData:[],
      activeaddaddRules:{
        result:[{required: true,message:'请选择审核结果',trigger: 'change'}],
        content:[{required: true,message:'请输入审核说明',trigger: 'change'}],
      },
      id: null,
      edit: 0,
      status: null,
      type: null
    }
  },
  watch:{
    documentWidth(val,oldVal){
      this.setMainWidth()
    },
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()
      this.id = this.$route.query.id
      this.edit = this.$route.query.edit
      this.status = this.$route.query.status
      this.type= this.$route.query.type
      this.getactivityDetail(this.id)
    })
  },
  methods:{
    changeRadios(val){
      if(val == 'AMOUNT'){
        this.dw = '(元)'
      }else{
        this.dw = '(%)'
      }
    },
    //图片展示
    openImgPic:function(str,url){
      this.showImgPic = 'http://'+this.activeadd[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.addactive .el-form').width()
      $('.rights').css('width',formWidth-379)
      window.onresize = () => {
        var formWidth=$('.addactive .el-form').width()
        $('.rights').css('width',formWidth-379)
      }
    },
    async getCompanyList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })

      data.data.records.map(item=>{
        if(item.id == id){
          this.$set(this.activeadd,'companyName',item.name)
        }
      })
    },
    // 获取数据列表
    async getStoreList(storeIds) {
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1,
          status: 1
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          let storeList = []
          data.data.records.map(o=>{
            storeIds.map(i=>{
              if(o.id == i){
                storeList.push(o.name)
              }
            })
          })
          this.$set(this.activeadd,'storeList', storeList.join(','))
        }
      })

    },

    // 特卖详情
    async getactivityDetail(id){
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/detail/'+id,true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          let myProducts = []
          data.data.items.forEach(item => {
            myProducts = myProducts.concat(item.products)
          })
          data.data.products.forEach(item => {
            myProducts = myProducts.concat(item.first)
          })
          let activeadd = data.data.activityDto
          this.activeadd = {
            ...activeadd,
            ...data.data,
            commissionRuleList: data.data.commissionRuleList ? data.data.commissionRuleList.map(item => {
              const currentProduct = myProducts.find(ele => {
                return ele.productId === item.productId
              })
              return {
                ...item,
                productNumTol: currentProduct.productNumTol
              }
            }): [],
            myProducts,
          }
          if(this.edit == 0){
            this.activeadd.result = activeadd.checkResult
            this.activeadd.content = activeadd.checkContent
          }
          if(this.activeadd.commissionType == 'AMOUNT'){
            this.dw = '(元)'
          }else{
            this.dw = '(%)'
          }
          this.getCompanyList(this.activeadd.companyId)
          if(activeadd.storeIds&&activeadd.storeIds.length>0){
            this.getStoreList(activeadd.storeIds)
          }

        }else{
          this.$message.error(data.msg)
        }
      })

    },
    submitCustomer(submit){
      this.$refs['activeadd'].validate(async (valid) => {
        if (valid) {
          const data = await this.$http({
            url: this.$http.adornUrl('/activity/check/'+this.id,true),
            method: 'post',
            data: this.$http.adornData({
              ...this.activeadd
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$router.push({name:'audit-activity'})
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
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
<style lang='scss' scope>
@import '~@/assets/scss/campaign/activeadd.scss';
</style>
