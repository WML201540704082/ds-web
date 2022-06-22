<template>
  <section class="addactive"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="activeadd" ref="activeadd" label-width="100px">
      <!-- 手机模板 -->
      <gt-specail-model :activeadd= "activeadd" />
      <!-- 右侧信息 -->
      <div class="rights">
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
              <el-input v-model="activeadd.subTitle" :maxlength="50" placeholder="请输入活动标题(至多50个汉字)" :disabled="true"></el-input>
            </el-form-item>

          </div>
        </el-card>

        <!-- 特卖内容 -->
        <gt-subtitle title="02. 特卖内容"/>
        <el-card class="contentSp" style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div v-for="(item, index) in activeadd.items" :key="index" class="inlines"  v-show="activeadd.items && activeadd.items.length > 0">
            <el-col :span="22">
              <el-form-item class="specail view-img" :label="'特卖图片'+(index+1)" :prop="'items.'+index+'.specailcover'" :rules="specailRules.moreSpecailPic">
                <img :src="'http://'+item.specailcover" alt="">
              </el-form-item>

              <el-form-item>
                <div class="listGoods" v-for="good in item.products" :key="good.id">
                  <div class="name">{{good.name}}，{{priceNum(good.retailPrice)}}元</div>
                  <div class="inputs">设置特卖价格<el-input v-model='good.price' :disabled="true"></el-input>元</div>
                </div>
              </el-form-item>

            </el-col>
          </div>
        </el-card>

        <!-- 更多特卖商品 -->
        <gt-subtitle title="03. 更多特卖商品" v-if="activeadd.products&&activeadd.products.length>0"/>
         <el-card class="contentSp contentSp1" style="margin-bottom: 10px;padding-bottom: 10px!important;"  v-if="activeadd.products&&activeadd.products.length>0">
          <div v-for="(item, index) in activeadd.products" :key="index" class="inlines">
            <el-col :span="22">
              <el-form-item>
                <div class="listGoods listGoods1" v-show="item.first" v-for="good in item.first" :key="good.id">
                  <div class="imgsgood">
                    <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic.png'" alt="">
                  </div>
                  <div class="name">{{good.name}}</div>
                  <div class="colorRed theme-color">{{priceNum(good.retailPrice)}}元</div>
                  <div class="inputs">设置特卖价格<el-input v-model='good.price' :disabled="true"></el-input>元</div>
                </div>
              </el-form-item>
            </el-col>
          </div>
        </el-card>
        <!-- 活动备注 -->
        <gt-subtitle title="04. 活动备注" />
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="活动备注" prop="remark">
            <el-input type="textarea" v-model="activeadd.remark"  :disabled="true"></el-input>
          </el-form-item>
        </el-card>
        <el-card>
          <el-form-item v-if="this.id" label="审核说明：" prop="content">
             <el-input  type="textarea" v-model="content" style="width: 300px;" :disabled='true' :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
        </el-card>
      </div>

    </el-form>


  </section>
</template>
<script>
import {validatenull, limitInputName} from '@/utils/validate'

import gtSpecailModel from '../../components/specailModal'
import gtSubtitle from '@/components/gt-sub-title'
import {getactivityDetail} from '@/service/activity'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-specail',
  components:{ gtSubtitle, gtSpecailModel },
  data(){
    return{
      loading: false,
      activeadd: {
        title:null,
        subTitle: null,
        cover: null,
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
      id: null,
      type: null,
      storeList:[],
      gridData:[],
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
    if(activityId){
      this.id = activityId
      this.type = this.$route.query.type
      this.getactivityDetail(activityId)
    }
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()
    })
  },
  methods:{
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
        this.activeadd = {
          ...activeadd,
          ...data.data
        }
        this.activeadd.id = data.data.activityDto.id
        this.content = data.data.activityDto.checkContent
        if(data.data.items&&data.data.items.length>0){
          data.data.items.map(item=>{
            item.specailcover = item.cover
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
    },

  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/campaign/activeadd.scss';
</style>
