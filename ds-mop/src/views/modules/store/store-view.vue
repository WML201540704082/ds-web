<template>
  <section v-loading="$store.state.loading.global">
    <el-card>
      <el-form :model="dataForm" ref="dataForm" label-width="120px" class="viewForm" >
        <el-form-item label="门店编号">
          <span class="itemInput">{{dataForm.code}}</span>
        </el-form-item>
        <el-form-item label="门店名称">
          <span class="itemInput">{{dataForm.name}}</span>
        </el-form-item>
        <el-form-item label="云店名称">
          <span class="itemInput">{{dataForm.weshopName}}</span>
        </el-form-item>
        <el-form-item label="门店营业执照名称">
          <span class="itemInput">{{dataForm.storeNameAcc}}</span>
        </el-form-item>
        <el-form-item label="所属企业">
          <span class="itemInput">{{companyName}}</span>
        </el-form-item>
        <el-form-item label="商户号">
          <span class="itemInput">{{dataForm.fuiouMerchantNo || '--'}}</span>
        </el-form-item>
        <!-- <el-form-item label="门店类型">
          <el-radio-group v-model="dataForm.storeCategory" :disabled="true">
            <el-radio v-for="item in storeB" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="联系人">
          <span class="itemInput">{{dataForm.linkman}}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span class="itemInput">{{dataForm.phone}}</span>
        </el-form-item>
        <el-form-item label="小店联系电话">
          <span class="itemInput">{{dataForm.storeLinkPhone}}</span>
        </el-form-item>
        <el-form-item label="加盟品牌">
          <span class="itemInput">{{dataForm.leagueBrand}}</span>
        </el-form-item>
        <el-form-item label="加盟授权编码">
          <span class="itemInput">{{dataForm.leagueAuthorizationCode}}</span>
        </el-form-item>
        <el-form-item label="营业时间">
          <span class="itemInput">上午&nbsp;&nbsp;{{`${dataForm.forenoonOpenHours || ''} - ${dataForm.forenoonCloseHours || ''}`}}</span>
          <span class="itemInput" style="display:block">下午&nbsp;&nbsp;{{`${dataForm.afternoonOpenHours || ''} - ${dataForm.afternoonCloseHours || ''}`}}</span>
        </el-form-item>
        <el-form-item label="门店位置">
          <span class="itemInput">{{`${dataForm.province || ''}${dataForm.city || ''}${dataForm.district || ''}${dataForm.address || ''}` || '--'}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="POS1-SN码">
              <span class="itemInput">{{dataForm.fuiouPos1SnNo || '--'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端号1">
              <span class="itemInput">{{dataForm.fuiouPos1TermNo || '--'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="POS2-SN码">
              <span class="itemInput">{{dataForm.fuiouPos2SnNo || '--'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端号2">
              <span class="itemInput">{{dataForm.fuiouPos2TermNo || '--'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务时间">
          <span class="itemInput">{{dataForm.serviceBeginDate || '-'}}<span v-if="dataForm.serviceBeginDate!=null && dataForm.serviceEndDate!=null"> 至 </span>{{dataForm.serviceEndDate || '-'}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店LOGO" class="view-img">
              <img :src="'http://'+dataForm.storeLogo" alt="" @click="openImgPic('storeLogo')" v-if='dataForm.storeLogo'>
                  <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店二维码" class="view-img">
              <img :src="'http://'+dataForm.smallProgramQrCode" alt="" @click="openImgPic('smallProgramQrCode')" v-if='dataForm.smallProgramQrCode'>
              <button v-else-if="isShow" class="Addbutton" @click.prevent="AddEwm">生成</button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营许可证" class="view-img">
              <img :src="'http://'+dataForm.businessLicensePic" alt="" @click="openImgPic('businessLicensePic')" v-if='dataForm.businessLicensePic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门头照" class="view-img" >
              <img :src="'http://'+dataForm.doorwayPic" alt="" @click="openImgPic('doorwayPic')" v-if='dataForm.doorwayPic' >
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="直播分享码" class="view-img">
              <img :src="'http://'+dataForm.liveCode" alt="" @click="openImgPic('liveCode')" v-if='dataForm.liveCode'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="店内实景照" class="view-img">
          <img v-for='item in dataForm.innerPic' :key="item.name" :src="'http://'+item.url" alt="" @click="openImgPic('innerPic',item.url)" v-show="dataForm.innerPic&&dataForm.innerPic.length>0">
          <span v-if="!dataForm.innerPic || dataForm.innerPic.length==0" class="itemInput">--</span>
        </el-form-item>
        <el-form-item label="门店状态">
          <el-radio-group v-model="dataForm.status" :disabled="true">
            <el-radio v-for="item in storeStatus" :key="item.value" :label="item.value" >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="入驻品牌" prop="brandFlag" v-if="dataForm.id">
          <span class="itemInput">{{dataForm.brandFlag == 1 ? '妈咪全知道' : '无'}}</span>
        </el-form-item> -->
        <el-form-item label="系统版本" prop="version">
            <span class="itemInput">{{dataForm.version ? filterStatus(dataForm.version, companyVersion) : '专业版'}}</span>
          </el-form-item>
          <el-form-item label="星级" prop="level">
            <span class="itemInput">{{filterStatus(dataForm.level, companyStarlevel)}}</span>
          </el-form-item>
        <el-form-item label="毛利率" v-if="dataForm.version=='MARKETING'">
          <span class="itemInput">{{dataForm.rateOfMargin}}&nbsp;%</span>
        </el-form-item>
        <el-form-item label="运送方式" v-if="dataForm.version=='MARKETING'">
          <span class="itemInput">{{dataForm.shipType === 'SELF' ? '到店自提': (dataForm.shipType === 'EXPRESS' ? '快递配送' : '快递配送,到店自提' )}}</span>
        </el-form-item>
        <el-form-item label="区域自定义">
          <span class="itemInput">{{dataForm.brandArea}}</span>
        </el-form-item>
        <el-form-item label="大区">
          <span class="itemInput">{{dataForm.region}}</span>
        </el-form-item>
        <el-form-item label="门店面积">
          <span class="itemInput">{{dataForm.acreage}}&nbsp;平</span>
        </el-form-item>
      </el-form>
    </el-card>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>

<script>
import { filterStatus } from '@/utils'
import { storeB, storeStatus,companyVersion,companyStarlevel } from '@/utils/dict'
export default {
  name:'store-view',
  data () {
    return {
      isShow:true,
      filterStatus,
      storeStatus,
      companyVersion,
      companyStarlevel,
      storeB,
      pageZ: 1000,
      pageC: 1,
      isView: true,
      companyName: null,
      companyNumber: null,
      companyList:[],
      dataForm: {
        id: null,
        code:null,
        name: null,
        companyId:null,
        storeCategory:null,
        phone:null,
        storeLinkPhone: null,
        linkman:null,
        status:null,
        liveCode:null,
        address:null,
        serviceBeginDate:null,
        serviceEndDate:null,
        serverTime:null,
        businessLicensePic: null,
        doorwayPic: null,
        storeLogo: null,
        innerPic: null,
        smallProgramQrCode:null
      },
      showImgPic:null
    }
  },
  created () {
    this.dataForm.id = this.$route.query.id || ''
    if(this.isAuth('mop:store:detail')){
      this.init(this.dataForm.id)
    }
  },
  methods: {

    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.dataForm[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    // 所选企业
    selectCompany(id){
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageZ,
          currentPage: this.pageC,
        })
      }).then(({data}) => {
        if(data && data.code === 0) {
          this.companyList = data.data.records
          console.log(this.companyList)
          for(var i in this.companyList){
            if(this.companyList[i].id == id){
              this.companyName = this.companyList[i].name
              this.companyNumber = this.companyList[i].number || ''
            }
          }
        }else{
          this.companyList = []
        }
      })
    },
    init (id) {
      if (id) {
        var that = this
        this.$http({
          url: this.$http.adornUrl('/baseinfo/mop/store/detail/'+id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            that.dataForm = data.data
            if(data.data.innerPic){
              that.dataForm.innerPic = JSON.parse(data.data.innerPic)
            }

            if(this.isAuth('mop:company:select1')){
              that.selectCompany(data.data.companyId)
            }
          }
        })
      }
    },
    //二维码
    AddEwm(){
      this.$http({
        url: this.$http.adornUrl('/open-api/store/saveStoreQrCode/'+this.dataForm.id),
        method:'get',
      }).then(({data})=>{
        if(data && data.code  == 0){
          this.$nextTick(() => {
            this.dataForm.smallProgramQrCode = data.data
            this.isShow=false
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scope>
.viewForm {
  .el-input__inner {
    width: 300px!important;
  }
}
.Addbutton{
  border: none;
  background-color: #f59055;
  width: 100px;
  height: 30px;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
}


</style>
