<template>
  <section>
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectAdvertisement" style="float:left;">
        <el-radio-button v-for="item in tabList" :key="item.id" :label="item.id" @click.native="clickTab(item.id)">{{item.name}}</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-secondIndex ref="secondIndex" />
  </section>
</template>
<script>
import gtSecondIndex from './secondIndex'
export default {
  name:'settings-advertisement-secondAdvertisement',
  components: {
    gtSecondIndex,
  },
  data(){
    return{
      tabList:[{id:'yunHome',name:'云店“首页”广告'},{id:'yunClassify',name:'云店“分类”广告'},{id:'posShow',name:'POS客显广告'}],
      selectAdvertisement:'yunHome'
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this.$refs['secondIndex'].initData(this.selectAdvertisement)
    })
  },
  methods:{
    clickTab(id){
      this.$nextTick(()=>{
        this.$refs['secondIndex'].initData(id)
      })
    }
  }
}
</script>