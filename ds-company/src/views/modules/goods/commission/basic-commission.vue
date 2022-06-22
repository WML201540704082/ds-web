<template>
  <section class="page-basic-commission">
    <!-- table列表 -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      v-table-height
      :expand-row-keys="expandRows"
      row-key="id"
      lazy
      :load="load"
      :stripe="true"
      style="width: 100%;">
      <el-table-column
        prop="name"
        width="300"
        label="商品分类">
      </el-table-column>
      <el-table-column
        prop="value"
        label="商品提成">
        <template slot-scope="scope">
          <span v-show="scope.row.id !== current">
            {{scope.row.commission ? scope.row.commission : 0}} %
            <span @click="toEdit(scope.row.id, scope.row.commission)"><icon-svg name="edit" class="edit-icon" /></span>
          </span>
          <span v-show="scope.row.id === current" class="commissionBt">
            <el-input class="edit-input" v-model="scope.row.commission"/> %
            <el-button style="margin-left: 15px;" :loading="$store.state.loading.global" type="primary" @click="addOrUpdateHandle(scope.row)">保存</el-button>
            <el-button @click="cancel(scope.row)">取消</el-button>
          </span>
          <span v-if="scope.row.parentId === null || scope.row.parentId === ''" class="operate-control" @click="subCategory(scope.row, 'add')">添加子分类</span>
          <span v-else>
            <span class="operate-control" @click="subCategory(scope.row, 'edit')">编辑</span>
            <span class="operate-control" @click="deleteSubCategory(scope.row)">删除</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <subcategory-add-or-update ref="subcategoryAddOrUpdate" @refreshSubcategory="getMainCategoryList" />
    <commission-tip ref="commissionTip" @refresh="getMainCategoryList" />
  </section>
</template>

<script>
import * as api from '@/service/goods'
import { twoDecimal, commissionRange } from '@/utils/validate'
import subcategoryAddOrUpdate from './subcategory-add-or-update'
import commissionTip from './basic-commission-tip'

export default {
  name: 'basic-commission',
  data () {

    return {
      dataList: [],
      current: null,
      orgValue: null,
      expandRows: [],
      dataListLoading: false
    }
  },

  async created() {
    // 获取商品列表
    this.getMainCategoryList()
  },

  components: {
    subcategoryAddOrUpdate,
    commissionTip
  },
  methods: {
    // 获取一级分类
    async getMainCategoryList() {
      this.dataListLoading = true
      const data = await api.getMainCategory()
      if (data && data.records) {
        const newList = data.records.map(item => {
          return {
            ...item,
            commission: this.priceNum(item.commission),
            hasChildren: true
          }
        })
        this.current = null,

        this.dataList = newList
      }
      this.dataListLoading = false
    },

    // 获取二级分类
    async getSubCategoryList(id) {
      const data = await api.getSubCategory(id)
      if (data && data.records) {
        const newList = data.records.map(item => {
          return {
            ...item,
            commission: this.priceNum(item.commission),
            hasChildren: true
          }
        })
        return newList
      } else {
        return []
      }
    },

    //获取三级分类
     async getThiCategoryList(id) {
      const data = await api.getSubCategory(id)
      if (data && data.records) {
        const newList = data.records.map(item => {
          return {
            ...item,
            commission: this.priceNum(item.commission),
            hasChildren:false
          }
        })
        return newList
      } else {
        return []
      }
    },

    // 设置编辑
    toEdit(id, orgValue) {
      if (this.current) {
        this.$message.warning('请先编辑当前行！')
      } else {
        this.current = id
        this.orgValue = orgValue
      }
    },

    // 取消
    async cancel(value) {
      await this.getMainCategoryList()
      this.current = null
    },

    async load(tree, treeNode, resolve) {
      let data = []
      if (tree.id && tree.level ==1) {
        data = await this.getSubCategoryList(tree.id)
        resolve(data)
      }
       if (tree.id && tree.level ==2) {
        data = await this.getThiCategoryList(tree.id)
        resolve(data)
      }
    },

    // 修改
    async addOrUpdateHandle (item) {
      if (commissionRange(item.commission, 100,'normal')) {
        // this.$easyConfirm.show({
        //   title: '提示',
        //   content: '确定更改该分类下所有商品的提成比例吗？',
        //   confirm: async () => {
        //     const { data } = await api.setPercent({
        //       categoryId: item.id,
        //       name: item.name,
        //       path: item.path,
        //       commission: this.priceNum(item.commission, 'out')
        //     })
        //     if (data.code === 0) {
        //       this.getMainCategoryList()
        //       this.current = null
        //     }
        //     this.$easyConfirm.hide()
        //   }
        // })
        this.$nextTick(() => {
          this.$refs['commissionTip'].init({
            categoryId: item.id,
            commission: item.commission
          })
        })
      } else {
        this.$message.warning('请输入0-100的数字，最多保留小数点后两位')
      }
    },

    // 新增编辑子分类
    async subCategory (row, type) {
      const firstCategoryItem = this.dataList.find(ele => ele.id === row.parentId)
      this.$nextTick(() => {
        let params = type === 'add' ? {
          firstCategoryId: row.id,
          firstCategoryName: row.name,
          // commission: 0,
          categoryId: null,
          categoryName: null
        } : {
          categoryId: row.id,
          firstCategoryId: row.parentId,
          firstCategoryName: firstCategoryItem ? firstCategoryItem.name : null,
          // commission: this.priceNum(row.commission, 'out'),
          categoryName: row.name
        }
        this.$refs['subcategoryAddOrUpdate'].init(params)
      })
    },

    // 删除子分类
    deleteSubCategory(row) {
      this.$easyConfirm.show({
        title: '提示',
        content: `是否要删除分类：${row.name}？`,
        confirm: async () => {
          const { data } = await api.deleteSubCategory(row.id)
          if (data.code === 0) {
            this.getMainCategoryList()
            this.current = null
          } else {
            this.$message.error(data.msg)
          }
          this.$easyConfirm.hide()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.page-basic-commission{
  .el-table .cell{
    min-height: 28px;
    line-height: 28px;
    .el-table__placeholder{
      display: inline-block;
      width: 30px;
    }
  }

  .el-table__expand-icon {
    width: 20px;
    margin-top: 3px;
    float: left;
    cursor: pointer;
  }
  .edit-icon{
    position: relative;
    font-size: 16px;
    margin-left: 10px;
    top: 4px;
    cursor: pointer;
  }
  .edit-input{
    float: left;
    padding: 0 !important;
    width: 100px;
    .el-input__inner{
      width: 100%;
      padding: 0 5px;
      height: 26px;
      line-height: 26px;
    }
  }
  .operate-control{
    display: inline-block;
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
