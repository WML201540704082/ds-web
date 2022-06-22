<template>
  <div class="mod-store customers page-customer-list member-level-container">
    <el-card style="padding-bottom: 20px;">
      <div class="allInfos">
        <div class="container-left" style="border-right: 1px solid #f2f2f2!important;">
          <div style="display: inline-block; margin-top: 30px;vertical-align: top; margin-left:20px"><icon-svg name="homevip" class="theme-color" style="font-size: 40px;"></icon-svg></div>
          <div class="memberAll" style="display: inline-block; ">
            <div class="amountName">会员总数</div>
            <div class="amount theme-color">{{num}}</div>
            <div class="todayAdd">今日新增:<p class="theme-color">{{todayNum}}</p></div>
          </div>
        </div>
        <div class="container-right">
          <div class="memberAll level" v-for="item in totalMember" :key="item.vipName">
            <div class="amountName">{{item.vipName}}</div>
            <div class="amount theme-color">{{item.tolSum}}</div>
            <div class="todayAdd">今日新增:<p class="theme-color">{{item.newSum}}</p></div>
          </div>
        </div>

      </div>
    </el-card>
    <!-- 是否开启自动升级 -->
    <el-card style="margin-top: 10px;padding-bottom: 18px;">
      <span class="switD" style="margin-bottom: 10px;">
        <div>
          <el-switch
            class="switchs"
            style="margin-bottom: 8px;"
            v-model="isFlag"
            active-color="#13ce66"
            inactive-color="#F66B40"
            @change="switchs"
            :active-text="isFlag?'开启':'关闭'">
          </el-switch>
        </div>
        <div style="font-size: 12px;color: #777;">是否开启会员自动升级</div>
      </span>
      <span class="lines"></span>
      <span  class="switD" style="font-size: 12px;color: #777;">
        <div><b style="color: red;">*</b>若开启会员自动升级，则顾客的{{text}}达到升级条件时，自动升级至对应的会员等级；不论开启与否，您均可手动修改顾客的会员等级；</div>
        <div style="margin-top: 10px;"><b style="color: red;">*</b>每次重新开启会员自动升级功能，顾客的{{text}}将重新开始计算。</div>
        <div style="margin-top: 10px;"><b style="color: red;">*</b>会员升级方式改变后，第二天生效。</div>
      </span>
      <div style="margin-top: 10px;" v-if="isFlag"><span class="theme-color theme-border" style="padding: 5px;border-radius: 5px;cursor:pointer" @click="setMemberMethod">设置会员升级方式</span></div>
    </el-card>

    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="this.dataList.length<6" txt="新增会员等级" type="create" @click.native="addMemberLevel('',0)"/>
      <el-table
        v-table-height
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="addMemberLevel(scope.row.id,scope.$index)">编辑</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="vipId"
          min-width="160"
          label="等级排序">
        </el-table-column>
        <el-table-column
          prop="vipName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="等级姓名">
        </el-table-column>
        <el-table-column
          prop="vipDiscount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="优惠折扣">
          <template slot-scope="scope">
            <span v-if="scope.row.vipDiscount || scope.row.vipDiscount==0">{{scope.row.vipDiscount}}%</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="upgtadeRule"
          :show-overflow-tooltip="true"
          min-width="150"
          label="自动升级规则">
          <template slot-scope="scope">
            <span v-if="scope.row.upgtadeRule || scope.row.upgtadeRule==0">{{text}}达到 {{priceNum(scope.row.upgtadeRule)}} {{unit}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="levelValid"
          min-width="120"
          :show-overflow-tooltip="true"
          label="有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.levelValid&&scope.row.levelValid!='MONTH'">{{filterStatus(scope.row.levelValid, levelValid)}}</span>
            <span v-else-if="scope.row.levelValid&&scope.row.levelValid=='MONTH'">{{scope.row.month}}月</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <gt-add-member v-if="addVisible" ref="addmember" @refreshDataList="getDataList"/>
    <gt-add-member-method v-if="addVisiblemethod" ref="addmembermethod" @refreshDataList="initData"/>
  </div>
</template>

<script>
import { levelValid } from '@/utils/dict'
import { filterStatus } from '@/utils'
import gtAddMember from './addMember'
import gtAddMemberMethod from './addMemberMethod'
import * as api from '@/service/mycustomer'
import moment from 'moment'
import NP from 'number-precision'
import {validatenull} from '@/utils/validate'
export default {
  name:'mycustomer-memberLevel-list',
  data () {
    return {
      filterStatus,
      levelValid,
      ruleDetail:{
        type: null,
      },
      isFlag: false,
      addVisiblemethod: false,
      addVisible: false,
      dataList:[],
      dataListLoading: false,
      totalMember:[],
      num:0,
      todayNum: 0,
      text:'累计现金消费',
      unit:'元',
    }
  },
  components: {
    gtAddMember,gtAddMemberMethod
  },
  created () {
    this.initData()
  },
  methods: {
    initData(){
      this.switchDetail()
      this.getDataList()
    },
    // 设置会员升级方式
    setMemberMethod(){
      this.addVisiblemethod = true
      this.$nextTick(() => {
        this.$refs.addmembermethod.init(this.ruleDetail.type)
      })
    },
    // 会员信息汇总
    async memberTotal(){
      const {data} = await api.memberTotal()
      if(data.code == 0){
        var totalMember = data.data
        var num = 0
        var todayNum = 0
        if(totalMember){
          totalMember.map(o=>{
            num = NP.plus(Math.abs(num),Math.abs(o.tolSum))
            todayNum = NP.plus(Math.abs(todayNum),Math.abs(o.newSum))
          })
        }
        this.num = num || 0
        this.todayNum = todayNum || 0
        this.totalMember = totalMember || []
      }else{
        this.totalMember = []
        this.$message.error(data.msg)
      }
    },
    // 升级开关详情
    async switchDetail(){
      const {data} = await api.autoDetail()
      if(data.code == 0){
        this.ruleDetail = data.data
        var type = data.data.type
        this.ruleDetail.type = type
        if(type == 1){
          this.text = '累计积分'
          this.unit = ''
        }else if(type==2){
          this.text = '累计现金消费'
          this.unit = '元'
        }else{
          this.text = '累计充值金额'
          this.unit = '元'
        }
        if(this.ruleDetail.autoType == 'ON'){
          this.isFlag = true
        }else{
          this.isFlag = false
        }
      }else{
        this.$message.error(data.msg)
      }
    },
    // 升级开关保存接口
    async switchs(val){
      const {data} = await api.autoSave({
        id:this.ruleDetail.id,
        autoType: val?'ON':'OFF'
      })
      if(data.code == 0){
        this.$message.success(val?'开启':'关闭')
      }else{
        this.isFlag=false
        this.$message.error(data.msg)
      }
    },
    // 获取等级列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.levelList({
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data
        this.memberTotal()
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }

    },
    // 删除等级
    deleteHandle (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该等级',
        confirm: async () => {
          const { data } = await api.deleteLevel(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.memberTotal()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$easyConfirm.hide()
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 新增会员等级
    addMemberLevel(id,index){
      if(this.ruleDetail.type){
        var idx 
        if(id){
          idx = index
        }else{
          idx = this.dataList.length
        }
        if(idx == 0){
          this.addVisible = true
          this.$nextTick(() => {
            this.$refs.addmember.init(id,this.dataList,index,this.ruleDetail.type)
          })
        }else{
          if(!validatenull(this.dataList[idx-1].upgtadeRule)){
            this.addVisible = true
            this.$nextTick(() => {
              this.$refs.addmember.init(id,this.dataList,index,this.ruleDetail.type)
            })
          }else{
            this.$message.warning('请先维护上一级的会员升级规则')
            return
          }
        }
      }else{
        this.$message.warning('请先设置会员等级方式')
        return
      }
      
    }
  }
}
</script>

<style lang="scss">
.member-level-container{
  .allInfos {
    display: flex;
    .container-left {
      width: 200px;
    }
    .container-right{
      display: flex;
      flex: 1;
      flex-direction: row;
    }
  }
}
.switchs {
  display: inline-block;
  vertical-align: initial;
}

.memberAll {
  padding: 0 20px;
  &.level{
    flex: 1;

  }
  .amountName {
    color: #A1A1A1;
    font-size: 12px;
  }
  .amount {
    margin: 10px 0 8px 0;
    font-weight: bold;
    font-size: 22px;
    text-align: left;
  }
  .todayAdd {
    color: #A1A1A1;
    font-size: 12px;
    p {
      margin-left: 8px;
      display: inline-block;
    }
  }
}

  .switD {
    display: inline-block;
  }
  .lines {
    height: 35px;
    margin: 0 18px;
    display: inherit;
    width: 1px;
    border-right: 1px solid #f2f2f2;
  }
</style>
