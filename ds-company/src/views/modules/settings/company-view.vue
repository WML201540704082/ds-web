<template>
  <section>
    <el-form label-width="135px" :model="company">
      <el-form-item label="实体类别">
        <span class="itemInput">{{filterStatus(company.entityCategory, companyType)}}</span>
      </el-form-item>
      <el-form-item label="企业名称">
        <span class="itemInput">{{company.name}}</span>
      </el-form-item>
      <!-- <el-form-item label="商户号">
        <span class="itemInput">{{company.fuiouMerchantNo || '--'}}</span>
      </el-form-item> -->
      <el-form-item label="法人">
        <span class="itemInput">{{company.legalPerson}}</span>
      </el-form-item>
      <el-form-item label="联系电话">
        <span class="itemInput">{{company.phone}}</span>
      </el-form-item>
      <!-- <el-form-item label="企业级别">
        <span class="itemInput">{{filterStatus(company.level, companyLevel)}}</span>
      </el-form-item> -->
      <el-form-item label="门店状态">
        <span class="itemInput" :class="filterColor(filterStatus(company.status, companyStatus))">{{filterStatus(company.status, companyStatus)}}</span>
      </el-form-item>
      <el-form-item label="营业执照编号">
        <span class="itemInput">{{company.businessLicenseCode}}</span>
      </el-form-item>
      <!-- <el-form-item label="门店数量">
        <span class="itemInput">{{company.count}}</span>
      </el-form-item> -->
      <el-form-item label="企业地址">
        <span class="itemInput">{{`${company.province || ''}${company.city || ''}${company.district || ''}${company.address || ''}` || '--'}}</span>
      </el-form-item>
      <!-- <el-form-item label="服务时间" class="serverTime">
        <span class="itemInput">{{company.serviceBeginDate}}<span v-if="company.serviceBeginDate!=null && company.serviceEndDate!=null">-</span>{{company.serviceEndDate}}</span>
      </el-form-item> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人身份证(正面)" class="view-img">
            <img :src="`https://${company.legalPersonIdPositivePic}`" alt="法人身份证正面" @click="openImgPic('legalPersonIdPositivePic')"  v-if='company.legalPersonIdPositivePic'>
            <span v-else class="itemInput">--</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人身份证(反面)" class="view-img">
            <img :src="`https://${company.legalPersonIdBackPic}`" alt="法人身份证反面" @click="openImgPic('legalPersonIdBackPic')" v-if='company.legalPersonIdBackPic'>
            <span v-else class="itemInput">--</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="营业执照" class="view-img">
        <img :src="`https://${company.businessLicensePic}`" alt="营业执照" @click="openImgPic('businessLicensePic')" v-if='company.businessLicensePic'>
        <span v-else class="itemInput">--</span>
      </el-form-item>
    </el-form>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import { filterStatus, filterColor } from '@/utils'
import { companyLevel, companyType, companyStatus } from '@/utils/dict'
export default {
  name: 'company-view',
  data() {
    return {
      filterStatus,
      filterColor,
      companyLevel,
      companyType,
      companyStatus,
      showImgPic: null,
    }
  },
  props: {
    company: {
      type: Object,
    }
  },
  methods:{
    //图片展示
    openImgPic:function(str){
      this.showImgPic = 'http://'+this.company[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
  }
}
</script>

