<template>
  <section class="gt-pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="isorder == 1 ? currentPage+1 : currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
    />
  </section>
</template>

<script>
export default {
  name:'gtPagination',
  props: {
    isorder:{
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    }
  },
  methods:{
    handleSizeChange(val) {
      let obj = {currentPage: this.isorder == 1?0:1, pageSize: val}
      this.$emit('updatePagination', obj)
    },
    handleCurrentChange(val) {
      let obj = {currentPage: this.isorder == 1?val-1:val, pageSize: this.pageSize}
      this.$emit('updatePagination', obj)
    },
  }
}
</script>
<style>
  .gt-pagination{
    display: inline-block;
    width: 100%;
  }
</style>
