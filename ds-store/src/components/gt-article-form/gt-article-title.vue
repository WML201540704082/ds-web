<template>
  <el-form-item label="段落标题" prop="tempValue" class="gt-article">
    <el-input v-model="tempValue" placeholder="请输入内容" @change="onChangeTitle" >
    </el-input>
    <span class="gt-article-control" >
      <slot></slot>
    </span>
  </el-form-item>
</template>
<script>
export default {
  name: 'gt-article-title',
  props: {
    value: null
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  methods: {
    onChangeTitle(value) {
      this.$emit('changeTitle', value)
    }
  }
}
</script>

<style lang="scss">
.gt-article {
  position: relative;
  .el-input--medium .el-input__inner,.el-textarea__inner{
    width: calc(100% - 180px);
  }
  .gt-article-control{
    position: absolute;
    top: 0;
    right: 20px;
  }

}
</style>

