<template>
  <el-button class="gt-button" :class="[size, defaultType]" :loading="loading">
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
      default: 'submit'
    },
    loading: {
      type: Boolean,
      default: false
    },
    txt: {
      type: String,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
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
      return this.txt ? this.txt : this.filter(this.type, 'text')
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
      case 'reset':
        text = '重置'
        icon = 'reset'
        break
      case 'create':
        text = '新增'
        icon = 'create'
        break
      default:
        text = '搜索'
        icon = 'search'
        break
      }
      return mod === 'icon' ? icon : text
    }
  }
}
</script>
