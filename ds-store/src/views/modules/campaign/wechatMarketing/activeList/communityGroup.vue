<template>
  <section class="addactive addactive1"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="activeadd" ref="activeadd" label-width="110px">
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
          <gt-subtitle title="01. 基本信息"/>
          <el-card style="margin-bottom: 10px;">
            <div>
              <el-form-item label="活动标题" prop="title" class="labelWidth">
                <el-input :disabled="true" v-model="activeadd.title" :maxlength="30" placeholder="请输入活动标题(至多30个汉字)"></el-input>
              </el-form-item>
              <el-form-item label="活动时间" class="gt-inline-item" required>
                <span>{{activeadd.startTime}}-{{activeadd.endTime}}</span>
              </el-form-item>
              <el-form-item label="封面图片" prop="cover" class="view-img">
                <img :src="'http://'+activeadd.cover" alt="">
              </el-form-item>
              <el-form-item label="宣传副标题" prop="subTitle" class="labelWidth">
                <el-input :disabled="true" v-model="activeadd.subTitle" :maxlength="50" placeholder="请输入活动标题(至多50个汉字)"></el-input>
              </el-form-item>
            </div>
          </el-card>

          <!-- 社区拼团内容 -->
          <gt-subtitle title="02. 社区拼团内容"/>
          <el-card class="contentSp" style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <div v-for="(item, index) in activeadd.items" :key="index" class="inlines"  v-show="activeadd.items && activeadd.items.length > 0">
              <el-col :span="22">
                <el-form-item class="specail view-img" :label="'社区拼团图片'+(index+1)" :prop="'items.'+index+'.specailcover'" :rules="specailRules.moreSpecailPic">
                  <img :src="'http://'+item.specailcover" alt="">
                </el-form-item>

                <el-form-item>
                  <div class="listGoods" v-for="good in item.products" :key="good.id">
                    <div class="name">{{good.name}}，{{priceNum(good.retailPrice)}}元</div>
                    <div class="inputs">设置拼团价格<el-input v-model='good.price'  :disabled="true"></el-input>元</div>
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </el-card>

          <!-- 更多社区拼团商品 -->
          <gt-subtitle title="03. 更多社区拼团商品" v-if="activeadd.products&&activeadd.products.length>0"/>
          <el-card class="contentSp contentSp1" style="margin-bottom: 10px;padding-bottom: 10px!important;" v-if="activeadd.products&&activeadd.products.length>0">
            <div v-for="(item, index) in activeadd.products" :key="index" class="inlines">
              <el-col :span="22">
                <el-form-item>
                  <div class="listGoods listGoods1" v-show="item.first" v-for="good in item.first" :key="good.id">
                    <div class="imgsgood">
                      <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic.png'" alt="">
                    </div>
                    <div class="name">{{good.name}}</div>
                    <div class="colorRed">{{priceNum(good.retailPrice)}}元</div>
                    <div class="inputs">设置拼团价格<el-input v-model='good.price'  :disabled="true"></el-input>元</div>
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </el-card>
        </div>

        <div v-show="!isHidden">
          <!-- 设置团长佣金奖励 -->
          <gt-subtitle title="04. 设置团长佣金奖励" />
          <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
            <el-form-item label="设置模式" prop="commissionType">
              <el-radio-group v-model="activeadd.commissionType" :disabled="true">
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
                  width="80"
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
                      <el-input class="inputs1"  v-model="scope.row.blackGold" :disabled="true"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="gold"
                    min-width="150"
                    :label="'黄金'+dw">
                    <template slot-scope="scope">
                      <el-input class="inputs1"  v-model="scope.row.gold" :disabled="true"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="normal"
                    min-width="150"
                    :label="'普通'+dw">
                    <template slot-scope="scope">
                      <el-input class="inputs1"  v-model="scope.row.normal" :disabled="true"></el-input>
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
              <el-input type="textarea" v-model="activeadd.remark"  :disabled="true"></el-input>
            </el-form-item>
          </el-card>
        <el-card>
           <el-form-item label="审核说明：" prop="auditcontent">
             <el-input  type="textarea" v-model="auditcontent" style="width: 300px;" :disabled="true" :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
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
    </div>

    <!-- 立即维护粉丝 -->
    <gt-withdrawal-amount-set ref="withdrawal" @updateWithdrawal="detailwithdrawal"/>
  </section>
</template>
<script>
import {validatenull,commissionRange} from '@/utils/validate'
import gtWithdrawalAmountSet from '../../components/withdrawalAmountSet'
import gtSpecailModel from '../../components/specailModal'
import gtSubtitle from '@/components/gt-sub-title'
import {getactivityDetail,getheadRuleDetail} from '@/service/activity'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-communityGroup',
  components:{ gtSubtitle, gtSpecailModel,gtWithdrawalAmountSet },
  data(){
    const isValidate = (rule ,value,callback)=>{
      if(value <= new Date().getTime()){
        callback(new Error('活动结束时间不得小于等于当前时间'))
      }else{
        callback()
      }
    }
    return{
      loading: false,
      obj:{},
      dw: '(元)',
      isFlag: true,
      activeadd: {
        title:null,
        subTitle: null,
        cover: null,
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
      storeList:[],
      gridData:[],
      isHidden: true,
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
    if(activityId){
      this.id = activityId
      this.type = this.$route.query.type
      this.getactivityDetail(activityId)
    }

    this.detailwithdrawal()
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()
    })
  },
  methods:{
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

    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.addactive .el-form').width()
      $('.rights').css('width',formWidth-380)
      window.onresize = () => {
        var formWidth=$('.addactive .el-form').width()
        $('.rights').css('width',formWidth-380)
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
      }else{
        this.$message.error(data.msg)
      }
    },
    
    // 图片
    updatePicUrl:function(imgoBJ){
      this.activeadd[imgoBJ.str] = imgoBJ.value
    },

    // 换算
    isprice(types){
      this.activeadd.items.map(item=>{
        item.cover = item.specailcover
        if(item.products&&item.products.length>0){
          item.products.map(o=>{
            o.price = this.priceNum(o.price,types)
          })
        }
      })

      this.activeadd.products.map(item=>{
        if(item.first&&item.first.length>0){
          item.first.map(o=>{
            o.price = this.priceNum(o.price,types)
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
    // 下一步
    nextStep(){
      this.isHidden= false
    },
    // 返回上一步
    prevStep(){
      this.isHidden= true
    },
  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/_variables.scss';
@import '~@/assets/scss/campaign/activeadd.scss';
</style>
