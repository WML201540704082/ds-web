<template>
  <el-button class="gt-border-button" :loading="loading">
     <icon-svg class="iconSvg" v-show="!loading" :name="icon"></icon-svg>
     <span style="position: relative; top: 1px;">{{text}}</span>
  </el-button>
</template>
<script>
export default {
  name: 'gt-border-button',
  props: {
    type: {
      type: String,
      default: 'submit'
    },
    loading: {
      type: Boolean,
      default: false
    },
    txt: {
      type: String,
      default: '新增'
    },
  },
  computed: {
    icon() {
      return this.filter(this.type, 'icon')
    },
    text() {
      return this.filter(this.type, 'text')
    },
  },
  methods: {
    filter(type, mod) {
      let text = this.txt || '新增'
      let icon = this.type || 'create'
      return mod === 'icon' ? icon : text
    }
  }
}
</script>
<style lang="scss" scope>
.iconSvg {
  font-size: 14px;
  vertical-align: top;
}
.gt-border-button{
  margin-bottom: 12px;
  height: 28px;
  background: #fff!important;
  vertical-align: middle;
  border-radius: 4px;
  padding: 0 4px;
  letter-spacing:3px;
  opacity: 1;
  font-size: 12px;
  &:hover, &:active, &:focus{
    color: #fff;
    opacity: 1;
  }
  .icon{
    margin-top: -4px;
    width: 16px;
    height: 16px;
  }
}
</style>
