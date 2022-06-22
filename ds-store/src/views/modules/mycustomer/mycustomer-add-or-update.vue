<template>
  <section class="addLabel"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="customeradd" ref="customeradd" :rules="customeraddaddRules" label-width="100px">

      <gt-subtitle title="基本信息"/>
      <el-card style="margin-bottom: 10px;">
        <div>
          <el-form-item label="手机号" v-if="customerid">
            <el-input v-model="customeradd.phone" placeholder="请输入手机号" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" v-else>
            <el-input v-model="customeradd.phone" placeholder="请输入手机号" maxlength='11'></el-input>
          </el-form-item>
          <el-form-item label="顾客姓名" prop="name">
            <el-input v-model="customeradd.name" placeholder="请输入姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="customeradd.gender">
              <el-radio v-for="item in sex" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="顾客生日" class="customerBirthday" prop="birthday">
            <el-date-picker type='date' :editable='false' value-format='yyyy-MM-dd'  v-model="customeradd.birthday" placeholder="请选择出生日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="归属员工" prop="employeeId" v-if="storeRoleName == '店长'">
            <el-select v-model="customeradd.employeeId" placeholder="请选择归属员工" >
              <el-option
                v-show="!item.flag"
                v-for="item in clerkList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐顾客" prop="referrerInfo">
            <el-select v-model="referrerInfo" placeholder="请选择推荐顾客" @change="reffer" filterable clearable>
              <el-option v-for="item in customerList" v-show="customerid?item.phone!=phone:item.phone" :key="item.id" :label="(item.name||'--')+'/'+item.phone" :value="(item.name||'--')+'/'+item.phone+'/'+item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="积分" prop="integral" v-if="!customerid">
            <el-input v-model.number="customeradd.integral" placeholder="请输入积分值" maxlength="10" style="display: inline;"></el-input>
            <span>(只能填写整数)</span>
          </el-form-item>
          <el-form-item label="储值卡" prop="cardAmount" v-if="!customerid">
            <el-input v-model="customeradd.cardAmount" placeholder="请输入储值卡" maxlength="10" style="display: inline;"></el-input>
            <span>(最多保留两位小数)</span>
          </el-form-item>
          <el-form-item label="备注" prop='remark'>
            <el-input type="textarea" v-model="customeradd.remark"></el-input>
          </el-form-item>
        </div>
      </el-card>

      <!-- 宝宝信息 -->
      <gt-subtitle title="宝宝信息"/>
      <el-card class="elCard">
        <div v-for="(babyItem, index) in customeradd.babyList" :key="index" class="inlines" v-show="customeradd.babyList&&customeradd.babyList.length >=1">
          <el-col :span="22">
            <el-form-item label="宝宝姓名" :prop="'babyList.'+index+'.name'" :rules="babyaddRules.morebabyName">
              <el-input v-model="babyItem.name" placeholder="请输入姓名"  ></el-input>
            </el-form-item>
            <el-form-item label="性别" :prop="'babyList.'+index+'.gender'">
              <el-radio-group v-model="babyItem.gender" >
                <el-radio v-for="item in babysex" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日/预产期" :prop="'babyList.'+index+'.birthday'"  :rules="babyaddRules.morebabyBirthday">
              <el-date-picker type='date' :editable='false' value-format='yyyy-MM-dd' v-model="babyItem.birthday" placeholder="请选择出生日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item  label="喂养方式" :prop="'babyList.'+index+'.feedType'" >
              <el-select v-model="babyItem.feedType" placeholder="请选择喂养方式">
                <el-option label="请选择喂养方式" value="NONE"></el-option>
                <el-option
                  v-for="item in babyFeedMode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <span class="closeBaby" @click="delBaby(index)">
              <icon-svg name="20" class="theme-color middle middle1"></icon-svg>
            </span>
          </el-col>
        </div>

        <div class="gt-form-bottom-submit" v-if='customeradd.babyList&&customeradd.babyList.length >= 0&&customeradd.babyList.length <= 2'>
          <el-button class="addBaby theme-nextb theme-nexborder theme-color" @click="babyadds">
            <span><icon-svg name="create" class="theme-color middle"></icon-svg></span>
            <span class="theme-color">再增加一个宝宝</span>
          </el-button>
        </div>
      </el-card>

      <gt-subtitle title="收货地址" style="display:block"/>
      <el-card class="elCard">
        <div v-for="(item,index) in customeradd.addressList" :key="index" v-show="customeradd.addressList&&customeradd.addressList.length >=1">
          <el-col :span="22">
            <el-form-item label="收货地址" style="margin-bottom: 5px;">
              <gt-select-location ref="addressLocation" :provinceId="item.provinceId" :cityId="item.cityId" :districtId="item.districtId" />
            </el-form-item>
            <el-form-item :prop="'addressList.'+index+'.address'"  style="padding-top: 15px">
              <el-input style="width: 210px;" class="locations" v-model="item.address" placeholder="请输入收货地址"></el-input>
              <el-input style="width: 210px;" v-model="item.name" placeholder="请输入收货人"></el-input>
              <el-input style="width: 210px;" v-model="item.phone" placeholder="请输入联系电话" maxlength='11'></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="2">
            <span class="closeBaby" @click="addAddress('del',index)">
              <icon-svg name="20" class="theme-color middle middle1"></icon-svg>
            </span>
          </el-col>
        </div>

        <div class="gt-form-bottom-submit" style="margin-top: 0!important;" v-if='customeradd.addressList&&customeradd.addressList.length >= 0&&customeradd.addressList.length <= 1'>
          <el-button class="addBaby theme-nextb theme-nexborder theme-color" @click="addAddress('add')">
            <span><icon-svg name="create" class="theme-color middle"></icon-svg></span>
            <span class="theme-color">添加一个地址</span>
          </el-button>
        </div>
      </el-card>

      <gt-subtitle title="顾客标签" style="display:block"/>
      <el-card class="elCard button_check">
        <el-form-item label="" prop="tagSelect" class="tagselects">
          <span class="edits" v-for="item in customeradd.tagList" :key="item.id">
            <span class="selectBoxs theme-border theme-color theme-nextb" style="margin-right: 10px;">{{item.tag}}</span>
          </span>
        </el-form-item>
        <el-form-item label="" prop="tagSelect" class="tagselects">
          <span @click="searchBox(true)" v-if="tagSelect.length==0" class="addSearchTag"><span><icon-svg name="create" style="font-size: 18px;margin-right: 5px;" class="theme-color middle"></icon-svg></span>添加标签</span>
          <span class="edits" v-for="(item,index) in tagSelect1" :key="item.id">
            <span class="selectBoxs theme-border theme-color theme-nextb">{{item.tag}}</span>
            <b class="closeTag closeStyle" @click="closeTag(index)">X</b>
          </span>
          <icon-svg v-if="tagSelect&&tagSelect.length>0&&!tagFlag" @click.native.prevent="searchBox(true)" name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
          <div class="tagSearchBox" v-if="tagFlag">
            <el-input  ref="siteInput" auto-complete="off" v-model="tagName" placeholder="搜索标签" @keyup.enter.native.stop="getTagList('search')" clearable></el-input>
            <div v-if="tagList&&tagList.length>0">
              <el-checkbox-group class="tagP" v-model="tagSelect">
                <el-checkbox-button @change="val=>getName(val,item)" v-show="index<=19" v-for="(item,index) in tagList" :key="item.id" :label="item.id">{{item.tag}}</el-checkbox-button>
              </el-checkbox-group>
              <div class="emptyTag">更多标签请搜索</div>
            </div>
            <div v-else-if="(!tagList||tagList.length==0)&&tagFlag" class="emptyTag theme-color cuspoiner" @click="addcustomerBq()">+没有查询到标签，去新增</div>
            <div v-else-if="tagSelect1.length==0" class="emptyTag">输入搜索更多标签</div>

            <b  v-if="tagFlag" class="closeTag1 closeStyle" @click="searchBox(false)">X</b>
          </div>
        </el-form-item>

      </el-card>

    </el-form>
    <div class="gt-form-bottom-submit" style="margin-top: 0!important;">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="submitCustomer" :loading="$store.state.loading.global" txt="保存"/>
    </div>
    <!-- 顾客标签 -->
    <add-label title="新增顾客标签" v-if="addCustomerVisible" ref="addCustomer" @refreshDataList='getcustomerBq'/>
  </section>
