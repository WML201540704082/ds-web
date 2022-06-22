<template>
  <div class="mod-store">
    <!-- 查询条件 -->
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="90px" :model="filterForm" @keyup.enter.native="resetForm('search')">
      <el-form-item label="发送场景" prop="sceneEnum">
        <el-select v-model="filterForm.sceneEnum" placeholder="请选择发送场景" clearable>
          <el-option label="全部" value="" ></el-option>
          <el-option
            v-for="item in shortmessageScenes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信主题" prop="title">
        <el-input placeholder="请输入短信主题" v-model="filterForm.title"></el-input>
      </el-form-item>
      <el-form-item class="search-toolbar" v-if="isAuth('company:product:list')">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>

    <!-- table列表 -->
    <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
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
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('company:product:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          <span>|</span>
          <el-button class="nopadding" type="text" size="small" @click="modifyStatus(scope.row.id, scope.row.status)">{{scope.row.status === 'ON' ? '停用' : '启用'}}</el-button>
          <span>|</span>
          <el-button class="nopadding" type="text" size="small" @click="deleteTemplate(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendScene"
        min-width="150"
        :show-overflow-tooltip="true"
        label="发送场景">
        <template slot-scope="scope">
          <span>{{filterStatus(scope.row.sendScene, shortmessageScenes)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        :show-overflow-tooltip="true"
        label="短信主题">
      </el-table-column>
      <!-- <el-table-column
        prop="content"
        min-width="200"
        :show-overflow-tooltip="true"
        label="模板内容">
      </el-table-column> -->
      <el-table-column
        prop="status"
        min-width="100"
        :show-overflow-tooltip="true"
        label="状态">
        <template slot-scope="scope">
          <span :class="filterColor(scope.row.status === 'ON' ? '启用' : '停用')">{{scope.row.status === 'ON' ? '启用' : '停用'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="createUser"
        width="120"
        :show-overflow-tooltip="true"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createDate"
        width="180"
        :show-overflow-tooltip="true"
        label="创建时间">
      </el-table-column> -->
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    <template-modal ref="templateModal" @refreshData="resetForm('search')" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import templateModal from './components/shortmessage-template-modal'
import { shortmessageScenes } from '@/utils/dict'
import moment from 'moment'
import { filterStatus, filterColor } from '@/utils'
import * as api from '@/service/campaign'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      shortmessageScenes,
      moment,
      filterStatus,
      filterColor,
      filterForm:{
        sceneEnum: '',
        title: ''
      },
    }
  },
  components: {
    gtPagination,
    templateModal
  },

  async created() {
    // 获取商品列表
    if(this.isAuth('company:product:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getShortmessageList({
        ...this.filterForm,
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

    // 新增 / 修改
    addOrUpdateHandle () {
      this.$nextTick(() => {
        this.$refs.templateModal.init()
      })
    },
    // 查看
    storeViewHandle (id){
      this.$nextTick(() => {
        this.$refs.templateModal.init(id)
      })
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
    // 删除
    deleteTemplate (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该短信模板？',
        confirm: async () => {
          const { data } = await api.deleteTemplate({id})
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
    // 启用、停用
    modifyStatus (id, status) {
      this.$easyConfirm.show({
        title: '提示',
        content: `确定${status === 'ON' ? '停用' : '启用'}该短信模板？`,
        confirm: async () => {
          const { data } = await api.updateTemplate({id})
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success(`${status === 'ON' ? '停用' : '启用'}成功`)
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
