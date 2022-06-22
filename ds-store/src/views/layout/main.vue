<template>
  <div
    class="site-wrapper inner__wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar/>
      <main-sidebar/>
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
import { changeTheme } from '@/utils'
export default {
  data () {
    return {
      loading: true,
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
    userId: {
      get () { return this.$store.state.user.id },
      set (val) { this.$store.commit('user/updateId', val) }
    },
    userName: {
      get () { return this.$store.state.user.name },
      set (val) { this.$store.commit('user/updateName', val) }
    }
  },
  created () {
    this.loading = false
    // 更改主题色
    var res = this.$cookie.get('store-info')
    const { theme = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
    changeTheme(theme)
  },
  mounted () {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight']
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight']
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
