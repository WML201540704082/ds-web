<template>
  <div class="mode-store-table" style="margin: 10px 0;margin-bottom: 3px;">
     <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="handdle(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="卡名称">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          min-width="150"
          :show-overflow-tooltip="true"
          label="卡号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="办理时间">
        </el-table-column>
        <el-table-column
          prop="content"
          min-width="180"
          :show-overflow-tooltip="true"
          label="卡项内容">
          <template slot-scope="scope">
            <span v-if="scope.row.content">{{scope.row.content.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="有效期">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="left"
          min-width="180"
          :show-overflow-tooltip="true"
          label="剩余次数">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
          <template slot-scope="scope">
            <span v-if="scope.row.storeName">{{scope.row.storeName.join(',')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

      <gt-card-detail ref="detail" />
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtCardDetail from './recordsDetail'
import { statCardList } from '@/service/mycustomer'
export default {
  components: {gtPagination,gtCardDetail},
  data(){
    return{
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
    }
  },
  watch:{
    types:{
      handler(val,oldval){
        console.log(val)
        this.currentPage = 0
        this.pageSize = 20
        this.getDataList(val)
      },
      deep: true
    }
  },
  props:['types','customerid'],
  created(){
    this.getDataList('')
  },
  methods:{
    async getDataList(type){
      var use = ''
      if(type=='USE'){
        use = type=='USE'?'NO':'YES'
        type = ''
      }else if(type=='NORMAL'||type=='INVALID'){
        use = 'YES'
      }
      const {data} = await statCardList({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
        'status': type,
        'use':use
      })
      if(data.code == 0){
        // this.dataList = data.data.records
        // this.dataList.map(item=>{
        //   item.content = []
        //   item.items.map(o=>{
        //     item.content.push(o.name+'*'+o.total)
        //   })

        //   item.storeName = []
        //   item.stores.map(o =>{
        //     item.storeName.push(o.name)
        //   })
        // })
        const dataList = data.data.records.map(item => {
          let content = item.items && item.items.length > 0 ? item.items.map(o => {
            return o.name + '*' + o.total
          }) : []
          let storeName = item.stores && item.stores.length > 0 ? item.stores.map(s => s.name) : []
          return {
            ...item,
            content,
            storeName
          }
        })
        this.dataList = dataList
        this.total = data.data.total
      }else{
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }

    },
    handdle(row) {
      this.$nextTick(() => {
        this.$refs.detail.init(row.id,row)
      })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList(this.types)
    },
  }
}
</script>


