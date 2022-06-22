<template>
  <transition name="fade">
    <div style="height: 100%;">
      <router-view></router-view>
    </div>
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

