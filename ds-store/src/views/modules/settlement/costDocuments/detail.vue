<template>
  <section v-loading="$store.state.loading.global">
    <span class="autio theme-background" @click="audioStatus" v-if="dataForm.status==='PENDING'&&dataForm.customerStoreId===storeid">审核</span>
    <el-form :model="dataForm" ref="dataForm" label-width="100px" class="viewForm" >
        <gt-subtitle title="单据信息" />
        <el-card style="position: relative;">
          <img alt="审核状态" class="cost-audit-status" :src="`static/img/settlement/${statusImg}.png`"/>
            <el-form-item label="单据编号">
                <span class="itemInput">{{dataForm.billCode}}</span>
            </el-form-item>
            <el-form-item label="来往单位">
                <span class="itemInput">{{dataForm.customerStoreName}}</span>
            </el-form-item>
            <el-form-item label="费用类型">
                <span class="itemInput">{{filterStatus(dataForm.type, costType) || '--'}}</span>
            </el-form-item>
            <el-form-item label="金额">
                <span class="itemInput">{{priceNum(dataForm.amount) || 0}}</span>
            </el-form-item>
            <el-form-item label="费用描述">
                <span class="itemInput">{{dataForm.description || '--'}}</span>
            </el-form-item>
            <el-form-item label="发生时间">
                <span class="itemInput">{{dataForm.occurTime}}</span>
            </el-form-item>
            <el-form-item label="申请人">
                <span class="itemInput">{{dataForm.proposerName}}</span>
            </el-form-item>
            <el-form-item label="申请人所在门店">
                <span class="itemInput">{{dataForm.storeName }}</span>
            </el-form-item>
            <el-form-item label="附件" class="view-img">
                <img v-for='item in imgList' :key="item.name" :src="'http://'+item.url" alt="" @click="openImgPic('filePic',item.url)" v-show="imgList&&imgList.length>0">
                <span v-if="!imgList || imgList.length==0" class="itemInput">--</span>
            </el-form-item>
        </el-card>
        <gt-subtitle title="审核结果" style="display:block"/>
        <el-card style="margin-bottom: 10px;">
            <el-form-item label="审核结果">
                <span class="itemInput">{{filterStatus(dataForm.status, costStatus) || '--'}}</span>
            </el-form-item>
            <el-form-item label="审核时间">
                <span class="itemInput">{{dataForm.auditTime || '--'}}</span>
            </el-form-item>
            <el-form-item label="审核人">
                <span class="itemInput">{{dataForm.auditorName || '--'}}</span>
            </el-form-item>
            <el-form-item label="备注">
                <span class="itemInput">{{dataForm.auditDescription || '--'}}</span>
            </el-form-item>
        </el-card>
    </el-form>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
    <gt-status-model v-if="statusVisible" ref="statusRef" @refreshDataList="detail" />
  </section>
</template>

<script>
import { filterStatus } from '@/utils'
import gtSubtitle from '@/components/gt-sub-title'
import { costType, costStatus } from '@/utils/dict'
import { getCostDetail } from '@/service/setting'
import { getStore } from '@/utils/storage'
import gtStatusModel from '../status-model'
export default {
  name: 'settlement-cost-detail',
  data () {
    return {
      statusVisible: false,
      imgList: [],
      filterStatus,
      costType,
      costStatus,
      dataForm: {
        id: null,
        billCode: null,
        customerStoreId: null,
        customerStoreName: null,
        type: 'COST',
        amount: null,
        description: null,
        occurTime:null,
        filePic: null,
        proposerName: null,
        storeName: null,
        status: null,
        auditTime: null,
        auditorName: null,
        auditDescription: null
      },
      showImgPic: null,
      storeid: null
    }
  },
  components:{ gtSubtitle,gtStatusModel },
  created () {
    const { storeId = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeid = storeId
    this.dataForm.id = this.$route.query.id || ''
    this.detail()
  },
  computed: {
    statusImg() {
      let img = ''
      switch (this.dataForm.status) {
      case 'PENDING':
        img = 'cost-audit-wait'
        break
      case 'REFUSE':
        img = 'cost-audit-refuse'
        break
      case 'PASS':
        img = 'cost-audit-pass'
        break
      default:
        img = 'cost-audit-wait'
        break
      }
      return img
    }
  },
  methods: {
    //图片展示
    openImgPic:function(str,url){
      if(str === 'filePic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.dataForm[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    async detail () {
      const {data} = await getCostDetail({id: this.dataForm.id})
      if(data.code == 0){
        this.dataForm={
          ...data.data
        }

        if(data.data.filePic){
          this.imgList = JSON.parse(data.data.filePic) || []
        }
      }else{
        this.$message.error(data.mag)
      }
    },
    // 审核
    audioStatus(){
      this.statusVisible = true
      this.$nextTick(() => {
        this.$refs.statusRef.init(this.dataForm.id)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.viewForm {
  .el-input__inner {
    width: 300px!important;
  }
}
.cost-audit-status{
  width: 100px;
  position: absolute;
  top: 50px;
  right: 50px;
}
.autio {
  display: inline-block;
  width:80px;
  height: 30px;
  text-align: center;
  border-radius: 10px;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

</style>
