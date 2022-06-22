<template>
  <div class="mod-store page-lifeCyc-info">
    <el-card>
      <div class="control-container">
        <div class="control-info">
          <div class="info">根据消费行为的不同，顾客的生命周期可分为5个阶段：潜在顾客、新客、活跃顾客、休眠顾客、流失顾客。</div>
          <div class="info">您可以根据自己企业的特点，调整其定义，并选择是否启用员工对不同阶段顾客的回访任务。</div>
        </div>
        <div class="control-operate commissionBt">
          <el-button class="basic-button" v-show="this.pageType === 'edit'" @click="changePageType('detail')">取消</el-button>
          <el-button class="basic-button border" v-show="this.pageType === 'edit'" type="primary" @click="save">保存</el-button>
          <el-button class="basic-button" v-show="this.pageType === 'detail'" type="primary" @click="changePageType('edit')">更改设置</el-button>
        </div>
      </div>
    </el-card>
    <el-form ref="settings-form" :rules="dataFormRules" :model="settings" size="mini">
      <el-card style="margin-top: 15px;padding-bottom: 10px;">
        <div class="setting-container">
          <div class="setting-item protential">
            <div class="title"><div class="name">潜在客户</div><div class="value">{{settings.protential.num}}</div></div>
            <div class="sub-title">
              <div class="sub-info">未产生过消费行为</div>
              <cyc-item @click.native="goCustomer('QZ')"/>
            </div>
          </div>
          <div class="setting-item newer">
            <div class="title"><div class="name">新客</div><div class="value">{{settings.newer.num}}</div></div>
            <div class="sub-title">
              <div class="sub-info">首次消费距今小于等于
                <span v-if="pageType === 'detail'">{{settings.newer.minDaysZone}}</span>
                <el-form-item v-else prop="newer.minDaysZone" class="mini-input">
                  <el-input v-model="settings.newer.minDaysZone"></el-input>
                </el-form-item>
                天
              </div>
              <cyc-item txt="新客-3天关怀" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.newer.three)" type="newerThree"><el-switch v-if="this.pageType === 'edit'" v-model="settings.newer.three"></el-switch></cyc-item>
              <cyc-item txt="新客-7天关怀" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.newer.seven)" type="newerSeven"><el-switch v-if="this.pageType === 'edit'" v-model="settings.newer.seven"></el-switch></cyc-item>
              <cyc-item txt="新客-10天关怀" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.newer.ten)" type="newerTen"><el-switch v-if="this.pageType === 'edit'" v-model="settings.newer.ten"></el-switch></cyc-item>
              <cyc-item @click.native="goCustomer('XK')"/>
            </div>
          </div>
          <div class="setting-item active">
            <div class="title">
              <div class="name">活跃顾客</div>
              <div class="value">{{settings.active.num}}</div>
              <div class="active-button" @click="goCategory">分类</div>
            </div>
            <div class="sub-title">
              <div class="sub-info">首次消费距今大于{{settings.newer.minDaysZone}}天， 且最近{{settings.dormancy.minDaysZone}}天有消费</div>
              <cyc-item txt="消费频率下降顾客回访" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.active.time)" type="consumer"><el-switch v-if="this.pageType === 'edit'" v-model="settings.active.time"></el-switch></cyc-item>
              <cyc-item txt="客单价下滑顾客回访" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.active.price)" type="customer"><el-switch v-if="this.pageType === 'edit'" v-model="settings.active.price"></el-switch></cyc-item>
              <cyc-item @click.native="goCustomer('HY')"/>
            </div>
          </div>
          <div class="setting-item dormancy">
            <div class="title"><div class="name">休眠顾客</div><div class="value">{{settings.dormancy.num}}</div></div>
            <div class="sub-title">
              <div class="sub-info">最近
                <span v-if="pageType === 'detail'">{{settings.dormancy.minDaysZone}}</span>
                <el-form-item v-else prop="dormancy.minDaysZone" class="mini-input">
                  <el-input v-model="settings.dormancy.minDaysZone"></el-input>
                </el-form-item>
                天无消费</div>
              <cyc-item txt="休眠顾客唤醒"  v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.dormancy.wakeup)" type="dormancy"><el-switch v-if="this.pageType === 'edit'" v-model="settings.dormancy.wakeup"></el-switch></cyc-item>
              <cyc-item @click.native="goCustomer('XM')"/>
            </div>
          </div>
          <div class="setting-item lost">
            <div class="title"><div class="name">流失顾客</div><div class="value">{{settings.lost.num}}</div></div>
            <div class="sub-title">
              <div class="sub-info">最近
                <span v-if="pageType === 'detail'">{{settings.lost.maxDaysZone}}</span>
                <el-form-item v-else prop="lost.maxDaysZone" class="mini-input">
                  <el-input v-model="settings.lost.maxDaysZone"></el-input>
                </el-form-item>
                天无消费</div>
              <cyc-item v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.lost.live)" txt="流失顾客挽回" type="lost"><el-switch v-if="this.pageType === 'edit'" v-model="settings.lost.live"></el-switch></cyc-item>
              <cyc-item @click.native="goCustomer('LS')"/>
            </div>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 15px;padding-bottom: 5px;" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && (settings.birthday.customer || settings.birthday.baby))">
        <div class="card-title">生日关怀</div>
        <div class="cyc-item-label" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.birthday.customer)">
          <div class="label"><cyc-item txt="顾客生日关怀">&nbsp;<el-switch v-if="this.pageType === 'edit'" v-model="settings.birthday.customer"></el-switch></cyc-item></div>
          <div class="tip">* 每日0点，系统自动推送
            <span v-if="pageType === 'detail'">{{settings.birthday.customer_condition || '--'}}</span>
            <el-form-item v-else prop="birthday.customer_condition" class="mini-input">
              <el-input v-model="settings.birthday.customer_condition"></el-input>
            </el-form-item>
            天后生日的顾客信息至对应归属员工，由归属员工进行顾客生日关怀</div>
        </div>
        <div class="cyc-item-label" v-if="this.pageType === 'edit' || (this.pageType === 'detail' && settings.birthday.baby)">
          <div class="label"><cyc-item txt="宝宝生日关怀">&nbsp;<el-switch v-if="this.pageType === 'edit'" v-model="settings.birthday.baby"></el-switch></cyc-item></div>
          <div class="tip">* 每日0点，系统自动推送
            <span v-if="pageType === 'detail'">{{settings.birthday.baby_condition || '--'}}</span>
            <el-form-item v-else prop="birthday.baby_condition" class="mini-input">
              <el-input v-model="settings.birthday.baby_condition"></el-input>
            </el-form-item>
            天后生日的宝宝信息至对应归属员工，由归属员工进行宝宝生日关怀</div>
        </div>
      </el-card>
    </el-form>
    <el-card style="margin-top: 15px;padding-bottom: 15px;">
      <div class="card-title">已下发任务</div>
      <task-table />
    </el-card>
    <customer-category ref="customer-category" />
  </div>
