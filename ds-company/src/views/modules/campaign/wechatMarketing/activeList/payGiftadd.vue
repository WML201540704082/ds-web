<template>
  <section class="paygift"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="paygift" ref="paygift" :rules="paygiftaddRules" label-width="100px">
      <!-- 手机模板 -->
      <gt-paygift-modal :activeadd= "paygift" />
      <!-- 右侧信息 -->
      <div class="rights">
        <div style="color:red;font-size:14px;padding-top:8px;" v-if="checkContent">审核说明：{{checkContent}}</div>
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
           <div>
              <el-form-item label="推送类型" prop="type">
                <el-radio-group v-model="paygift.type" @change="reset" :disabled="type=='detail'">
                  <el-radio :label="'ACTIVITY'" :value="'ACTIVITY'">营销活动</el-radio>
                  <el-radio :label="'COUPON'" :value="'COUPON'">优惠券</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="活动标题" prop="title" class="labelWidth">
                <el-input v-model="paygift.title" :disabled="!saveTitle" :maxlength="50" placeholder="请输入活动标题(至多50个汉字)"></el-input>
              </el-form-item>
              <el-row v-if="paygift.type == 'ACTIVITY'">
                <el-col style="width: 330px;">
                  <el-form-item label="活动内容" prop="activityName" class="labelWidth">
                    <el-input v-model="paygift.activityName" :clearable='true' :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="width: auto;display:inline-block" v-if="type!='detail'">
                  <span class="storeBox theme-background" @click="selectActive">选择活动</span>
                </el-col>
              </el-row>
              <!-- <el-form-item label="已选活动" class="labelWidth" v-if="paygift.type == 'ACTIVITY'">
                <span class="itemInput">{{paygift.activityName}}</span>
              </el-form-item> -->

              <el-row v-if="paygift.type == 'COUPON'">
                <el-col  style="width: 330px;">
                  <el-form-item label="优惠券" prop="couponName" class="labelWidth">
                    <el-input v-model="paygift.couponName" :clearable='true' :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="width: auto;display:inline-block" v-if="type!='detail'">
                  <span class="storeBox theme-background" @click="selectCoupon">选择优惠券</span>
                </el-col>
              </el-row>

              <el-form-item label="活动时间" class="gt-inline-item" required>
                <gt-time-range
                :limitBeforeToday="timeRange.startTime"
                :limitAfterToday="timeRange.endTime"
                :disabled="(!(paygift.activityName || paygift.couponName))||type=='detail'"
                start-time-prop="startTime"
                :start-time-value="paygift.startTime"
                :end-time-value="paygift.endTime"
                end-time-prop="endTime"
                @changeStartValue="value => paygift.startTime = value"
                @changeEndValue="value => paygift.endTime = value"
              ></gt-time-range>
              </el-form-item>
              <el-form-item label="封面图片" prop="cover" class="view-img">
                 <span style="position: relative">
                <gt-image-upload
                v-if="type!='detail'"
                @updatePicUrl="updatePicUrl"
                :realistStr="'cover'"
                :names="2"
                :multiple="true"
                :max=1
                tip="(图片尺寸建议 750x350或等比图片，大小5M以下)"
                :reallist="paygift.cover"
                :cb="value => paygift.cover = value" />
                <img v-else :src="'http://'+paygift.cover" alt="">
              </span>
              <span class="theme-border theme-color fromGallery" @click="gallerySelect('single')" v-if="type!='detail'">从图库选择</span>
            </el-form-item>
           </div>
        </el-card>

        <!-- 活动条件 -->
        <gt-subtitle title="02. 活动条件"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="订单金额" prop="condition" class="labelWidth2">
            <span>满</span><el-input v-model="paygift.condition" :disabled="type=='detail'"></el-input><span>元，参与活动</span>
          </el-form-item>
        </el-card>
      </div>

    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" v-if="saveTitle" txt="取消" />
      <gt-button size="large" @click.native="submitCustomer(false)" :loading="$store.state.loading.global" v-if="type!='detail'" txt="暂存"/>
      <gt-button size="large" @click.native="submitCustomer(true)" :loading="$store.state.loading.global" v-if="saveTitle" txt="保存并提交"/>
    </div>

    <!-- 选择叠加商品 -->
    <gt-select-active ref="selectactive" @refreshData="changeActive"/>
    <gt-select-coupon ref="selectcoupon" @refreshData="changeCoupon"/>
    <!-- 图库 -->
    <gt-select-gallery ref="gallery" @refreshData="getGalleryPic"/>
  </section>
</template>
<script>
import {validatenull, priceRange} from '@/utils/validate'

