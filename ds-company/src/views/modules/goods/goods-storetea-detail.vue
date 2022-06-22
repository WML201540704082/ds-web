<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="商品图片">
          <img v-if="dataList.pic" :src="'http://'+dataList.pic" alt style="width:56px;height:56px" />
          <span v-else>--</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <span class="itemInput">{{dataList.name || '--'}}</span>
        </el-form-item>
        <el-form-item label="商品编码">
          <span class="itemInput">{{dataList.code}}</span>
        </el-form-item>
        <el-form-item label="商品分类">
          <span class="itemInput">{{dataList.className}}</span>
        </el-form-item>
        <el-form-item label="商品标记">
          <span class="itemInput">{{dataList.mark == "EMPTY" ? '无' : dataList.mark}}</span>
        </el-form-item>
        <el-form-item label="商品描述">
          <span class="itemInput">{{dataList.description ? dataList.description :'--'}}</span>
        </el-form-item>
        <el-form-item label="终端排序">
          <span class="itemInput">{{dataList.sequence ? dataList.sequence : '--'}}</span>
        </el-form-item>
        <el-form-item label="销售价格">
          <span
            class="itemInput"
          >{{dataList.salePrice ? Number(priceNum(dataList.salePrice)).toFixed(2) : Number(priceNum(dataList.minSalePrice)).toFixed(2)}}</span>
        </el-form-item>
        <el-form-item label="销售规格" v-if="!dataList.salePrice">
          <span
            class="itemInput"
            v-for="(item,index) in dataList.specs"
            :key="index"
          >{{item.name}}:{{priceNum(item.salePrice)}},</span>
        </el-form-item>
        <el-form-item label="销售单位">
          <span v-if="dataList.unit='CUP' " class="itemInput">杯</span>
          <span v-else>份</span>
        </el-form-item>
        <el-form-item label="销售状态">
          <span class="itemInput">{{sale = true ? '在售': '停售'}}</span>
        </el-form-item>
        <el-form-item label="商品口味">
          <span
            class="itemInput"
            v-for="(item,index) in dataList.tastes"
            :key="index"
          >{{item.name}}：{{item.valueNames}}</span>
          <span class="itemInput" v-if="dataList.tastes&&dataList.tastes.length==0">--</span>
        </el-form-item>
        <el-form-item label="选择加料">
          <span class="itemInput">{{dataList.feedTable ? dataList.feedTable.name : '--'}}</span>
        </el-form-item>
        <el-form-item label="商品标签">
          <span class="itemInput">{{dataList.tags ? dataList.tags : '--'}}</span>
        </el-form-item>
        <!-- <el-form-item label="商品描述" v-if="dataList.infos && dataList.infos.length>0">
          <div v-for="(item,index) in dataList.infos" :key="index">
            <el-form-item label="图文">
              <span class="itemInput">{{index+1}}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span class="itemInput">{{item.description}}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <span v-if="item.pic">
                <div class="view-img">
                  <img class="theme-border" :src="'http://'+item.pic" alt />
                </div>
              </span>
              <span class="itemInput" v-else>--</span>
            </el-form-item>
          </div>
        </el-form-item> -->
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { getStoreteaDetail } from "@/service/goods";

export default {
  name: "goods-storetea-detail",
  data() {
    return {
      dataList: {},
      sale: null,
    };
  },
  async created() {
    const { id } = this.$route.query;
    const datas = this.$route.query
    const data = await getStoreteaDetail(datas);
    this.dataList = data.drink;
    console.log(this.dataList.tastes);
    this.sale = data.sale;
    localStorage.setItem('pramsStoreid', datas.storeId)
  },
};
</script>