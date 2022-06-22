<template>
  <div class="mod-store mod-menu sysItems">
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('sys:menu:list')" type="create" @click.native="addOrUpdateHandle()"/>
      <el-table
        :data="dataList"
        border
        v-table-height
        :stripe="true">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <table-tree-column
          prop="name"
          header-align="center"
          treeKey="id"
          :show-overflow-tooltip="true"
          width="150"
          label="名称">
        </table-tree-column>
        <el-table-column
          prop="parentName"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          width="120"
          label="上级菜单">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="图标">
          <template slot-scope="scope">
            <icon-svg :name="scope.row.icon || ''"></icon-svg>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum"
          header-align="center"
          align="center"
          label="排序号">
        </el-table-column>
        <el-table-column
          prop="url"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="菜单URL">
        </el-table-column>
        <el-table-column
          prop="perms"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="授权标识">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹窗, 新增 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column'
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  created () {
    if(this.isAuth('sys:menu:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/company/sysMenu/list'),
        method: 'get',
        selfHandleError: true,
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data && data.code == 0){
          this.dataList = treeDataTranslate(data.data, 'id')
          this.dataListLoading = false
        }
        this.dataListLoading = false
      })
    },
    // 新增
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>
