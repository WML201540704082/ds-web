<template>
  <div class="mod-store modStore page-settings-data">
    <el-card>
      <gt-subtitle title="数据导入" style="display: block;"/>
      <el-form :inline="true" class="mode-form-line1" label-width="120px">
        <el-form-item v-if="newStore == 'false'" label="文件类型">
          <el-select v-model="type" placeholder="请选择文件类型">
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? importHasOrderType : importType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" label="文件类型">
          <el-select v-model="type" placeholder="请选择文件类型">
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? importHasOrderType : importType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item v-if="newStore == 'true'&& companyRoleName !='数据运维（技术服务）'" label="文件类型">
          <el-select v-model="type" placeholder="请选择文件类型">
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? newimportHasOrderType : newimportType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <gt-file-upload :fileList="fileList" @finishUpload="finishUpload">
            <gt-button size="default" type="import" txt="导入" @click.native="importFile()" />
            <gt-button v-if="type === 'PRODUCT'" class="download-goods" size="default" txt="下载商品模板" download="企业运营平台商品清单模板" @click.native="() => exportExcel(type)"/>
            <gt-button v-else-if="type === 'CUSTOMER'" class="download-goods" size="default" txt="下载顾客模板" download="顾客模板" @click.native="() => exportExcel(type)"/>
            <gt-button v-else-if="type === 'STORE_STOCK'" class="download-goods" size="default" txt="下载门店库存模板" download="门店库存模板" @click.native="() => exportExcel(type)"/>
            <gt-button v-else-if="type === 'STORE_REQ_STOCK'" class="download-goods" size="default" txt="下载首铺货订货单模板" download="首铺货订货单模板" @click.native="() => exportExcel(type)"/>
            <gt-button v-else-if="type === 'STORE_REQ_ALL_STOCK'" class="download-goods" size="default" txt="下载订货单套餐模板" download="下载订货单套餐模板" @click.native="() => exportExcel(type)"/>
            <gt-button v-else class="download-goods" size="default" txt="下载寄存模板" download="寄存模板" @click.native="() => exportExcel(type)"/>
          </gt-file-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="currentList"
        border
        v-show="currentList && currentList.length > 0"
        :stripe="true"
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
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="文件类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, importHasOrderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="150"
          align="center"
          :show-overflow-tooltip="true"
          label="文件名称">
        </el-table-column>
        <el-table-column
          prop="percentage"
          min-width="100"
          :show-overflow-tooltip="true"
          label="导入进度">
          <template slot-scope="scope">
            <el-progress :percentage="getPercentage(scope.row)"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-subtitle title="导入历史" style="display: block;"/>
      <!-- 查询条件 -->
      <el-form :model='form' :inline="true" ref='form' class="mode-form-line1" label-width="120px" @keyup.enter.native="resetForm('search')">
        <el-form-item label="导入类型" prop='type' v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'">
          <el-select v-model="form.type" placeholder="请选择导入类型" >
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? importHasOrderType : importType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入类型" prop='type' v-if="newStore == 'false'">
          <el-select v-model="form.type" placeholder="请选择导入类型" >
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? importHasOrderType : importType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入类型" prop='type' v-if="newStore == 'true'&& companyRoleName !='数据运维（技术服务）'">
          <el-select v-model="form.type" placeholder="请选择导入类型" >
            <el-option
              v-for="item in (companyRoleName == '销管' && newStore == 'true' ? newimportHasOrderType : newimportType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="form.startTime"
            @changeStartValue="value => form.startTime = value"
            :end-time-value="form.endTime"
            end-time-prop="endTime"
            @changeEndValue="value => form.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
      <el-table
        :data="historyList"
        border
        :stripe="true"
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
          prop="index"
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewDetail(scope.row.id)">查看导入结果</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="newStore == 'true'&& companyRoleName !='数据运维（技术服务）'"
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="文件类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, newimportHasOrderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="newStore == 'false'"
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="文件类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, importHasOrderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
         v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'"
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="文件类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, importHasOrderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="150"
          align="center"
          :show-overflow-tooltip="true"
          label="文件名">
        </el-table-column>
        <el-table-column
          prop="startTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="导入时间">
        </el-table-column>
        <el-table-column
          prop="operator"
          :show-overflow-tooltip="true"
          min-width="120"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="result"
          :show-overflow-tooltip="true"
          min-width="120"
          label="导入结果">
          <template slot-scope="scope">
            <span>成功<span style="color: green;">{{scope.row.success}}</span>条， 失败 <span style="color: red;">{{scope.row.failed}}</span>条</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <data-error-modal ref="dataErrorModal" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtSubtitle from '@/components/gt-sub-title'
