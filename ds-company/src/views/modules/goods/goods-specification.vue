<template>
  <section class="page-goods-spec">
    <el-card>
      <gt-border-button type="create" @click.native="() => addOrUpdateHandle()" style="float: left;margin-top: -5px;margin-bottom: 7px;"/>
      <!-- table列表 -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        v-table-height
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
          width="120"
          label="操作" v-if="isAuth('product:pSpecAttrKey:update')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="160"
          :show-overflow-tooltip="true"
          label="规格名称">
        </el-table-column>
        <el-table-column
          prop="specValues"
          :show-overflow-tooltip="true"
          min-width="280"
          label="规格值">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.values ? scope.row.values.join(',') : ''}}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="sequence"
          min-width="160"
          style="text-align:center"
          label="排序">
          <template slot-scope="scope">
            <span style="cursor: pointer;" v-show="editId !== scope.row.id" @click="() => changeInput(scope.row.id)">{{scope.row.sequence}}</span>
            <el-input v-show="editId === scope.row.id" class="edit-input" @blur="e => updateSpecKey(scope.row, e.target.value)" v-model="scope.row.sequence"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="padding: 0">
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-col>
    </el-card>
    <add-or-update ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import addOrUpdate from './components/goods-specification-modal'
import * as api from '@/service/goods'
export default {
  name: 'goods-goods-specification',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      editId: null
    }
  },
  components: {
    gtPagination, addOrUpdate
  },

  async created() {
    // 获取商品列表
    this.getDataList()
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      vm.reload()
    })
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getSpecKeyList({
        page: this.currentPage,
        size: this.pageSize
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.msg)
        this.dataList = []
        this.total = 0
      }
      this.dataListLoading = false
    },
    changeInput(id) {
      this.editId = id
    },
    async updateSpecKey(item, value) {
      var CS = /^[0-9]+$/
      if (Number(value) && CS.test(value) && value <=127) {
        try {
          this.dataListLoading = true
          const { data } = await api.updateSpecKey({
            id: item.id,
            name: item.name,
            sequence: value,
          })
          if (data.code === 0) {
            this.getDataList()
            this.$message.success('修改排序成功')
          } else {
            this.$message.error(data.msg)
          }
          this.editId = null
        } catch (error) {
          this.dataListLoading = false
        }
      } else {
        this.$message.error('只能输入正整数并且最大支持127')
      }
    },
    // 修改
    addOrUpdateHandle (type, id) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(type, id)
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
<style lang="scss">
  .page-goods-spec{
    .edit-input{
      .el-input__inner{
        width: 90px;
      }
      padding: 0 !important;
    }
  }

</style>

