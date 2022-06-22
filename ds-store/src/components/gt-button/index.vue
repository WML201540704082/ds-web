<template>
  <el-button class="gt-button theme-background" :class="[size, defaultType]" :loading="loading">
    <img v-show="!loading" v-if="size === 'common'" class="icon" :src="'static/img/icon/' + icon + '.png'" />
    {{text}}
  </el-button>
</template>
<script>
export default {
  name: 'gt-button',
  props: {
    type: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    txt: {
      type: String,
      default: '保存'
    },
    size: {
      type: String,
      default: 'common'
    }
  },
  computed: {
    icon() {
      return this.filter(this.type, 'icon')
    },
    text() {
      return this.filter(this.type, 'text')
    },
    defaultType() {
      return this.isDefault ? 'is-default': ''
    }
  },
  methods: {
    filter(type, mod) {
      let icon = ''
      let text = ''
      switch (type) {
      case 'submit':
        text = '提交'
        icon = 'submit'
        break
      case 'search':
        text = '搜索'
        icon = 'search'
        break
      case 'export':
        text = '导出'
        icon = 'export'
        break
      case 'reset':
        text = '重置'
        icon = 'reset'
        break
      default:
        text = this.txt
        icon = ''
        break
      }
      return mod === 'icon' ? icon : text
    }
  }
}
</script>
<style lang="scss">
.gt-button{
  height: 28px;
  border: 0;
  color: #fff !important;
  vertical-align: middle;
  border-radius: 4px;
  padding: 0 4px;
  letter-spacing:3px;
  opacity: .9;
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
  &.large {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    padding: 0 10% !important;
    letter-spacing:10px;
  }
  &.is-default{
    color: #000 !important;
    background: #fff !important;
    border: 1px solid #dcdfe6;
    &:hover{
      border-color: #dcdfe6 !important;
      background-color: #fff !important;
    }
  }
}
</style>