import gtSelectActive from '../../components/select-active-modal'
import gtSelectCoupon from '../../components/select-coupon-modal'
import gtPaygiftModal from '../../components/paygiftModal'
import gtSelectGallery from '../../components/selectGallery'
import gtSubtitle from '@/components/gt-sub-title'
import gtTimeRange from '@/components/gt-time-range'
import { savePaidGift, getactivityDetail,getactivityList } from '@/service/activity'
import {getCouponSelectOptions} from '@/service/campaign'
import gtImageUpload from '@/components/gt-image-upload'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-payGiftadd',
  components:{ gtSubtitle, gtTimeRange, gtSelectActive, gtPaygiftModal,gtImageUpload,gtSelectCoupon,gtSelectGallery },
  data(){

    const isNumber =(rule,value,callback)=>{
      if (value) {
        if (!priceRange(value, 499999.99)) {
          callback(new Error('请输入0.01-499999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const isValidate = (rule ,value,callback)=>{
      console.log(moment(value).valueOf() +'>'+ moment(this.timeRange.endTime).valueOf())
      if(moment(value).valueOf() > moment(this.timeRange.endTime).valueOf()){
        callback(new Error('活动结束时间不得大于所选'+(this.paygift.type == 'COUPON'?'优惠券':'活动内容')+'结束时间'))
      } else if (moment(value).valueOf() < moment().valueOf()) {
        callback(new Error('活动结束时间不得小于当前时间'))
      } else{
        callback()
      }
    }
    const isValidate1 = (rule ,value,callback)=>{
      console.log(value +'<'+ this.timeRange.startTime)
      if(moment(value).valueOf() < moment(this.timeRange.startTime).valueOf()){
        callback(new Error('活动开始时间不得小于所选'+(this.paygift.type == 'COUPON'?'优惠券':'活动内容')+'开始时间'))
      }else{
        callback()
      }
    }
    return{
      checkContent:'',
      loading: false,
      timeRange: {
        startTime: null,
        endTime: null
      },
      isYX: true,
      paygift: {
        couponId: null,
        couponName: null,
        type: 'ACTIVITY',
        cover: null,
        title:null,
        href: null,
        startTime: null,
        endTime: null,
        condition: null,
        activityName: null,
        activityId: null
      },
      items:{},
      type: null,
      saveTitle: true,//是否保存title
      activityId:null,
      paygiftaddRules:{
        title:[{required: true,message:'请输入活动标题', trigger: 'change'}],
        cover:[{required: true,message:'请选择活动图片', trigger: 'change'}],
        startTime:[{required: true,message:'请选择活动开始时间', trigger: 'change'},
          {validator:isValidate1,trigger: 'blur'}],
        endTime:[{required: true,message:'请选择活动结束时间', trigger: 'change'},
          {validator:isValidate,trigger: 'blur'}],
        href:[{required: true,message:'请选择选择活动链接', trigger: 'change'}],
        activityName:[{required: true,message:'请选择选择活动', trigger: 'change'}],
        type:[{required: true,message:'请选择推送类型', trigger: 'change'}],
        couponName:[{required: true,message:'请选择优惠券', trigger: 'change'}],
        couponId:[{required: true,message:'请选择优惠券', trigger: 'change'}],
        condition:[{required: true,message:'请选择输入订单金额', trigger: 'change'},
          {validator: isNumber, trigger: 'blur'}]
      },

    }
  },
  watch:{
    documentWidth(val,oldVal){
      this.setMainWidth()
    },
    'paygift.href'(val,old){
      if(validatenull(val)){
        this.paygift.activityName = null
        this.paygift.activityId = null
      }
    }
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
  },
  created(){
    var checkContent = this.$route.query.checkContent
    var type = this.$route.query.type
    if (checkContent && type == 'REJECT') {
      this.checkContent = checkContent
    }
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()

      var activityId = this.$route.query.id
      this.activityId = activityId
      if(activityId){
        const {type} = this.$route.query
        // PROCESSING("进行中"),PAUSE("暂停"),NOCHECK("待审核")
        if(type){
          this.type = 'detail'
          if(type=='PROCESSING'||type=='PAUSE'||type=='NOCHECK'){
            this.saveTitle = true
          }else{
            this.saveTitle = false
          }
        }
        this.getPayDetails(activityId)
      }
    })
  },
  methods:{
    gallerySelect(type){
      this.$nextTick(() => {
        this.$refs.gallery.init(type)
      })
    },
    // 从图库选择
    getGalleryPic(obj){
      if(obj.type=='single'){
        this.paygift.cover = obj.cover
      }
    },
    // 获取商品列表
    async activilist(activityId) {
      const { data } = await getactivityList({
        status:'PROCESSING',
        type: null
      })
      if (data.code === 0) {
        if(activityId){
          data.data&&data.data.map(o=>{
            if(o.id == activityId){
              this.items = o
              this.timeRange.startTime = o.startTime
              this.timeRange.endTime = o.endTime
            }
          })
        }
      } else {
        this.$message.error(data.msg)
      }
    },

    async couponlist(couponId) {
      const data = await getCouponSelectOptions({
        keyword: ''
      })
      if(couponId){
        data&&data.map(o=>{
          if(o.id == couponId){
            this.items = o
            this.timeRange.startTime = o.effectiveBeginDate
            this.timeRange.endTime = o.effectiveEndDate
          }
        })
      }

    },
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.paygift .el-form').width()
      $('.rights').css('width',formWidth-370)
      window.onresize = () => {
        var formWidth=$('.paygift .el-form').width()
        $('.rights').css('width',formWidth-370)
      }
    },
    // 图片
    updatePicUrl:function(imgoBJ){
      this.paygift[imgoBJ.str] = imgoBJ.value
    },
    // 支付有礼详情
    async getPayDetails(id){
      const {data} = await getactivityDetail(id)
      if(data.code == 0){
        let paygift = data.data.activityDto
        this.paygift = {
          ...paygift,
          type: data.data.type,
          couponName: data.data.couponName,
          couponId: data.data.couponId,
          startTime: moment(paygift.startTime).valueOf(),
          endTime: moment(paygift.endTime).valueOf(),
          href: data.data.href,
          activityName: data.data.activityName,
          activityId: data.data.activityId,
          condition: this.priceNum(data.data.condition)
        }

        this.activilist(data.data.activityId)
        this.couponlist(data.data.couponId)
      }else{
        this.$message.error(data.msg)
      }
    },

    reset(value) {
      if (value === 'ACTIVITY') {
        this.paygift.couponName = null
        this.paygift.couponId = null
      } else {
        this.paygift.href = null
        this.paygift.activityName = null
        this.paygift.activityId = null
      }
      this.paygift.startTime = null
      this.paygift.endTime = null
      this.timeRange.startTime = null
      this.timeRange.endTime = null
      this.$refs['paygift'].clearValidate()
    },

    // 选择活动
    selectActive(){
      this.$nextTick(()=>{
        this.$refs.selectactive.init(this.items)
      })
    },
    // 活动回显
    changeActive(obj){
      this.items = obj
      this.paygift.href = obj.href
      this.paygift.activityName = obj.title
      this.paygift.activityId = obj.id
      // 设置活动时间
      // this.paygift.startTime = moment(obj.startTime).isAfter(moment()) ? moment(obj.startTime).valueOf() : moment().valueOf()
      this.paygift.startTime = moment(obj.startTime).valueOf()
      this.paygift.endTime = moment(obj.endTime).valueOf()
      this.timeRange.startTime = obj.startTime
      // moment(obj.startTime).isAfter(moment()) ? obj.startTime : moment().format('YYYY-MM-DD HH:mm:ss')
      this.timeRange.endTime = obj.endTime
    },
    // 选择优惠券
    selectCoupon(){
      this.$nextTick(()=>{
        this.$refs.selectcoupon.init(this.items)
      })
    },
    // 优惠券回显
    changeCoupon(obj){
      this.items = obj
      this.paygift.couponName = obj.name
      this.paygift.couponId = obj.id
      // 设置活动时间
      // this.paygift.startTime = moment(obj.effectiveBeginDate).isAfter(moment()) ? moment(obj.effectiveBeginDate).valueOf() : moment().valueOf()
      this.paygift.startTime = obj.expiryDateType=='DAY'? null:moment(obj.effectiveBeginDate).valueOf()
      this.paygift.endTime = obj.expiryDateType=='DAY'? null:moment(obj.effectiveEndDate).valueOf()
      this.timeRange.startTime =  obj.effectiveBeginDate
      // moment(obj.effectiveBeginDate).isAfter(moment()) ? obj.effectiveBeginDate : moment().format('YYYY-MM-DD HH:mm:ss')
      this.timeRange.endTime = obj.effectiveEndDate
    },

    submitCustomer(submit){
      console.log(this.paygift)
      this.$refs['paygift'].validate(async (valid) => {
        if (valid) {

          if(this.paygift.type == 'COUPON'){
            this.paygift.href = null
            this.paygift.activityName = null
            this.paygift.activityId = null
          }else{
            this.paygift.couponName = null
            this.paygift.couponId = null
          }
          const {data} = await savePaidGift({
            ...this.paygift,
            submit: submit,
            condition: this.priceNum(this.paygift.condition, 'out'),
            createOrUpdate: this.activityId?((this.saveTitle&&this.type==='detail')?false:true):true
          })
          if(data.code == 0){
            this.$router.push({name:'campaign-wechatMarketing-activeList-activeList'})
          }else{
            this.$message.error(data.msg)
          }
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
@import '~@/assets/scss/campaign/paygift.scss';
.fromGallery {
  cursor:pointer;position:absolute;top: 10px;left: 180px;border-radius:10px;padding: 0 10px;height: 30px;line-height: 30px;
}
</style>


