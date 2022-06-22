<template>
  <div class="mod-store">
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="新增" @click.native="() => newShoppingCards()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewDetails(scope.row.id)">查看</el-button>
            <span v-if="scope.row.type == 'NORMAL'">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100">
              <el-button class="nopadding" v-if="scope.row.type == 'NORMAL'" slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" @click="newShoppingCards(scope.row.id)">编辑</div>
              <div class="buttonOne" @click="deleteShoppingCards(scope.row.id)">删除</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="购物卡名称">
          <template slot-scope="scope">
            <el-tooltip placement="top"  v-if="scope.row.type == 'GIFT'">
              <div slot="content">
                1.此卡是系统默认购物卡，不可进行删除；<br>
                2.卡内金额只能进行充值赠送，不可进行充值；<br>
                3. 赠送卡消费不计算员工业绩和提成
              </div>
              <span>
                {{scope.row.cardName}}
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt=""/>
              </span>
            </el-tooltip>
            <span v-else>{{scope.row.cardName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活动有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.validityType === 'ALWAYS'">永久有效</span>
            <span v-else>自发放之日起 {{scope.row.validityDays}} 天</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { deleteShoppingCard,getshoppingCardList } from '@/service/campaign'
export default {
  name: 'campaign-giftBag-giftBag',
  data(){
    return{
      dataList: [],
      dataListLoading: false,
      total: 0,
      giftBag:{
        name: null,
        type:'',
        status:''
      },
    }
  },
  components: {

  },
  async created() {
    // 获取列表
    this.getDataList()
  },
  methods:{
    //获取详情
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getshoppingCardList({
        ...this.giftBag,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //新增
    newShoppingCards(id){
      if (id) {
        this.$router.push({name:'campaign-intergralExchange-shoppingCards-newShoppingCards', query:{id:id}})
      } else {
        if (this.dataList.length < 6) {
          this.$router.push({name:'campaign-intergralExchange-shoppingCards-newShoppingCards'})
        } else {
          this.$message.warning('最多新增五条数据');
        } 
      }
    },
    //查看
    async viewDetails(id){
      this.$router.push({name:'shoppingCards-view', query: {id:id}})
    },
    //使失效
    async deleteShoppingCards(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除此购物卡？',
        confirm: async () => {
          const { data } = await deleteShoppingCard(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">

</style>