<template>
  <div class="mod-store customers">
      <!-- 查询条件 -->
      <el-form :model="customer" label-width="120px" :inline="true" ref='customer' class="mode-form-line1" @keyup.enter.native="resetForm('seach')">
        <el-form-item label="顾客姓名/手机号" prop='keyword'>
          <el-input v-model="customer.keyword" placeholder="顾客姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('store:customer:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>

        <div style="display:none;" class="button_check">
          <div>
            <el-form-item label="会员等级" prop="level">
              <el-radio-group v-model="customer.level" size="small">
                <el-radio-button v-for="item in memberList" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'level')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="生命周期" prop="lifeLevel">
              <el-radio-group v-model="customer.lifeLevel" size="small">
                <el-radio-button v-for="item in life" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'lifeLevel')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-show="customer.lifeLevel == 'HY'">
            <el-form-item label="消费频率等级" prop="costFrequencyLevelId" >
              <el-radio-group v-model="customer.costFrequencyLevelId" size="small">
                <el-radio-button v-for="item in details.timesLevels" :key="item.id" :label="item.id" @click.native.prevent="clickitem(item.id,'costFrequencyLevelId')">{{item.name}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-show="customer.lifeLevel == 'HY'">
            <el-form-item label="客单价等级" prop="costAmountLevelId">
              <el-radio-group v-model="customer.costAmountLevelId" size="small">
                <el-radio-button v-for="item in details.priceLevels" :key="item.id" :label="item.id" @click.native.prevent="clickitem(item.id,'costAmountLevelId')">{{item.name}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="顾客归属" prop="bind">
              <el-radio-group v-model="bind" size="small">
                <el-radio-button v-for="item in customerBind" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'bind')">{{item.label}}</el-radio-button>
              </el-radio-group>
              <span v-if="bind==='none'" style="display: inline-block;">
                <el-select v-model="customer.employeeId" placeholder="请输入员工关键词" remote filterable clearable>
                  <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="顾客生日" prop="birthdays">
              <el-radio-group v-model="customer.birthdays" size="small">
                <el-radio-button v-for="item in customerBirthday" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'birthdays')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="宝宝生日" prop="babyBirthday">
              <el-radio-group v-model="customer.babyBirthday" size="small">
                <el-radio-button v-for="item in customerBirthday" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'babyBirthday')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="宝宝年龄" prop="babyages">
              <el-radio-group v-model="babyages" size="small" @change="changeAgeDay">
                <el-radio-button v-for="item in babyAges" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'babyages')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="顾客回访" prop="visitdays">
              <el-radio-group v-model="customer.visitdays" size="small">
                <el-radio-button v-for="item in customerReturn" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'visitdays')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="多久未消费" prop="lastBuyDays">
              <el-radio-group v-model="lastBuyDays" size="small" @change="changeDay">
                <el-radio-button v-for="item in customerBuy" :key="item.value" :label="item.value" @click.native.prevent="clickitem(item.value,'lastBuyDays')">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="顾客标签" prop="tagSelect" class="tagselects">
              <span @click="searchBox(true)" v-if="tagSelect.length==0" class="addSearchTag">添加搜索标签</span>
              <span class="edits" v-for="(item,index) in tagSelect1" :key="item.id">
                <span class="selectBoxs theme-border theme-color theme-nextb">{{item.tag}}<b style="font-weight: 500;margin-left: 10px;">{{item.count}}</b></span>
                <b class="closeTag closeStyle" @click="closeTag(index)">X</b>
              </span>
              <icon-svg v-if="tagSelect&&tagSelect.length>0&&!tagFlag" @click.native.prevent="searchBox(true)" name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
              <div class="tagSearchBox" v-if="tagFlag"> 
                <el-input  ref="siteInput" auto-complete="off" v-model="tagName" placeholder="搜索标签" @keyup.enter.native.stop="getTagList('search')" clearable></el-input>
                <div v-if="tagList&&tagList.length>0">
                  <el-checkbox-group class="tagP" v-model="tagSelect">
                    <el-checkbox-button  @change="val=>getName(val,item)" v-show="index<=19" v-for="(item,index) in tagList" :key="item.id" :label="item.id">{{item.tag}}<b style="font-weight: 500;margin-left: 10px;">{{item.count}}</b></el-checkbox-button>
                  </el-checkbox-group>
                  <div style="text-align:center;font-size: 14px;color: #999999;">更多标签请搜索</div>
                </div>
                <div v-else style="text-align:center;font-size: 14px;color: #999999;">没有匹配到您搜索的标签</div>
                <b  v-if="tagFlag" class="closeTag1 closeStyle" @click="searchBox(false)">X</b>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
  </div>
