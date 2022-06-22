<template>
  <el-form>
    <el-form-item label="口味名称" prop="tempValue" class="gt-article">
      <el-input v-model="tempValue" placeholder="例：冰" @change="onChangeTea"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button>添加口味</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "goods-detail-tea",
  props: {
    value: null,
  },
  data() {
    return {
      tempValue: this.value,
    };
  },
  methods: {
    onChangeTea(value) {
      this.$emit("changeTea", value);
    },
  },
};
</script>

<style lang="scss">
.gt-article {
  position: relative;
  .el-input--medium .el-input__inner,
  .el-textarea__inner {
    width: calc(100% - 180px);
  }
  .gt-article-control {
    position: absolute;
    top: 0;
    right: 20px;
  }
}
</style>

