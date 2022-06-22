<template>
  <section >
    <el-dialog
      title="门店列表"
      :close-on-click-modal="false"
      :visible.sync="visible"
      append-to-body>
      <el-form :inline="true" class="mode-form-line1" label-width="80px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="storeName" placeholder="请输入门店关键字"></el-input>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="getStores"/>
          <gt-button type="reset" @click.native="resetForm"/>
        </el-form-item>
      </el-form>
      <el-table
        :data="gridData"
        v-loading="dataListLoading"
        :stripe="true"
        ref="storeSelectionTable"
        @row-dblclick="doubleClick"
        @selection-change="selectionChangeHandle">
        <el-table-column
          type="selection"
          header-align="center"
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
import { getStoreList } from '@/service/systore.js'
import _ from 'lodash'
export default {
  data(){
    return{
      dataListLoading:false,
      storeName: null,
      checkList:[],
      visible: false,
      gridData: [],
    }
  },
  created(){
    this.getStores()
  },
  methods:{
    init(selectArray){
      this.visible = true
      this.checkList = selectArray
      this.$nextTick(() => {
        selectArray.forEach(row => {
          const currentRow = this.gridData.find(item => item.id == row.id)
          this.$refs.storeSelectionTable.toggleRowSelection(currentRow)
        })
      })
    },
    // 获取企业下属门店
    async getStores() {
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.gridData = data.data
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    resetForm(){
      this.storeName = ''
      this.getStores()
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.checkList)
      originalList.push(row)
      this.checkList = originalList
      this.$refs.storeSelectionTable.toggleRowSelection(row)
    },
    // 多选
    selectionChangeHandle (val) {
      this.checkList = val
    },
    sure(){
      this.visible = false
      this.$emit('list',JSON.stringify(this.checkList))
    }
  }
}
</script>

