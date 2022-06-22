<template>
  <div class="mod-store">
    <el-card>
      <el-form :model="secondAdvertisement" :inline="true" ref='secondAdvertisement' class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="适用门店" prop='storeId'>
          <el-select v-model="secondAdvertisement.storeId" placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar" style="float:right">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" @click.native="() => createSecondAd(type)"/>
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
          min-width="140"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="createSecondAd(type,scope.row.id)">编辑</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="deleteSecondAd(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          min-width="180"
          :show-overflow-tooltip="true"
          label="图片标题">
        </el-table-column>
        <el-table-column
          prop="advertisementUrl"
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="图片">
          <template slot-scope="scope">
            <img v-if="scope.row.advertisementUrl" style="width:50px;height:50px" :src="'http://'+scope.row.advertisementUrl" alt="图片" @click="openImgPic('innerPic',scope.row.advertisementUrl)"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          min-width="180"
          :show-overflow-tooltip="true"
          label="链接"
          v-if="type == 'yunHome'">
        </el-table-column>
        <el-table-column
          prop="storeNames"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
      <gt-secondAd v-if="secondAdVisible" ref="secondAd" @refreshDataList="getDataList"/>
    </el-card>
  </div>
</template>
<script>
import { getStoreList } from '@/service/systore'
import { getBannerPage,deleteSecondBanner } from '@/service/advertisement'
import gtPagination from '@/components/gt-pagination'
import gtSecondAd from './secondIndexAd'
export default {
  name: 'settings-advertisement-advertisementIndex',
  data() {
    return {
      storeList: [],
      secondAdvertisement:{
        storeId:'',
      },
      dataList:[],
      dataListLoading: false,
      secondAdVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      showImgPic: null,
      type: null,
    }
  },
 
  created() {
   
  },
  components: {
    gtPagination,gtSecondAd
  },
  methods:{
    initData(selectAdvertisement){
      this.type = selectAdvertisement
      // 获取门店列表
      this.getStoreList()
      // 获取数据列表
      this.getDataList()
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getBannerPage({
        ...this.secondAdvertisement,
        type: this.type == 'yunHome' ? 0 : this.type == 'yunClassify' ? 2 : 1,
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
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.secondAdvertisement[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    //新增or编辑广告
    createSecondAd(type,id){
      this.secondAdVisible = true
      this.$nextTick(() => {
        this.$refs.secondAd.init(type,id)
      })
    },
    //删除广告
    deleteSecondAd(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该条广告',
        confirm: async () => {
          const { data } = await deleteSecondBanner(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['secondAdvertisement'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>