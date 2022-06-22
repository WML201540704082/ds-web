<template>
<el-dialog
  title="选择技师"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    height="300"
    ref="serviceTableList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="index"
      width="55"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      width="150"
      :show-overflow-tooltip="true"
      label="技师">
    </el-table-column>
    <el-table-column
      prop="phone"
      align="center"
      min-width="120"
      :show-overflow-tooltip="true"
      label="手机号">
    </el-table-column>
    <el-table-column
      prop="photo"
      min-width="100"
      :show-overflow-tooltip="true"
      label="头像">
      <template slot-scope="scope">
        <img class="header-photo" :src="getPhoto(scope.row)" alt="头像" />
      </template>
    </el-table-column>
    <el-table-column
      prop="gender"
      min-width="100"
      :show-overflow-tooltip="true"
      label="性别">
      <template slot-scope="scope">
        <span>{{scope.row.gender === 'FEMALE' ? '女' : (scope.row.gender === 'MALE' ? '男' : '--')}}</span>
      </template>
    </el-table-column>
  </el-table>
  <!-- <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/> -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { getAdjustmentList } from '@/service/goods'
// import gtPagination from '@/components/gt-pagination'
import _ from 'lodash'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      currentPageSelect: [],
      total: 0,
      pageSize: 10000,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      selectedList: [],
      changePage: false
    }
  },
  // components: {
  //   gtPagination,
  // },
  methods: {
    async init (techList) {
      this.visible = true
      this.currentPage = 0
      this.selectedList = techList || []
      this.changePage = true
      this.getAdjustment()
    },
    // 获取技师列表
    async getAdjustment() {
      this.dataListLoading = true
      const { data } = await getAdjustmentList({
        status: 'ENABLE',
        page: this.currentPage,
        size: this.pageSize
      })
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => (item.id == row.id))
              if (currentRow) {
                this.$refs.serviceTableList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.$message.error(data.data.error)
      }
      this.dataListLoading = false
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.serviceTableList.toggleRowSelection(row)
    },
    getPhoto(row) {
      if (row.photo) {
        return `https://${row.photo}`
      } else if (row.gender === 'FEMALE') {
        return 'static/img/goods/female.png'
      } else {
        return 'static/img/goods/male.png'
      }
    },
    // 获取技师选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => (ele.id == item.id))
        })
        const select = newList.concat(pushList)
        this.selectedList = select
      }
    },
    // pagination_event(val) {
    //   this.pageSize = val.pageSize
    //   this.currentPage = val.currentPage
    //   this.changePage = true
    //   this.getAdjustment()
    // },
    // 表单提交
    dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        this.$emit('refreshData', this.selectedList)
        this.visible = false
      }else{
        this.visible = true
        this.$message.warning('请先选择技师')
      }
    },
  }
}
</script>
<style lang="scss">
  .select-goods-dailog{
    .gt-pagination{
      text-align: right;
    }
    .header-photo{
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
  }
</style>
