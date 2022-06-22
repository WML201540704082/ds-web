<template>
  <section class="section-main-info">
    <!-- <img @click="showFlag" class="main-info-select" :src="isFlag?'static/img/icon/close.png':'static/img/icon/zhedie.png'" alt=""> -->
    <span @click="showFlag">
      <icon-svg class="main-info-select theme-color"  :name="isFlag?'close1':'qi1'" ></icon-svg>
    </span>
    <el-card class="info">
      <div v-show="isDesk" class="desk-show-container">
        <img class="desk-show-bg" :src="'static/img/setting/'+temp+'/main.png'" alt="工作台">
        <div class="text">
          <p class="desk-show-title">工作台</p>
          <p class="desk-show-tip justify" style="color: #fff">工作台页面，本商户经营状况一览无余， 在此页面可以快速处理工作，并且可以便捷切入其他功能区</p>
        </div>
      </div>
      <div class="title">
        最新动态
        <!-- <div class="more">更多 <img :src="'static/img/desk/more.png'" alt="更多"/></div> -->
      </div>
      <div class="content">
        <div class="content-news" :key="news.id" v-for="news in newsList">
          <p class='justify' v-html="news.text"></p>
          <p class="date">{{news.date}}</p>
        </div>
      </div>
      <div class="platform">
        <img class="platform-icon" src="static/img/desk/mobile.png" alt="mobile"/>
        <div class="platform-info">
          <div class="text">移动收银台</div>
          <div class="tip">母婴行业专业收银终端</div>
        </div>
      </div>
      <div class="platform">
        <img class="platform-icon" src="static/img/desk/wechat.png" alt="wechat"/>
        <div class="platform-info">
          <div class="text">门店专属小程序</div>
          <div class="tip">一键获取最新优惠，促销活动不错过</div>
        </div>
      </div>
      <div class="title">
        帮助
        <!-- <div class="more">更多 <img :src="'static/img/desk/more.png'" alt="更多"/></div> -->
      </div>
      <div class="help-item" :key="help.id" v-for="help in helpList" @click="help.action">
        <img :src="'static/img/desk/'+ help.icon +'.png'" />
        <span>{{help.text}}</span>
      </div>
    </el-card>
    <pdf-view ref="pdf"></pdf-view>
  </section>
</template>
<script>
import pdfView from './pdf-view'
import { getStore } from '@/utils/storage'
export default {
  name: 'main-info',
  props: {
    isDesk: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      temp:'green',
      isFlag: true,
      newsList: [
        {
          id: 1,
          text: '<span>萌百格一站式营销管理平台，v2.6.0更新发布！</br>' +
            '本次更新包含：</br>' +
            '1、移动加权成本价算法</br>' +
            '2、门店向企业要货改为“订货”</br>' +
            '3、门店向企业订货确认收货后直接生成入库单</br>' +
            '4、库存管理商品成本价显示加权成本</br>' +
            '5、商品新增包装单位改成必填</br>' +
            '6、其他已知问题修复</br>' +
            '</span>',
          date: '2020-09-10'
        }
      ],
      helpList: [{
        id: 1,
        text: '快速入门',
        icon: 'quick-start',
        router: '',
        action: () => {}
      }, {
        id: 2,
        text: '常见问题',
        icon: 'common-question',
        router: '',
        action: () => {}
      }, {
        id: 3,
        text: '系统操作手册',
        icon: 'hander-book',
        router: '',
        action: () => {
          this.$nextTick(() => {
            this.$refs['pdf'].init()
          })
        }
      }, {
        id: 4,
        text: '版本更新日志',
        icon: 'version-update',
        router: '',
        action: () => {}
      }]
    }
  },
  components: {
    pdfView
  },
  created(){
    var res = this.$cookie.get('store-info')
    const { theme = '' } = JSON.parse(this.$cookie.get('store-info')) || {}

    if (theme === 'ORANGEWHITE') {
      this.temp = 'orange'
    } else {
      this.temp = 'green'
    }
  },

  mounted() {
    this.showFlag(0)
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
      set (val) { this.$store.commit('common/updateDocumentWidth', val) }
    },
  },
  methods: {
    viewPdf() {
      this.$nextTick(() => {
        this.$refs['pdf'].init()
      })
    },
    showFlag(showTime = 300){
      if(!this.isFlag){
        $('.section-main-info').animate({'right':'0','padding':'15px 15px 15px 0'}, showTime, 'linear')
        $('.main-info-select').animate({'right': '300px'}, showTime, 'linear')
        $('.site-content__wrapper').removeClass('site-content__wrapper12')
        this.documentWidth = 300
        this.isFlag =!this.isFlag
      }else{
        this.isFlag = !this.isFlag
        $('.section-main-info').animate({'right':'-300px','padding':0}, showTime, 'linear')
        $('.main-info-select').animate({'right': 0}, showTime, 'linear')
        $('.site-content__wrapper').addClass('site-content__wrapper12')
        this.documentWidth = 0
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
.section-main-info{
  width: 300px;
  position: fixed;
  right: 0;
  top: 50px;
  z-index: 1020;
  padding: 15px 15px 15px 0;
  background: $content--background-color;
  height: calc(100% - 50px);
  .justify {
    text-align: justify;
    line-height: 22px;
    color: #6f6f6f;
  }

  .desk-show-container{
    position: relative;
    .desk-show-bg{
      width: 100%;
      margin-bottom: 10px;
    }
    .text{
      padding: 0 15px;
      color: #fff;
      position: absolute;
      top: 15px;
    }
  }

  .info{
    padding: 10px;
    height: 100%;
    overflow-y:auto;
    .el-card__body{
      padding: 0 !important;

    }
    .title{
      background-color: #F8F8F8;
      padding: 10px;
      color: #4C4E58;
      font-size: $font-size-menu-min;
      margin-bottom: 5px;
      overflow: hidden;
      font-weight: bold;
      .more{
        float:right;
        color: $info--sub-font-color;
        font-size: 14px;
        img{
          margin-left: 5px;
          height: 12px;
        }
      }
    }
    .content{
      background-color: #F8F8F8;
      padding: 10px 0;
      margin-bottom: 15px;
      .content-news{
        padding: 5px 10px;
        color: $info--sub-font-color;
        p{
          font-size: $font-size-min;
          margin: 5px 0;
        }
        .date{
          font-size: 12px;
        }
      }
    }
  }
  .help-item{
    background-color: #F8F8F8;
    margin-bottom: 5px;
    overflow: hidden;
    color: $info--sub-font-color;
    padding: 10px;
    cursor: pointer;
    img{
      width: 24px;
      margin-right: 20px
    }
  }
  .platform{
    background-color: #F8F8F8;
    padding: 15px 5px;
    overflow: hidden;
    margin-bottom: 10px;
    .platform-icon{
      width: 38px;
      height: 38px;
      float: left;
    }
    .platform-info{
      float: left;
      margin-left: 15px;
      .text{
        font-size: 16px;
        color: $info--main-font-color;
        margin-bottom: 5px;
      }
      .tip {
        font-size: 12px;
        color: $info--sub-font-color;
      }
    }
  }
}

.main-info-select {
  cursor: pointer;
  width: 20px;
  height: 58px;
  position: fixed;
  top: 0;
  bottom:0;
  right: 300px;
  font-size: 60px;
  margin: auto
}
.site-content__wrapper12 {
  padding-right: 0!important;
}
</style>
