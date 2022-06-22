<template>
  <section>
    <div class="gt-check-item" :class="{'select theme-color theme-border theme-nextb': select}" @click="selectItem(select)">
      {{text}}
    </div>
  </section>
</template>
<script>
export default {
  name: 'gt-check-item',
  props: {
    text: {
      type: String,
      default: 'text'
    },
    cancel: {
      type: Boolean,
      default: false
    },
    select: {
      type: Boolean,
      default: false
    },
    id: {
      default: null
    }
  },
  methods: {
    selectItem() {
      if (this.cancel) {
        this.$message.warning('已添加的商品规格不能删除！')
      } else {
        this.$emit('change', this.id)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/_variables.scss';
.gt-check-item{
  float: left;
  padding: 0 10px;
  color: $info--sub-font-color;
  border: 1px solid $info--sub-font-color;
  text-align: center;
  height: 30px;
  line-height: 30px;
  min-width: 50px;
  margin: 10px 10px 0 0;
  cursor: pointer;
  &.select {
    background-color:  rgba(244, 132, 66, .2);
  }
}
</style>
