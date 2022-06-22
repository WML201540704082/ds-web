<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="盘点编号" prop="orderNo" >
          <el-input v-model="filterForm.orderNo" placeholder="请输入盘点编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="盘点人姓名" prop="adjustEmployeeName" label-width="90px">
          <el-input v-model="filterForm.adjustEmployeeName" placeholder="请输入盘点人姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="盘点人手机号" prop="adjustUser" label-width="100px">
          <el-input v-model="filterForm.adjustUser" placeholder="请输入盘点人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="盘点日期">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="filterForm.startTime"
            :end-time-value="filterForm.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => filterForm.startTime = value"
            @changeEndValue="value => filterForm.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('store:checkStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
      <gt-border-button type="export" class="gt-table-create" txt="盘点商品导入" @click.native="() => upload()"/>
      <input id="upload" type="file" class="file-input" accept=".xls,.xlsx" @change="inputChange" style="display: none"/>
      <span class="download-template">
        <a class="download-goods" style="cursor:pointer" download="商品导入模板" :href="(storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL') ? templateUrl : templateTwoUrl">下载导入模板</a>
      </span>
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
          min-width="100"
          label="操作"
          v-if="isAuth('store:checkStock:list')">
          <template slot-scope="scope">
            <el-button v-if="isAuth('store:checkStock:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id, scope.row.batchNumber)">查看</el-button>
            <span v-if="scope.row.status == 'NOT'">|</span>
             <el-popover
              class="popover"
              placement="bottom"
              width="100" v-if="scope.row.status == 'NOT'">
              <el-button class="nopadding"  slot="reference" type="text" size="small" v-if="isAuth('store:checkStock:generateAdjust')||isAuth('store:checkStock:update')||isAuth('store:checkStock:delete')">更多</el-button>
              <div class="buttonOne buttonOne1" v-if="isAuth('store:checkStock:generateAdjust')" @click="generateAdjust(scope.row.id)" >生成调整单</div>
              <div class="buttonOne" v-if="isAuth('store:checkStock:update')" @click="addOrUpdateHandle(scope.row.id)" >编辑</div>
              <div class="buttonOne" v-if="isAuth('store:checkStock:delete')" @click="deleteAdjust(scope.row.id)" style="margin-bottom: 0">删除</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="150"
          :show-overflow-tooltip="true"
          label="盘点编号">
        </el-table-column>
        <el-table-column
          prop="adjustTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="盘点日期">
        </el-table-column>
        <!-- <el-table-column
          prop="batchNo"
          min-width="120"
          :show-overflow-tooltip="true"
          label="批次号">
        </el-table-column> -->
        <el-table-column
          prop="adjustUser"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盘点人">
          <template slot-scope="scope">
            <span>{{`${scope.row.adjustEmployeeName || '--'}/${scope.row.adjustUser || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="是否生成调整单">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'NOT'" size="small" type="danger">否</el-tag>
            <el-tag v-else size="small">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkStatus"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盘点状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.checkStatus, inventoryMainType))">{{filterStatus(scope.row.checkStatus, inventoryMainType)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <inventory-view v-if="viewVisible" ref="inventoryView"/>
    <data-error-modal ref="dataErrorModal" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { inventoryMainType } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { generateJustify, getInventoryList, deleteInventory, importInventory } from '@/service/stock'
import gtTimeRange from '@/components/gt-time-range'
import inventoryView from './component/inventoryView'
import dataErrorModal from './data-error-modal'
export default {
  name:'stockManagement-inventoryManagement',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      viewVisible: false,
      templateUrl: window.SITE_CONFIG['inventoryTemplateUrl'],
      templateTwoUrl: window.SITE_CONFIG['inventoryTemplateTwoUrl'],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      inventoryMainType,
      filterStatus,
      filterColor,
      filterForm:{
        orderNo: null,
        adjustUser: null,
        startTime: null,
        endTime: null
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    inventoryView,
    dataErrorModal
  },
  async created() {
    const { storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeType = storeType
    // 获取盘点列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getInventoryList({
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
    // 导出盘点清单
    async exportExcel() {
      const { data, headers } = await api.exportInventoryExcel({
        ...this.filterForm,
        size: 10000,
        page: 0
      })
      fileDownload(data, '盘点清单.xls')
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      if (id) {
        this.$router.push({name:'stockManagement-inventory-add', query: {id}})
      } else {
        if (this.dataList && this.dataList.length > 0) {
          const listItem = this.dataList[0]
          // 未生成调整单
          if (listItem.status === 'NOT') {
            this.$message.warning('有未生成调整单的盘点单，请先处理该盘点单')
          } else {
            this.$router.push({name:'stockManagement-inventory-add'})
          }
        } else {
          this.$router.push({name:'stockManagement-inventory-add'})
        }
      }
    },

    // 检查上传文件变化
    inputChange(e) {
      const uploadFiles = Array.from(e.target.files)
      let flag = false
      uploadFiles.forEach(file => {
        if (this.beforeCheck(file)){
          flag = true
        }
      })
      if (flag) {
        return
      }
      const result = Promise.all(uploadFiles.map(file => this.ajaxup(file)))
    },
    upload() {
      // 检查是否有未生成的调整单
      if (this.dataList.length > 0 ) {
        const flag = this.dataList[0].status === 'NOT'
        if(flag) {
          this.$message.warning('有未生成的调整单，请先处理！')
          return
        }
      }
      const ele = document.getElementById('upload')
      if (ele) {
        ele.click()
      }
    },
    // 检查单个文件
    beforeCheck(file) {
      // 检查文件大小
      let isLtSize = file.size / 1024 / 1024 <= 5
      if (!isLtSize) {
        this.$message.warning(`单个文件大小不允许超过${this.size}M`)
        return true
      }
      // 检查文件格式
      const fileName = file.name
      const suffixIndex=fileName.lastIndexOf('.')
      const suffix=fileName.substring(suffixIndex+1).toUpperCase()
      if (suffix!='CVS'&&suffix!='XLSX'&&suffix!='XLS') {
        this.$message.warning('文件类型必须是.xlsx,.xls中的一种')
        return true
      }
      return false
    },
    // 调用请求ajax
    ajaxup(file){
      // 清空input，防止两次不能传相同的文件
      let ele = document.getElementById('upload')
      ele.value = ''
      this.fileList = [file]
      if (file) {
        this.importFile()
      }
    },

    // 导入文件
    async importFile() {
      if (this.fileList && this.fileList.length > 0) {
        const file = this.fileList[0]
        let fileForm = new FormData()
        fileForm.append('file', file)
        fileForm.append('type', 'file-upload')
        const { data } = await importInventory(fileForm)
        if (data.code === 0) {
          this.fileList = []
          if (data.data && data.data.length > 0) {
            // 显示错误信息
            this.$nextTick(() => {
              this.$refs['dataErrorModal'].init(data.data)
            })
          } else {
            this.$message.success('导入成功！')
          }
          this.getDataList()
        } else {
          this.$message.error(data.msg)
        }
      } else {
        this.$message.warning('请先选择文件')
      }
    },

    // 生成调整单
    generateAdjust(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定生成调整单',
        confirm: async () => {
          const { data } = await generateJustify(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('生成调整单成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 删除盘点单
    deleteAdjust(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该盘点单？',
        confirm: async () => {
          const { data } = await deleteInventory(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除盘点单成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 查看
    storeViewHandle (id){
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.inventoryView.init(id)
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
  }
}
</script>
<style scoped>
.download-template{
  line-height: 20px;
  margin-left: 20px;
}
</style>

