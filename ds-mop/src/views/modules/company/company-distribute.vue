<template>
  <div class="mod-store page-company-distribute">
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle('create', null)"/>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading"
        v-table-height>
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle('view', scope.row.id)">查看</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle('edit', scope.row.id)">编辑</el-button>
            <!-- <span>|</span> -->
            <!-- <el-button class="nopadding" type="text" size="small" @click="support(scope.row.id)">进件</el-button> -->
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="autoClac"
          min-width="100"
          class-name="switch-open"
          :show-overflow-tooltip="true"
          label="T+1结算">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.autoClac"
              @change="e => changePhone(e, scope.row, scope.$index)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="certifId"
          min-width="180"
          :show-overflow-tooltip="true"
          label="身份证">
        </el-table-column>
        <el-table-column
          prop="artifNm"
          min-width="100"
          label="开户人姓名">
        </el-table-column>
         <el-table-column
          prop="mobileNo"
          min-width="160"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="bankNm"
          min-width="100"
          label="银行">
        </el-table-column>
        <el-table-column
          prop="capAcntNo"
          min-width="200"
          label="银行卡号">
        </el-table-column>
        <el-table-column
          prop="accountId"
          min-width="150"
          label="开户ID">
        </el-table-column>
      </el-table>
    </el-card>
    <company-distribute-modal ref="distributeModal" @refreshData="getDataList(companyId)" />
    <!-- <company-distribute-support ref="distributeSupport" @refreshData="getDataList(companyId)"/> -->
    <gt-chphone v-if="chPhone" ref="refPhone" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import { filterStatus, filterColor, fileDownload } from '@/utils'
import companyDistributeModal from './company-distribute-modal'
// import companyDistributeSupport from './company-distribute-support'
import gtChphone from './component/changePhone'
export default {
  name: 'company-distribute',
  data () {
    return {
      dataList: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      dataListLoading: false,
      chPhone:false,
    }
  },
  components: {
    companyDistributeModal,gtChphone
  },
  created() {
    this.companyId = this.$route.query.id
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/userAccount/list'),
        method: 'get',
        params: this.$http.adornParams({
          companyId: this.companyId,
        })
      })
      if (data.code === 0) {
        this.dataList = data.data.map(item => {
          return {
            ...item,
            autoClac: item.autoClac === '1'
          }
        })
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    addOrUpdateHandle (type, id) {
      this.$nextTick(() => {
        this.$refs['distributeModal'].init(type, id, this.companyId)
      })
    },
    // 进件
    support (id) {
      this.$nextTick(() => {
        this.$refs['supportModal'].init(id, this.companyId)
      })
    },
    changePhone(value, row, index){
      this.dataList[index].autoClac = !value
      this.chPhone = true
      this.$nextTick(() => {
        this.$refs.refPhone.init(row)
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
@import '~@/assets/scss/store/store.scss';
.page-company-distribute{
  .switch-open{
    .cell{
      padding: 5px 0 !important;
      .el-switch{
        padding-left: 0 !important;
      }
    }
  }
}
</style>