</template>

<script>
import { customerLevel, customerBind,customerBirthday,customerReturn,customerBuy,life,babyAges } from '@/utils/dict'
import { filterStatus } from '@/utils'
import { getTagList } from '@/service/tags'
import { levelList,getLeveLCategory,employeeSelect } from '@/service/mycustomer'
export default {
  data () {
    return {
      filterStatus,
      customerLevel,
      customerBuy,
      customerBind,
      customerBirthday,
      customerReturn,
      babyAges,
      life,
      customer:{
        keyword:null,
        storeId: null,
        level: null,
        bind: null,
        birthdays: null,
        visitdays: null,
        tags: '',
        lastBuyMinDays: null,
        lastBuyMaxDays: null,
        costFrequencyLevelId: null,
        costAmountLevelId:null,
        lifeLevel:null,
        babyBirthday: null,
        babyAgeStart: null,
        babyAgeEnd: null,
        employeeId: null,
        // operator: 'AND'
      },
      bind: null,
      babyages: null,
      lastBuyDays: null,
      // checked: true,
      tagList:[],
      tagSelect:[],
      memberList:[],
      details:{},
      tagName: null,
      tagFlag: false,
      tagSelect1:[],
      employeeList:[]
    }
  },
  props:['tagF'],
  created () {
    this.tagFlag = this.tagF
    // 获取标签列表
    this.getTagList()
    // 获取等级
    this.getMemberList()
    this.getDetail()
    // 获取员工
    this.getEmployee()
  },
  watch:{
    tagName(val,old){
      this.getTagList('no',val)
    },
  },
  methods: {
    // 获取店员下拉
    async getEmployee(){
      const { data } = await employeeSelect({
        keyword: null,
        storeId: '',
        type: 'STORE'
      })
      if(data.code == 0){
        this.employeeList = data.data
      }else{
        this.employeeList = []
      }
    },
    // 通过id获取名字
    getName(val,item){
      if(JSON.stringify(this.tagSelect1).indexOf(item.id) == -1&&val){
        this.tagSelect1.push(item)
      }else{
        for(var i in this.tagSelect1){
          if(this.tagSelect1[i].id == item.id){
            this.tagSelect1.splice(i,1)
          }
        }
      }
    },
    // 获取顾客标签数据
    async getTagList(type) {
      this.dataListLoading = true
      const { data } = await getTagList({tag: this.tagName,
        size: 100000})
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.tagList = data.data || []
        if(type==='search'&&data.data.length>0){
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
    // 获取数据列表
    async getDetail() {
      this.dataListLoading = true
      const { data } = await getLeveLCategory()
      this.dataListLoading = false
      if (data && data.code === 0) {
        if (data.data) {
          this.details = data.data
        } else {
          this.$message.warning('获取默认设置失败')
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    // 获取等级列表
    async getMemberList() {
      const { data } = await levelList()
      if (data && data.code === 0) {
        let memberList = []
        data.data.map(o=>{
          memberList.push({
            label:o.vipName,
            value:o.vipId
          })
        })

        memberList.splice(0, 0, {
          label: '普通',
          value: 'GENERAL'
        })
        this.memberList = memberList
      } else {
        this.memberList = []
        this.$message.warning(data.msg)
      }

    },
    clickitem(val,name){
      if(name === 'lastBuyDays'){
        if(this.lastBuyDays==val){
          this.lastBuyDays = null
        }else{
          this.lastBuyDays=val
        }
        this.changeDay(this.lastBuyDays)
      }else if(name === 'babyages'){
        if(this.babyages==val){
          this.babyages = null
        }else{
          this.babyages=val
        }
        this.changeAgeDay(this.babyages)
      }else if(name==='bind'){
        if(this.bind==val){
          this.bind = null
        }else{
          this.bind=val
        }
      }else{
        if(this.customer[name]==val){
          this.customer[name] = null
        }else{
          this.customer[name]=val
        }
      }
    },
    // 宝宝年龄
    changeAgeDay(val){
      var babyAgeStart= null
      var babyAgeEnd= null
      if(val == 0){
        babyAgeStart= 0
        babyAgeEnd= 6
      }else if(val == 6){
        babyAgeStart= 6
        babyAgeEnd= 12
      }else if(val == 12){
        babyAgeStart= 12
        babyAgeEnd= 24
      }else if(val == 24){
        babyAgeStart= 24
        babyAgeEnd= 36
      }else if(val == 36){
        babyAgeStart= 36
        babyAgeEnd= null
      }else{
        babyAgeStart= null
        babyAgeEnd= null
      }
      this.customer.babyAgeStart = babyAgeStart
      this.customer.babyAgeEnd = babyAgeEnd
    },
    changeDay(val){
      var lastBuyMinDays= null
      var lastBuyMaxDays= null
      if(val == 15){
        lastBuyMinDays= 15
        lastBuyMaxDays= 30
      }else if(val == 30){
        lastBuyMinDays= 30
        lastBuyMaxDays= 60
      }else if(val == 60){
        lastBuyMinDays= 60
        lastBuyMaxDays= 90
      }else if(val == 90){
        lastBuyMinDays= 90
        lastBuyMaxDays= 180
      }else if(val == 181){
        lastBuyMinDays= 180
        lastBuyMaxDays= null
      }else{
        lastBuyMinDays= null
        lastBuyMaxDays= null
      }
      this.customer.lastBuyMinDays = lastBuyMinDays
      this.customer.lastBuyMaxDays = lastBuyMaxDays
    },
    resetForm(type){
      // this.customer.operator = this.checked?'AND':'OR'
      this.customer.tags = this.tagSelect.join(',') 
      if(this.customer.lifeLevel != 'HY'){
        this.customer.costFrequencyLevelId = null
        this.customer.costAmountLevelId = null
      }
      if(this.bind == 'none'){
        this.customer.bind = null
      }else{
        this.customer.employeeId = null
        this.customer.bind = this.bind
      }
      if (type === 'reset') {
        this.$refs['customer'].resetFields()
        this.bind = null
        this.customer.bind = null
        this.customer.employeeId = null
        this.tagSelect=[]
        this.tagSelect1 = []
        this.lastBuyDays = null
        this.customer.lastBuyMinDays = null
        this.customer.lastBuyMaxDays = null
        this.customer.tags=''
        this.babyages = null
        this.customer.babyAgeStart = null
        this.customer.babyAgeEnd = null
      }
      var obj = {
        'type': type,
        'customer': this.customer
      }
      this.$emit('refreshSearch',obj)
    }
  }
}
</script>
<style lang="scss">
.button_check {
  .el-checkbox-button {
    margin-right: 10px;
  }
  .el-checkbox-button__inner {
    border: 1px solid #dcdfe6;
    border-radius: 5px!important;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-radius: 5px 5px 0 5px!important;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner:after {
    content: "";
    // background: url('/static/img/mycustomer/select_box.png') no-repeat 100% 100%;
    background-size: 18px 18px;
    height: 18px;
    width: 18px;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  // radius
  .el-radio-button {
    margin-right: 10px;
  }
  .el-radio-button__inner {
    border: 1px solid #dcdfe6;
    border-radius: 5px!important;
  }
  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled){
    -webkit-box-shadow: none!important;
    box-shadow: none!important;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .el-radio-button.is-active:after {
    content: "";
    // background: url('/static/img/mycustomer/select_box.png') no-repeat 100% 100%;
    background-size: 18px 18px;
    height: 18px;
    width: 18px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.main-info-selects1 {
  cursor: pointer;
  width: 58px;
  height: 20px;
  margin: auto
}
.tagselects {
  width: 100%;
  .el-checkbox-button {
    margin-bottom: 5px;
  }
  .el-form-item__label{
    float: left;
  }
  .el-form-item__content{
    float: left;
    width: calc(100% - 130px);
  }
  .tagSearchBox {
    position: relative;
    margin-top: 7px;
    width: 50%;
    padding: 2px 0;
    border: 1px solid #CCC;
    border-radius: 5px;
    input {
      width: 100%!important;
      border: none;
      border-bottom: 1px solid #ccc;
      border-radius: 0;
    }
  }
  
  .tagP {
    padding: 8px 10px;
  }
  .selectBoxs {
    padding: 8px 10px;
    font-size: 12px;
    color: #606266;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
  }
  .closeTag {
    position: relative;
    top: -16px;
    right: 15px;
  }
  .closeStyle {
    background: #e4e2e2;
    width: 18px;
    height: 18px;
    display: inline-block;
    text-align: center;
    line-height: 18px;
    border-radius: 100%;
    font-size: 12px;
    font-weight: 500;
    color: #a7a7a7;
    cursor: pointer;
  }

  .closeTag1 {
    position: absolute;
    top: -10px;
    left: 98.5%;
  }
  .addSearchTag {
    font-size: 12px;
    cursor: pointer;
  }
}

.iconSvg1 {
  font-size: 60px
}

</style>

