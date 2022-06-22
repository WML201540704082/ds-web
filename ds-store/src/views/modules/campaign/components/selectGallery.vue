<template>
<el-dialog
  title="选择图片"
  :close-on-click-modal="false"
  width="60%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <gt-subtitle title="活动封面图片" v-show="iscover==='single'" style="display:block"/>
  <div style="display: inline-block;width: 100%;text-align:center;"  v-show="iscover==='single'">
    <div style="display: inline-block;" v-if="advertisement.activityFrontPictures&&advertisement.activityFrontPictures.length>0">
        <span class="picList" v-for="(item,index) in advertisement.activityFrontPictures" :key="index">
          <img :src="'https://'+item" alt="">
          <div class="theme-border theme-color" @click="applyPic(item)">立即应用</div>
        </span> 
    </div>
    <div style="display: inline-block;" v-else>
      暂无封面图
    </div>
    
  </div>
  <gt-subtitle title="活动内容背景图片" v-show="iscover!='single'" style="display:block"/>
  <div style="display: inline-block;width: 100%;text-align:center;"  v-show="iscover!=='single'">
    <div style="display: inline-block;" v-if="advertisement.activityBackPictures&&advertisement.activityBackPictures.length>0">
        <span class="picList" v-for="(item,index) in advertisement.activityBackPictures" :key="index">
        <img :src="'https://'+item" alt="">
        <div class="theme-border theme-color" @click="applyPic(item)">立即应用</div>
        </span> 
    </div>
    <div style="display: inline-block;" v-else>
      暂无背景图
    </div>
  </div>
</el-dialog>
</template>

<script>
import gtSubtitle from '@/components/gt-sub-title'
import {getBannerList} from '@/service/activity'
export default {
  components:{ gtSubtitle },
  data () {
    return {
      idx: null,
      visible: false,
      iscover: null, 
      advertisement: {
        activityBackPictures: [],
        activityFrontPictures: []
      },
    }
  },
  methods: {
    async init (type,index) {
      this.iscover = type
      this.idx = index
      this.visible = true
      this.getBannerList()
    },
    // 获取商品列表
    async getBannerList() {
      const { data } = await getBannerList()
      if (data.code === 0) {
        this.advertisement = {
          activityBackPictures: data.data.activityBackPictures,
          activityFrontPictures: data.data.activityFrontPictures
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    // 表单提交
    applyPic (coverItem) {
      var obj={
        'type':this.iscover,
        'index':this.idx,
        'cover': coverItem
      }
      this.$emit('refreshData', obj)
      this.visible = false
    },

  }
}
</script>
<style lang="scss" scope>
  .picList {
    float: left;
    width: 200px;
    height: 200px;
    text-align: center;
    overflow: hidden;
    img {
        // width: 150px;
        height: 150px;
    }
    div {
        display: inline-block;
        margin: 15px 0;
        width: 100px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        border-radius: 10px;
        cursor:pointer;
    }
  }
</style>
