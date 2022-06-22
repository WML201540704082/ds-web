<template>
  <section class="page-goods-spec">
    <el-card>
      <gt-border-button type="create" @click.native="() => addGoodsHandle()" style="float: left;margin-top: -5px;margin-bottom: 7px;"/>
      <!-- table列表 -->
      <el-table
        :data="goodsList"
        border
        :stripe="true"
        v-table-height
        max-height="420"
        :default-sort = "{prop: 'rank', order: 'ascending'}"
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          :show-overflow-tooltip="true"
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="handleEdit(scope.$index, goodsList)">编辑</el-button> -->
            <el-button
              size="small"
              class="nopadding"
              type="text"
              @click="handleDelete(scope.row, goodsList)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barcodes"
          align="center"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="rank"
          :show-overflow-tooltip="true"
          sortable
          label="排序(点击编辑)">
          <template slot-scope="scope">
            <span style="cursor: pointer;color:green" v-show="editId !== scope.row.id" @click="() => changeInput(scope.row.id)">{{scope.row.rank}}</span>
            <el-input v-show="editId === scope.row.id" class="edit-input" @blur="e => updategoodsGuess(scope.row, e.target.value)" v-model="scope.row.rank"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="padding: 0">
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-col>
    </el-card>
    <select-goods-modal ref="selectGoodsModal" @refreshData="changeGoods" @cancelBtn="cancelhandleBtn"/>
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import selectGoodsModal from '../components/guess-select-goods'
// import { getStoreList } from '@/service/systore'
import * as api from '@/service/goods'
export default {
  name: 'goods-goods-guess',
  data () {
    return {
      goodsList: [],// 商品列表
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      editId: null,
      newGoodsList:[]
    }
  },
  components: {
    gtPagination,selectGoodsModal
  },

  async created() {
    // this.getStorelist()
    // 获取商品列表
    this.getDataList()
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      vm.reload()
    })
  },
  methods: {
    // 编辑排序
    handleEdit(index,rows){
      console.log(index)

    },
    // 删除
    async handleDelete(row, rows) {
      await api.deleteGuessGoods(row.id)
      this.getDataList()
    },

    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      // 获取 猜你喜欢的商品列表
      const { data } = await api.getGuessGoodsList()
      if (data.code === 0) {
        this.$nextTick(() => {
          this.goodsList = data.data
          this.total =  data.data ? data.data.length : 0 
        })
      } else {
        this.$message.error(data.msg)
        this.goodsList = []
        this.total = 0
      }
      this.dataListLoading = false
    },
    
    // 新增商品
    async addGoodsHandle (type, id) {

      // 获取新的数据
      const { data } = await api.getGuessGoodsList()
      if (data.code === 0) {
        this.$nextTick(() => {
          this.goodsList = data.data 
          this.total =  data.data.length 
          data.data.map((item,index)=>{
            item.id = item.productId
          })
          this.newGoodsList = this.goodsList
          this.$nextTick(() => {
            this.$refs.selectGoodsModal.init('',this.newGoodsList)
          })

        })
      } else {
        this.$message.error(data.msg)
        this.goodsList = []
        this.total = 0
      }
    },
    // 
    cancelhandleBtn(){
      this.getDataList()
    },
    // 获取选中商品的列表
    async changeGoods(list) {
      if (list && list.length <=20) {
        let newList = []
        list.map( (item,index)=>{
          let _item = {}
					_item.rank = index+1
					_item.productId = item.id
					_item.companyId =  item.companyId
					_item.name =  item.name
					_item.barcodes =  item.barcodes
					_item.cover =  item.cover
          _item.linePicture = item.linePicture
          _item.retailPrice  =  item.retailPrice 
          return newList.push(_item)
        })
        const { data } = await api.guessLikeSave(newList)
        if (data.code === 0) {
          this.$message.success('序号重新排序')
          this.getDataList()
          this.total = this.goodsList.length
        } else {
          this.$message.warning(data.msg)
          return
        }
      } else {
        this.$message.warning('猜你喜欢最多20个商品!')
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    changeInput(id) {
      this.editId = id
    },
    async updategoodsGuess(item, value) {
      var CS = /^[0-9]+$/
      // Number(value) &&
      if ( CS.test(value)) {
        try {
          this.dataListLoading = true
          let res = {}
          let flagNum = 0 
          this.goodsList.map((item,index)=>{
            if(parseInt(value) === parseInt(item.rank)){
              flagNum++
            }
          })
          if(flagNum > 1){
            this.$message.error('修改排序失败,有相同排序值，请重新填写')
          }else{
            res = await api.editrank(item.id,{ rank:value})
            let {data} = res
            if (data.code === 0) {
              this.$message.success('修改排序成功')
              flagNum=0
            }else{
              this.$message.error(data.msg)
            }
          }
          this.editId = null
          this.getDataList()
        } catch (error) {
          this.dataListLoading = false
        }
      } else {
        this.editId = null
        this.getDataList()
        this.$message.error('只能输入整数')
      }
    },
  }
}
</script>
<style lang="scss">
  .page-goods-spec{
    .edit-input{
      .el-input__inner{
        width: 90px;
      }
      padding: 0 !important;
    }
  }

</style>

