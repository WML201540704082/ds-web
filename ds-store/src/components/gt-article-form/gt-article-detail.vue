<template>
  <el-form-item label="文本内容" prop="tempValue" class="gt-article">
    <el-input
      type="textarea"
      :rows="4"
      placeholder="请输入文本内容"
      class="gt-article"
      @change="onChange"
      v-model="tempValue">
    </el-input>
    <span class="gt-article-control">
      <slot></slot>
    </span>
  </el-form-item>
</template>
<script>
export default {
  name: 'gt-article-detail',
  data() {
    return {
      tempValue: null
    }
  },
  props: {
    value: null,
    onAdd: null
  },
  mounted() {
  },
  created () {
    console.log('----------------------------'+this.value)
    this.tempValue = this.value
  },
  methods: {
    onChange(value) {
      this.$emit('changeDetail', value)
    }
  }
}
</script>
