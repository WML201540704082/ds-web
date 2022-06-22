<template>
  <section class="page-campaign-add">
    <div class="left">
      <el-card>
        <el-form ref="staff-form"  label-width="150px" :model="staff" :validate-on-rule-change="false">
          <span class="satff-add_top"><b>基本信息</b></span>
          <el-form-item label="员工姓名：" prop="name">
            <span class="itemInput">{{staff.name}}</span>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <span class="itemInput">{{staff.phone}}</span>
          </el-form-item>
          <el-form-item label="员工岗位：" prop="position">
            <span class="itemInput">{{staff.position}}</span>
          </el-form-item>
          <!-- 业绩提成 -->
          <div>
            <span>------------------------------------------------------------------------------------------------------------</span>
          </div>
          <span class="satff-add_top"><b>业绩提成</b></span>
          <el-form-item label="销售业绩指标：" class="gt-input-tip" prop="indicator">
            <span class="itemInput">{{number(staff.indicator)}}元</span>
          </el-form-item>
          <el-form-item label="销售业绩跑档：" class="gt-input-tip">
            <!-- table -->
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
                width="80">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.one+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="two"
                label="第二档"
                width="80">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.two+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="three"
                label="第三档"
                width="80">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.three+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="four"
                label="第四档%"
                width="80">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&lt;</span>
                  <span class="itemInput">{{scope.row.four+'%'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="five"
                label="第五档"
                width="90">
                <template slot-scope="scope">
                  <span class="itemInput" v-if="scope.$index === 0">&gt;=</span>
                  <span class="itemInput">{{scope.row.five+'%'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div>
            <span>------------------------------------------------------------------------------------------------------------</span>
          </div>
          <!-- 数据权限 -->
          <span class="satff-add_top"><b>数据权限</b></span>
          <el-form-item label="员工角色：" prop="sysRoleId">
            <span class="itemInput">
              <!-- {{
                staff.sysRoleId === 0 ? '管理员' :
                staff.sysRoleId === 1 ? '店长' :
                staff.sysRoleId === 2 ? '导购员' :
                                        '收银员'
              }} -->
              {{staff.sysRoleId}}
            </span>
          </el-form-item>
          <el-form-item label="员工状态：">
             <span class="itemInput">{{staff.status === 'ENABLE' ? '激活' : '离职'}}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="right" v-if="dataList&&dataList.length>0">
      <el-card>
        <span class="satff-add_top">回访/小记</span>
        <el-form ref="returnVisit" v-for="item in dataList" :key="item.employeeId"  label-width="50px" >
          <span class="returnVisit-times">{{item.createTime || '--'}}</span>
          <el-form-item label="顾客:" prop="customerName">
            <span class="itemInput">{{item.customerName}}</span>
          </el-form-item>
          <el-form-item label="项目:" prop="workItem">
            <span class="itemInput">{{item.workItem}}</span>
          </el-form-item>
          <el-form-item label="备注:" prop="content">
            <span class="itemInput">{{item.content}}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <!-- <gt-dialog-checkbox ref="checkboxs" @list="listBox"/> -->
  </section>
</template>
<script>
import { status, couponType, staffType, staffRole} from '@/utils/dict'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
// import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import { getStoreList } from '@/service/systore'
import { getStaffDetail,workRecords  } from '@/service/staffManagement'
import { number } from '@/utils/validate'
import moment from 'moment'
export default {
  data() {
    return {
      dataList:[],//回访小记
      sysRoleIdList:[],
      imgArr: [],
      picFlag: true,
      staff:{
        type:'',//类型
        name:'',//姓名
        phone:'',//手机号
        sysRoleIdList:'',//角色
        quarters:'',//岗位
        status:'',//状态
        storeName:'',//所属门店
        commissionTableList:[],//阶档
        position: [],
      },
      returnVisit:{},
      goodsType: 1,
      storeList: [], // 门店列表
      number,
      staffType,
      staffRole,
    }
  },
  created() {
    const { id } = this.$route.query
    this.init(id)
    // if(this.isAuth('store:workRecords:select')){
      this.getDataList(id)
    // }
  },
  methods: {
    async init(id) {
      const data = await getStaffDetail(id)
      const commissionTableList = [{
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
      this.staff = {
        ...data,
        commissionTableList
      }
    },
    // 回访小记
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await workRecords({
        'employeeId':id
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
.page-campaign-add{
  .min-input{
    .el-input__inner{
      width: 100px;
    }
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
  .satff-add_top{
    color: black;
    font-size: 18px;
    margin-left: 5px;
  }
  #photo img {
    float: right;
    width: 140px;
    height: 140px;
    margin-right: 9rem;
    margin-top: -10rem;
  }
  hide {
    display: none;
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
.right{
  width: 30%;
  float: right;
}
</style>
