<template>
  <section class="page-mutiple-integral-rule">
    <!-- table列表 -->
    <div class="mutiple-title theme-color">顾客等级多倍积分：<el-tooltip placement="top">
            <div slot="content" style="width: 360px;">1、会员等级多倍积分、会员指定周期多倍积分：仅对储值卡充值（若开启储值卡积分）、礼品卡积分、储值卡消费、订单积分生效；<br/>2、在进行整单退时，会相应的扣除退货订单积分（若当时下单享有的是多倍积分，则扣除多倍积分）；进行单品退时，不会扣除积分；</div>
            <img class="tip-icon" style="margin-left: 10px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        <span class="tips" style="font-size: 14px;color: #8a979e">（多倍积分=订单积分*积分倍数（默认1倍，即不计算多倍积分））</span>
    </div>
    <el-table
      :data="[{}]"
      border
      v-if="vipList && vipList.length > 0"
      v-loading="dataListLoading">
      <el-table-column
        prop="rule"
        width="180"
        label="等级名称">
        <template slot-scope="scope">
          <span>积分倍数</span>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.levelId"
        width="140"
        :key="item.levelId"
        v-for="item in vipList"
        :label="item.vipName">
        <template slot-scope="scope">
          <span>{{item.multiple}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="tip">暂无顾客等级，请先至“我的顾客-会员等级管理”中维护等级</div>

    <!-- <div class="mutiple-title theme-color">顾客生日多倍积分：</div>
    <el-table
      :data="mutipleIntegral.birthdayList"
      border
      v-loading="dataListLoading">
      <el-table-column
        prop="rule"
        width="180"
        label="等级名称">
        <template>
          <span>积分倍数</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rule"
        width="140"
        :key="item.value"
        v-for="item in memberList"
        :label="item.label">
        <template>
          <span>积分倍数</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="mutiple-title theme-color">
      特殊节日多倍积分：
      <icon-svg name="create" class="theme-color" />
    </div>
    <el-table
      :data="mutipleIntegral.festivalList"
      border
      v-loading="dataListLoading">
      <el-table-column
        prop="index"
        width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button class="nopadding" type="text" size="small" @click="addOrUpdateRule(scope.row)">编辑</el-button>
          <span >|</span>
          <el-button class="nopadding" type="text" size="small" @click="deleteRule(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="start"
        width="180"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="end"
        width="180"
        label="结束日期">
      </el-table-column>
      <el-table-column
        prop="level"
        width="180"
        label="适用等级">
      </el-table-column>
      <el-table-column
        prop="times"
        width="180"
        label="积分倍数">
      </el-table-column>
    </el-table> -->

    <div v-if="vipList && vipList.length > 0" class="mutiple-title theme-color">指定周期多倍积分：</div>
    <el-form-item v-if="vipList && vipList.length > 0" prop="">
      <el-radio-group class="block-radio" v-model="vipDatePlans.cycleType" :disabled="pageType === 'detail'?true:false">
        <el-radio label="WEEK" value="WEEK">
          每周
          <el-form-item prop="weekLabel" class="form-item-inline">
            <el-select class="inputs1" v-model="vipDatePlans.dayOfWeek" :disabled="pageType === 'detail'?true:false">
              <el-option v-for="item in weekConstant" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          消费获
          <el-form-item prop="weekValue" class="form-item-inline">
            <el-input class="inputs1" v-model="vipDatePlans.weekVal" :disabled="pageType === 'detail'?true:false"/>
          </el-form-item>
          倍积分
        </el-radio>
        <el-radio label="MONTH" value="MONTH" style="margin-left: 0;">
          每月
          <el-form-item prop="monthLabel" class="form-item-inline">
            <el-select class="inputs1" v-model="vipDatePlans.dayOfMonth" :disabled="pageType === 'detail'?true:false">
              <el-option v-for="item in 31" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <!-- <el-input class="inputs1" v-model="vipDatePlans.dayOfMonth" :disabled="pageType === 'detail'?true:false"/> -->
          </el-form-item>
          号消费获
          <el-form-item prop="monthValue" class="form-item-inline">
            <el-input class="inputs1" v-model="vipDatePlans.monthVal" :disabled="pageType === 'detail'?true:false"/>
          </el-form-item>
          倍积分
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <integral-rule-list-modal ref="addOrUpdate" @refreshRuleList="refreshList"/> -->
  </section>
</template>
<script>
// import integralRuleListModal from './integral-rule-list-modal'
import { weekConstant } from '@/utils/dict'
export default {
  name: 'page-integral-rule-list',
  props: ['pageType'],
  data () {
    return {
      monthList:[],
      weekConstant,
      vipList: [],
      dataFormRules: {},
      vipDatePlans:{
        id: null,
        cycleType:'WEEK',
        dayOfWeek: 1,
        weekVal: 1,
        dayOfMonth: 1,
        monthVal: 1
      },
      dataListLoading: false
    }
  },

  // components: {
  //   integralRuleListModal
  // },

  methods: {
    // 获取等级列表
    async getLevel(obj,vipList) {
      this.vipList = vipList.map(item => {
        return {
          id: item.id?item.id:null,
          vipName: item.vipName,
          levelId: item.levelId,
          multiple: this.priceNum(item.multiple) || 1
        }
      })
      this.vipDatePlans = obj.vipDatePlans?{
        ...obj.vipDatePlans,
        monthVal: this.priceNum(obj.vipDatePlans.monthVal),
        weekVal: this.priceNum(obj.vipDatePlans.weekVal)}:this.vipDatePlans
    },

    // async addOrUpdateRule(item) {
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(item)
    //   })
    // },

  }
}
</script>
<style lang="scss">
.page-mutiple-integral-rule{
  .mutiple-title{
    font-size: 16px;
    line-height: 40px;
    .tip{
      font-size: 12px;
    }
  }
  .el-table{
    td{
      .table-input{
        padding: 4px 0 !important;
        .el-input__inner{
          width: 100px;
        }
      }
    }
  }
}
</style>

