<template>
  <section class="paygift"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="paygift" ref="paygift" :rules="paygiftaddRules" label-width="100px">
      <!-- 右侧信息 -->
      <div class="rights">
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
          <div style="float: right;font-size: 15px;">状态：<span style="color: green">{{filterStatus(status,activeStatus)}}</span></div>
           <div>
              <el-form-item label="活动标题" prop="title" class="labelWidth">
                <span class="itemInput">{{paygift.title}}</span>
              </el-form-item>
              <el-form-item label="活动时间" class="gt-inline-item">
                <span class="itemInput">{{paygift.startTime}}-{{paygift.endTime}}</span>
              </el-form-item>
              <el-form-item label="封面图片" class="view-img" >
                <img :src="'http://'+paygift.cover" alt="" @click="openImgPic('cover')" v-if='paygift.cover' >
                <span v-else class="itemInput">--</span>
              </el-form-item>
              <!-- <el-form-item label="活动链接" prop="href" class="labelWidth" >
                <span class="itemInput">{{paygift.href}}</span>
              </el-form-item> -->
              <el-form-item label="所属企业" class="labelWidth">
                <span class="itemInput">{{companyName}}</span>
              </el-form-item>
              <el-form-item label="活动内容" class="labelWidth" v-if="paygift.type=='ACTIVITY'">
                <span class="itemInput">{{paygift.activityName}}</span>
              </el-form-item>
              <el-form-item label="优惠券" class="labelWidth" v-if="paygift.type=='COUPON'">
                <span class="itemInput">{{paygift.couponName}}</span>
              </el-form-item>

           </div>
        </el-card>

        <!-- 活动条件 -->
        <gt-subtitle title="02. 活动条件"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="订单金额" prop="condition" class="labelWidth2">
            <span>满{{paygift.condition/100}}元，参与活动</span>
          </el-form-item>
        </el-card>

          <!-- 审核信息 -->
        <gt-subtitle title="02. 审核信息"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="审核信息" prop="result">
            <el-radio-group v-model="paygift.result"  :disabled="edit==0">
              <el-radio v-for="item in audio" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核信息" prop="content">
            <el-input type="textarea" v-model="paygift.content" :maxlength='200' v-if="edit!=0"></el-input>
            <span class="itemInput" v-else>{{paygift.content}}</span>
          </el-form-item>
        </el-card>

         <!-- 下架原因 -->
        <gt-subtitle title="03. 下架原因" v-if="paygift.stopReason"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;" v-if="paygift.stopReason">
          <el-form-item label="下架原因" prop="stopReason">
            <span class="itemInput">{{paygift.stopReason}}</span>
          </el-form-item>
        </el-card>

      </div>

    </el-form>
    <div class="gt-form-bottom-submit" v-if="edit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="submitCustomer(true)" :loading="$store.state.loading.global" txt="提交"/>
    </div>

    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import {validatenull} from '@/utils/validate'
import { audio,activeStatus } from '@/utils/dict'
import gtSubtitle from '@/components/gt-sub-title'
import { filterStatus} from '@/utils'
export default {
  name:'paygift-view',
  components:{ gtSubtitle },
  data(){
    return{
      activeStatus,
      filterStatus,
      audio,
      showImgPic:null,
      loading: false,
      paygift: {
        type: 'ACTIVITY',
        result: null,
        content: null,
      },
      paygiftaddRules:{
        result:[{required: true,message:'请选择审核结果',trigger: 'change'}],
        content:[{required: true,message:'请输入审核说明',trigger: 'change'}],
      },
      companyName: null,
      id: null,
      edit: 0,
      status: null,

    }
  },
  mounted(){
    this.$nextTick(function () {
      this.id = this.$route.query.id
      this.edit = this.$route.query.edit
      this.status = this.$route.query.status
      this.getPayDetails(this.id)
    })
  },
  methods:{
    //图片展示
    openImgPic:function(str,url){
      this.showImgPic = 'http://'+this.paygift[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
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
          this.companyName = item.name
        }
      })
    },
    // 支付有礼详情
    async getPayDetails(id){
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/detail/'+id,true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          let paygift = data.data.activityDto
          this.paygift = {
            ...paygift,
            ...data.data,
            type: data.data.type
          }
          if(this.edit == 0){
            this.paygift.result = paygift.checkResult
            this.paygift.content = paygift.checkContent
          }
          this.getCompanyList(paygift.companyId)
        }else{
          this.$message.error(data.msg)
        }
      })
    },

    submitCustomer(submit){
      console.log(this.paygift)
      this.$refs['paygift'].validate(async (valid) => {
        if (valid) {
          const data = await this.$http({
            url: this.$http.adornUrl('/activity/check/'+this.id,true),
            method: 'post',
            data: this.$http.adornData({
              ...this.paygift
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$router.push({name:'audit-activity'})
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/campaign/paygift.scss';
</style>
