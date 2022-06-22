<template>
  <!-- <div id="baidu_map"
    :style="{width: `${width}px`, height: `${height}px`}"
    class="map">
    <div class="result"></div>
  </div>-->
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
    // 百度地图API功能
    // let map = new BMap.Map('baidu_map')
    // 设置可以缩放
    // map.enableScrollWheelZoom(true)
    // map.centerAndZoom(new BMap.Point(116.4035,39.915),8)
    // this.local = new BMap.LocalSearch(map, {
    //   renderOptions:{map: map}
    // })

    // const map = new qq.maps.Map(document.getElementById("container"), {
    //   //加载地图经纬度信息
    //   center: new qq.maps.LatLng(39.916527, 116.397128),
    //   zoom: 10, //设置缩放级别
    //   draggable: false, //设置是否可以拖拽
    //   scrollwheel: false, //设置是否可以滚动
    //   disableDoubleClickZoom: true //设置是否可以双击放大
    // })
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
        // // 百度地图API功能
        // let map = new BMap.Map('baidu_map')
        // // 设置可以缩放
        // map.enableScrollWheelZoom(true)
        // map.centerAndZoom(new BMap.Point(116.4035,39.915),8)
        // this.local = new BMap.LocalSearch(map, {
        //   renderOptions:{map: map}
        // })
        // const self = this
        // this.local.setSearchCompleteCallback(function(searchResult) {
        //   var poi = searchResult.getPoi(0)
        //   if(!validatenull(poi)){
        //     var lat = poi.point.lat
        //     var lng = poi.point.lng
        //     var point ={
        //       lat:lat,
        //       lng:lng
        //     }
        //     self.$emit('refreshDataList',point)
        //   }else{
        //     self.$emit('refreshDataList','')
        //     self.$message.warning('请输入正确的地址,以便于能在地图中查找出来')
        //   }
        // })

        // this.local.search(n)
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
