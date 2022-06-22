<template>
  <section class="gt-pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage + 1"
      :page-sizes="[20, 50, 100, 200, 1000]"
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
      let obj = {currentPage: 0, pageSize: val}
      this.$emit('updatePagination', obj)
    },
    handleCurrentChange(val) {
      let obj = {currentPage: val - 1, pageSize: this.pageSize}
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
