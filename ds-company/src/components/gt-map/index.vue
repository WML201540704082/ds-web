<template>
  <div id="container" :style="{width: `${width}px`, height: `${height}px`}"></div>
</template>
<script>
import { validatenull } from '@/utils/validate'
export default {
  name: 'gt-map',
  data() {
    return {
      local: null,
      searchService: null
    }
  },
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    },
    search: {
      type: String
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var center = new qq.maps.LatLng(39.916527, 116.397128)
      var map = new qq.maps.Map(document.getElementById('container'), {
        center: center,
        zoom: 13
      })
      this.searchService = new qq.maps.Geocoder({
        complete : result => {
          map.setCenter(result.detail.location)
          this.$emit('refreshDataList',result.detail.location)
          var marker = new qq.maps.Marker({
            map:map,
            position: result.detail.location
          })
          //获取标记的点击事件
          qq.maps.event.addListener(marker, 'click', () => {
            this.$emit('refreshDataList',result.detail.location)
          })
        }
      })


    }
  },
  watch: {
    search: {
      handler(n, o) {
        if ( n !== o ) {
          this.searchService.getLocation(n)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.map {
  margin-top: 20px;
}
</style>
