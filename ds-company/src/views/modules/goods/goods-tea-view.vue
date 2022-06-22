<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <gt-subtitle title="基本信息" style="display: block;" />
      <el-form label-width="150px" :model="dataList">
        <el-form-item label="商品图片">
          <img :src="'http://'+ dataList.pic" alt="" style="width:100px;height:100px" v-if="dataList.pic">
          <span v-else class="itemInput">--</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <span class="itemInput">{{dataList.name}}</span>
        </el-form-item>
        <el-form-item label="选择分类">
          <span class="itemInput">{{dataList.className}}</span>
        </el-form-item>
        <el-form-item label="第三方编码">
          <span class="itemInput">{{dataList.code ? dataList.code :'--'}}</span>
        </el-form-item>
        <el-form-item label="终端排序">
          <span class="itemInput">{{dataList.sequence ? dataList.sequence :'--'}}</span>
        </el-form-item>
        <el-form-item label="商品标记">
          <el-radio-group v-model="dataList.mark"  v-if="dataList.mark" disabled>
            <el-radio label="EMPTY">无</el-radio>
            <el-radio label="HOT">hot</el-radio>
            <el-radio label="NEW">new</el-radio>
          </el-radio-group>
          <!-- <span class="itemInput" v-if="dataList.mark">{{dataList.mark == "EMPTY" ? '无' : dataList.mark}}</span> -->
          <span class="itemInput" v-else>--</span>
        </el-form-item>
        <el-form-item label="商品描述">
          <span class="itemInput">{{dataList.description? dataList.description :'--'}}</span>
        </el-form-item>
        <!--  -->
        <gt-subtitle title="基本信息" style="display: block;" />
        <el-form-item label="销售价">
          <span class="itemInput">{{dataList.salePrice? Number(priceNum(dataList.salePrice)).toFixed(2): Number(priceNum(dataList.minSalePrice)).toFixed(2)}}</span>
        </el-form-item>
        <el-form-item label="销售规格" prop="specs" v-if="dataList.salePrice==0||dataList.salePrice ==null">
          <el-table :data="specs " style="width: 100%">
            <el-table-column label="规格" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column label="价格/元" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.salePrice" size="mini" disabled></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- <span class="itemInput" v-for="(item,index) in specs" :key="index">{{item.name}}:{{item.salePrice}},</span> -->
        </el-form-item>
        <el-form-item label="销售单位">
          <!-- <span class="itemInput">{{dataList.unit=="CUP" ? '杯' : '份'}}</span> -->
          <el-radio-group v-model="dataList.unit" disabled>
            <el-radio label="CUP">杯</el-radio>
            <el-radio label="PORTION">份</el-radio>
          </el-radio-group>
        </el-form-item> 
        <!--  -->
        <gt-subtitle title="售卖信息" style="display: block;" />
        <el-form-item label="商品口味">
          <span class="itemInput  m-right" v-for="(item,index) in tastes" :key="index">{{item.name}}：{{item.valueNames}}.</span>
          <span class="itemInput" v-if="tastes&&tastes.length==0">--</span>
        </el-form-item>
        <el-form-item label="选择加料">
          <span class="itemInput" v-if="dataList.feedTable">{{dataList.feedTable.name}}</span>
          <span class="itemInput" v-else>--</span>
        </el-form-item>
        <el-form-item label="商品标签">
          <span class="itemInput">{{dataList.tags ? dataList.tags : '--'}}</span>
        </el-form-item>
        <!-- <gt-subtitle title="菜品详情" style="display: block;" /> -->
        <!-- <div v-for="(item,index) in infos" :key="index">
          <el-form-item>
            <span class="itemInput">图文{{index+1}}</span>
          </el-form-item>
           <el-form-item label="内容">
            <span class="itemInput">{{item.description}}</span>
           </el-form-item>
           <el-form-item label="商品图片">
            <span v-if="item.pic">
              <div class="view-img">
                <img class="theme-border" :src="'http://'+item.pic" alt="">
              </div>
            </span>
            <span class="itemInput" v-else>--</span>
         </el-form-item>
        </div>
        <el-form-item label="无" v-if="infos.length==0">
        </el-form-item> -->
      </el-form>
    </el-card>
  </section>
</template>
<script>
import gtSubtitle from "@/components/gt-sub-title";
import * as api from "@/service/goods";

export default {
  name: "goods-tea-view",
  components: {
    gtSubtitle,
  },
  data(){
    return{
      dataList:{
        feedTable:{}
      },
      infos:[],
      specs:[],//规格
      tastes:[],
    }
  },
  async created(){
    const { id } = this.$route.query;
    // console.log(id);
   const { data } = await api.detailTea(id)
   if(data.code===0){
     this.dataList = data.data
     this.infos = data.data.infos
     this.specs = data.data.specs.map(item=>{item.salePrice=item.salePrice/100;return item})
     this.tastes = data.data.tastes
     console.log(data.data);
   }
  },
};
</script>
<style lang="scss">
 .view-img {
    float: left;
    margin-right: 15px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 5px;
    }
  }
  .m-right{
    margin-right: 10px;
    z-index: 999;
  }
</style>