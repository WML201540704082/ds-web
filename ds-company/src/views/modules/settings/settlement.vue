<template>
  <section class="page-settlement">
    <el-card>
      <gt-sub-title title="结算账户设置（暂不支持分店打款）"/>
      <el-row :gutter="50" v-if="card">
        <el-col :span="10">
          <div class="card-container">
            <div class="card-account">
              <div class="card-bank">{{card.bankName}}</div>
              <div class="card-type">{{filterStatus(card.type, cardType)}}</div>
            </div>
            <div class="card-number">{{card.bankCode | cardNumber}}</div>
            <el-button class="change-button" type="primary" @click="changeAccount">更换账户</el-button>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="card-info">
            <img class="icon" src="static/img/setting/settlement-info.png" alt="提示"> <span class="tip">温馨提示</span>
            <p class="info">商户发起提现后， 1-3个工作日到账，请留意账户余额变动</p>
          </div>
        </el-col>
      </el-row>
      <div class="add-card" @click="changeAccount" v-else>
        <img class="add-icon" src="static/img/mycustomer/addbaby.png" alt="添加"/>
        添加银行卡
      </div>
    </el-card>
    <el-card>
      <gt-sub-title title="数据统计" />
      <div class="settlement-sub-title">
        <icon-svg name="settings-card" class="card-icon" ></icon-svg>
        <span class="tip">可用余额（元）
          <el-tooltip placement="top" effect="dark" content="对账完成，企业可提现的金额">
            <img class="answer" src="static/img/icon/answer.png" />
          </el-tooltip>
        </span>
      </div>
      <div class="money">{{info.inuse | moneyFormat}}</div>
    </el-card>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div class="settlement-sub-title">
            <icon-svg name="settings-card" class="card-icon" ></icon-svg>
            <span class="tip">待结算金额（元）
            </span>
          </div>
          <div class="money">{{info.canuse | moneyFormat}}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="settlement-sub-title">
            <icon-svg name="settings-card" class="card-icon" ></icon-svg>
            <span class="tip">结算历史（元）
              <el-tooltip placement="top" effect="dark" content="已完成的结算历史记录">
                <img class="answer" src="static/img/icon/answer.png" />
              </el-tooltip>
            </span>
          </div>
          <div class="money">
            {{info.history | moneyFormat}}
            <el-button class="detail-button" type="primary" @click="viewHistory">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="settlement-sub-title">
            <icon-svg name="settings-card" class="card-icon" ></icon-svg>
            <span class="tip">保证金（元）
              <el-tooltip placement="top" effect="dark" content="企业缴纳的保证金">
                <img class="answer" src="static/img/icon/answer.png" />
              </el-tooltip>
            </span>
          </div>
          <div class="money theme-color">{{info.guarenteen | moneyFormat}}</div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 银行卡页面 -->
    <account-modal ref="addOrUpdateAccount" @refreshAccount="getAccount"></account-modal>
  </section>
</template>
<script>
import gtSubTitle from '@/components/gt-sub-title'
import { cardNumber, moneyFormat } from '@/utils/filter'
import { cardType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import accountModal from './account-modal'
export default {
  data() {
    return {
      card: null,
      cardType,
      filterStatus,
      info: {
        inuse: 1980,
        canuse: 980,
        history: 6980,
        guarenteen: 0
      }
    }
  },
  components: { gtSubTitle, accountModal },
  filters: { cardNumber, moneyFormat },
  methods: {
    changeAccount() {
      this.$nextTick(() => {
        this.$refs.addOrUpdateAccount.init(this.card)
      })
    },
    viewHistory() {
      this.$router.push({name:'settlement-history'})
    },
    getAccount(card) {
      this.card = card
    }
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  .page-settlement{
    .tip{
      font-weight: bold;
      color: $info--main-font-color;
    }
    .el-card{
      margin-top: 10px;
    }


    .card-container{
      padding: 15px 30px;
      overflow: hidden;
      .card-account{
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .card-bank{
          color: $info--sub-font-color;
          font-size: 20px;
        }
        .card-type{
          width: 70px;
          text-align: right;
          color: $status--common-color;
        }
      }
      .card-number{
        color: $info--main-font-color;
        font-size: 24px;
        margin-bottom: 15px;
      }
      .change-button{
        float:right;
        height: 30px;
        line-height: 18px;
        border-radius: 15px;
        box-shadow: 0 0 10px rgba(249, 120, 66, 0.5);
      }
    }
    .card-info{
      text-align: center;
      font-size: 16px;
      padding-top: 15px;
      .icon{
        width: 18px;
        margin-right: 10px;
        margin-top: -2px;
      }
      .info{
        color: $info--sub-font-color;
      }
    }
    .add-card{
      padding: 30px 50px;
      font-size: 20px;
      cursor: pointer;
      overflow: hidden;
      line-height: 30px;
      .add-icon{
        float: left;
        width: 30px;
        margin-right: 20px;
      }
    }
    .settlement-sub-title{
      padding: 5px 10px;
      vertical-align: middle;
      overflow: hidden;
      .card-icon{
        float: left;
        margin-top: -2px;
        font-size: 20px;
        margin-right: 10px;
      }
      .answer{
        position: relative;
        top: -2px;
        width: 18px;
      }
    }
    .money{
      position: relative;
      font-size: 20px;
      padding: 20px 30px;
      .detail-button{
        position: absolute;
        margin: -2px 0 0 10px;
        box-shadow: 0 0 10px rgba(249, 120, 66, 0.5);
      }
    }
  }
</style>
