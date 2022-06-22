<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" v-html-height :style="{'padding-right':documentWidth+'px', 'min-height': documentClientHeight + 'px','height': documentClientHeight + 'px' }">
        <!-- <GeminiScrollbar class="my-scroll-bar1" v-html-height style="height: 100%;"> -->
          <main-content />
        <!-- </GeminiScrollbar> -->
      </div>
    </template>
  </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
export default {
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  computed: {
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },
      set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
  },
  created () {
    this.loading = false
  },
  mounted () {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight']
      this.documentClientWidth = document.documentElement['clientWidth']-188
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight']
        this.documentClientWidth = document.documentElement['clientWidth']-188
      }
    },
  }
}
</script>
<style lang="scss">
.my-scroll-bar1 {
  .gm-scroll-view{
    height: 100%;
  }
  .site-content{
    min-width:1080px
  }
}
</style>


