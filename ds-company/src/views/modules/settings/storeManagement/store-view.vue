<template>
  <section v-loading="$store.state.loading.global">
    <el-card>
      <el-form :model="dataForm" ref="dataForm" label-width="120px">
        <el-form-item label="门店编号">
          <span class="itemInput">{{dataForm.code}}</span>  
          <el-checkbox v-if="dataForm.type == 'normal' && newStore == 'true'" v-model="dataForm.selfBusinessFlag" class="itemInput"   style="margin-left:20px">允许自营商品新增</el-checkbox>
          <el-checkbox v-if="dataForm.type != 'normal' && newStore == 'true'" disabled v-model="dataForm.selfBusinessFlag" class="itemInput"   style="margin-left:20px">允许自营商品新增</el-checkbox>
          <el-checkbox v-if="dataForm.type == 'normal' && newStore == 'true'" v-model="dataForm.inStockFlag" class="itemInput"  style="margin-left:20px">允许自营商品入库</el-checkbox>
          <el-checkbox v-if="dataForm.type != 'normal' && newStore == 'true'" disabled v-model="dataForm.inStockFlag" class="itemInput"  style="margin-left:20px">允许自营商品入库</el-checkbox>
        </el-form-item>
        <el-form-item label="门店名称">
          <span class="itemInput">{{dataForm.name}}</span>
        </el-form-item>
        <el-form-item label="云店名称">
          <span class="itemInput">{{dataForm.weshopName}}</span>
        </el-form-item>
        <el-form-item label="门店营业执照名称" v-if="newStore == 'true'">
          <span class="itemInput">{{dataForm.storeNameAcc}}</span>
        </el-form-item>
        <el-form-item label="门店类型" prop="type" v-if="newStore == 'true'">
          <span class="itemInput">{{type =="NEW_RETAIL" ? '新零售' : type == 'NEW_RETAIL_AND_DRINK' ? "新零售+茶饮" : ''}}</span>
          <!-- <span class="itemInput" v-else>{{filterStatus(dataForm.storeCategory,storeB)}}</span> -->
        </el-form-item>
        <el-form-item label="联系人">
          <span class="itemInput">{{dataForm.linkman}}</span>
        </el-form-item>
        <el-form-item label="联系电话">
           <span class="itemInput">{{dataForm.phone}}</span>
        </el-form-item>
        <el-form-item label="小店联系电话" prop="storeLinkPhone">
          <el-input v-if="dataForm.type == 'normal'" v-model="dataForm.storeLinkPhone" placeholder="请输入萌百小店联系电话" maxlength="11"></el-input>
          <span v-else class="itemInput">{{dataForm.storeLinkPhone}}</span>
        </el-form-item>
        <el-form-item label="营业时间" v-if="dataForm.type != 'normal'">
          <span class="itemInput">上午&nbsp;&nbsp;{{`${dataForm.forenoonOpenHours || ''} - ${dataForm.forenoonCloseHours || ''}`}}</span>
          <span class="itemInput" style="display:block">下午&nbsp;&nbsp;{{`${dataForm.afternoonOpenHours || ''} - ${dataForm.afternoonCloseHours || ''}`}}</span>
        </el-form-item>
        <el-form-item label="营业时间" prop="openRangeAm" v-if="dataForm.type == 'normal'">
          上午&nbsp;&nbsp;
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.forenoonOpenHours"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '12:00',
              maxTime: dataForm.forenoonCloseHours
            }">
          </el-time-select>
          至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.forenoonCloseHours"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '12:00',
              minTime: dataForm.forenoonOpenHours
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item prop="openRangePm" v-if="dataForm.type == 'normal'">
          下午&nbsp;&nbsp;
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.afternoonOpenHours"
            :picker-options="{
              start: '12:00',
              step: '00:15',
              end: '23:00',
              maxTime: dataForm.afternoonCloseHours
            }">
          </el-time-select>
          至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.afternoonCloseHours"
            :picker-options="{
              start: '12:00',
              step: '00:15',
              end: '23:00',
              minTime: dataForm.afternoonOpenHours
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="门店位置">
          <span class="itemInput">{{`${dataForm.province || ''}${dataForm.city || ''}${dataForm.district || ''}${dataForm.address || ''}` || '--'}}</span>
        </el-form-item>
        <el-form-item label="服务时间" v-if="dataForm.serviceBeginDate || dataForm.serviceEndDate">
          <span class="itemInput">{{dataForm.serviceBeginDate}}<span v-if="dataForm.serviceBeginDate!=null && dataForm.serviceEndDate!=null"> 至 </span>{{dataForm.serviceEndDate}}</span>
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
                  <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营许可证" class="view-img" >
              <img :src="'http://'+dataForm.businessLicensePic" alt="" @click="openImgPic('businessLicensePic')" v-if='dataForm.businessLicensePic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门头照" class="view-img">
              <img :src="'http://'+dataForm.doorwayPic" alt="" @click="openImgPic('doorwayPic')" v-if='dataForm.doorwayPic' >
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店直播分享码" prop="share" class="view-img">
              <img v-if="dataForm.liveCode" :src="'http://'+ dataForm.liveCode" alt="" @click="openImgPic('liveCode')">
               <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="店内实景照" class="view-img">
          <img v-for='item in dataForm.innerPic' :key="item.name" :src="'http://'+item.url" alt="" @click="openImgPic('innerPic',item.url)"  v-show="dataForm.innerPic&&dataForm.innerPic.length>0">
          <span v-if="!dataForm.innerPic || dataForm.innerPic.length==0" class="itemInput">--</span>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="dialog-footer-inner" v-if="dataForm.type == 'normal'" style="margin-top: 10px;">
      <gt-button size="large" :loading="$store.state.loading.global" @click.native="dataFormSubmit(true)" txt="保存并提交"/>
    </div>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>

