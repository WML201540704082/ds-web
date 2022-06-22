<template>
  <section >
    <el-dialog
      title="门店列表"
      :close-on-click-modal="false"
      :visible.sync="visible"
      append-to-body>
      <el-form :inline="true" class="mode-form-line1" label-width="80px" @submit.native.prevent="searchForm" :model="form">
        <el-form-item label="门店名称" prop="key">
          <el-input v-model="form.key" placeholder="请输入门店关键字"></el-input>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="searchForm"/>
          <gt-button type="reset" @click.native="resetForm"/>
        </el-form-item>
      </el-form>
      <el-table
        :data="gridData"
        v-loading="dataListLoading"
        :stripe="true"
        ref="storeSelectionTable"
        @selection-change="selectionChangeHandle"
        @row-dblclick="doubleClick">
        <el-table-column
          type="selection"
          header-align="center"
          :selectable="selectable"
          align="center">
        </el-table-column>
        <el-table-column property="name" label="门店名称"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { getStoresList } from '@/service/setting.js'
export default {
  data(){
    return{
      dataListLoading:false,
      // 最后选中的数组
      checkList:[],
      visible: false,
      gridData: [],
      pageSize: 10000,
      currentPage: 1,
      changePage: false,
      form:{
        key:null,
      },
    }
  },
  props: {
    cancel: {
      type: Boolean,
      default: false
    },
    double: {
      type: Boolean,
      default: true
    },
    initSelectList: {
      type: Array,
      default: null
    }
  },
  methods:{
    //双击填入
    doubleClick(row){
      if(this.double){
        let originalList = _.cloneDeep(this.checkList)
        originalList.push(row)
        this.checkList = originalList
        this.$refs.storeSelectionTable.toggleRowSelection(row)
      }else{
        return false
      }
    },

    async init(selectArray = [],allSelect,part){
      this.visible = true
      this.dataListLoading = true
      this.changePage = true
      this.currentPage = 1
      this.form.key = null
      this.checkList = selectArray
      this.part = part
      this.partList = this.part ? this.part.split(',') : []
      await this.getStores()
      if (allSelect) {
        this.$nextTick(() => {
          this.$refs.storeSelectionTable.toggleAllSelection()
        })
      }
      if (part) {
        this.$nextTick(() => {
          if (this.partList && this.partList.length > 0) {
            this.partList.forEach(ele => {
              const currentRow = this.gridData.find(item => (ele == item.id))
              if (currentRow) {
                this.$refs.storeSelectionTable.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        }) 
      }
    },
    // 是否可选
    selectable(row, index){
      console.log('test', this.initSelectList, 'row', row.id)
      if (this.cancel && this.initSelectList && this.initSelectList.length > 0) {
        const arr = this.initSelectList.filter(ele => {
          return ele.id == row.id
        })
        return arr.length === 0
      } else {
        return true
      }
    },
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoresList({
        pageSize: 10000,
        currentPage: 1,
        key: this.form.key,
        status:1
      })
      if (data.code === 0) {
        this.gridData = data.data.records
        this.$nextTick(() => {
          this.changePage = false
          this.checkList.forEach(row => {
            const currentRow = this.gridData.find(item => item.id == row.id)
            if (currentRow) {
              this.$refs.storeSelectionTable.toggleRowSelection(currentRow)
            }
          })
        })

      } else {
        this.gridData = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    resetForm(){
      this.form.key = ''
      this.changePage = true
      this.getStores()
    },
    searchForm() {
      this.changePage = true
      this.getStores()
    },
    // 多选
    selectionChangeHandle (val) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.checkList).filter(item => {
          return !this.gridData.some(ele => ele.id == item.id)
        })
        const select = newList.concat(val)
        console.log('select', select)
        this.checkList = select
      }
    },
    sure(){
      this.visible = false
      const newList = this.checkList.filter(item => {
        if (item) {
          return true
        } else {
          return false
        }
      })
      this.$emit('list',JSON.stringify(newList))
    }
  }
}
</script>
