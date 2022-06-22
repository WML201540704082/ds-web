<template>
  <div class="mod-store">
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="新增加料信息" type="create" @click.native="() => viewMaterial()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        v-table-height
        :stripe="true"
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
          prop="name"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="加料名称">
        </el-table-column>
        <el-table-column
          min-width="100"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewMaterial(scope.row.id,'view')">查看详情</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="viewMaterial(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="deleteMaterial(scope.row.id,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="salePrice"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="加料价格">
          <template slot-scope="scope">
            <span v-if="scope.row.salePrice !== null">{{Number(priceNum(scope.row.salePrice)).toFixed(1)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      <material-view v-if="viewMaterialVisible" ref="materialTemplateView" @refreshDataList="getDataList"/>
    </el-card>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { materialList,deleteMaterial } from "@/service/goods";
import materialView from './material-view'//新增-编辑-查看
export default {
  name: 'goods-material',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      viewMaterialVisible: false,//新增-编辑-查看加料
      total: 0,
      pageSize: 20,
      currentPage: 0,
    }
  },
  created() {
    this.getDataList()
  },
  components: {
    gtPagination,
    materialView
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await materialList({
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 新增-编辑-查看加料
    viewMaterial(id,type){
      this.viewMaterialVisible = true
      this.$nextTick(() => {
        this.$refs.materialTemplateView.init(id,type)
      })
    },
    // 删除加料
    deleteMaterial(id,name){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除 "' + name + '" 加料吗？删除后所有应用该模板的饮料都会受到影响，请谨慎操作。',
        confirm: async () => {
          const { data } = await deleteMaterial(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$easyConfirm.hide()
            this.$message.error(data.msg)
          }
        }
      })
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>