</template>
<script>
import { sex, babyFeedMode, babysex, customerLevel} from '@/utils/dict'
import { locations } from '@/utils'
import {isMobile, isphone, validatenull, limitInputName, priceRange } from '@/utils/validate'
import gtSubtitle from '@/components/gt-sub-title'
import addLabel from './mycustomer-addLabel'
import gtSelectLocation from '@/components/gt-select-location'
import { getCustomerDetail, getCustomerUpdate,employeeSelect,getCustomerList} from '@/service/mycustomer'
import {getTagList,getTagadd} from '@/service/tags'
export default {
  name:'mycustomer-add-or-update',
  components:{ gtSubtitle, addLabel, gtSelectLocation },
  data(){
    const limit = (rule, value, callback) => {
      var CS = /^([\u4e00-\u9fa5]{1,30}|[a-zA-Z\\.\\s]{1,10})$/
      if (!validatenull(value)&&!CS.test(value)) {
        return callback(new Error('至多为10个字符且不能含有特殊字符'))
      }else{
        return callback()
      }
    }

    const integral = (rule, value, callback) => {
      var CS = /^[0-9]+$/
      if (!validatenull(value)&&!CS.test(value)) {
        callback(new Error('只能输入正整数'))
      }else{
        callback()
      }
    }

    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,200) == 1) {
        callback(new Error('备注不能超过100个汉字'))
      } else{
        callback()
      }
    }

    const validateCard = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99)) {
          callback(new Error('请输入0.01-499999.99的数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      referrerInfo:null,
      addCustomerVisible: false,
      val:null,
      loading: false,
      sex,
      customerLevel,
      babysex,
      babyFeedMode,
      clerkList:[],//店员列表
      customerid:null,
      customeradd: {
        id: 0,
        name: null,
        phone: null,
        gender: 'FEMALE',
        birthday: null,
        babyList:[],
        label: null,
        employeeId: '',
        referrer: null,
        referrerId: null,
        recommenderStoreUser: -1,
        storeName: null,
        cardNo: null,
        level: 'GENERAL',
        levelName: '普通',
        integral: null,
        cardAmount: null,
        remark: null,
        password: null,
        addressList:[],
        addTags:[],
        subTags:[]
      },
      customerList:[],

      tagName: null,
      tagList:[],//被选中的id
      tagSelect:[],//被选中的id
      tagSelect1: [],//标签名数组
      tagFlag: false,

      storeRoleName: null,
      customeraddaddRules:{
        gender:[{required: true,message:'请选择性别', trigger: 'change'}],
        phone:[{required: true,message:'请输入手机号', trigger: 'change'},
          {validator: isphone, trigger: 'change'}],
        integral:[{validator: integral, trigger: 'blur' }],
        cardAmount:[{validator: validateCard, trigger: 'blur' }],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      },
      babyaddRules:{
        morebabyName: [{ required: true, message: '请输入宝宝姓名', trigger: 'blur' },
          {validator: limit, trigger: 'change'}],
        morebabyBirthday: [{ required: true, message: '请选择宝宝生日', trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.$nextTick(function () {
      const { storeRoleName = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
      this.storeRoleName = storeRoleName
      this.customerid = this.$route.query.id || ''
      this.phone = this.$route.query.phone || ''
      this.customeradd.id = this.$route.query.id || ''
      this.getClerkList()
      this.getcustomerDetails(this.customeradd.id)
      // 获取所有顾客标签
      this.getTagList()
      this.getCustomerList()
    })
  },
  watch:{
    tagName(val,old){
      this.getTagList('no',val)
    },
  },
  methods:{
    // 获取顾客标签数据
    async getTagList(type) {
      this.dataListLoading = true
      const { data } = await getTagList({
        tag: this.tagName,
        size: 100000
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.tagList = data.data || []
        if(type==='search'&&this.tagList.length>0){
          if(JSON.stringify(this.tagSelect).indexOf(data.data[0].id) == -1){
            this.tagSelect.push(data.data[0].id)
            this.tagSelect1.push(data.data[0])
          }
        }
      } else {
        this.tagList = []
        this.$message.warning(data.msg)
      }

    },
    // 通过id获取名字
    getName(val,item){
      if(JSON.stringify(this.tagSelect1).indexOf('"'+item.tag+'"') == -1&&val){
        this.tagSelect1.push(item)
      }else{
        for(var i in this.tagSelect1){
          if(this.tagSelect1[i].tag == item.tag){
            this.tagSelect1.splice(i,1)
          }
        }
      }
    },
    // 查询
    searchBox(flag){
      this.tagFlag = flag
      if(flag){
        this.$nextTick(function(){
          this.$refs['siteInput'].focus()
        })
      }
    },
    // 删除tag
    closeTag(idx){
      this.tagSelect1.splice(idx,1)
      this.tagSelect.splice(idx,1)
    },

    //点击添加顾客标签
    addcustomerBq(){
      this.addCustomerVisible = true
      this.$nextTick(() => {
        this.$refs.addCustomer.init(this.tagSelect1,this.tagName)
      })
    },
    // 添加完顾客之后返回数据
    getcustomerBq(obj){
      this.tagName = null
      this.tagSelect1.push(obj)
      this.tagSelect.push(obj.id)
    },

    reffer(val){
      var temp = val.split('/')
      this.customeradd.referrer = temp[0]+'/'+temp[1]
      this.customeradd.referrerId = temp[2]
    },
    // 获取数据列表
    async getCustomerList(query,refferId) {
      const { data } = await getCustomerList({
        size: 100000,
        page: 0,
        keyword: query
      })
      if (data && data.code === 0) {
        this.customerList = data.data.records
        if(refferId){
          for(var i in data.data.records){
            var item = data.data.records[i]
            if(item.id == refferId){
              this.referrerInfo = item.name+'/'+item.phone+'/'+refferId
              break
            }
          }
        }
      } else {
        this.customerList = []
        this.$message.warning(data.msg)
      }

    },

    // 顾客详情
    async getcustomerDetails(customerId){
      if (customerId) {
        const data = await getCustomerDetail(customerId)
        this.customeradd = {
          ...data,
          babyList: data.babyList || [],
          addressList: data.addressList || []
        }
        if(JSON.stringify(this.clerkList).indexOf(this.customeradd.employeeId) == -1){
          this.clerkList.splice(0, 0, {
            name: this.customeradd.employee,
            id: this.customeradd.employeeId,
            flag: true
          })
        }
        this.getCustomerList('',this.customeradd.referrerId)
      }
    },
    // 获取店员列表
    async getClerkList(){
      const {data} = await employeeSelect({
        keyword: ''
      })
      if(data.code == 0){
        this.clerkList = data.data
      }else{
        this.clerkList = []
      }
    },
    // 校验宝宝信息是否进行填写
    isCheckBabayInfo(){
      var baby = this.customeradd.babyList
      for(var i in baby) {
        if(validatenull(baby[i].name)){
          this.$message.warning('请输入宝宝姓名')
          return false
        }
        if(validatenull(baby[i].birthday)){
          this.$message.warning('请选择宝宝生日')
          return false
        }
      }
      return true
    },

    // 添加宝宝
    babyadds(){
      // 单个宝宝对象
      this.baby = {
        id: null,
        name: null,
        gender: 'BOY',
        birthday: null,
        feedType: 'NONE'
      }

      if(this.isCheckBabayInfo()){//校验信息完成
        var array = this.customeradd.babyList
        var isRepeat = 0
        for(var i in array){
          if(array.length >1){
            var n = parseInt(i)+1==array.length?parseInt(i)-1:parseInt(i)+1
            if(array[i].name == array[n].name){
              isRepeat = 1
              this.$message.warning('不能输入相同的宝宝姓名')
              return
            }
          }else{
            isRepeat = 0
          }
        }
        if(isRepeat != 1){
          this.customeradd.babyList.push(this.baby)
        }

      }
    },
    // 删除宝宝
    delBaby(index){
      var baby = this.customeradd.babyList
      baby.splice(index,1)
    },

    // 保存时去重
    isRepeats(array1){
      var listName = []
      for(var i in array1){
        listName.push(array1[i].name)
      }
      var setName = new Set(listName)
      if(setName.size != array1.length){
        this.$message.warning('不能输入相同的宝宝姓名')
        return
      }
    },
    // 添加地址
    addAddress(type,idx){
      if(type=='add'){
        this.customeradd.addressList.push({
          id: null,
          provinceId:'',
          cityId:'',
          districtId:'',
          address: '',
          fullAddress: null,
          name:'',
          phone:'',
        })
      }else{
        var addressList = this.customeradd.addressList
        addressList.splice(idx,1)
      }
    },
    // 获取地址信息
    getAddress(){
      var addressList = this.customeradd.addressList
      var flag = true
      for(var i in addressList){
        var item = addressList[i]
        var local = locations((this.$refs['addressLocation'])[i])
        item.provinceId = local.provinceId
        item.cityId = local.cityId
        item.districtId = local.districtId
        item.fullAddress = `${local.province || ''}${local.city || ''}${local.district || ''}${item.address || ''}`
        if(!validatenull(item.phone)&&!isMobile(item.phone)){
          flag = false
          break
        }
      }
      return flag
    },
    submitCustomer(){
      if(!this.getAddress()){
        this.$message.warning('收货地址中的联系电话格式错误')
        return
      }

      this.isRepeats(this.customeradd.babyList||[])
      this.$refs['customeradd'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.addTags()
        }else{
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    },

    //添加标签
    async addTags(){
      let tag = this.tagSelect1.filter(item=>item.id==-1)
      let array = []
      tag.forEach(o=>{
        array.push(o.tag)
      })
      if(array&&array.length>0){
        const { data } = await getTagadd({
          'tag': array.join(','),
          'type': 'NATURE'
        })
        if(data.code == 0&&data.data){
          for (var i in data.data){
            var item = data.data[i]
            this.tagSelect.push(item.id)
          }
          this.addOrupdate()
        }else{
          this.addOrupdate()
        }
      }else{
        this.addOrupdate()
      }
    },
    async addOrupdate(){
      var addressList = []
      this.customeradd.addressList.map(o=>{
        if(o.fullAddress) {
          addressList.push(o)
        }
      })

      var param = {
        ...this.customeradd,
        addTags: this.tagSelect.filter(item=>item!=-1),
        addressList: addressList,
        id: this.customerid,
        cardAmount: this.priceNum(this.customeradd.cardAmount,'out') || 0,
      }
      const { data } = await getCustomerUpdate(param)
      this.loading = false
      if(data.code == 0){
        this.$router.push({name:'mycustomer-mycustomer'})
      }else{
        this.$message.error(data.msg)
      }
    }

  }
}
</script>
<style lang='scss'>
@import '~@/assets/scss/mycustomer/index.scss';
.elCard {
  margin-bottom: 10px;
  padding-bottom: 10px!important;
  .el-card__body{
    padding-top: 10px!important
  }
}
.customerBirthday {
  .el-input__icon{
    margin-right: 42px;
  }
}
.middle {
  font-size: 22px;vertical-align: middle;
}
.middle1 {
  font-size: 30px!important;
}
.addNotice{
  margin-left: 10px;
}
.classP {
  float:left;cursor: pointer;
}

</style>
