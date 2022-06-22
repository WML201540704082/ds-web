<template>
<!-- v-if="menu.name!='菜单管理'"  v-show="menu.name!='门店菜单'" &&menu.name!='营销首页'-->
  <div v-if="menu.name!='通用设置'" :class="{'sub-menu': true, 'is-active theme-color theme-border-top': menu.isActive}" @click="gotoRouteHandle(menu)">
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
<style lang="scss" scoped>
  .sub-menu{
    float: left;
    min-width: 80px;
    padding: 7px 15px;
    border-top: 2px solid #fff;
    vertical-align: baseline;
    font-size: 14px;
    color: #B1B1B1;
    cursor: pointer;
    text-align: center;
    .icon{
      // font-size: 14px;
      vertical-align: middle;
      margin-right: 5px;
    }
    &.is-active{
      border-left: 0!important;
      border-right: 0!important;
      border-bottom: 0!important;
    }
  }
</style>
