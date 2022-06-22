<template>
  <section class="page-staff-view">
    <div :class="dataList.length>0?'left':'left_complete'" style="position: relative;">
      <el-card>
        <!-- 基本信息 -->
        <gt-subtitle title="基本信息" style="display: block;"/>
        <el-form ref="staff-form"  label-width="150px" :model="staff" :validate-on-rule-change="false">
          <img v-if="staff.photo" class="staff-header" :src="`https://${staff.photo}`" alt="头像">
          <el-form-item label="员工状态：">
            <span class="itemInput">{{staff.status === 'ENABLE' ? '正常' : '停用'}}</span>
          </el-form-item>
          <el-form-item label="员工姓名：" prop="name">
            <span class="itemInput">{{staff.name}}</span>
          </el-form-item>
          <el-form-item label="员工性别：" prop="gender">
            <span class="itemInput">{{staff.gender === 'FEMALE' ? '女' : (staff.gender === 'MALE' ? '男' : '--')}}</span>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <span class="itemInput">{{staff.phone}}</span>
          </el-form-item>
          <el-form-item label="员工类型：" prop="type">
            <span class="itemInput">{{staff.type === 'STORE' ? '门店员工' : '企业员工'}}</span>
          </el-form-item>
          <el-form-item label="所属门店：" prop='storeName' v-if="staff.type === 'STORE'" >
            <span class="itemInput">{{staff.storeName}}</span>
          </el-form-item>
          <el-form-item label="员工角色：" prop="sysRoleId">
            <span class="itemInput">{{staff.sysRoleName}}</span>
          </el-form-item>
          <div class="dashed" v-show="staff.type=='STORE'"></div>
          <!-- 业绩提成 -->
          <gt-subtitle title="指标设置" v-show="staff.type=='STORE'" style="display: block;"/>
          <el-form-item label="销售业绩指标：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="indicator">
            <span class="itemInput">{{number(priceNum(staff.indicator,'in'))}}元</span>
          </el-form-item>
          <el-form-item label="销售业绩跑档：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="commissionTableList">
            <el-table
              ref="filterTable"
              :data="staff.commissionTableList"
              style="width: 100%">
              <el-table-column
                prop="achievementDegree"
                label="跑档"
                width="100">
              </el-table-column>
              <el-table-column
                prop="one"
                label="第一档"
                width="100">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.one+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="two"
                label="第二档"
                width="100">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.two+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="three"
                label="第三档"
                width="100">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.three+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="four"
                label="第四档"
                width="100">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.four+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="five"
                label="第五档"
                width="100">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&gt;=</span>
                  <span class="itemInput">{{scope.row.five+'%'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="新客开发指标：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="newCustomerIndicator">
            <span class="itemInput">{{ staff.newCustomerIndicator }}位/月</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="right" v-if="dataList&&dataList.length>0">
      <el-card>
        <gt-subtitle title="回访小记" style="display: block;"/>
        <el-form ref="returnVisit" v-for="item in dataList" :key="item.employeeId"  label-width="50px" >
          <span class="returnVisit-times">{{item.createTime || '--'}}</span>
          <el-form-item label="顾客:" prop="customerName">
            <span class="itemInput">{{item.customerName}}</span>
          </el-form-item>
          <el-form-item label="项目:" prop="workItem">
            <span class="itemInput">{{filterStatus(item.workItem,workProject)}}</span>
          </el-form-item>
          <!-- 回访内容 -->
          <el-form-item label="备注:" prop="content">
            <span class="itemInput">{{item.content}}</span>
          </el-form-item>
          <div class="dashed"></div>
        </el-form>
      </el-card>
    </div>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { status, couponType, staffType, staffRole,workProject} from '@/utils/dict'
import { filterStatus } from '@/utils'
import { mapState } from 'vuex'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
import { getStaffDetail,workRecords } from '@/service/staffManagement'
import { number } from '@/utils/validate'

import moment from 'moment'
export default {
  name: 'staff-view',
  components: {
    gtSubtitle
  },
  data() {
    return {
      filterStatus,
      workProject,
      dataList:[],//回访小记
      id: '',
      sysRoleIdList:[],
      imgArr: [],
      picFlag: true,
      staff:{
        type:'',//类型
        name:'',//姓名
        phone:'',//手机号
        gender: '', // 性别
        sysRoleIdList:'',//角色
        quarters:'',//岗位
        status:'',//状态
        storeName:'',//所属门店
        commissionTableList: [{
          degree: '80',
          ratio: '0'
        }, {
          degree: '80',
          ratio: '0'
        }, {
          degree: '80',
          ratio: '0'
        }, {
          degree: '80',
          ratio: '0'
        }, {
          degree: '80',
          ratio: '0'
        }],
        position: [],
      },
      returnVisit:{
        createTime:'',//创建时间
        employeeId:'',//顾客
        workItem:'',//项目
        content:'',//回访内容，即：备注
      },
      goodsType: 1,
      storeList: [], // 门店列表
      number,
      staffType,
      staffRole,
    }
  },
  created() {
    const { id } = this.$route.query
    this.id = id
    this.init(id)
    // if(this.isAuth('company:workRecords:select')){
    this.getDataList(id)
    // }
  },
  methods: {
    async init(id) {
      const data = await getStaffDetail(id)
      let commissionTableList = this.staff.commissionTableList
      if (data && data.commissionTableList && data.commissionTableList.length >= 5) {
        commissionTableList = [{
          achievementDegree: '业绩完成度',
          one: data.commissionTableList[0].degree,
          two: data.commissionTableList[1].degree,
          three: data.commissionTableList[2].degree,
          four: data.commissionTableList[3].degree,
          five: data.commissionTableList[4].degree
        },{
          achievementDegree: '提成比例',
          one: data.commissionTableList[0].ratio,
          two: data.commissionTableList[1].ratio,
          three: data.commissionTableList[2].ratio,
          four: data.commissionTableList[3].ratio,
          five: data.commissionTableList[4].ratio
        }]
      }

      this.staff = {
        ...data,
        commissionTableList
      }
    },
    // 回访小记
    async getDataList() {
      this.dataListLoading = true
      const { data } = await workRecords({
        'employeeId': this.id
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
    },
  }
}
</script>
<style lang="scss">
  .page-staff-view{
    position: relative;
    .staff-header{
      width: 160px;
      height: 160px;
      // border-radius: 80px;
      position: absolute;
      top: 30px;
      right: 30px;
    }
    .min-input{
      .el-input__inner{
        width: 100px;
      }
    }
    .dashed{
      width: 100%;
      border: 1px dashed #8a979e;
    }
    .gt-input-tip{
      .min-input{
        .el-input__prefix{
          left: 110px;
        }
      }
    }
    .table-container{
      padding: 10px 15px;
      background-color: #f1f4f5;
      border-radius: 10px;
    }

    .img-item {
      width: 10rem;
      height: 12rem;
      float: right;
      margin-right: 12rem;
      margin-top: -12.5rem;
    }
    .img-item img {
      width: 100%;
      height: 100%;
    }
    .active-pic {
      font-size: 0.6rem;
      color: #9b9b9b;
      padding: 0 1rem 0 1.5rem;
      margin-top: 1rem;
    }
    .add-pic input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0;
    }
    .edit-input{
      .el-input__inner{
        width: 50px;
      }
      padding: 0 !important;
    }
  }
  .left{
    width: 70%;
    float: left;
  }
  .left_complete{
    width: 100%;
    float: left;
  }
  .right{
    width: 30%;
    float: right;
  }
  .returnVisit-times{
    float: right;
    margin-right: 2px;
  }
</style>
