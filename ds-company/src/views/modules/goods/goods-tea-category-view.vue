<template>
  <el-card>
    <el-form>
      <el-form-item label="分类名称">
        <span class="itemInput">{{dataList.name}}</span>
      </el-form-item>
      <el-form-item label="终端排序">
        <span class="itemInput">{{dataList.sequence}}</span>
      </el-form-item>
      <el-form-item label="分类标记">
        <span class="itemInput">{{dataList.mark=="EMPTY" ? '无': dataList.mark}}</span>
      </el-form-item>
      <el-form-item label="分类图片">
        <img v-if="dataList.pic" :src="'http://'+dataList.pic" alt style="width:56px;height:56px"/>
        <span class="itemInput" v-else>--</span>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import * as api from "@/service/goods";

export default {
  name: "goods-tea-category-view",
  data() {
    return {
      dataList: [],
    };
  },
  async created() {
    const { id } = this.$route.query;
    const data = await api.getCategoryList(id);
    this.dataList=data
  },
};
</script>