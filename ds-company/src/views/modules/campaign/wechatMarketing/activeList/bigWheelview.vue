<template>
  <section class='bigwheel'
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="bigwheel" ref="bigwheel" :rules="bigwheeladdRules" label-width="100px">
      <!-- 手机模板 -->
      <gt-wheel-modal :activeadd= "bigwheel" />
      <!-- 右侧信息 -->
      <div class="rights">
        <div style="color:red;font-size:14px;" v-if="checkContent">审核说明：{{checkContent}}</div>
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
          <el-form-item label="活动标题" prop="title" class="labelWidth">
            <el-input v-model="bigwheel.title" :maxlength="30" :disabled="!saveTitle" placeholder="请输入活动标题(至多30个汉字)"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" class="gt-inline-item" required>
            <gt-time-range
             :disabled="isType=='detail'"
            start-time-prop="startTime"
            :start-time-value="bigwheel.startTime"
            :end-time-value="bigwheel.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => bigwheel.startTime = value"
            @changeEndValue="value => bigwheel.endTime = value"
          ></gt-time-range>
          </el-form-item>
          <el-form-item label="封面图片" prop="cover" class="view-img">
            <span style="position: relative">
              <gt-image-upload
              v-if="isType!='detail'"
              @updatePicUrl="updatePicUrl"
              :realistStr="'cover'"
              :names="2"
              :multiple="true"
              :max=1
              tip="(图片尺寸建议 750x350或等比图片，大小5M以下)"
              :reallist="bigwheel.cover"
              :cb="value => bigwheel.cover = value" />
              <img v-else :src="'http://'+bigwheel.cover" alt="">
            </span>
            <span class="theme-border theme-color fromGallery" @click="gallerySelect('single')" v-if="isType!='detail'">从图库选择</span>
          </el-form-item>
           <el-form-item label="分享海报图片" prop="poster" class="view-img">
            <span style="position: relative" v-if="bigwheel.poster">
              <gt-image-upload
              v-if="isType!='detail'"
              @updatePicUrl="updatePicUrl"
              :realistStr="'poster'"
              :names="3"
              :multiple="true"
              :max=1
              tip="(图片尺寸建议 750x750或等比图片，大小5M以下)"
              :reallist="bigwheel.poster"
              :cb="value => bigwheel.poster = value" />
              <img v-else :src="'http://'+bigwheel.poster" alt="">
            </span>
            <span v-else>--</span>
          </el-form-item>
          <el-form-item label="宣传副标题" prop="subTitle" class="labelWidth">
            <el-input v-model="bigwheel.subTitle" :maxlength="50" :disabled="!saveTitle" placeholder="请输入活动标题(至多50个汉字)"></el-input>
          </el-form-item>
          <el-form-item label="适用门店" prop="storeIds">
            <span class="storeBox theme-background" v-for="(item,index) in storeList" :key="item.id" :title="item.name"><b>{{item.name}}</b><span v-if="isType!='detail'" class="close" @click="close(index)">X</span>  </span>
            <span class="selectSale" @click="selectSalestore" v-if="isType!='detail'">
              <icon-svg name="create" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
              </span>
          </el-form-item>
        </el-card>

        <!-- 奖项设置 -->
        <gt-subtitle title="02. 奖项设置"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div>设置奖项（最少4项，最多9项）
            <el-tooltip placement="top" popper-class="width-limit" effect="dark" :content="content">
              <img class="answer" src="static/img/icon/answer.png" />
            </el-tooltip><span style="color: red;font-size: 15px;">总中奖率{{allNum}}%</span></div>
          <el-form-item prop="items" class="prizeList" v-if="isType!='detail'">
            <div class="addvisit" v-for="(item,index) in bigwheel.items" :key="index">
              <span>{{index+1}}等奖</span>
              <el-form-item :prop="'items.'+index+'.prizeId'" :rules="prizeRules.morePrize">
                <span class="inputs">
                  <!-- 自定义 -->
                  <el-input :title="item.name" v-if="item.prizeType=='CUSTOMEIZE'" v-model="item.name" placeholder="输入奖项" :disabled="item.prizeId=='-1'" clearable  @change="val=>changes(val,item)"></el-input>
                  <!-- 优惠券 -->
                  <el-select :title="item.name" v-show="item.prizeType=='COUPON'" v-model="item.prizeId" placeholder="选择奖项" @clear="clearVal" remote filterable :remote-method="remoteMethod" clearable @change="val=>changes(val,item)">
                    <el-option
                     :disabled="(selectKeys.indexOf(coupon.id) === -1)?false:true"
                     v-for="coupon in couponList"
                     :key="coupon.id"
                     :label="coupon.name"
                     :value="coupon.id"></el-option>
                  </el-select>
                  <!-- 商品 -->
                  <el-select :title="item.name"  v-loadmore="loadMore" v-if="item.prizeType=='PRODUCT'" v-model="item.prizeId" placeholder="选择奖项" @clear="clearVal" remote filterable :remote-method="remoteMethod" clearable  @change="val=>changes(val,item)">
                    <el-option
                      v-show="selectKeys.indexOf(item.id) === -1"
                      v-for="item in fromDetailProduct"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                    <el-option
                      :disabled="(selectKeys.indexOf(product.id) === -1)?false:true"
                      v-for="product in productList"
                      :key="product.id"
                      :label="product.name"
                      :value="product.id">
                    </el-option>
                  </el-select>
                  <!-- 礼品卡 -->
                  <el-select :title="item.name" v-if="item.prizeType=='STATCARD'" v-model="item.prizeId" placeholder="选择奖项" @clear="clearVal" remote filterable :remote-method="remoteMethod" clearable  @change="val=>changes(val,item)">
                    <el-option
                      :disabled="(selectKeys.indexOf(gift.id) === -1)?false:true"
                      v-for="gift in giftCardList"
                      :key="gift.id"
                      :label="gift.name"
                      :value="gift.id">
                    </el-option>
                  </el-select>
                </span>
              </el-form-item>
              <el-form-item :prop="'items.'+index+'.totalQuantity'" :rules="prizeRules.moreNum" v-show="item.prizeId!='-1'">
                <span class="inputs"><el-input v-model="item.totalQuantity" placeholder="投放数量" ></el-input></span>
              </el-form-item>
              <el-form-item :prop="'items.'+index+'.probability'" :rules="prizeRules.moreRate">
                <span class="inputs"><el-input v-model="item.probability" :disabled="item.prizeId=='-1'" placeholder="设置中奖率%" @change ="val=>changepro(val,item)"></el-input>%</span>
              </el-form-item>
              <span class="del" v-if="item.name!='谢谢参与'"  @click="delPrize(index)">
                <icon-svg name="20" class="theme-color" style="font-size: 25px;vertical-align: middle;" v-if="isType!='detail'"></icon-svg>
              </span>
              <span style="margin-left: 10px;color: red;font-size: 12px;"  v-show="item.prizeId&&item.prizeType!=='CUSTOMEIZE' && item.prizeId.indexOf('####') != -1">奖项已过期，请重新添加</span>
              <!-- <span style="margin-left: 10px;color: red;font-size: 12px;"  v-show="item.prizeId&&item.prizeType=='STATCARD'&&(item.prizeId).indexOf('####') != -1">奖项已过期，请重新添加</span> -->
              <!-- <span style="margin-left: 10px;color: red;font-size: 12px;"  v-show="item.prizeId&&item.prizeType=='COUPON'&&(item.prizeId).indexOf('####') != -1">奖项已过期，请重新添加</span> -->
            </div>

          </el-form-item>
          <div class="storeBox1 theme-background" @click="addPrize" v-if="bigwheel.items&&bigwheel.items.length<9&&isType!='detail'">+添加一项</div>
          <el-table
            :data="bigwheel.items"
            border
            :stripe="true"
            max-height="360"
            v-if="isType=='detail'"
            ref="goodsTableList"
            style="width: 100%;min-height: 300px;margin-top: 20px;">
            <el-table-column
              prop="level"
              min-width="200"
              :show-overflow-tooltip="true"
              label="奖项">
              <template slot-scope="scope">
                <span>{{number_of(scope.row.level)}}等奖</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              min-width="200"
              :show-overflow-tooltip="true"
              label="奖品">
            </el-table-column>
            <el-table-column
              prop="totalQuantity"
              min-width="200"
              :show-overflow-tooltip="true"
              label="投放总数">
              <template slot-scope="scope">
                <span v-if="scope.row.level==bigwheel.items.length">--</span>
                <span v-else>{{scope.row.totalQuantity}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              min-width="200"
              :show-overflow-tooltip="true"
              label="剩余数量">
              <template slot-scope="scope">
                <span v-if="scope.row.level==bigwheel.items.length">--</span>
                <span v-else>{{scope.row.quantity}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="probability"
              min-width="100"
              :show-overflow-tooltip="true"
              label="中奖率">
              <template slot-scope="scope">
                <span >{{scope.row.probability}}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 活动须知 -->
        <gt-subtitle title="03. 活动须知" />
         <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item prop="radio" label="参与次数" class="limits">
            <div class="radios">
              <el-radio-group v-model="bigwheel.radio" @change="changeRadio" :disabled="isType=='detail'">
                <el-radio :label="1" :value="1">不限</el-radio>
                <el-radio :label="2" :value="2">每位顾客限参与<el-input v-model="bigwheel.times" :disabled="bigwheel.radio!==2||isType=='detail'" @change="val=>changeVal(val,'canyu')"></el-input>次</el-radio>
                <el-radio :label="3" :value="3">每位顾客每天限参与<el-input v-model="bigwheel.dayTimes" :disabled="bigwheel.radio!==3||isType=='detail'" @change="val=>changeVal(val,'canyu')"></el-input>次</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <div class="numbers" v-if="bigwheel.radio==2">
            <span style="margin-right: 10px;margin-bottom: 10px;">分享1次获赠参与次数<el-input v-model="bigwheel.gift"  @change="val=>changeVal(val,'share')" :disabled="isType=='detail'"></el-input>次</span>
            <span>每位顾客最多可获赠参与次数<el-input v-model="bigwheel.share" @change="val=>changeVal(val,'limit')" :disabled="isType=='detail'||bigwheel.gift==0"></el-input>次</span>
          </div>
           <div class="numbers" v-if="bigwheel.radio==3">
            <span style="margin-right: 10px;margin-bottom: 10px;">每天分享1次获赠参与次数<el-input v-model="bigwheel.gift"  @change="val=>changeVal(val,'share')" :disabled="isType=='detail'"></el-input>次</span>
            <span>每位顾客每天最多可获赠参与次数<el-input v-model="bigwheel.share" @change="val=>changeVal(val,'limit')" :disabled="isType=='detail'||bigwheel.gift==0"></el-input>次</span>
          </div>
          <div>温馨提示</div>
          <div class="wxTitle">
            <div>本活动不兑换现金，不找零;</div>
            <div>本活动不与其他优惠叠加，不同享;</div>
            <div>本活动在同一个企业的不同门店均属同一个活动</div>
            <div>活动内容及图片由门店自行提供，若出现侵权或损害您的权益，请及时联系我们平台处理.</div>
          </div>

        </el-card>
        <!-- 活动备注 -->
        <gt-subtitle title="04. 更多详情" />
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;"  class="com-goods-edit">
          <gt-article-form :array="bigwheel.templates" @changeArray="value => changeArray(value)"/>
          <div v-if="isType!='detail'" class="storeBox1 theme-background" @click="addGroup" style="margin: 0 0 20px 100px;">+再添加一组</div>
        </el-card>
        <el-card>
          <el-form-item label="审核说明：" prop="auditcontent">
        <el-input  type="textarea" v-model="auditcontent" style="width: 300px;" :disabled='audit' :maxlength="50"  placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
        </el-card>
      </div>
    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button v-if="!audit" size="large" @click.native="submitCustomer('APPROVED')" :loading="$store.state.loading.global" :disabled="type=='detail'"  txt="审核通过"/>
      <gt-button v-if="!audit" size="large" @click.native="submitCustomer('REFUSED')" :loading="$store.state.loading.global"  :disabled="type=='detail'" txt="拒绝"/>
    </div>
    <gt-select-prize ref="addprize" @refresh="getPrizelist"/>

    <!-- 选择门店 -->
    <gt-store-select ref="checkboxs" @list="listBox"/>
    <!-- 图库 -->
    <gt-select-gallery ref="gallery" @refreshData="getGalleryPic"/>
  </section>
</template>
<script>
import {validatenull,twoDecimal,priceRange} from '@/utils/validate'

import NP from 'number-precision'
import * as api from '@/service/activity'
import gtImageUpload from '@/components/gt-image-upload'
import gtStoreSelect from '../../components/select-store-modal'
import gtTimeRange from '@/components/gt-time-range'
import gtWheelModal from '../../components/wheelModal'
import gtSelectPrize from '../../components/selectPrize'
import gtSelectGallery from '../../components/selectGallery'
import gtSubtitle from '@/components/gt-sub-title'
import gtArticleForm from '@/components/gt-article-form'
import {addTurntable,getactivityDetail} from '@/service/activity'
import { getactivityCoupon,getstatCardSelectOption } from '@/service/campaign'
import { getStoresList } from '@/service/setting'
import { selectPro } from '@/service/goods'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-bigWheeladd',
  components:{ gtSubtitle, gtWheelModal, gtSelectPrize, gtArticleForm, gtTimeRange ,gtStoreSelect,gtImageUpload,gtSelectGallery },
  data(){
    const isNumber =(rule,value,callback)=>{
      // let reg= /^[0-9]+$/
      // if(!reg.test(value)){
      //   return callback(new Error('请输入正整数'))
      // }else{
      //   return callback()
      // }
      if (!priceRange(value, 100, 0)) {
        callback(new Error('请输入0-100数字，最多保留小数点后两位'))
      } else {
        callback()
      }
    }

    const isNumbers =(rule,value,callback)=>{
      let reg= /^[0-9]+$/
      if(!validatenull(value)&&!reg.test(value)){
        return callback(new Error('请输入正整数'))
      }else{
        return callback()
      }
    }

    const isArray =(rule,value,callback)=>{
      if(value.length<4){
        return callback(new Error('请将奖项最少设置为4项'))
      }else{
        return callback()
      }
    }

    const isValidate = (rule ,value,callback)=>{
      if(value <= moment().valueOf()){
        callback(new Error('活动结束时间不得小于等于当前时间'))
      }else{
        callback()
      }
    }
    return{
      checkContent:'',
      prizeArray:[],
      id: null,
      loading: false,
      fromDetailProduct: [],//从详情页面来的商品数据
      fromDetailCoupon: [],//从详情页面来的优惠券数据
      fromDetailStatcard: [],//从详情页面来的计次卡数据
      couponList: [],//优惠券
      productList: [],//商品
      giftCardList:[],//礼品卡
      key: '',//优惠劵关键字查询
      bigwheel: {
        audit:null,
        title:null,
        subTitle: null,
        poster:null,
        cover: null,
        startTime: null,
        endTime: null,
        storeIds:[],
        radio: 2,
        times: 1,
        dayTimes:0,
        gift: 0,
        share: 0,
        items:[{
          name:'谢谢参与',
          quantity: 1,
          totalQuantity: 1,
          probability: '',
          cover: null,
          prizeType: 'CUSTOMEIZE',
          prizeId: -1,
        }],
        templates:[],
        submit: false
      },
      storeList:[],
      gridData:[],
      type: 'CUSTOMEIZE',
      isType: null,
      saveTitle: true,//是否保存title
      allNum: 0,
      isFlag: 1,
      content: null,
      auditcontent: null,
      query: null,
      page: 0,
      size: 10,
      dataHasNext: false,
      bigwheeladdRules:{
        title:[{required: true,message:'请输入活动标题', trigger: 'change'}],
        startTime:[{required: true,message:'请选择活动开始时间', trigger: 'change'}],
        endTime:[{required: true,message:'请选择活动结束时间', trigger: 'change'},
          {validator:isValidate,trigger: 'blur'}],
        cover:[{required: true,message:'请选择封面图片', trigger: 'change'}],
        subTitle:[{required: true,message:'请输入宣传副标题', trigger: 'change'}],
        storeIds:[{required: true,message:'请选择适用门店', trigger: 'change'}],
        items:[{required: true,message:'请设置奖项', trigger: 'change'},
          {validator: isArray, trigger: 'blur'}],
      },
      prizeRules:{
        morePrize:[{required: true,message:'请输入或选择奖项', trigger: 'change'}],
        moreNum:[{required: true,message:'请输入投放数量', trigger: 'change'},
          {validator: isNumbers, trigger: 'blur'}],
        moreRate:[{required: true,message:'请输入中奖率', trigger: 'change'},
          {validator: isNumber, trigger: 'blur'}]
      }

    }
  },
  watch:{
    documentWidth(val,oldVal){
      this.setMainWidth()
    },
    'bigwheel.items':{
      handler(val,oldval){
        let num =0
        val.map(item=>{
          // let reg= /^[0-9]+$/
          if(priceRange(item.probability, 100, 0)){
            num = NP.plus(Math.abs(num),Math.abs(item.probability))
          }
        })
        this.allNum = num
      },
      deep: true

    },
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
    selectKeys() {
      return this.bigwheel.items.map(item => item.prizeId)
    }
  },
  created(){
    var checkContent = this.$route.query.checkContent
    var type = this.$route.query.type
    this.audit = this.$route.query.audit
    if (checkContent && type == 'REJECT') {
      this.checkContent = checkContent
    }
  },
  mounted(){
    this.content = '1.奖项说明：'+
        '1.1 商品--门店在售商品；顾客中奖后，系统会以商品兑换券的形式，将兑换券发放至顾客账号，顾客可以在有效期内使用该兑换券购买对应商品；'+
        '1.2 优惠券--门店发放状态下的优惠券；顾客中奖后，系统会将优惠券自动发放至顾客账号，顾客可以在有效期内使用；'+
        '1.3 自定义商品--系统中不存在的非在售商品；顾客中奖后，系统会以商品兑换券的形式，将兑换券发放至顾客账号；商家需要线下完成对应奖项商品的采购、兑换工作；'+
        '2.请谨慎设置奖品投放数量及中奖率，一旦设置成功，系统将严格按照设置参数进行计算；'+
        '3.除了“谢谢参与”默认奖项，每个大转盘活动需要添加最少3个、最多8个奖项；'
    this.$nextTick(function () {
      this.setMainWidth()
      var activityId = this.$route.query.id
      // var checkContent = this.$route.query.checkContent
      // var type = this.$route.query.type
      if(activityId){
        this.id = activityId
        const {type} = this.$route.query
        // PROCESSING("进行中"),PAUSE("暂停"),NOCHECK("待审核")
        if(type){
          this.isType = 'detail'
          if(type=='PROCESSING'||type=='PAUSE'||type=='NOCHECK'){
            this.saveTitle = true
          }else{
            this.saveTitle = false
          }
        }
        this.getbigwheelDetails(activityId)
      }
      // if (checkContent && type == 'REJECT') {
      //   this.checkContent = checkContent
      // }
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
        this.bigwheel.cover = obj.cover
      }
    },
    // 等级
    number_of (level) {
      level = parseInt(level)
      switch (level) {
      case 1:
        level='一'
        break
      case 2:
        level = '二'
        break
      case 3:
        level = '三'
        break
      case 4:
        level = '四'
        break
      case 5:
        level = '五'
        break
      case 6:
        level = '六'
        break
      case 7:
        level = '七'
        break
      case 8:
        level = '八'
        break
      case 9:
        level = '九'
        break
      }

      return level
    },
    clearVal(){
      this.page = 0
      this.getallSelect('','All')
    },
    // 自定义奖项
    changes(val,item){
      if(item.prizeType == 'CUSTOMEIZE'){
        if(val == '谢谢参与' && item.prizeId!='-1') {
          item.name = ''
          this.$message.warning('已添加过谢谢参与')
        }else{
          item.prizeId = -2
        }
        item.cover = null
      }else if(item.prizeType == 'COUPON'){
        if(this.couponList&&this.couponList.length>0){
          this.couponList.map(o=>{
            if(o.id == item.prizeId) {
              item.name = o.name
              item.cover = null
            }
          })
        }
      }else if(item.prizeType == 'STATCARD'){
        if(this.giftCardList&&this.giftCardList.length>0){
          this.giftCardList.map(o=>{
            if(o.id == item.prizeId) {
              item.name = o.name
              item.cover = null
            }
          })
        }
      }else{
        if(this.productList&&this.productList.length>0){
          this.productList.map(o=>{
            if(o.id == item.prizeId) {
              item.name = o.name
              item.cover = o.cover
            }
          })
        }
      }

    },
    // 中奖率
    changepro(val,o){
      let num = 0
      if(o.prizeId == -1){
        if(!validatenull(o.probability)){
          this.isFlag = 2
        }else{
          this.isFlag = 1
        }
      }else{
        if(this.isFlag ==1){
          this.bigwheel.items.map(item=>{
            if(item.prizeId == -1){
              item.probability = NP.minus(100,Math.abs(num))
              if(!validatenull(item.probability)&&item.probability<0){//若没有书写值
                item.probability = 0
              }
            }else{
              num = NP.plus(Math.abs(num),Math.abs(item.probability))
            }
          })
        }
      }
    },
    // 参与次数规则
    changeRadio(val){
      if(val == 1){
        this.bigwheel.times = 0
        this.bigwheel.dayTimes = 0
        this.bigwheel.gift = 0
        this.bigwheel.share = 0
      }else if(val == 2){
        this.bigwheel.times = 1
        this.bigwheel.dayTimes = 0
      }else{
        this.bigwheel.times = 0
        this.bigwheel.dayTimes = 1
      }
    },
    // 转盘详情
    async getbigwheelDetails(id){
      const {data} = await getactivityDetail(id)
      if(data.data&&data.code == 0){
        let bigwheel = data.data.activityDto
        let tempRadio = null
        if(data.data.times&&data.data.times > 0){
          tempRadio = 2
        }else if(data.data.dayTimes>0){
          tempRadio = 3
        }else{
          tempRadio = 1
        }
        this.auditcontent = data.data.activityDto.checkContent,
        this.bigwheel = {
          ...bigwheel,
          ...data.data,
          radio: tempRadio,
          items: data.data.items.map(item => {
            return {
              ...item,
              probability: this.priceNum(item.probability)
            }
          }),
          id: data.data.activityDto.id,
          startTime: moment(bigwheel.startTime).valueOf(),
          endTime: moment(bigwheel.endTime).valueOf()
        }
        debugger
        if(bigwheel.storeIds&&bigwheel.storeIds.length>0){
          this.getStores(bigwheel.storeIds)
          let num =0
          if(this.bigwheel.items&&this.bigwheel.items.length>=0){
            let items = this.bigwheel.items
            items.forEach(item=>{
              // let reg= /^[0-9]+$/
              // if(reg.test(item.probability)){

              if(priceRange(item.probability, 100, 0)){
                num = NP.plus(Math.abs(num),Math.abs(item.probability))
              }
              if(item.prizeType=='PRODUCT'){
                this.fromDetailProduct.push({
                  id: item.prizeId,
                  name: item.name
                })
              }

              this.page = 0
              this.getProduct('',bigwheel.storeIds,'pros')
            })
            items.push({
              level: items.length+1,
              name:'谢谢参与',
              quantity: 1,
              totalQuantity: 1,
              probability: NP.minus(100,Math.abs(num)),
              cover: null,
              prizeType: 'CUSTOMEIZE',
              prizeId: -1,
            })
            items.map(item=>{
              if(item.prizeId == -1){
                item.name = '谢谢参与'
              }
            })
            this.getactivityCoupon('',bigwheel.storeIds)
            this.getCountCard('',bigwheel.storeIds)
          }
        }

      }else{
        this.$message.error(data.msg)
      }
    },
    // 获取企业下属门店
    async getStores(storeIds) {
      const { data } = await getStoresList({
        pageSize: 10000,
        currentPage: 1,
        key: null,
        status:1
      })
      if (data.code === 0) {
        this.gridData = data.data.records
        if(this.gridData&&this.gridData.length>0){
          let storeList = []
          this.gridData.map(o=>{
            storeIds.map(i=>{
              if(o.id  == i){
                storeList.push({
                  id: o.id,
                  name: o.name
                })
              }
            })
          })
          this.storeList = storeList
        }
      } else {
        this.gridData = []
      }
    },
    // 适用门店
    storeidsget(){
      let array = []
      this.storeList.map(item =>{
        array.push(item.id)
      })
      this.bigwheel.storeIds = array
    },

    // 选择门店
    selectSalestore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList)
      })
    },

    //弹框复选返回值(门店)
    listBox(obj){
      console.log(obj)
      this.storeList = JSON.parse(obj)
      let items = this.bigwheel.items
      items.map(item=>{
        if(item.name !='谢谢参与'){
          item.name = ''
          item.prizeId = ''
        }
      })
      this.bigwheel.items = items
      this.getallSelect('','All')
    },
    // 删除适应门店
    close(idx){
      this.storeList.splice(idx,1)
      let items = this.bigwheel.items
      items.map(item=>{
        if(item.name !='谢谢参与'){
          item.name = ''
          item.prizeId = ''
        }
      })
      this.bigwheel.items = items
      this.getallSelect('','All')
    },
    // 加载更多
    loadMore(){
      if (this.dataHasNext) {
        this.type = 'PRODUCT'
        this.page++
        this.getallSelect(this.query)
      }
    },
    // 选择商品
    async getProduct(query,storeids,fs){
      const { data } = await selectPro({
        'page': this.page,
        'size': this.size,
        'key': query,
        'type': 'ENTITY',
        'ownership': 'COMPANY',
        'saleStatus': 'ON',
        'storeIds': storeids.join(',')
      })
      if (data && data.code == 0) {
        let oldList = this.page == 0 ? [] : this.productList
        oldList = oldList.concat(data.data.records || [])
        data.data.records.forEach(o=>{
          for(var i=this.fromDetailProduct.length-1;i>=0;i--){
            var item = this.fromDetailProduct[i]
            if(o.id === item.id){
              this.fromDetailProduct.splice(i,1)
            }
          }
        })
        this.dataHasNext= data.data.hasNext
        this.productList = oldList
      } else {
        this.productList = []
        this.$message.warning(data.msg)
      }
    },
    // 选择优惠券
    async getactivityCoupon(query,storeids) {
      const { data } = await getactivityCoupon({
        'keyword': query,
        'storeId': storeids.join(',')
      })
      if (data && data.code == 0) {
        this.couponList = data.data
      } else {
        this.couponList = []
        this.$message.warning(data.msg)
      }
    },
    // 选择礼品卡
    async getCountCard(query,storeids){
      const { data } = await getstatCardSelectOption({
        'keyword': query,
        'storeIds': storeids.join(',')
      })
      if (data && data.code == 0) {
        this.giftCardList = data.data
      } else {
        this.giftCardList = []
        this.$message.warning(data.msg)
      }
    },
    // CUSTOMEIZE
    getallSelect(query,isAll){
      this.storeidsget()
      let storeids = this.bigwheel.storeIds || []
      if(!validatenull(storeids)&&storeids.length>0){
        if(this.type == 'PRODUCT'){
          this.getProduct(query,storeids)
        }else if(this.type == 'COUPON'){
          this.getactivityCoupon(query,storeids)
        }else if(this.type == 'STATCARD'){
          this.getCountCard(query,storeids)
        }else if(this.type == 'CUSTOMEIZE'){

        }
        if(isAll == 'All'){
          this.getProduct(query,storeids)
          this.getactivityCoupon(query,storeids)
          this.getCountCard(query,storeids)
        }
      }else{
        this.couponList = []
        this.productList = []
        this.$message.error('请先选择适用门店')
      }
    },
    // 输入查询
    remoteMethod(query) {
      this.query = query
      this.page = 0
      this.getallSelect(query)
    },
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.bigwheel .el-form').width()
      $('.rights').css('width',formWidth-370)
      window.onresize = () => {
        var formWidth=$('.bigwheel .el-form').width()
        $('.rights').css('width',formWidth-370)
      }
    },

    // 图片
    updatePicUrl:function(imgoBJ){
      this.bigwheel[imgoBJ.str] = imgoBJ.value
    },

    // 添加一组
    addGroup() {
      this.bigwheel.templates.push({
        type: 'TITLE',
        content: ''
      })
      this.bigwheel.templates.push({
        type: 'CONTENT',
        content: ''
      })
      this.bigwheel.templates.push({
        type: 'IMAGE',
        content: ''
      })
    },
    changeArray(array) {
      this.bigwheel.templates = array
    },
    // 删除奖项
    delPrize(idx){
      this.bigwheel.items.splice(idx,1)
      let num =0
      let items = this.bigwheel.items
      if(items&&items.length>0){
        items.map(item=>{
          let reg= /^[0-9]+$/
          if(reg.test(item.probability)&&item.prizeId!=-1){
            num = NP.plus(Math.abs(num),Math.abs(item.probability))
          }
          if(item.prizeId == -1){
            item.probability = NP.minus(100,Math.abs(num))
          }
        })
      }
    },
    // 奖项设置--添加一项
    addPrize(){
      if(this.allNum>100){
        this.$message.warning('中奖率必须要等于100%')
        return
      }
      this.$refs.addprize.init()
    },
    // 奖品选择
    getPrizelist(type){
      this.bigwheel.items.splice(this.bigwheel.items.length-1, 0, {
        name: null,
        quantity: null,
        totalQuantity: null,
        probability: null,
        cover: null,
        prizeType: type,
        prizeId: null
      })
      this.type=type
      if(type=='COUPON' || type=='PRODUCT' || type == 'STATCARD'){
        this.getallSelect('')
      }else{//CUSTOMEIZE  自定义

      }
    },
    // 参与次数
    changeVal(val,type){
      let CS = /^[0-9]+$/
      if(CS.test(val)){
        if(type=='canyu' ){
          if(this.bigwheel.times>0 && this.bigwheel.radio==2){
            this.bigwheel.times = val
            this.bigwheel.dayTimes = 0
          }else if(this.bigwheel.radio==2){
            this.bigwheel.times = 1
            this.$message.warning('参与次数必须大于0')
          }
          else if(this.bigwheel.radio==3){
            this.bigwheel.dayTimes = val
            this.bigwheel.times = 0
          }
        }else if(type=='share'){
          if(Number(this.bigwheel.gift)>=0&&Number(this.bigwheel.gift) <=Number(this.bigwheel.share)){
            this.bigwheel.gift = val
          }else{
            this.$message.warning('分享获赠次数必须小于等于顾客最多可获赠次数')
          }
        }else{//limit
          if(Number(this.bigwheel.gift) <=Number(this.bigwheel.share)){
            this.bigwheel.share = val
            return true
          }else{
            this.$message.warning('分享获赠次数必须小于等于顾客最多可获赠次数')
            return false
          }
        }
      }else{
        this.$message.warning('只能输入正整数')
        val = type=='canyu'?1:0
        if(type=='canyu'){
          this.bigwheel.times = val
        }else if(type=='share'){
          this.bigwheel.gift = val
        }else{//limit
          this.bigwheel.share = val
        }
      }
    },
    // 获取奖品名称--传值时不包括谢谢参与
    getPrizeName(type){
      var array = this.bigwheel.items
      array.forEach((item,index)=>{
        item.level = index+1
        if(type=='edit'){
          item.quantity = item.totalQuantity
        }
      })
      this.$set(this.bigwheel,'items',array)
    },
    flagApply(submit){
      if ( this.bigwheel.radio == 3 && this.bigwheel.dayTimes == 0) {
        this.$message.warning('选择每位顾客每天限参与，需大于0')
        return
      }
      if(submit){
        var text
        if(this.bigwheel.radio == 1){
          text = '参与次数设置“不限” 会存在刷单风险，确定要保存并提交吗?'
          this.$easyConfirm.show({
            title: '提示',
            content: text,
            confirm:() => {
              this.submitCustomer(submit)
              this.$easyConfirm.hide()
            }
          })
        }else{
          text = '参与次数过大可能会存在刷单风险，确定要保存并提交吗?'
          if(parseInt(this.bigwheel.share)>20 || parseInt(this.bigwheel.times)>20 || parseInt(this.bigwheel.gift)>20){
            this.$easyConfirm.show({
              title: '提示',
              content: text,
              confirm:() => {
                this.submitCustomer(submit)
                this.$easyConfirm.hide()
              }
            })
          }else{
            this.submitCustomer(submit)
          }
        }

      }else{
        this.submitCustomer(submit)
      }
    },
    async getParam(submit){
      console.log()
      const {data} = await addTurntable({
        ...this.bigwheel,
        id: this.id,
        items: this.bigwheel.items.filter(item=>item.prizeId!=-1).map(item => {
          return {
            ...item,
            probability: this.priceNum(item.probability, 'out')
          }
        }),
        submit: submit,
        createOrUpdate: this.id?((this.saveTitle&&this.isType==='detail')?false:true):true
      })
      if(data.code == 0){
        this.$router.push({name:'campaign-wechatMarketing-activeList-activeList'})
      }else{
        this.$message.error(data.msg)
      }
    },
    async submitCustomer(result){
      this.dataListLoading = true;
      if(this.auditcontent){
            const { data } = await api.auditActivity({
                    id:this.id,
                    result,
                    content:this.auditcontent
            });
            this.dataListLoading = false;
             if (data && data.code === 0) {
               this.$router.push({name:'audit-activityAudit-list'})
      } else {
        this.$message.error(data.msg)
      }
      } else{
        this.$message.warning('请填写审核内容')
      }
          }
  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/campaign/bigwheel.scss';
.com-goods-edit{
  .gt-input-tip.large{
    .el-input__inner{
      width: 300px;
    }
    .el-input__prefix{
      left: 310px;
    }
  }
}
.width-limit{
  max-width: 300px;
}
.gt-icon-add{
  width: 18px;
  height: 18px;
  line-height: 32px;
}
.answer{
  position: relative;
  top: -2px;
  width: 18px;
  margin-right: 15px;
}

.fromGallery {
  cursor:pointer;position:absolute;top: 10px;left: 180px;border-radius:10px;padding: 0 10px;height: 30px;line-height: 30px;
}
</style>
