<template>
  <section class="page-staff-add-or-edit">
    <el-card>
      <gt-subtitle title="基本信息" style="display: block;"/>
      <el-form ref="staff-form" :rules="dataFormRules" label-width="150px" :model="staff" :validate-on-rule-change="false">
        <el-form-item class="staff-header" prop="photo">
          <gt-image-upload :comp="12" :realistStr="'staffHeader'"  :names="0" :max="1" tip="照片大小不超过5M" :reallist="staff.photo" :cb="value => staff.photo = value"/>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-switch v-model="staff.status"
          active-text="正常"
          :disabled="true"
          active-value="ENABLE"
          inactive-value="LEAVE">
          </el-switch>
          <!-- <span style="color: #c0c4cc;font-size:8px;margin-left:10px;">员工停用，将清空归属于员工名下的顾客</span> -->
        </el-form-item>
        <el-form-item label="员工类型：" prop="type">
          <el-radio-group v-model="staff.type" :disabled="this.id ? true : false">
            <el-radio :label="item.value" :key="item.value"  v-for="item in staffType">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工姓名：" prop="name">
          <el-input v-model="staff.name" :maxlength="8" placeholder="最多支持8个汉字"/>
        </el-form-item>
        <el-form-item label="员工性别：" prop="gender">
          <el-radio-group v-model="staff.gender">
            <el-radio label="FEMALE">女</el-radio>
            <el-radio label="MALE">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-if="!this.id" v-model="staff.phone" :maxlength="11" placeholder="请输入11位手机号码"/>
          <span v-else class="itemInput">{{staff.phone}}</span>
        </el-form-item>
        <el-form-item label="密码：" style="position: relative;" prop="password" v-if="!this.id">
          <el-input :type="pwdType ? 'text' : 'password'" placeholder="6位以上字母数字混合密码" v-model="staff.password"></el-input>
          <img :src="seen ? seenImg : unseenImg" @click="changeType()" class="img_eye"/>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId' v-if="staff.type=='STORE'">
          <el-select v-model="staff.storeId" filterable placeholder="请选择门店" clearable>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工角色：" prop="sysRoleId" v-if="staff.type=='COMPANY'">
          <el-radio-group v-model="staff.sysRoleId">
            <el-radio
            :label="item.id"
            :key="item.id"
            v-for="item in staffRole">
            {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工角色：" prop="sysRoleId" v-if="staff.type=='STORE'">
          <el-radio-group v-model="staff.sysRoleId">
            <el-radio
            :label="item.id"
            :key="item.id"
            v-for="item in staffStoreRole">
            {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="dashed" v-show="staff.type=='STORE'"></div>
        <!-- 指标设置 -->
        <gt-subtitle title="指标设置" v-show="staff.type=='STORE'" style="display: block;"/>
        <el-form-item label="销售业绩指标：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="indicator">
          <el-input v-model="staff.indicator" :maxlength="10" class="min-input">
            <span slot="prefix" ><span class="unit">元</span> <sapn style="color:#FF7E52">（销售业绩指标修改后，次月1号零点生效）</sapn></span>
            
          </el-input>
        </el-form-item>
        <el-form-item label="销售业绩跑档：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="stage">
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
                <el-input class="edit-input" v-model="scope.row.one" :maxlength="3"></el-input>
                <span slot="prefix" class="precent_sign">%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="two"
              label="第二档"
              width="100">
              <template slot-scope="scope">
                <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
                <el-input class="edit-input" v-model="scope.row.two" :maxlength="3"></el-input>
                <span slot="prefix" class="precent_sign">%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="three"
              label="第三档"
              width="100">
              <template slot-scope="scope">
                <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
                <el-input class="edit-input" v-model="scope.row.three" :maxlength="3"></el-input>
                <span slot="prefix" class="precent_sign">%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="four"
              label="第四档"
              width="100">
              <template slot-scope="scope">
                <span class="less_than_sign" v-if="scope.$index === 0">&lt;</span>
                <el-input class="edit-input" v-model="scope.row.four" :maxlength="3"></el-input>
                <span slot="prefix" class="precent_sign">%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="five"
              label="第五档"
              width="100">
              <template slot-scope="scope">
                <span class="greater_than_sign" v-if="scope.$index === 0">&gt;=</span>
                <el-input class="edit-input" v-model="scope.row.five" :maxlength="3"></el-input>
                <span slot="prefix" class="precent_sign">%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="新客开发指标：" v-show="staff.type=='STORE'" class="gt-input-tip" prop="newCustomerIndicator">
          <el-input v-model="staff.newCustomerIndicator" :maxlength="10" class="min-input">
            <span slot="prefix" >
              <span class="unit">位/月</span>
              <!-- <i class="theme-color" @click="newCustomer">新客定义>></i> -->
            </span>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { status, couponType, staffType, staffQuarters } from '@/utils/dict'
import { mapState } from 'vuex'
import { limitInputName, validateDiscount as judgeDiscount, priceRange, password } from '@/utils/validate'
import { getStoreList } from '@/service/systore'
import { createStaff,updateStaff,getStaffDetail,getRoleDetail,getStoreRoleDetail } from '@/service/staffManagement'
import { number } from '@/utils/validate'
import gtImageUpload from '@/components/gt-image-upload'
import moment from 'moment'
export default {
  name: 'staff-add-or-edit',
  components: {
    gtSubtitle,
    gtImageUpload
  },
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
    //新客开发指标
    const validateIndicator = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value || value == 0) {
        if (!reg.test(value)) {
          callback(new Error('请输入0-99999的正整数！'))
        } else if (value < 0 || value > 99999){
          callback(new Error('请输入0-99999的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      id: null,
      editId: null,
      sysRoleId:[],
      imgArr: [],
      picFlag: true,
      staff:{
        indicator:'0',
        numberOfDigits:'0',
        newCustomerIndicator:'0',
        type:'COMPANY',//类型
        name:'',//姓名
        phone:'',//手机号
        password:'',//密码
        sysRoleId:'',//角色
        quarters:'',//岗位
        status:'ENABLE',//状态
        gender: 'FEMALE', // 性别
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
      staffType,
      staffRole:[],
      staffStoreRole:[],
      staffQuarters,
      dataFormRules: {
        type:[{required: true, message: '请选择员工类型'}],
        gender:[{ required: true, message:'请选择员工性别' }],
        name:[{ required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }],
        phone:[{required:true,message:'请输入手机号',trigger:'blur'},
          {validator: validatePhone, trigger: 'blur'},],
        password:[{required:true, validator: password, trigger: 'blur' }],
        sysRoleId:[{required:true, message: '至少选择一个角色', trigger: 'blur' }],
        storeId:[{required:true, message: '请选择门店', trigger: 'blur' }],
        indicator:[{ pattern:/^\d{1,10}$/, message: '请输入10位以内的正整数', trigger: 'blur'}],
        numberOfDigits:[{ pattern:/^\d{1,10}$/, message: '请输入10位以内的正整数', trigger: 'blur' }],
        newCustomerIndicator:[{ validator: validateIndicator, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  async created() {
    const { id = '' } = this.$route.query
    if (id) {
      this.getDetails(id)
      this.id = id
    }
    // 获取所属门店
    if(this.isAuth('order:company:company:select')){
      this.getStoreList()
    }
    this.getRoleDetail()
    this.getStoreRoleDetail()
  },
  methods: {
    // newCustomer(){
    //   this.$router.push({name:'settings-staff-commission',params:{isStaff:'newEmployee'}})
    // },
    //密码的显示隐藏
    changeType:function(){
      this.seen = !this.seen//小眼睛的变化
      this.pwdType = !this.pwdType//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
    },
    // async init(id) {
    //   const data = await getStaffDetail(id)
    //   this.staff = {
    //     position: [],
    //     ...data,
    //     newCustomerIndicator:data.newCustomerIndicator || 0,
    //   }
    // },
    //获取编辑数据
    async getDetails(id) {
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
        indicator: this.priceNum(data.indicator),
        position: data.position ? data.position.split(',') : [],
        commissionTableList
      }
    },
    // 获取企业员工角色
    async getRoleDetail() {
      const { data } = await getRoleDetail()
      if (data.code === 0) {
        this.staffRole = data.data
      } else {
        this.$message.error('获取员工角色失败')
      }
    },
    // 获取门店员工角色
    async getStoreRoleDetail() {
      const { data } = await getStoreRoleDetail()
      if (data.code === 0) {
        this.staffStoreRole = data.data
      } else {
        this.$message.error('获取员工角色失败')
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
    //取消
    goBack(){
      history.go(-1)
    },
    check() {
      let reg = /^\d+$/
      let flag = true
      for (let i = 0; i < 2; i++) {
        if (!reg.test(this.staff.commissionTableList[i].one) || !reg.test(this.staff.commissionTableList[i].two)
        || !reg.test(this.staff.commissionTableList[i].three) || !reg.test(this.staff.commissionTableList[i].four)
        || !reg.test(this.staff.commissionTableList[i].five)) {
          flag = false
        }
      }
      if (!flag) {
        this.$message.warning('销售业绩跑档有误,请输入大于等于0的正整数！')
      }
      return flag
    },
    // 确定
    async add() {
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
        if (valid && this.check()) {
          const res = !this.id ? await createStaff({
            ...this.staff,
            indicator:this.priceNum(this.staff.indicator,'out'),
            commissionTableList: arr,
            position: this.staff.position.join(',')
          }) : await updateStaff({
            ...this.staff,
            indicator:this.priceNum(this.staff.indicator,'out'),
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
  .page-staff-add-or-edit{
    position: relative;
    .staff-header{
      position: absolute;
      top: 30px;
      right: 30px;
      .el-upload__tip{
        text-align: center;
      }
    }
    .el-checkbox+.el-checkbox {
      margin-left: 20px;
    }
    .dashed{
      width: 100%;
      border: 1px dashed #8a979e;
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
      top: 12px;
      left: 175px;
    }
    .less_than_sign{
      position: absolute;
      top: 22px;
      left: 2px;
    }
    .greater_than_sign {
      position: absolute;
      top: 22px;
      left: -5px;
    }
    .el-switch.is-disabled .el-switch__core, .el-switch.is-disabled .el-switch__label{
      cursor: pointer!important;
    }
  }
</style>