<script>
import { filterStatus } from '@/utils'
import { storeB } from '@/utils/dict'
import { getStoresDetail,getStoresData } from '@/service/setting'
import { getStore } from '@/utils/storage'
export default {
  name: 'store-view',
  data () {
    return {
      type:null,//茶饮
      filterStatus,
      storeB,
      dataForm: {
        id: null,
        code:null,
        name: null,
        storeCategory:null,
        phone:null,
        storeLinkPhone: null,
        linkman:null,
        address:null,
        serviceBeginDate:null,
        serviceEndDate:null,
        serverTime:null,
        businessLicensePic: null,
        doorwayPic: null,
        storeLogo: null,
        innerPic: null,
        selfBusinessFlag:false,
        inStockFlag:false
      },
      showImgPic:null
    }
  },
  created (storeType) {
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    if(this.newStore=='true'){
      this.dataForm.selfBusinessFlag=true,
      this.dataForm.inStockFlag=true
    }else{
      this.dataForm.selfBusinessFlag=true,
      this.dataForm.inStockFlag=true
    }
    this.dataForm.id = this.$route.query.id || ''
    this.init(this.dataForm.id)
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
    async init (id) {
      if (id) {
        var that = this
        const data = await getStoresDetail(id)
        that.dataForm = data
        that.type = data.type
        this.dataForm.type = this.$route.query.type || ''
        if(data.innerPic){
          that.dataForm.innerPic = JSON.parse(data.innerPic)
        }
      }
    },
    // 表单提交
    dataFormSubmit (submit) {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          const { data } = await getStoresData({
            ...this.dataForm,
            storeLogo:this.dataForm.storeLogo || '',
            smallProgramQrCode:this.dataForm.smallProgramQrCode || '',
            businessLicensePic:this.dataForm.businessLicensePic || '',
            doorwayPic:this.dataForm.doorwayPic || '',
            liveCode:this.dataForm.liveCode || '',
            innerPic:this.dataForminnerPic || '',
            type:this.type
          })
          this.loading = false
          if(data.code == 0){
            this.$router.push({name:'settings-storeManagement-store'})
          }else{
            this.$message.error(data.msg)
          }
        } else {
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.viewForm {
  .el-input__inner {
    width: 300px!important;
  }
}
.view-img img{
  width: 150px;
  height: 150px;
  border-radius: 5px;
  float: left;
  margin-right: 15px;
}
</style>
