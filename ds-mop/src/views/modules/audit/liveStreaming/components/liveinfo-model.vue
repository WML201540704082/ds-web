<template>
  <div>
    <el-form-item label="直播标题" prop="title" class="labelWidth">
      <span class="itemInput">{{liveinfoAdd.title}}</span>
    </el-form-item>
    <el-form-item label="主播昵称" prop="nickName" class="labelWidth">
      <span class="itemInput">{{liveinfoAdd.nickName}}</span>
    </el-form-item>
    <el-form-item label="开播时间" class="gt-inline-item">
      <span class="itemInput">{{liveinfoAdd.startTime}}</span>
    </el-form-item>
    <el-form-item label="结束时间" class="gt-inline-item">
      <span class="itemInput">{{liveinfoAdd.endTime}}</span>
    </el-form-item>
    <el-form-item label="允许评论" prop="hasComment" class="labelWidth">
      <span class="itemInput">{{liveinfoAdd.hasComment ? '是' : '否'}}</span>
    </el-form-item>
    <el-form-item label="主播微信账号" prop="wechatAccount" class="gt-inline-item">
      <span class="itemInput">{{liveinfoAdd.wechatAccount}}</span>
    </el-form-item>
    <el-form-item label="分享卡片封面" class="view-img" >
      <img :src="liveinfoAdd.shareCardCover" alt="" @click="openImgPic('shareCardCover')" v-if='liveinfoAdd.shareCardCover' >
      <span v-else class="itemInput">--</span>
    </el-form-item>
    <el-form-item label="直播间封面" class="view-img" >
      <img :src="liveinfoAdd.roomCover" alt="" @click="openImgPic('roomCover')" v-if='liveinfoAdd.roomCover' >
      <span v-else class="itemInput">--</span>
    </el-form-item>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic"></gt-show-pic>
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
    liveinfoAdd:{
      type: Object
    }
  },
  created(){
  },
  methods:{
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = url
      }else{
        this.showImgPic = this.liveinfoAdd[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
  }
}
</script>