</template>

<script>
import { filterStatus } from '@/utils'
import { lifeCycList, editLifeCyc } from '@/service/mycustomer'
import moment from 'moment'
import NP from 'number-precision'
import cycItem from './components/item'
import taskTable from './components/table'
import customerCategory from './components/category'
export default {
  name:'mycustomer-lifeCycle-detail',
  data () {
    const isNumber = (rule, value, callback) => {
      var CS = /^[0-9]+$/
      if (!CS.test(value) || value === 0) {
        callback(new Error('只能输入正整数'))
      }else{
        callback()
      }
    }
    return {
      pageType: 'detail',
      dataList:[],
      settings: {
        // 潜在客户
        protential: {num: 0},
        // 新客
        newer: {num: 0},
        // 活跃顾客
        active: {num: 0},
        // 休眠顾客
        dormancy: {num: 0},
        // 流失顾客
        lost: {num: 0},
        // 生日关怀
        birthday: {}
      },
      dataListLoading: false,
      dataFormRules: {
        'newer.minDaysZone': [{required: true, message: '请输入正整数'}, {validator: isNumber, trigger: 'blur' }],
        'dormancy.minDaysZone': [{required: true, message: '请输入正整数'}, {validator: isNumber, trigger: 'blur' }],
        'lost.maxDaysZone': [{required: true, message: '请输入正整数'}, {validator: isNumber, trigger: 'blur' }],
        'birthday.customer_condition': [{required: true, message: '请输入正整数'}, {validator: isNumber, trigger: 'blur' }],
        'birthday.baby_condition': [{required: true, message: '请输入正整数'}, {validator: isNumber, trigger: 'blur' }],
      }
    }
  },
  components: {
    cycItem,
    taskTable,
    customerCategory
  },
  created () {
    this.init()
  },
  methods: {
    // 获取等级列表
    async init() {
      const { data } = await lifeCycList()
      if (data && data.code === 0) {
        // 数据转换
        let tempData = {}
        // 潜在客户
        let protential = data.data.find(item => { return item.customerStage === 'QZ'}) || {}
        // 新客
        let newer = data.data.find(item => { return item.customerStage === 'XK'}) || {}
        // 活跃顾客
        let active = data.data.find(item => { return item.customerStage === 'HY'}) || {}
        // 休眠顾客
        let dormancy = data.data.find(item => { return item.customerStage === 'XM'}) || {}
        // 流失顾客
        let lost = data.data.find(item => { return item.customerStage === 'LS'}) || {}
        // 生日关怀
        let birthday = data.data.find(item => { return item.customerStage === 'BIRTH'}) || {}

        newer = {
          ...newer,
          three: newer.customerSwitches.find(item => { return item.type === 'NEW_OF_3'}).opened,
          seven: newer.customerSwitches.find(item => { return item.type === 'NEW_OF_7'}).opened,
          ten: newer.customerSwitches.find(item => { return item.type === 'NEW_OF_10'}).opened
        }
        active = {
          ...active,
          time: active.customerSwitches.find(item => { return item.type === 'TIMES'}).opened,
          price: active.customerSwitches.find(item => { return item.type === 'PRICE'}).opened,
        }
        dormancy = {
          ...dormancy,
          wakeup: dormancy.customerSwitches.find(item => { return item.type === 'WAKEUP'}).opened,
        }
        lost = {
          ...lost,
          live: lost.customerSwitches.find(item => { return item.type === 'LIVE'}).opened,
        }
        const customer = birthday.customerSwitches.find(item => { return item.type === 'CUSTOMER_BIRTH'})
        const baby = birthday.customerSwitches.find(item => { return item.type === 'BABY_BIRTH'})
        birthday = {
          ...birthday,
          customer: customer.opened,
          customer_condition: customer.condition,
          baby: baby.opened,
          baby_condition: baby.condition
        }
        tempData = {
          protential,
          newer,
          active,
          dormancy,
          lost,
          birthday
        }
        this.settings = tempData
        this.pageType = 'detail'
      } else {
        this.$message.warning(data.msg)
      }
    },

    // 更改页面状态
    changePageType(type) {
      if (type === 'detail') {
        this.init()
      }
      this.pageType = type
    },

    // 客户分类
    goCategory() {
      this.$nextTick(() => {
        this.$refs['customer-category'].init()
      })
    },

    checkDay() {
      let flag = true
      let message = ''
      if (Number(this.settings.newer.minDaysZone) >= Number(this.settings.dormancy.minDaysZone)) {
        message = '休眠顾客时间需大于新客时间！'
        flag = false
      } else if ( Number(this.settings.dormancy.minDaysZone) >= Number(this.settings.lost.maxDaysZone)) {
        message = '流失顾客时间需大于休眠顾客时间！'
        flag = false
      }
      if (!flag) {
        this.$message.warning(message)
      }
      return flag
    },

    goCustomer(type) {
      this.$router.push({ name: 'mycustomer-mycustomer', params: {type}})
    },

    // 保存
    save() {
      this.$refs['settings-form'].validate(async (valid) => {
        if (valid && this.checkDay()) {
          const newer = {
            ...this.settings.newer,
            minDaysZone: this.settings.newer.minDaysZone,
            maxDaysZone: this.settings.newer.minDaysZone,
            customerSwitches: [{
              opened: this.settings.newer.three,
              type: 'NEW_OF_3'
            }, {
              opened: this.settings.newer.seven,
              type: 'NEW_OF_7'
            }, {
              opened: this.settings.newer.ten,
              type: 'NEW_OF_10'
            }]
          }
          const active = {
            ...this.settings.active,
            minDaysZone: this.settings.newer.minDaysZone,
            maxDaysZone: this.settings.dormancy.minDaysZone,
            customerSwitches: [{
              opened: this.settings.active.time,
              type: 'TIMES'
            }, {
              opened: this.settings.active.price,
              type: 'PRICE'
            }]
          }
          const dormancy = {
            ...this.settings.dormancy,
            minDaysZone: this.settings.dormancy.minDaysZone,
            maxDaysZone: this.settings.lost.maxDaysZone,
            customerSwitches: [{
              opened: this.settings.dormancy.wakeup,
              type: 'WAKEUP'
            }]
          }
          const lost = {
            ...this.settings.lost,
            minDaysZone: this.settings.lost.maxDaysZone,
            maxDaysZone: this.settings.lost.maxDaysZone,
            customerSwitches: [{
              opened: this.settings.lost.live,
              type: 'LIVE'
            }]
          }
          const birthday = {
            ...this.settings.birthday,
            customerSwitches: [{
              condition: this.settings.birthday.customer_condition,
              opened: this.settings.birthday.customer,
              type: 'CUSTOMER_BIRTH'
            }, {
              condition: this.settings.birthday.baby_condition,
              opened: this.settings.birthday.baby,
              type: 'BABY_BIRTH'
            }]
          }
          let settings = [newer, active, dormancy, lost, birthday]
          // 数据转换
          const { data } = await editLifeCyc({customerLifeDtos: settings})
          if (data.code === 0) {
            this.$message.success('保存成功')
            this.init()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }

  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
.page-lifeCyc-info{
  .active-button{
    position: absolute;
    top: 30px;
    right: 5px;
    cursor: pointer;
    width: 40px;
    height: 20px;
    border-radius: 6px;
    line-height: 20px;
    text-align: center;
    // z-index: 20;
    color: #fff !important;
    border: 1px solid #fff;
    background: transparent;
  }
  .mini-input{
    width: 30px;
    display: inline-block;
    .el-input__inner{
      padding: 0 3px;
    }
    .el-form-item__error{
      left: -30px;
      right: -30px;
    }
  }
  .basic-button{
    width: 100px;
    text-align: center;
    padding: 10px !important;
    font-size: 12px;
  }
  .setting-container{
    margin: 0 -15px;
    display: flex;
    flex-direction: row;
    .el-switch{
      float: left;
    }

    .setting-item{
      width: 20%;
      position: relative;
      padding-top: 60px;
      .title{
        height: 60px;
        top: 0;
        position: absolute;
        width: 100%;
        background: #5b98f5;
        color: #fff;
        text-align: center;
        .name{
          font-size: 14px;
          padding: 5px 10px;
        }
        .value{
          font-size: 24px;
        }
        // &:after{
        //   z-index: 10;
        //   content: '';
        //   width: 52px;
        //   height: 52px;
        //   background: #ff9248;
        //   position: absolute;
        //   top: 9px;
        //   right: -24px;
        //   border-top: 3px solid #fff;
        //   border-right: 3px solid #fff;
        //   transform: rotate(45deg);
        // }
      }
      &.newer{
        .title {
          background: #77c059;
          // &:after{
          //   background: #ff7c24;
          // }
        }

      }
      &.active{
        .title {
          background: #e7766f;
          // &:after{
          //   background: #ff6600;
          // }
        }
      }
      &.dormancy{
        .title {
          background: #dda755;
          // &:after{
          //   background: #ff4e00;
          // }
        }
      }
      &.lost{
        .title {
          background: #909398;
          // &:after{
          //   display: none;
          // }
        }
      }
    }
    .sub-title{
      padding: 10px;
      height: 100%;
      border-right: 1px solid #dcdcdc;
      .sub-info{
        color: $info--sub-font-color;
        height: 40px;
        line-height: 20px;
      }
    }

    .setting-item.lost{
      .sub-title{
        border-right: none;
      }
    }
  }
  .card-title{
    font-size: 18px;
    margin-bottom: 15px;
  }
  .cyc-item-label{
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    .label{
      width: 200px;
      .life-cyc-item{
        margin-top: 0;
      }
    }
    .tip{
      padding-left: 15px;
      line-height: 40px;
      flex: 1
    }
  }
  .control-container{
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .control-info{
      flex: 1;
    }
    .control-operate{
      // width: 200px;
      text-align: right;
    }
  }

}
</style>
