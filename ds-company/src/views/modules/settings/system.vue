<template>
  <section class="setting-system-page">
    <div class="basic-title">POS设置</div>
    <div class="item-container">
      <div class="card-item">
        <p class="main-title">订单优惠<span class="status-label" :class="{'active': settings.orderSet  === 'TRUE'}" v-show="pageType === 'detail'">{{settings.orderSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">设置POS收银时单品改价、整单折扣、整单减免、整单抹零操作</p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE" v-model="settings.orderSet" class="switch-item"></el-switch>
      </div>
      <div class="card-item">
        <p class="main-title">自动交接班<span class="status-label" :class="{'active': settings.autoSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.autoSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">
          收银员当天未交接班额，系统自动每天
          <el-select v-show="pageType === 'edit'" disabled size="mini" v-model="settings.autoDateTime" class="mini-input">
            <el-option :key="item" :value="item" :label="`${item} : 00`" v-for="item in exchangeList"/>
          </el-select>
          <span v-show="pageType === 'detail'" class="theme-color">{{settings.autoDateTime}} : 00</span>
          点完成交接班
        </p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE"  v-model="settings.autoSet" class="switch-item"></el-switch>
      </div>
      <div class="card-item">
        <p class="main-title">个人收款<span class="status-label" :class="{'active': settings.perAumSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.perAumSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">开启个人支付宝、个人微信、刷卡支付方式</p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE"  v-model="settings.perAumSet" class="switch-item"></el-switch>
      </div>
      <div class="card-item">
        <p class="main-title">客显播放间隔<span class="customer-radio theme-color" v-show="pageType === 'detail'">{{settings.postSet}} 秒</span></p>
        <p class="sub-title">设置POS客显屏幕广告轮播间隔时间</p>
        <el-radio-group v-show="pageType === 'edit'" class="customer-radio" size="small" v-model="settings.postSet">
          <el-radio :label="5" border>5秒</el-radio>
          <el-radio :label="8" border>8秒</el-radio>
          <el-radio :label="10" border>10秒</el-radio>
        </el-radio-group>
      </div>
      <div class="card-item">
        <p class="main-title">客显购物车<span class="status-label" :class="{'active': settings.shopSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.shopSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">客显屏幕是否显示购物车详情</p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE" v-model="settings.shopSet" class="switch-item"></el-switch>
      </div>
      <!-- 购物车商品合并开关 -->
      <div class="card-item">
        <p class="main-title">POS购物车商品合并<span class="status-label" :class="{'active': settings.shopCartSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.shopCartSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">POS收银首页购物车添加商品相同时，自动合并为一条！</p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE" v-model="settings.shopCartSet" class="switch-item"></el-switch>
      </div>
      <div class="card-item">
        <p class="main-title">小票打印<span class="status-label" :class="{'active': settings.notePrint === 'TRUE'}" v-show="pageType === 'detail'">{{settings.notePrint === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">设置Pos收银端下单打印小票功能(进行交易下单打印小票的设置，寄存/交接班/补打小票不受限制)</p>
        <el-switch v-show="pageType === 'edit'" active-value="TRUE" inactive-value="FALSE" v-model="settings.notePrint" class="switch-item"></el-switch>
      </div>
    </div>
    <div class="basic-title">SaaS门店&B_Mobile店务助手设置</div>
    <div class="item-container">
      <div class="card-item">
        <p class="main-title">店长查看权限<span class="status-label" :class="{'active': settings.viewSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.viewSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">设置门店店长角色是否可查看商品成本价、毛利</p>
        <el-switch v-show="pageType === 'edit'" v-model="settings.viewSet" active-value="TRUE" inactive-value="FALSE" class="switch-item"></el-switch>
      </div>
       <div class="card-item">
        <p class="main-title">门店销售额查看<span class="status-label" :class="{'active': settings.storesSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.storesSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">员工角色可否查看门店销售额</p>
        <el-switch v-show="pageType === 'edit'" v-model="settings.storesSet" active-value="TRUE" inactive-value="FALSE" class="switch-item"></el-switch>
      </div>
    </div>
    <div class="basic-title">云店设置</div>
    <div class="item-container">
      <div class="card-item">
        <p class="main-title">储值卡消费<span class="status-label" :class="{'active': settings.cartSet === 'TRUE'}" v-show="pageType === 'detail'">{{settings.cartSet === 'TRUE' ? '启用' : '禁用'}}</span></p>
        <p class="sub-title">萌百小店的订单是否可用储值卡消费</p>
        <el-switch v-show="pageType === 'edit'" v-model="settings.cartSet" active-value="TRUE" inactive-value="FALSE" class="switch-item"></el-switch>
      </div>
    </div>
    <div class="control-operate commissionBt">
      <el-button class="basic-button" v-show="this.pageType === 'edit'" @click="changePageType('detail')">取消</el-button>
      <el-button class="basic-button border" v-show="this.pageType === 'edit'" type="primary" @click="save">保存</el-button>
      <el-button class="basic-button" v-show="this.pageType === 'detail'" type="primary" @click="changePageType('edit')">更改设置</el-button>
    </div>
  </section>
</template>
<script>
import { getCompanySetting, setCompanySetting } from '@/service/setting'
export default {
  name: 'setting-system',
  data() {
    return {
      // exchangeList: [24, 23, 22, 21, 20],
      exchangeList: [24],
      pageType: 'detail',
      settings: {
        autoDateTime: 24, // 自动交接班时间
        autoSet: 'TRUE', // 自动交接班设置
        orderSet: 'TRUE', // 订单优惠设置
        perAumSet: 'TRUE', // 个人收款设置
        postSet: 5, // 播放间隔设置
        shopSet: 'TRUE', // 购物车设置
        shopCartSet: 'TRUE',//购物车合并设置
        notePrint: 'TRUE', // 设置POS小票打印
        viewSet: 'TRUE', // 店长查看权限设置
        cartSet: 'FALSE',//萌百小店储值卡消费权限设置
        storesSet : 'TRUE',//门店员工查看总销售额
      }
    }
  },
  async created () {
    this.getDetail()
  },
  methods: {
    changePageType(type) {
      this.pageType = type
      if (type === 'detail') {
        this.getDetail()
      }
    },
    async getDetail() {
      const { data } = await getCompanySetting({token: this.$cookie.get('company-token')})
      if (data.code === 0) {
        this.settings = {
          ...data.data,
          autoDateTime: 24
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    async save() {
      const { data } = await setCompanySetting(this.settings)
      if (data.code === 0) {
        await this.getDetail()
        this.pageType = 'detail'
      } else {
        this.$message.error(data.msg)
      }
    }
  },
}
</script>
<style lang="scss">
.setting-system-page{
  .mini-input{
    width: 90px;
    .el-input__inner{
      width: 90px;
    }
  }
  .el-radio.is-bordered{
    padding: 3px 0;
    height: 20px;
    line-height: 12px;
    width: 40px;
    text-align: center;
    font-size: 14px;
    border: none;
    .el-radio__input{
      display: none;
    }
    .el-radio__label{
      padding-left: 0;
    }
    &.is-checked{
      .el-radio__label{
        color: #fff !important;
      }
    }
  }
  .customer-radio{
    position: absolute;
    top: 15px;
    right: 15px;
  }
  .basic-title{
    font-size: 18px;
    color: #7F7F7F;
    margin: 15px 0 -15px;
  }
  .control-operate{
    text-align: center;
  }
  .status-label{
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    background-color: #ccc;
  }
  .item-container{
    overflow: hidden;
    padding: 10px 0;
    .card-item{
      width: 320px;
      height: 120px;
      padding: 15px;
      float: left;
      margin-right: 20px;
      margin-top: 15px;
      background-color: #fff;
      position: relative;
      .main-title{
        margin-top: 0;
        font-size: 16px;
        color: #7F7F7F;
      }
      .sub-title{
        font-size: 13px;
        color: #ABABAB;
        margin-bottom: 0;
        line-height: 28px;
      }
      .switch-item{
        position: absolute;
        top: 15px;
        right: 15px;
      }
    }
  }
}
</style>
