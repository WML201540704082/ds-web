<template>
  <section class='bigwheel'
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="bigwheel" ref="bigwheel" label-width="100px">
      <!-- 手机模板 -->
      <gt-wheel-modal :activeadd="bigwheel" />
      <!-- 右侧信息 -->
      <div class="rights">
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
          <el-form-item label="活动标题" prop="title" class="labelWidth">
            <el-input :disabled="true" v-model="bigwheel.title" :maxlength="30" placeholder="请输入活动标题(至多30个汉字)"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" class="gt-inline-item" required>
            <span>{{bigwheel.startTime}}-{{bigwheel.endTime}}</span>
          </el-form-item>
          <el-form-item label="封面图片" prop="cover" class="view-img">
            <img :src="'http://'+bigwheel.cover" alt="">
          </el-form-item>
          <el-form-item label="宣传副标题" prop="subTitle" class="labelWidth">
            <el-input :disabled="true" v-model="bigwheel.subTitle" :maxlength="50" placeholder="请输入活动标题(至多50个汉字)"></el-input>
          </el-form-item>
        </el-card>

        <!-- 奖项设置 -->
        <gt-subtitle title="02. 奖项设置"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div>设置奖项（最少4项，最多9项）
            <el-tooltip placement="top" popper-class="width-limit" effect="dark" :content="content">
              <img class="answer" src="static/img/icon/answer.png" />
            </el-tooltip><span style="color: red;font-size: 15px;">总中奖率{{allNum}}%</span></div>
            <el-table
            :data="bigwheel.items"
            border
            :stripe="true"
            max-height="360"
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
              <el-radio-group v-model="bigwheel.radio" :disabled="true">
                <el-radio :label="1" :value="1">不限</el-radio>
                <el-radio :label="2" :value="2">每位顾客限参与<el-input v-model="bigwheel.times" :disabled="bigwheel.radio==1"></el-input>次</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <div class="numbers" v-if="bigwheel.radio==2">
            <span style="margin-right: 10px;margin-bottom: 10px;">分享1次获赠参与次数<el-input v-model="bigwheel.gift"></el-input>次</span>
            <span>每位顾客最多可获赠参与次数<el-input v-model="bigwheel.share" @change="val=>changeVal(val,'limit')"></el-input>次</span>
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
        <gt-subtitle title="04. 更多详情" v-if="bigwheel.templates&&bigwheel.templates.length>0"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;"  class="com-goods-edit" v-if="bigwheel.templates&&bigwheel.templates.length>0">
          <gt-article-form :array="bigwheel.templates" @changeArray="value => changeArray(value)"/>
        </el-card>
        <el-card>
           <el-form-item label="审核说明：" prop="auditcontent">
             <el-input  type="textarea" v-model="auditcontent" style="width: 300px;" :disabled="true" :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
        </el-card>
      </div>

    </el-form>
  </section>
</template>
<script>
import {validatenull,twoDecimal,priceRange} from '@/utils/validate'

import NP from 'number-precision'
import gtWheelModal from '../../components/wheelModal'
import gtSubtitle from '@/components/gt-sub-title'
import gtArticleForm from '@/components/gt-article-form'
import {getactivityDetail} from '@/service/activity'
import moment from 'moment'
export default {
  name:'campaign-wechatMarketing-activeList-bigWheel',
  components:{ gtSubtitle, gtWheelModal, gtArticleForm },
  data(){
    return{
      id: null,
      loading: false,
      couponList: [],//优惠券
      productList: [],//商品
      key: '',//优惠劵关键字查询
      bigwheel: {
        title:null,
        subTitle: null,
        cover: null,
        startTime: null,
        endTime: null,
        storeIds:[],
        radio: 2,
        times: 1,
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
      allNum: 100,
      isFlag: 1,
      isNext: false,//是否将信息填写完整了
      content: null

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

    selectKeys() {
      return this.bigwheel.items.map(item => item.prizeId)
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
      if(activityId){
        this.id = activityId
        this.isType = this.$route.query.type
        this.getbigwheelDetails(activityId)
      }
    })
  },
  methods:{
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
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.bigwheel .el-form').width()
      $('.rights').css('width',formWidth-370)
      window.onresize = () => {
        var formWidth=$('.bigwheel .el-form').width()
        $('.rights').css('width',formWidth-370)
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
        }else{
          tempRadio = 1
        }
        this.auditcontent = data.data.activityDto.checkContent,
        this.bigwheel = {
          ...bigwheel,
          ...data.data,
          items : data.data.items.map(item => {
            return {
              ...item,
              probability: this.priceNum(item.probability)
            }
          }),
          radio: tempRadio,
          id: data.data.activityDto.id,
        }

        let num =0
        if(this.bigwheel.items&&this.bigwheel.items.length>0){
          let items = this.bigwheel.items
          items.map(item=>{
            // let reg= /^[0-9]+$/
            if(priceRange(item.probability, 100, 0)){
              num = NP.plus(Math.abs(num),Math.abs(item.probability))
            }
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
          console.log(items)
          items.map(item=>{
            if(item.prizeId == -1){
              item.name = '谢谢参与'
            }
          })
        }

      }else{
        this.$message.error(data.msg)
      }
    },

    // 图片
    updatePicUrl:function(imgoBJ){
      this.bigwheel[imgoBJ.str] = imgoBJ.value
    },

    changeArray(array) {
      this.bigwheel.templates = array
    },

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
</style>
