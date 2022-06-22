<template>
  <div class="desk-cygn">
    {{title}}
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'gt-sub-title',
  props: {
    title: {
      type: String,
      require: true
    }
  }
}
</script>