import { addImportTask, currentTask, historyTaskList, taskErrorList } from '@/service/setting'
import { newimportType,importType,importHasOrderType,newimportHasOrderType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import gtFileUpload from '@/components/gt-file-upload'
import dataErrorModal from './data-error-modal'
import { getStore } from '@/utils/storage'
export default {
  name: 'settings-data',
  data () {
    return {
      productTemplateUrl: window.SITE_CONFIG['productTemplateUrl'],
      customerTemplateUrl: window.SITE_CONFIG['customerTemplateUrl'],
      depositTemplateUrl: window.SITE_CONFIG['depositTemplateUrl'],
      storestockTemplateUrl: window.SITE_CONFIG['storestockTemplateUrl'],
      stockOrderTemplateUrl: window.SITE_CONFIG['stockOrderTemplateUrl'],
      fileList: [], // 当前选中的文件
      currentList: [],
      historyList: [],
      type: 'CUSTOMER',
      historyListLoading: false,
      currentListLoading: false,
      filterStatus,
      importType,
      importHasOrderType,
      newimportHasOrderType,
      newimportType,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      timeId: null,
      form: {
        type: 'CUSTOMER',
        startTime: '',
        endTime: ''
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtFileUpload,
    dataErrorModal,
    gtSubtitle
  },
  created () {
    // 获取员工角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    this.getHistoryList()
    this.getCurrentList()
  },
  mounted () {
    this.timeId = setInterval(() => {
      this.getHistoryList()
      this.getCurrentList()
    },10000)
  },

  destroyed () {
    clearInterval(this.timeId)
    this.timeId = null
  },

  methods: {
    async exportExcel(type) {
      if(type === 'PRODUCT'){
         window.open(window.SITE_CONFIG['productTemplateUrl'])
      }else if(type === 'CUSTOMER'){
       window.open(window.SITE_CONFIG['customerTemplateUrl'])
      }else if(type === 'STORE_STOCK'){
       window.open(window.SITE_CONFIG['storestockTemplateUrl'])
      }else if(type === 'STORE_REQ_STOCK'){
       window.open(window.SITE_CONFIG['stockOrderTemplateUrl'])
      }else if(type === 'STORE_REQ_ALL_STOCK'){
       window.open(window.SITE_CONFIG['stockOrderTemplateUrl'])
      }else {
       window.open(window.SITE_CONFIG['depositTemplateUrl'])
      }
     
    },
    // 获取历史列表
    async getHistoryList() {
      this.historyListLoading = true
      const {data} = await historyTaskList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.form
      })
      this.historyListLoading = false
      if (data && data.code === 0) {
        this.historyList = data.data.records
        this.total = data.data.total
      } else {
        this.historyList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    // 获取当前进度
    getPercentage(item) {
      let percetage = 0
      if (item.total !== 0) {
        percetage = (item.failed + item.success) / item.total * 100
      }
      return Number(percetage.toFixed(2))
    },

    // 获取当前导入列表
    async getCurrentList() {
      this.currentListLoading = true
      const {data} = await currentTask()
      this.currentListLoading = false
      if (data && data.code === 0) {
        this.currentList = data.data
      } else {
        this.currentList = []
        this.$message.error(data.msg)
      }
    },

    viewDetail(id) {
      this.$nextTick(() => {
        this.$refs['dataErrorModal'].init(id)
      })
    },

    pagination_event(val) {
      this.page = val.pageSize
      this.currentPage = val.currentPage
      this.getHistoryList()
    },

    // 上传文件完成
    finishUpload(fileList) {
      this.fileList = fileList
    },

    // 导入文件
    async importFile() {
      if (this.fileList && this.fileList.length > 0) {
        const file = this.fileList[0]
        let fileForm = new FormData()
        fileForm.append('file', file)
        fileForm.append('type', this.type)
        const { data } = await addImportTask(fileForm)
        if (data.code === 0) {
          this.getCurrentList()
          this.fileList = []
        } else {
          this.$message.error(data.msg)
        }
      } else {
        this.$message.warning('请先选择文件')
      }
    },

    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['form'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getHistoryList()
    },
  }
}
</script>
<style lang="scss">
.page-settings-data{
  .el-table__row{
    .el-progress{
      padding: 0 !important;
      .el-progress-bar{
        padding: 0 50px 0 0 !important;
      }
    }
  }
}
</style>
