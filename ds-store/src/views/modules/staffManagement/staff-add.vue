<template>
  <section class="page-staff-add">
    <el-card>
      <!-- <gt-sub-title title="新增员工" /> -->
      <span class="satff-add_top"><b>基本信息</b></span>
      <el-form ref="staff-form" :rules="dataFormRules" label-width="150px" :model="staff" :validate-on-rule-change="false">
        <el-form-item label="员工姓名：" prop="name">
          <el-input v-model="staff.name" :maxlength="8" placeholder="最多支持8个汉字"/>
        </el-form-item>
        <el-form-item label="员工性别：" prop="sex">
          <el-radio-group v-model="staff.sex">
            <el-radio label="female">女</el-radio>
            <el-radio label="male">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="staff.phone" :maxlength="11" placeholder="请输入11位手机号码"/>
        </el-form-item>
        <!-- <el-form-item label="密码：" prop="password">
          <el-input v-model="staff.password" :maxlength="18" placeholder="系统登陆密码"/>
        </el-form-item>  -->
        <el-form-item label="密码：" style="position: relative;" prop="password">
          <el-input :type="pwdType ? 'text' : 'password'" placeholder="6位以上字母数字混合密码" v-model="staff.password" ></el-input>
          <img :src="seen ? seenImg : unseenImg" @click="changeType()" class="img_eye"/>
        </el-form-item>
        <!-- 业绩提成 -->
        <div>
          <br><br>
          <span>-------------------------------------------------------------------------------------------------------------------------------------------------------------</span>
        </div>
        <span class="satff-add_top"><b>业绩提成</b></span>
        <el-form-item label="员工岗位：" prop="position">
          <el-checkbox-group v-model="staff.position">
            <el-checkbox :label="item.value" :key="item.value"  v-for="item in staffQuarters">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="销售业绩指标：" class="gt-input-tip" prop="indicator">
          <el-input v-model="staff.indicator" class="min-input" placeholder="0" >
            <span slot="prefix" ><span class="unit">元</span></span>
          </el-input>
        </el-form-item>
        <el-form-item label="销售业绩跑档：" class="gt-input-tip" prop="stage">
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
            width="100">
            <template slot-scope="scope">
              <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
              <el-input class="edit-input" v-model="scope.row.one"></el-input>
              <span slot="prefix" class="precent_sign">%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="two"
            label="第二档"
            width="100">
            <template slot-scope="scope">
              <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
              <el-input class="edit-input" v-model="scope.row.two"></el-input>
              <span slot="prefix" class="precent_sign">%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="three"
            label="第三档"
            width="100">
            <template slot-scope="scope">
              <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
              <el-input class="edit-input" v-model="scope.row.three"></el-input>
              <span slot="prefix" class="precent_sign">%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="four"
            label="第四档"
            width="100">
            <template slot-scope="scope">
              <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
              <el-input class="edit-input" v-model="scope.row.four"></el-input>
              <span slot="prefix" class="precent_sign">%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="five"
            label="第五档%"
            width="100">
            <template slot-scope="scope">
              <span class="greater_than_sign" v-if="scope.$index === 0">&gt;=</span>
              <el-input class="edit-input" v-model="scope.row.five"></el-input>
              <span slot="prefix" class="precent_sign">%</span>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
        <div>
          <span>-------------------------------------------------------------------------------------------------------------------------------------------------------------</span>
        </div>
        <!-- 数据权限 -->
        <span class="satff-add_top"><b>数据权限</b></span>
        <el-form-item label="员工角色：" prop="sysRoleId">
          <el-radio-group v-model="staff.sysRoleId">
            <el-radio
            :label="item.id"
            :key="item.id"
            v-for="item in staffRole">
            {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工状态">
            <el-switch v-model="staff.status"
            active-text="激活"
            :disabled="true"
            active-value="ENABLE"
            inactive-value="LEAVE">
            </el-switch>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
    <!-- <gt-dialog-checkbox ref="checkboxs" @list="listBox"/> -->
  </section>
</template>
<script>
import { status, couponType, staffType, staffQuarters } from '@/utils/dict'
import { mapState } from 'vuex'
import { limitInputName, validateDiscount as judgeDiscount, priceRange, password } from '@/utils/validate'
// import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import { getStoreList } from '@/service/systore'
import { createStaff,getStaffDetail,getRoleDetail } from '@/service/staffManagement'
import { number } from '@/utils/validate'
import moment from 'moment'
export default {
  data() {
    //验证手机号
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'))
      } else {
        if (value !== '') {
          var reg=/^1[1-9]\d{9}$/
          if(!reg.test(value)){
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }
    // const validatePassword =(rule,value,callback) =>{
    //   var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    //   if (value === ''){
    //     callback(new Error('密码不能位空'))
    //   }else if(value.length < 6 || value.length > 6 || !reg.test( value )){
    //     callback(new Error('密码长度需6位字母数字混合'))
    //   }else{
    //     callback()
    //   }
    // }
    return {
      editId: null,
      sysRoleId:[],
      imgArr: [],
      picFlag: true,
      staff:{
        name:'',//姓名
        phone:'',//手机号
        password:'',//密码
        sysRoleId:'',//角色
        sex: 'female', // 性别
        quarters:'',//岗位
        status:'ENABLE',//状态
        storeName:'',//所属门店
        stage:null,//阶档
        position: [],
        photo:null,
        commissionTableList: [{
          achievementDegree: '业绩完成度',
          one: '80',
          two: '100',
          three: '120',
          four:'150',
          five:'150'},{
          achievementDegree: '提成比例',
          one: '0',
          two: '0',
          three: '0',
          four:'0',
          five:'0'
        }]
      },
      //密码
      seen:'',
      unseenImg:'../static/img/eye/close.png',//看不见
      seenImg:'../static/img/eye/open.png',//看得见密码
      pwdType:false, //此时文本框隐藏，显示密码框
      goodsType: 1,
      storeList: [], // 门店列表
      goodsList: [], // 商品列表
      number,
      // couponType,
      staffType,
      staffRole:[],
      staffQuarters,
      dataFormRules: {
        name:[{ required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }],
        phone:[{required:true,message:'请输入手机号',trigger:'blur'},
          {validator: validatePhone, trigger: 'blur'},],
        password:[{required:true, validator: password, trigger: 'blur' }],
        sysRoleId:[{required:true, message: '至少选择一个角色', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.init(id)
    }
    // 获取所属门店
    if(this.isAuth('order:company:company:select')){
      this.getStoreList()
    }
    this.getRoleDetail()
  },
  methods: {
    // 启动激活
    // openActive (delFlag) {
    //   this.$easyConfirm.show({
    //     title: '提示',
    //     content: `确定${delFlag != 'ENABLE' ? '激活' : '离职'}`,
    //     confirm: async () => {
    //       if(delFlag == 'ENABLE'){
    //         this.staff.status = 'LEAVE'
    //         this.$easyConfirm.hide()
    //       }else{
    //         this.staff.status = 'ENABLE'
    //         this.$easyConfirm.hide()
    //       }
    //     }
    //   })
    // },
    //密码的显示隐藏
    changeType:function(){
      this.seen = !this.seen;//小眼睛的变化
      this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
    },

    async init(id) {
      const data = await getStaffDetail(id)
      this.staff = {
        position: [],
        ...data
      }
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.$message.error('获取门店列表失败')
      }
    },
     // 获取员工角色
    async getRoleDetail() {
      const { data } = await getRoleDetail()
      if (data.code === 0) {
        this.staffRole = data.data
      } else {
        this.$message.error('获取员工角色失败')
      }
    },
    goBack(){
      history.go(-1)
    },


    updatePicUrl:function(imgoBJ){
      this.staff[imgoBJ.str] = imgoBJ.value
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 添加员工
    async add() {
      console.log(this.staff)
      const degree = this.staff.commissionTableList[0]
      const ratio = this.staff.commissionTableList[1]
      let arr = [{
        degree: degree.one,
        ratio: ratio.one
      }, {
        degree: degree.two,
        ratio: ratio.two
      }, {
        degree: degree.three,
        ratio: ratio.three
      }, {
        degree: degree.four,
        ratio: ratio.four
      }, {
        degree: degree.five,
        ratio: ratio.five
      }]
      this.$refs['staff-form'].validate(async (valid) => {
        if (valid) {
          const res = await createStaff({
            ...this.staff,
            commissionTableList: arr,
            position: this.staff.position.join(',')
          })
          this.$router.push({name: 'staffManagement-staffList'})
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .page-staff-add{
    .el-checkbox+.el-checkbox {
      margin-left: 20px;
    }
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
  .hide {
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
      width: 53px;
    }
    top: 12px;
    padding: 0 !important;
  }
  .precent_sign{
    position: relative;
    left: 55px;
    top: -16px;
  }
  .img_eye{
    position: absolute;
    top: 10px;
    left: 175px;
  }
  .el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label{
    cursor: pointer!important;
  }
  .less_than_sign{
    position: absolute;
    top: 22px;
    left: 2px;
  }
  .greater_than_sign{
    position: absolute;
    top: 22px;
    left: -5px;
  }
}
</style>
