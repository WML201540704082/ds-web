<template>
  <section class="addactive"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="activeadd" ref="activeadd" :rules="activeaddaddRules" label-width="100px" >
      <!-- 手机模板 -->
      <gt-specail-model :activeadd= "activeadd" />
      <!-- 右侧信息 -->
      <div class="rights">
        <div style="color:red;font-size:14px;" v-if="checkContent">审核说明：{{checkContent}}</div>
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
            <el-form-item label="分享海报图片" prop="poster" class="view-img">
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
              <el-input v-model="activeadd.subTitle" :disabled="!saveTitle" :maxlength="50" placeholder="请输入活动标题(至多50个汉字)"></el-input>
            </el-form-item>
            <el-form-item label="适用门店" prop="storeIds">
              <span class="storeBox theme-background" v-for="(item,index) in storeList" :key="item.id"><b :title="item.name">{{item.name}}</b><span class="close" v-if="type!='detail'" @click="close(index)">X</span>  </span>
              <span class="selectSale" @click="selectSalestore" v-if="type!='detail'">
                <icon-svg name="create" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
              </span>
            </el-form-item>
            <el-form-item label="商品购买次数" prop="activityProductNum">
              每个用户ID/手机号码同一件商品最多只能购买 <el-input class="cus-mini-input" :disabled="type=='detail'" v-model="activeadd.activityProductNum"></el-input> 个（不填写默认不限制购买次数)
            </el-form-item>
          </div>
        </el-card>

        <!-- 特卖内容 -->
        <gt-subtitle title="02. 特卖内容"/>
        <el-card class="contentSp" style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div v-for="(item, index) in activeadd.items" :key="index" class="inlines"  v-show="activeadd.items && activeadd.items.length > 0">
            <el-col :span="22">
              <el-form-item class="specail view-img" :label="'特卖图片'+(index+1)" :prop="'items.'+index+'.specailcover'" :rules="specailRules.moreSpecailPic">
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
                <div class="listGoods" :id="'product-' + good.productId" :class="{'error-goods': deleteGoodsIds.indexOf(good.productId) > -1}" v-for="good in item.products" :key="good.productId">
                  <div class="name">{{good.name}}，{{priceNum(good.retailPrice)}}元</div>
                  <div class="inputs">设置特卖价格<el-input v-model='good.price' @change="val=>changeVal(val,good)" :disabled="type=='detail'"></el-input>元</div><br/>
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

        <!-- 更多特卖商品 -->
        <gt-subtitle title="03. 更多特卖商品" />
         <el-card class="contentSp contentSp1" style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div v-for="(item, index) in activeadd.products" :key="index" class="inlines">
            <el-col :span="22">
              <el-form-item>
                <div class="listGoods listGoods1" :id="'product-' + good.productId" :class="{'error-goods': deleteGoodsIds.indexOf(good.productId) > -1}" v-show="item.first" v-for="good in item.first" :key="good.id">
                  <div class="imgsgood">
                    <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic.png'" alt="">
                  </div>
                  <div class="name">{{good.name}}</div>
                  <div class="colorRed theme-color">{{priceNum(good.retailPrice)}}元</div>
                  <div class="inputs">设置特卖价格<el-input v-model='good.price' @change="val=>changeVal(val,good)" :disabled="type=='detail'"></el-input>元</div><br/>
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
        <!-- 活动备注 -->
        <gt-subtitle title="04. 活动备注" />
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="活动备注" prop="remark">
            <el-input type="textarea" v-model="activeadd.remark" :disabled="type=='detail'"></el-input>
          </el-form-item>
        </el-card>
        <el-card>
          <el-form-item label="审核说明：" prop="content">
             <el-input  type="textarea" v-model="content" style="width: 300px;" :disabled='audit' :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
        </el-card>
      </div>

    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button v-if="!audit" size="large" @click.native="submitCustomer('APPROVED')" :loading="$store.state.loading.global"  txt="审核通过"/>
      <gt-button v-if="!audit" size="large" @click.native="submitCustomer('REFUSED')" :loading="$store.state.loading.global"  txt="拒绝"/>
    </div>

    <!-- 选择叠加商品 -->
    <gt-select-goods ref="selectgoods" @refreshData="changeGoods"/>

    <!-- 选择门店 -->
    <gt-store-select ref="checkboxs" @list="listBox"/>
    <!-- 图库 -->
    <gt-select-gallery ref="gallery" @refreshData="getGalleryPic"/>
  </section>
