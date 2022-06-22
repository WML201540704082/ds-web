<template>
  <div
    class="site-wrapper"
    width="80%"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar/>
      <main-sidebar v-if="isAuthentication !==0"/>
      <div class="site-content__wrapper"  v-html-height :class="isAuthentication !==0?'':'marginLeft'" :style="{ 'padding-right':documentWidth+'px','min-height': documentClientHeight + 'px','height': documentClientHeight + 'px' }">
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
import { getStore } from '@/utils/storage'
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
    isAuthentication: {
      get () {
        if (this.$store.state.common.needRefreshFlag) {
          return getStore({name: 'company-info'})
        } else {
          return getStore({name: 'company-info'})
        }
      }
    },
  },
  created () {
    this.loading = false 
    // 更改主题色
    const theme = getStore({name: 'theme'})
    changeTheme(theme)
  },
  mounted () {
    this.resetDocumentClientHeight()
    // this.isAuthentication = getStore({name: 'company-info'})
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
.marginLeft {
  margin-left: 0!important
}
</style>

