<template>
  <section class="page-goods-tea mod-store">
    <el-card>
        <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
        <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        ref="goodsTableList"
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
          align="center"
          min-width="60"
          :show-overflow-tooltip="true"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="detailOrUpdateHandle(scope.row.id)">查看</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          </template>
          </el-table-column>
        <el-table-column
          prop="name"
          min-width="60"
          :show-overflow-tooltip="true"
          label="分类名称">
        </el-table-column>
         <el-table-column
          prop="sequence"
          min-width="60"
          :show-overflow-tooltip="true"
          label="终端排序">
           <template slot-scope="scope">
            <span>{{scope.row.sequence ? scope.row.sequence: '--'}}</span>
          </template>
        </el-table-column>
         <el-table-column
          prop="mark"
          min-width="60"
          :show-overflow-tooltip="true"
          label="分类标记">
          <template slot-scope="scope">
            <span >{{scope.row.mark=="EMPTY" ? '无' : scope.row.mark}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pic"
          min-width="60"
          :show-overflow-tooltip="true"
          label="分类图片">
          <template slot-scope="scope"  style="width:56px;height:56px">
              <img :src="'http://' + scope.row.pic" alt="" v-if="scope.row.pic"  style="width:56px;height:56px">
              <span class="itemInput" v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    <!-- <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/> -->
    </el-card>
    <add-or-update ref="addOrUpdate" @refreshBrand="getDataList"></add-or-update>
  
  </section>    
</template>
<script>
import * as api from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import addOrUpdate from './components/goods-tea-category-modal'

export default {
  name: 'goods-store-tea',
  data () {
    return {
      // filterForm: {
      //   key: null,
      // },
      // total: 0,
      // pageSize: 20,
      // currentPage: 0,
      pageSize:10000,
      dataList:[],
      dataListLoading: false,

    }
  },
  components: {
    gtPagination,addOrUpdate
  },
  async created(){
      this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getTeaManager({
        page: 0,
        size: this.pageSize,
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.msg)
        this.dataList = []
        // this.total = 0
      }
      this.dataListLoading = false
    },
    
    addOrUpdateHandle(data){
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    detailOrUpdateHandle(id){
      this.$router.push({ name: "goods-tea-category-view", query: { id } });
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        // this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
    // //分页
    // pagination_event(val) {
    //   this.pageSize = val.pageSize
    //   this.currentPage = val.currentPage
    //   this.getDataList()
    // },
  },
}
</script>
<style lang="scss">
  .page-goods-tea{
    .edit-input{
      .el-input__inner{
        width: 90px;
      }
      padding: 0 !important;
    }
  }
</style>