</template>
<script>
import {validatenull, limitInputName} from '@/utils/validate'
import * as api from '@/service/activity'
import gtImageUpload from '@/components/gt-image-upload'
import gtSelectGoods from '../../components/selectGoods'
import gtSpecailModel from '../../components/specailModal'
import gtSelectGallery from '../../components/selectGallery'
import gtSubtitle from '@/components/gt-sub-title'
import {saveSpecial,getactivityDetail} from '@/service/activity'
import { getStoresList } from '@/service/setting'
import gtStoreSelect from '../../components/select-store-modal'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-specailadd',
  components:{ gtSubtitle, gtImageUpload, gtSelectGoods, gtSpecailModel,gtTimeRange,gtStoreSelect,gtSelectGallery },
  data(){
    const isValidate = (rule ,value,callback)=>{
      if(value <= moment().valueOf()){
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
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }
    return{
      checkContent:'',
      loading: false,
      deleteGoodsIds: [], // 被删除的商品id
      activeadd: {
        title:null,
        subTitle: null,
        cover: null,
        poster:null,
        startTime: null,
        endTime: null,
        storeIds:[],
        items:[{ //特卖内容
          specailcover:'',
          products:[]
        }],
        products: [],
        remark:''
      },
      result: null,
      content: null,
      id: null,
      type: null,//详情
      audit: null,
      saveTitle: true,//是否保存title
      storeList:[],
      gridData:[],
      activeaddaddRules:{
        title:[{required: true,message:'请输入活动标题', trigger: 'change'}],
        startTime:[{required: true,message:'请选择活动开始时间', trigger: 'change'}],
        endTime:[{required: true,message:'请选择活动结束时间', trigger: 'change'},
          {validator:isValidate,trigger: 'blur'}],
        cover:[{required: true,message:'请选择封面图片', trigger: 'change'}],
        subTitle:[{required: true,message:'请输入宣传副标题', trigger: 'change'}],
        storeIds:[{required: true,message:'请选择适用门店', trigger: 'change'}],
        remark: [{validator: validateRemark, trigger: 'blur' }],
        activityProductNum: [{validator: validateNum, trigger: 'blur' }],
      },
      specailRules:{
        moreSpecailPic: [{ required: true, message: '请选择特卖图片', trigger: 'change' }],
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
    var type = this.$route.query.type
    var audit = this.$route.query.audit
    if(activityId){
      this.id = activityId
      const {type, audit} = this.$route.query
      this.audit = audit
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
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.addactive .el-form').width()
      $('.rights').css('width',formWidth-370)
      window.onresize = () => {
        var formWidth=$('.addactive .el-form').width()
        $('.rights').css('width',formWidth-370)
      }
    },

    // 特卖详情
    async getactivityDetail(id){
      const {data} = await getactivityDetail(id)
      if(data.code == 0&&data.data){
        let activeadd = data.data.activityDto
        debugger
        this.activeadd = {
          ...activeadd,
          ...data.data,
        }
        this.content = data.data.activityDto.checkContent,
        this.activeadd.id = data.data.activityDto.id
        this.activeadd.startTime = moment(activeadd.startTime).valueOf()
        this.activeadd.endTime = moment(activeadd.endTime).valueOf()

        if(data.data.items&&data.data.items.length>0){
          data.data.items.map(item=>{
            item.specailcover = item.cover
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
      this.activeadd.items.map(o=>{//特卖内容
        o.specailcover = o.specailcover
        o.products = []
      })
      this.activeadd.products = []
    },

    // 删除适应门店
    close(idx){
      this.storeList.splice(idx,1)
      this.activeadd.items.map(o=>{//特卖内容
        o.specailcover = o.specailcover
        o.products = []
      })
      this.activeadd.products = []
    },
    // 选择叠加商品--更多特卖商品
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
    // 获取选中商品的列表--更多特卖商品
    changeGoods(obj) {
      let array = []
      obj.list.map(item=>{
        array.push({
          'productId':item.id,
          'pic': item.cover,
          'name': item.name,
          'retailPrice': item.retailPrice,
          'price': item.price
        })
      })

      if(obj.type=='products'){
        this.activeadd.products[obj.index].first = array
      }else{
        this.activeadd.items[obj.index].products = array
      }
    },
    // 特卖商品新增--特卖商品删除
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
        this.$message.warning('特卖价格只能输入数字,且必须小于零售价(不能为0)')
        item.price=null

        return false
      }
    },
    changeNum(value){
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
      if(goodsList){
        for(var i in goodsList){
          let itemList = goodsList[i].products
          if(itemList){
            for(var j in itemList){
              ids.push(itemList[j].productId)
              let price = itemList[j].price
              let number = itemList[j].productNumTol
              if(!price||price <= 0){
                this.$message.warning('特卖价格只能输入数字,且必须小于零售价(不能为0)')
                return 1
              }
              if (!this.changeNum(number)){
                return 1
              }
            }
          }
        }
      }

      // 更多特卖活动
      let proids = []
      let products = this.activeadd.products
      if(products){
        for(var i in products){
          let itemList = products[i].first
          if(itemList){
            for(var j in itemList){
              proids.push(itemList[j].productId)
              let price = itemList[j].price
              let number = itemList[j].productNumTol
              if(!price||price <= 0){
                this.$message.warning('特卖价格不能为空且不能为0')
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
      console.log(listids)
      var newids = [...ids,...proids]
      var setName = new Set(newids)
      if(setName.size != listids.length){
        this.$message.warning('不能选择相同的商品')
        return 1
      }

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
    },
    async submitCustomer(result,id){
      this.dataListLoading = true;
      if(this.content){
            const { data } = await api.auditActivity({
                      id:this.id,
                      result,
                      content:this.content   
            });
              this.dataListLoading = false;
              if (data && data.code === 0) {
               this.$router.push({name:'audit-activityAudit-list'})
            } else {
              this.$message.error(data.msg)
            }
            }else{
                    this.$message.warning('请填写审核内容')
            }

          

    } 
  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/campaign/activeadd.scss';

.fromGallery {
  cursor:pointer;position:absolute;top: 10px;left: 180px;border-radius:10px;padding: 0 10px;height: 30px;line-height: 30px;
}
</style>
