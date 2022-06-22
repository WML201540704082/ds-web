<template>
  <goods-view :isCompany="false"/>
</template>
<script>
import goodsView from './goods-view'
export default {
  name: 'goods-store-view',
  components: {
    goodsView
  }
}
</script>
