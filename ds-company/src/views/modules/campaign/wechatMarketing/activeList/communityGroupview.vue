<template>
  <section class="addactive addactive1"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="activeadd" ref="activeadd" :rules="activeaddaddRules" label-width="110px">
      <!-- 手机模板 -->
      <gt-specail-model :activeadd= "activeadd" />
      <!-- 右侧信息 -->
      <div class="rights">
        <el-card class="cards" v-show="isHidden">
          <span class="destion" v-if="isFlag">您还没有维护过社区拼团的团长等级，请先进行维护</span>
          <span @click="withdrawalAmountSet" class="qW theme-border theme-color" v-if="isFlag">立即维护</span>
          <span @click="withdrawalAmountSet" class="qW theme-border theme-color" v-if="!isFlag">查看社区拼团团长等级</span>
        </el-card>
        <div v-show="isHidden">
          <div style="color:red;font-size:14px;padding-top:8px;" v-if="checkContent">审核说明：{{checkContent}}</div>
          <gt-subtitle title="01. 基本信息"/>
          <el-card style="margin-bottom: 10px;">
            <div>
              <el-form-item label="活动标题" prop="title" class="labelWidth">
                <el-input v-model="activeadd.title" :maxlength="30" :disabled="!saveTitle" placeholder="请输入活动标题(至多30个汉字)"></el-input>
              </el-form-item>
              <el-form-item label="活动时间" class="gt-inline-item" required>
                <gt-time-range
                :disabled="type=='detail'"
                start-time-prop="startTime"
                :start-time-value="activeadd.startTime"
                :end-time-value="activeadd.endTime"
                end-time-prop="endTime"
                @changeStartValue="value => activeadd.startTime = value"
                @changeEndValue="value => activeadd.endTime = value"
              ></gt-time-range>
              </el-form-item>
              <el-form-item label="封面图片" prop="cover" class="view-img">
                <span style="position: relative;display: block">
                <gt-image-upload
                  v-if="type!='detail'"
                  @updatePicUrl="updatePicUrl"
                  :realistStr="'cover'"
                  :names="2"
                  :multiple="true"
                  :max=1
                  tip="(图片尺寸建议 750x350或等比图片，大小5M以下)"
                  :reallist="activeadd.cover"
                  :cb="value => activeadd.cover = value" />
                  <img v-else :src="'http://'+activeadd.cover" alt="">
                </span>
                <span class="theme-border theme-color fromGallery" @click="gallerySelect('single')" v-if="type!='detail'">从图库选择</span>
            </el-form-item>
            <el-form-item label="分享图片" prop="poster" class="view-img">
                <span style="position: relative;display: block" v-if="activeadd.poster">
                <gt-image-upload
                  v-if="type!='detail'"
                  @updatePicUrl="updatePicUrl"
                  :realistStr="'poster'"
                  :names="3"
                  :multiple="true"
                  :max=1
                  tip="(图片尺寸建议 750x750或等比图片，大小5M以下)"
                  :reallist="activeadd.poster"
                  :cb="value => activeadd.poster = value" />
                  <img v-else :src="'http://'+activeadd.poster" alt="">
                </span>
                <span v-else>--</span>
            </el-form-item>
              <el-form-item label="宣传副标题" prop="subTitle" class="labelWidth">
                <el-input v-model="activeadd.subTitle" :maxlength="50" :disabled="!saveTitle" placeholder="请输入活动标题(至多50个汉字)"></el-input>
              </el-form-item>
              <el-form-item label="适用门店" prop="storeIds">
                <span class="storeBox theme-background" v-for="(item,index) in storeList" :key="item.id"><b :title="item.name">{{item.name}}</b><span v-if="type!='detail'" class="close" @click="close(index)">X</span>  </span>
                <span class="selectSale" @click="selectSalestore" v-if="type!='detail'">
                  <icon-svg name="create" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
                </span>
              </el-form-item>
              <el-form-item label="商品购买次数" prop="activityProductNum">
                每个用户ID/手机号码同一件商品最多只能购买 <el-input class="cus-mini-input" :disabled="type=='detail'" v-model="activeadd.activityProductNum"></el-input> 个（不填写默认不限制购买次数）
              </el-form-item>
            </div>
          </el-card>

          <!-- 社区拼团内容 -->
          <gt-subtitle title="02. 社区拼团内容"/>
          <el-card class="contentSp" style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <div v-for="(item, index) in activeadd.items" :key="index" class="inlines"  v-show="activeadd.items && activeadd.items.length > 0">
              <el-col :span="22">
                <el-form-item class="specail view-img" :label="'社区拼团图片'+(index+1)" :prop="'items.'+index+'.specailcover'" :rules="specailRules.moreSpecailPic">
                  <span style="position:relative">
                  <gt-image-upload
                  v-if="type!='detail'"
                  @updatePicUrl="updatePicUrl"
                  :realistStr="'specailcover'"
                  :names="'specailcover' +index"
                  :multiple="true"
                  :max='1'
                  :comp="12"
                  tip="(图片尺寸建议 750x750或等比图片，大小不超过5M)"
                  :reallist="item.specailcover"
                  :cb="value => item.specailcover = value" />
                  <img v-else :src="'http://'+item.specailcover" alt="">
                </span>
                <span class="theme-border theme-color fromGallery" @click="gallerySelect('double',index)" v-if="type!='detail'">从图库选择</span>
              </el-form-item>

                <el-form-item>
                  <div class="listGoods" :id="'product-' + good.productId" :class="{'error-goods': deleteGoodsIds.indexOf(good.productId) > -1}" v-for="good in item.products" :key="good.id">
                    <div class="name">{{good.name}}，{{priceNum(good.retailPrice)}}元</div>
                    <div class="inputs">设置拼团价格<el-input v-model='good.price' @change="val=>changeVal(val,good)"
                :disabled="type=='detail'"></el-input>元</div><br/>
                    <div class="inputs">设置商品限量<el-input v-model='good.productNumTol' @change="val=>changeNum(val,good)" :disabled="type=='detail'"></el-input>个</div><br/>
                    <div class="inputs" v-show="type=='detail'">商品剩余数量 {{good.productNum === 0 ? 0 : (good.productNum || '--')}} 个</div>
                  </div>
                </el-form-item>

                <el-form-item :prop="'items.'+index+'.products'" :rules="specailRules.moreSpecailList" v-if="type!='detail'">
                  <div class="selectgoods theme-border theme-color" @click="selectGoods(index,'specail')">选择叠加商品</div>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="2" v-if="type!='detail'">
                <span class="closeSpecail" @click="addSpecail('del',index)">
                  <icon-svg name="20" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
                </span>
              </el-col> -->
            </div>
            <!-- <div class="gt-form-bottom-submit"  @click="addSpecail('add')" v-if="type!='detail'">
              <el-button class="addSpecail theme-background"><span style="margin-right: 10px;">+</span><span>增加一组内容和商品</span></el-button>
            </div> -->
          </el-card>

          <!-- 更多社区拼团商品 -->
          <gt-subtitle title="03. 更多社区拼团商品" />
          <el-card class="contentSp contentSp1" style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <div v-for="(item, index) in activeadd.products" :key="index" class="inlines">
              <el-col :span="22">
                <el-form-item>
                  <div class="listGoods listGoods1" :id="'product-' + good.productId" :class="{'error-goods': deleteGoodsIds.indexOf(good.productId) > -1}" v-show="item.first" v-for="good in item.first" :key="good.id">
                    <div class="imgsgood">
                      <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic.png'" alt="">
                    </div>
                    <div class="name">{{good.name}}</div>
                    <div class="colorRed">{{priceNum(good.retailPrice)}}元</div>
                    <div class="inputs">设置拼团价格<el-input v-model='good.price' @change="val=>changeVal(val,good)"
                :disabled="type=='detail'"></el-input>元</div><br/>
                    <div class="inputs">设置商品限量<el-input v-model='good.productNumTol' @change="val=>changeNum(val,good)" :disabled="type=='detail'"></el-input>个</div><br/>
                    <div class="inputs" v-show="type=='detail'">商品剩余数量 {{good.productNum === 0 ? 0 : (good.productNum || '--')}} 个</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="type!='detail'">
                <span class="closeSpecail" @click="selectGoods(index,'products')" title="添加商品">
                  <icon-svg name="create" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
                  <!-- <img style="height: 25px;margin-right:5px;" src="static/img/mycustomer/addbaby.png" alt=""> -->
                </span>
                <span class="closeSpecail" @click="addProduct('del',index)" title="删除商品">
                  <!-- <img src="static/img/mycustomer/del.png" alt=""> -->
                  <icon-svg name="20" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>

                </span>
              </el-col>
            </div>

            <div class="gt-form-bottom-submit"  @click="addProduct('add')" v-if="type!='detail'">
              <el-button class="addSpecail theme-background"><span style="margin-right: 10px;">+</span><span>增加一组商品</span></el-button>
            </div>
          </el-card>
        </div>

        <div v-show="!isHidden">
          <!-- 设置团长佣金奖励 -->
          <gt-subtitle title="04. 设置团长佣金奖励" />
          <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <el-form-item label="设置模式" prop="commissionType">
              <el-radio-group v-model="activeadd.commissionType" @change="changeRadios" :disabled="type=='detail'">
                <el-radio :label="'AMOUNT'" :value="'AMOUNT'">按商品金额(元)</el-radio>
                <el-radio :label="'PROPORTION' " :value="'PROPORTION'">按拼团价格比例(%)</el-radio>
              </el-radio-group>
            </el-form-item>
            <div>
              <el-table
                :data="activeadd.commissionRuleList"
                border
                :stripe="true"
                height="300"
                class="table_commision"
                style="width: 100%;">
                <el-table-column
                  prop="index"
                  width="60"
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
                  label="社区拼团价格(元)">
                  <template slot-scope="scope">
                    <span v-if="type==='detail'">{{priceNum(scope.row.price)}}</span>
                    <span v-else>{{scope.row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="佣金奖励" class="haha">
                  <el-table-column
                    prop="blackGold"
                    min-width="150"
                    :label="'黑金'+dw">
                    <template slot-scope="scope">
                      <el-input class="inputs1" :disabled="type=='detail'" v-model="scope.row.blackGold" @change="numberInfo(scope.row,'blackGold')"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="gold"
                    min-width="150"
                    :label="'黄金'+dw">
                    <template slot-scope="scope">
                      <el-input class="inputs1" :disabled="type=='detail'" v-model="scope.row.gold" @change="numberInfo(scope.row,'gold')"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="normal"
                    min-width="150"
                    :label="'普通'+dw">
                    <template slot-scope="scope">
                      <el-input class="inputs1" :disabled="type=='detail'" v-model="scope.row.normal" @change="numberInfo(scope.row,'normal')"></el-input>
                    </template>
                  </el-table-column>
                </el-table-column>

              </el-table>
              <div style="margin-top: 20px;color: red;font-size: 12px;">温馨提示：黑金、黄金的佣金奖励不能为空。</div>
            </div>
          </el-card>
          <!-- 活动备注 -->
          <gt-subtitle title="05. 活动备注" />
          <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <el-form-item label="活动备注" prop="remark">
              <el-input type="textarea" v-model="activeadd.remark" :disabled="type=='detail'"></el-input>
            </el-form-item>
          </el-card>
          <el-card>
          <el-form-item label="审核说明：" prop="auditcontent">
            <el-input  type="textarea" v-model="auditcontent" style="width: 300px;" :maxlength="50" :disabled='audit' placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
          </el-card>
        </div>
      </div>

    </el-form>
    <div class="gt-form-bottom-submit" v-if="isHidden">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="nextStep()" txt="下一步" />
    </div>

    <div class="gt-form-bottom-submit" v-if="!isHidden">
      <gt-button size="large" is-default @click.native="prevStep()" txt="返回上一步" />
      <gt-button size="large" v-if="!audit" @click.native="submitCustomer('APPROVED')" :loading="$store.state.loading.global"  txt="审核通过"/>
      <gt-button size="large" v-if="!audit" @click.native="submitCustomer('REFUSED')" :loading="$store.state.loading.global"  txt="拒绝"/>
    </div>

    <!-- 选择叠加商品 -->
    <gt-select-goods ref="selectgoods" @refreshData="changeGoods"/>

    <!-- 选择门店 -->
    <gt-store-select ref="checkboxs" @list="listBox"/>

    <!-- 立即维护粉丝 -->
    <gt-withdrawal-amount-set ref="withdrawal" @updateWithdrawal="detailwithdrawal"/>
    <!-- 图库 -->
    <gt-select-gallery ref="gallery" @refreshData="getGalleryPic"/>
  </section>
</template>
<script>
import * as api from '@/service/activity'
import {validatenull,commissionRange} from '@/utils/validate'
import gtWithdrawalAmountSet from '../../components/withdrawalAmountSet'
import gtImageUpload from '@/components/gt-image-upload'
import gtSelectGoods from '../../components/selectGoods'
import gtSelectGallery from '../../components/selectGallery'
import gtSpecailModel from '../../components/specailModal'
import gtSubtitle from '@/components/gt-sub-title'
import {saveGroupBuy,getactivityDetail,getheadRuleDetail, checkGroupBuyPro} from '@/service/activity'
import { getStoresList } from '@/service/setting'
import gtStoreSelect from '../../components/select-store-modal'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-communityGroup',
  components:{ gtSubtitle, gtImageUpload, gtSelectGoods, gtSpecailModel,gtTimeRange,gtStoreSelect,gtWithdrawalAmountSet,gtSelectGallery },
  data(){
    const isValidate = (rule ,value,callback)=>{
      if(value <= new Date().getTime()){
        callback(new Error('活动结束时间不得小于等于当前时间'))
      }else{
        callback()
      }
    }
    const validateNum = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value || value === 0) {
        if (!reg.test(value)) {
          callback(new Error('请输入1-99999的正整数！'))
        } else if (value <= 0 || value > 99999){
          callback(new Error('请输入1-99999的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      audit: null,
      auditcontent:'',
      checkContent:'',
      loading: false,
      obj:{},
      dw: '(元)',
      isFlag: true,
      deleteGoodsIds: [], // 被删除的商品id
      activeadd: {
        title:null,
        subTitle: null,
        cover: null,
        poster:null,
        startTime: null,
        endTime: null,
        storeIds:[],
        items:[{ //社区拼团内容
          specailcover:'',
          products:[]
        }],
        products: [],
        remark:'',
        commissionType: 'AMOUNT',
        commissionRuleList: []
      },
      id: null,
      type: null,
      saveTitle: true,//是否保存title
      storeList:[],
      gridData:[],
      isHidden: true,
      activeaddaddRules:{
        title:[{required: true,message:'请输入活动标题', trigger: 'change'}],
        startTime:[{required: true,message:'请选择活动开始时间', trigger: 'change'}],
        endTime:[{required: true,message:'请选择活动结束时间', trigger: 'change'},
          {validator:isValidate,trigger: 'blur'}],
        cover:[{required: true,message:'请选择封面图片', trigger: 'change'}],
        subTitle:[{required: true,message:'请输入宣传副标题', trigger: 'change'}],
        storeIds:[{required: true,message:'请选择适用门店', trigger: 'change'}],
        activityProductNum: [{validator: validateNum, trigger: 'blur' }]
      },
      specailRules:{
        moreSpecailPic: [{ required: true, message: '请选择社区拼团图片', trigger: 'change' }],
        moreSpecailList: [{ required: true, message: '请至少选择一个商品', trigger: 'change' }]
      }
    }
  },
  watch:{
    documentWidth(val,oldVal){
      this.setMainWidth()
    }
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
  },
  created() {
    var activityId = this.$route.query.id
    var checkContent = this.$route.query.checkContent
    this.audit = this.$route.query.audit
    var type = this.$route.query.type
    if(activityId){
      this.id = activityId
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
      this.getactivityDetail(activityId)
    }
    if (checkContent && type == 'REJECT') {
      this.checkContent = checkContent
    }
    this.detailwithdrawal()
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()
    })
  },
  methods:{
    gallerySelect(type,index){
      this.$nextTick(() => {
        this.$refs.gallery.init(type,index)
      })
    },
    // 从图库选择
    getGalleryPic(obj){
      if(obj.type=='single'){
        this.activeadd.cover = obj.cover
      }else{
        this.activeadd.items[obj.index].specailcover = obj.cover
      }
    },
    async detailwithdrawal(){
      const {data} = await getheadRuleDetail()
      if(data.code == 0){
        if(data.data){
          this.obj = data.data
          this.isFlag = false
        }else{
          this.obj = null
          this.isFlag = true
        }
      }else{
        this.$message.error(data.msg)
      }
    },
    // 维护粉丝
    withdrawalAmountSet(){
      this.$nextTick(() => {
        this.$refs.withdrawal.init(this.obj,this.isFlag)
      })
    },
    // 切换设置模式
    changeRadios(val){
      if(val == 'AMOUNT'){
        this.dw = '(元)'
        this.activeadd.commissionRuleList.map(o=>{
          o.blackGold = null
          o.gold = null
          o.normal = null
        })
      }else{
        this.dw = '(%)'
        this.activeadd.commissionRuleList.map(o=>{
          o.blackGold = null
          o.gold = null
          o.normal = null
        })
      }
    },
    // 根据条件判断黑金，黄金，普通佣金
    numberInfo(obj,type,wher){
      if(type =='blackGold'){//黑金
        if(this.communityInfo(obj.blackGold,obj.price,type) !=1){
          if(Math.abs(obj.blackGold) <= Math.abs(obj.gold)){
            if(wher == 'check'){
              obj.gold = ''
              obj.normal = ''
            }
            obj.blackGold = ''
            this.$message.warning('黑金必须大于黄金的佣金奖励')
            return 1
          }
        }else{
          if(wher == 'check'){
            obj.gold = ''
            obj.normal = ''
          }
          obj.blackGold = ''
          return 1
        }
      }else if(type=='gold'){//黄金
        if(this.communityInfo(obj.gold,obj.blackGold,type) !=1){
          if(Math.abs(obj.blackGold) <= Math.abs(obj.gold)){
            if(wher == 'check'){
              obj.normal = ''
            }
            obj.gold = ''
            this.$message.warning('黄金必须小于黑金的佣金奖励')
            return 1
          }
        }else{
          if(wher == 'check'){
            obj.normal = ''
          }
          obj.gold = ''
          return 1
        }
      }else{//普通
        if(this.communityInfo(obj.normal,obj.gold,type) != 1){
          if(Math.abs(obj.gold) <= Math.abs(obj.normal)){
            obj.normal = ''
            this.$message.warning('普通必须小于黄金的佣金奖励')
            return 1
          }
        }else{
          obj.normal = ''
          return 1
        }
      }
    },

    // 黄金-黑金-普通
    communityInfo(quantity,price,type){
      if(!validatenull(quantity)){
        if(this.activeadd.commissionType == 'AMOUNT'){//选中商品价格
          if(type == 'blackGold'){//黑金
            if (!commissionRange(quantity, price,'blackGold')) {
              this.$message.warning('黑金佣金奖励只能输入小于等于社区拼团价的金额(最多保留小数点后两位，不为负数且不能为0)')
              return 1
            }
          }else if(type == 'gold'){//黄金
            if (!commissionRange(quantity, price,'gold')) {
              this.$message.warning('黄金只能输入小于黑金的佣金奖励(最多保留小数点后两位，不为负数且不能为0)')
              return 1
            }
          }else{//普通
            if (!commissionRange(quantity, price,'normal')) {
              this.$message.warning('普通只能输入小于黄金的佣金奖励(最多保留小数点后两位，不为负数)')
              return 1
            }
          }


        }else{//选中社区拼团价比例
          if(type == 'blackGold'){//黑金
            if (!commissionRange(quantity, 100,'blackGold')) {
              this.$message.warning('黑金佣金比例只能输入小于等于100%(最多保留小数点后两位，不为负数且不能为0)')
              return 1
            }
          }else if(type == 'gold'){//黄金
            if (!commissionRange(quantity, price,'gold')) {
              this.$message.warning('黄金只能输入小于黑金的佣金比例(最多保留小数点后两位，不为负数且不能为0)')
              return 1
            }
          }else{//普通
            if (!commissionRange(quantity, price,'normal')) {
              this.$message.warning('普通只能小于黄金的佣金比例(最多保留小数点后两位，不为负数)')
              return 1
            }
          }
        }
      }else{
        if(type != 'normal'){//黄金黑金为空
          this.$message.warning('黑金、黄金商品佣金奖励必填')
          return 1
        }
      }
    },

    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.addactive .el-form').width()
      $('.rights').css('width',formWidth-370)
      window.onresize = () => {
        var formWidth=$('.addactive .el-form').width()
        $('.rights').css('width',formWidth-370)
      }
    },

    // 社区拼团详情
    async getactivityDetail(id){
      const {data} = await getactivityDetail(id)
      if(data.code == 0&&data.data){
        let activeadd = data.data.activityDto
        this.activeadd = {
          ...activeadd,
          ...data.data,
          items: data.data.items,
          startTime: moment(activeadd.startTime).valueOf(),
          endTime: moment(activeadd.endTime).valueOf()
        }
        this.auditcontent = data.data.activityDto.checkContent,
        this.activeadd.id = data.data.activityDto.id
        if(data.data.items&&data.data.items.length>0){
          data.data.items.map(item=>{
            item.specailcover = item.cover
            if(this.activeadd.commissionType == 'AMOUNT'){
              this.dw = '(元)'
              item.products.map(o=>{
                o.blackGold = this.priceNum(o.blackGold,'in')
                o.gold = this.priceNum(o.gold,'in')
                o.normal = this.priceNum(o.normal,'in')
              })
            }else{
              this.dw = '%'
            }
          })
        }
        if(data.data.products&&data.data.products.length>0&&this.activeadd.commissionType == 'AMOUNT'){
          data.data.products.map(item=>{
            item.first.map(o=>{
              o.blackGold = this.priceNum(o.blackGold,'in')
              o.gold = this.priceNum(o.gold,'in')
              o.normal = this.priceNum(o.normal,'in')
            })
          })
        }
        this.isprice('in')
        if(activeadd.storeIds&&activeadd.storeIds.length>0){
          this.getStores(activeadd.storeIds)
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
    // 图片
    updatePicUrl:function(imgoBJ){
      this.activeadd[imgoBJ.str] = imgoBJ.value
    },
    // 选择门店
    selectSalestore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList)
      })
    },

    //弹框复选返回值(门店)
    listBox(obj){
      this.storeList = JSON.parse(obj)
      this.activeadd.items.map(o=>{//社区拼团内容
        o.specailcover = o.specailcover
        o.products = []
      })
      this.activeadd.products = []
    },

    // 删除适应门店
    close(idx){
      this.storeList.splice(idx,1)
      this.activeadd.items.map(o=>{//社区拼团内容
        o.specailcover = o.specailcover
        o.products = []
      })
      this.activeadd.products = []
    },
    // 选择叠加商品--更多社区拼团商品
    selectGoods(idx,type){
      this.storeidsget()
      var list = []
      if(type == 'products'){
        list = this.activeadd.products[idx].first
      }else{
        list = this.activeadd.items[idx].products
      }
      this.$nextTick(() => {
        this.$refs.selectgoods.init(list,idx,type,this.activeadd.storeIds,-1)
      })
    },
    // 获取选中商品的列表--更多社区拼团商品
    changeGoods(obj) {
      let array = []
      obj.list.map(item=>{
        array.push({
          'productId':item.id,
          'pic': item.cover,
          'name': item.name,
          'retailPrice': item.retailPrice,
          'price': item.price,
          'gold':item.gold,
          'blackGold':item.blackGold,
          'normal':item.normal,
        })
      })

      if(obj.type=='products'){
        this.activeadd.products[obj.index].first = array
      }else{
        this.activeadd.items[obj.index].products = array
      }
    },
    // 社区拼团商品新增--社区拼团商品删除
    addProduct(type,idx){
      if(type == 'add'){
        this.activeadd.products.push({
          first:[]
        })
      }else{
        this.activeadd.products.splice(idx,1)
      }
    },
    // 新增一组内容和商品--删除一组内容和商品
    addSpecail(type,idx){
      if(type=='del'){
        this.activeadd.items.splice(idx,1)
      }else{
        this.activeadd.items.push({
          specailcover:'',
          products:[]
        })
      }
    },
    changeVal(val,item){
      let reg= /[^0-9.]/g
      if(!reg.test(val)&&val<this.priceNum(item.retailPrice)){
        return val
      }else{
        this.$message.warning('社区拼团价格只能输入数字,且必须小于零售价(不能为0)')
        item.price=null

        return false
      }
    },
    changeNum(value,item){
      const reg = /^\d+$/
      if (value || value === 0) {
        if (!reg.test(value) || value <= 0 || value > 99999) {
          this.$message.warning('请输入1-99999的正整数！')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 校验保存信息
    checkInfo(){
      let ids = []
      let goodsList = this.activeadd.items
      let array1 = []
      if(goodsList){
        for(var i in goodsList){
          let itemList = goodsList[i].products
          if(itemList){
            for(var j in itemList){
              ids.push(itemList[j].productId)
              array1.push(itemList[j])
              let price = itemList[j].price
              let number = itemList[j].productNumTol
              if(!price||price <= 0){
                this.$message.warning('社区拼团价格只能输入数字,且必须小于零售价(不能为0)')
                return 1
              }
              if (!this.changeNum(number)){
                return 1
              }
            }
          }
        }
      }

      // 更多社区拼团活动
      let proids = []
      let products = this.activeadd.products
      let array2 = []
      if(products){
        for(var i in products){
          let itemLists = products[i].first
          if(itemLists){
            for(var j in itemLists){
              proids.push(itemLists[j].productId)
              array2.push(itemLists[j])
              let price = itemLists[j].price
              let number = itemLists[j].productNumTol
              if(!price||price <= 0){
                this.$message.warning('社区拼团价格不能为空且不能为0')
                return 1
              }
              if (!this.changeNum(number)){
                return 1
              }
            }
          }
        }
      }

      var listids = [...ids,...proids]
      var productsList = [...array1,...array2]
      this.activeadd.commissionRuleList = this.uniq(productsList)
      this.checkSetName()
      var newids = [...ids,...proids]
      var setName = new Set(newids)
      if(setName.size != listids.length){
        this.$message.warning('不能选择相同的商品')
        return 1
      }

    },
    uniq(array){
      var temp = [] //一个新的临时数组
      for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){
          temp.push(array[i])
        }
      }
      return temp
    },
    // 适用门店
    storeidsget(){
      let array = []
      this.storeList.map(item =>{
        array.push(item.id)
      })
      this.activeadd.storeIds = array
    },
    // 换算
    isprice(types){
      this.activeadd.items.map(item=>{
        item.cover = item.specailcover
        if(item.products&&item.products.length>0){
          item.products.map(o=>{
            o.price = this.priceNum(o.price,types)
            o.productNum = types === 'out' ? o.productNumTol : o.productNum
          })
        }
      })

      this.activeadd.products.map(item=>{
        if(item.first&&item.first.length>0){
          item.first.map(o=>{
            o.price = this.priceNum(o.price,types)
            o.productNum = types === 'out' ? o.productNumTol : o.productNum
          })
        }
      })
      if(this.activeadd.commissionType == 'AMOUNT'){
        this.activeadd.commissionRuleList.map(item=>{
          item.blackGold = this.priceNum(item.blackGold,types)
          item.gold = this.priceNum(item.gold,types)
          if(!validatenull(item.normal)){
            item.normal = this.priceNum(item.normal,types)
          }else{
            item.normal = 0
          }
        })
      }
    },

    async checkDeleteGoods() {
      let products = []
      this.activeadd.items.forEach(item => {
        products = products.concat(item.products)
      })
      this.activeadd.products.forEach(item => {
        products = products.concat(item.first)
      })
      const { data } = await checkGroupBuyPro({
        products: products.map(product => {
          return {
            ...product,
            price: this.priceNum(product.price, 'out')
          }
        })
      })
      if (data.code === 0) {
        return false
      } else {
        // 有商品被删除了
        if (data.data && data.data instanceof Array) {
          const firstErrorId = null
          this.deleteGoodsIds = data.data.map((goods, index) => {
            if (index == 0) {
              firstErrorId = goods.productId
            }
            return goods.productId
          })
          let offset = $(`#product-${firstErrorId}`).offset()
          let top = offset.top-140
          $('html,body').animate({scrollTop: top}, 500, 'linear')
        }
        this.$message.error(data.msg)
        return true
      }
    },
    // 下一步
    async nextStep(){
      if(this.type!='detail'){
        this.$refs['activeadd'].validate(async (valid) => {
          if (valid) {
            this.storeidsget()
            const checkFlag = this.checkInfo()
            if(checkFlag==1){
              return
            }
            // 判断是否有删除的商品
            let flag = await this.checkDeleteGoods()
            if(flag){
              return
            }
            if(this.activeadd.items.length<=0){
              this.$message.warning('至少添加一组社区拼团内容')
              return
            }
            if(!this.isFlag){
              this.isHidden= false
            }else{
              this.$message.warning('您还没有维护过社区拼团的团长等级，请先进行维护')
              return false
            }
          }else{
            this.$nextTick(() => {
              let offset = $('.el-form-item__error').offset()
              let top = offset.top-140
              $('html,body').animate({scrollTop: top}, 500, 'linear')
            })
          }
        })
      }else{
        this.isHidden= false
      }
    },
    // 返回上一步
    prevStep(){
      if(this.type!='detail'){
        this.$easyConfirm.show({
          title: '提示',
          content: '团长的佣金奖励信息未保存，您确认要返回上一步吗?',
          confirm: async () => {
            this.$easyConfirm.hide()
            this.isHidden= true
          }
        })
      }else{
        this.isHidden= true
      }
    },
    checkSetName(){
      let array = this.activeadd.commissionRuleList
      let flag = false
      for(var i in array){
        if(!validatenull(array[i].blackGold)){
          if(this.numberInfo(array[i],'blackGold','check') == 1){
            flag = true
            break
          }else{
            if(!validatenull(array[i].gold)){
              if(this.numberInfo(array[i],'gold','check') == 1){
                flag = true
                break
              }else{
                if(!validatenull(array[i].normal)){
                  if(this.numberInfo(array[i],'normal') == 1){
                    flag = true
                    break
                  }else{
                  }
                }else{
                  console.log('可以不必填')
                }
              }
            }else{
              this.$message.warning('黄金商品佣金奖励必填')
              flag = true
              break
            }
          }
        }else{
          this.$message.warning('黑金商品佣金奖励必填')
          flag = true
          break
        }
      }
      return flag
    },
    //审核
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
@import '~@/assets/scss/_variables.scss';
@import '~@/assets/scss/campaign/activeadd.scss';

.fromGallery {
  cursor:pointer;position:absolute;top: 10px;left: 180px;border-radius:10px;padding: 0 10px;height: 30px;line-height: 30px;
}
</style>
