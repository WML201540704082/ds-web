<template>
  <div>
    <el-form-item label="活动标题" prop="title" class="labelWidth">
      <span class="itemInput">{{activeadd.title}}</span>
    </el-form-item>
    <el-form-item label="活动时间" class="gt-inline-item">
      <span class="itemInput">{{activeadd.startTime}}-{{activeadd.endTime}}</span>
    </el-form-item>
    <el-form-item label="封面图片" class="view-img">
      <img :src="'http://'+activeadd.cover" alt="" @click="openImgPic('cover')" v-if='activeadd.cover' >
      <span v-else class="itemInput">--</span>
    </el-form-item>
    <el-form-item label="分享海报图片" class="view-img">
      <img :src="'http://'+activeadd.poster" alt="" @click="openImgPic('poster')" v-if='activeadd.poster' >
      <span v-else class="itemInput">--</span>
    </el-form-item>
    <el-form-item label="宣传副标题" prop="subTitle" class="labelWidth">
      <span class="itemInput">{{activeadd.subTitle}}</span>
    </el-form-item>
    <el-form-item label="适用门店" prop="storeList">
      <span class="itemInput">{{activeadd.storeList}}</span>
    </el-form-item>
    <el-form-item label="所属企业" prop="companyName" class="labelWidth">
      <span class="itemInput">{{activeadd.companyName}}</span>
    </el-form-item>
    <el-form-item label="商品购买次数" prop="activityProductNum" class="labelWidth">
      <span class="itemInput">{{activeadd.activityProductNum ? `每个用户ID/手机号码同一件商品限制${activeadd.activityProductNum}个` : '每个用户ID/手机号码同一件商品不限制购买数量'}}</span>
    </el-form-item>

    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </div>
</template>

<script>

export default {
  data(){
    return{
      showImgPic:null,
    }
  },
  props:{
    activeadd:{
      type: Object
    }
  },
  created(){
  },
  methods:{
    //图片展示
    openImgPic:function(str,url){
      this.showImgPic = 'http://'+this.activeadd[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
  }

}
</script>
