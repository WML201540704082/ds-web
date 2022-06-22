<template>
  <div>
    <div v-for="item in list" :key="item.name" class="allBox">
      <div class="listY" v-if="hasName(item.list)">{{item.name}}</div>
      <div class="listY1">
        <div v-for="item1 in item.list" :key="item1.name" >
          <div v-if="isAuthMenu(item1.isauth || '')" class="listBox" @click="goList(item1.router,item1.type)"  :style="item1.disabled?'background:#d3d3d3':''">
            <span class="imgs"><icon-svg :name="item1.icon" class="th-size theme-color" :class="{'special-theme-icon': item1.icon === 'campaignTogether'}"></icon-svg></span>
            <span class="imgTitle">
              <div class="name">{{item1.name}}</div>
              <div class="title">{{item1.title}}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'survey-index',
  data(){
    return{
      list:[{
        'name':'日常数据',
        list:[{'router':'survey-list', isauth: 'survey_list', 'name':'营业概况','icon':'survey_list','title':'门店营业概况信息'},
          {'router':'survey-exchange',isauth: 'survey_exchange', 'name':'交班记录','icon':'exchange','title':'营业员交接班记录表'}
        ]},{
        'name':'销售报表',
        list:[
          {'router':'survey-salesFlow', isauth: 'survey_sales_flow', 'name':'商品销售流水','icon':'sales_form','title':'商品销售流水表信息'},
          {'router':'survey-salesAnalysis', isauth: 'survey_sales_analysis', 'name':'商品销售分析','icon':'sales_analysis','title':'商品销量、销售额排名'}
        ]},{
        'name':'库存报表',
        list:[
          {'router':'survey-deposit', isauth: 'survey_deposit', 'name':'寄存流水表','icon':'dosipot','title':'顾客寄存流水记录'},
          {'router':'survey-particulars', isauth: 'survey_particulars', 'name':'出入库明细表','icon':'particulars','title':'商品的出入库明细'},
          {'router':'survey-buy-sale-base', isauth: 'survey_buy-sale-base', 'name':'进销存流水表','icon':'buy-sale-base','title':'商品的进销存流水记录'}
        ]}]
    }
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      vm.reload()
    })
  },
  methods:{
    goList(url,type){
      if(url == 1){
        this.$message.success('敬请期待！！！')
      }else{
        // ,query:{type:type||''}
        this.$router.push({name:url})
      }
    },
    hasName(auths) {
      if (auths && auths.length > 0) {
        const flag = auths.some(item => {
          return this.isAuthMenu(item.isauth || '')
        })
        return flag
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss">
.th-size {
  font-size: 40px;
}
.allBox {
  // display: inline-block;
}
.listY {
  font-size: 16px;
  color: #535353;
}
.listY1{
  overflow: hidden;
}
.listY1 .listBox {
  width: 250px;
  height: 100px;
  float: left;
  margin: 20px 20px 20px 0;
  background: #fff;
  padding: 30px 0 30px 30px;
  cursor: pointer;
}
.listY1 .listBox:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,.2)
}
.imgs {
  margin-right: 15px;
  float: left;
  width: 50px;
}
.imgs img {
  width: 50px;
  height:45px;
}
.imgTitle .name {
  margin-bottom: 15px;
  font-size: 16px;
  color: #7F7F7F;
}
.imgTitle .title {
  font-size: 13px;
  color: #ABABAB;
}
</style>
