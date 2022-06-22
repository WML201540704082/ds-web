<template>
  <div v-if="menu.name!='菜单管理'" class="sub-menu" :class="{'is-active': menu.isActive}" @click="gotoRouteHandle(menu)">
    <span class="name">{{ menu.name }}</span>
  </div>
</template>

<script>
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      this.$emit('changeSubview', menu)
    }
  }
}
</script>
