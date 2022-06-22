<template>
  <div class="mod-store">
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="新增加料模板" type="create" @click.native="() => newOrEditTemplate()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        v-table-height
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="name"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="模板名称">
        </el-table-column>
        <el-table-column
          min-width="100"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewTemplate(scope.row.id)">查看</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="newOrEditTemplate(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="deleteTemplate(scope.row.id,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="feedQuantity"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="加料数量">
        </el-table-column>
        <el-table-column
          prop="drinkQuantity"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="应用商品数量">
        </el-table-column>
      </el-table>
      <meterial-template-view v-if="viewTemplateVisible" ref="meterialTemplateView" @refreshDataList="getDataList"/>
      <new-meterial-template v-if="newTemplateVisible" ref="newMeterialTemplate" @refreshDataList="getDataList"/>
    </el-card>
  </div>
</template>
<script>
import { materialTemplateList,deleteMaterialTemplate } from "@/service/goods";
import meterialTemplateView from './meterial-template-view'
import newMeterialTemplate from './new-material-template'
export default {
  name: 'goods-material-template',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      newTemplateVisible: false,//新增编辑加料模板
      viewTemplateVisible: false,//查看加料模板
    }
  },
  created() {
    this.getDataList()
  },
  components: {
    newMeterialTemplate,
    meterialTemplateView
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await materialTemplateList({
      })
      if (data.code === 0) {
        this.dataList = data.data
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 新增编辑加料模板
    newOrEditTemplate(id){
      this.newTemplateVisible = true
      this.$nextTick(() => {
        this.$refs.newMeterialTemplate.init(id)
      })
    },
    // 查看加料模板
    viewTemplate(id){
      this.viewTemplateVisible = true
      this.$nextTick(() => {
        this.$refs.meterialTemplateView.init(id)
      })
    },
    // 删除加料模板
    deleteTemplate(id,name){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除 "' + name + '" 加料模板吗？删除后所有应用该模板的饮料都会受到影响，请谨慎操作',
        confirm: async () => {
          const { data } = await deleteMaterialTemplate(id)
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
    }
  }
}
</script>