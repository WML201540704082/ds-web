<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
import { showProgressSpeed } from '@/utils'
export default {
  name: 'app',
  data() {
    return {

    }
  },
  mounted(){
    showProgressSpeed('close')
  },
}
</script>
