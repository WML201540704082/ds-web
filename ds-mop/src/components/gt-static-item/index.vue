<template>
  <section class="gt-static-item">
    <el-col v-if="type === 1" :lg="8" :md="8" :sm="12" :xs="24" class="item">
      <el-col :span="12" class="label">{{label}}：</el-col>
      <el-col :span="12" class="value">{{value}}</el-col>
    </el-col>
    <el-col v-if="type === 2" :lg="16" :md="16" :sm="24" :xs="24" class="item">
      <el-col :lg="6" :md="6" :sm="6" :xs="12" class="label">{{label}}：</el-col>
      <el-col :lg="18" :md="18" :sm="18" :xs="12" class="value">{{value}}</el-col>
    </el-col>
    <el-col v-if="type === 3" :span="24" class="item">
      <el-col :lg="4" :md="4" :sm="6" :xs="12" class="label">{{label}}：</el-col>
      <el-col :lg="20" :md="20" :sm="18" :xs="12" class="value">{{value}}</el-col>
    </el-col>
  </section>

</template>

<script>
export default {
  name: 'gt-static-item',
  props: {
    label: {
      type: String,
      default: 'label'
    },
    value: {
      default: ''
    },
    type: {
      type: Number,
      default: 1
    }
  }
}
</script>
