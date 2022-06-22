<template>
  <div class="mod-role sysItems mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="消息类型" prop='messageEnum'>
          <el-select v-model="form.messageEnum" placeholder="请选择消息类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in sysMessageType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <el-table
        :data="dataList"
        border
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
          prop="companyName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="messageEnum"
          min-width="120"
          label="消息类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.messageEnum, sysMessageType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="提醒时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime ? moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="messageContent"
          min-width="180"
          :show-overflow-tooltip="true"
          label="消息内容">
        </el-table-column>
      </el-table>
       <gt-pagination :isorder="1" :total="total" :currentPage="page" :pageSize="size" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import { sysMessageType } from '@/utils/dict'
import { filterStatus } from '@/utils'
import { getMessageList } from '@/service/settings'
import gtPagination from '@/components/gt-pagination'
export default {
  name:'sys-message',
  data () {
    return {
      form: {
        messageEnum:'',
      },
      dataList: [],
      page: 0,
      size: 20,
      total: 0,
      moment,
      filterStatus,
      sysMessageType,//消息类型
      dataListLoading: false,
    }
  },
  components: {
    gtPagination
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList () {
      this.dataListLoading = true
      const { data } = await getMessageList({
        ...this.form,
        page: this.page,
        size: this.size
      })
      if(data && data.code == 0){
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 修改分页
    pagination_event (val){
      this.size = val.pageSize
      this.page = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm (isSearch) {
      if(isSearch != 'search'){
        this.$refs['form'].resetFields()
      }
      this.size = 20
      this.page = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/store/store.scss';
</style>
