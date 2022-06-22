<template>
  <div>
    <div v-for="item in labels" :key="item.name" class="allBox">
      <div class="listY">{{item.name}}</div>
      <div class="listY1">
        <div class="listBox" v-for="item1 in item.list" :key="item1.name" @click="goList(item1.router)">
          <span class="imgs"><img :src="item1.img" alt=""></span>
          <span class="imgTitle">
            <div class="name">{{item1.name}}</div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'page-shortmessage-template',
  data(){
    return{
      labels:[{
        name:'生日关怀',
        list:[{'name':'顾客本人生日','img':'static/img/campaign/shortmessage/campaignBirthOwn.png'},
          {'name':'宝宝生日','img':'static/img/campaign/shortmessage/campaignBirthBaby.png'}
        ]},{
        name:'复购邀请',
        list:[{'name':'1个月未到店','img':'static/img/campaign/shortmessage/campaignNoneOne.png'},
          {'name':'3个月未到店','img':'static/img/campaign/shortmessage/campaignNoneThree.png'},
          {'name':'很久未到店','img':'static/img/campaign/shortmessage/campaignNoneLong.png'}
        ]},{
        name:'节日问候',
        list:[{'name':'周年庆','img':'static/img/campaign/shortmessage/campaignStoreYear.png'},
          {'name':'新年祝福','img':'static/img/campaign/shortmessage/campaignFu.png'},
          {'name':'三八妇女节','img':'static/img/campaign/shortmessage/campaignWomen.png'},
          {'name':'五一劳动节','img':'static/img/campaign/shortmessage/campaignWorker.png'},
          {'name':'六一儿童节','img':'static/img/campaign/shortmessage/campaignChildren.png'},
          {'name':'国庆节','img':'static/img/campaign/shortmessage/campaignCountry.png'}
        ]},{
        name:'其他',
        list:[{'name':'新建模板','img':'static/img/campaign/shortmessage/campaignAdd.png'}]
      }]
    }
  },
  methods:{
    goList(url){
      this.$router.push({name:url})
    }
  }
}
</script>
<style lang="scss">
.allBox {
  display: inline-block;
}
.listY {
  font-size: 16px;
  color: #535353;
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
  margin-top: 15px;
  font-size: 16px;
  color: #7F7F7F;
}
</style>

