<template>
  <div id="baidu_map"
    :style="{width: `${width}px`, height: `${height}px`}"
    class="map">
  </div>
</template>
<script>
import { validatenull } from '@/utils/validate'
export default {
  name: 'gt-map',
  data() {
    return {
      local: null
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
    let map = new BMap.Map('baidu_map')
    // 设置可以缩放
    map.enableScrollWheelZoom(true)
    map.centerAndZoom(new BMap.Point(116.4035,39.915),8)
    this.local = new BMap.LocalSearch(map, {
      renderOptions:{map: map}
    })
  },
  watch: {
    search:{
      handler(n,o){
        // 百度地图API功能
        let map = new BMap.Map('baidu_map')
        // 设置可以缩放
        map.enableScrollWheelZoom(true)
        map.centerAndZoom(new BMap.Point(116.4035,39.915),8)
        this.local = new BMap.LocalSearch(map, {
          renderOptions:{map: map}
        })
        const self = this
        this.local.setSearchCompleteCallback(function(searchResult) { 
          var poi = searchResult.getPoi(0) 
          if(!validatenull(poi)){
            var lat = poi.point.lat
            var lng = poi.point.lng
            var point ={
              lat:lat,
              lng:lng
            }
            self.$emit('refreshDataList',point)
          }else{
            self.$emit('refreshDataList','')
            self.$message.warning('请输入正确的地址,以便于能在地图中查找出来')
          }
        })
        
        this.local.search(n) 
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .map{
    margin-top: 20px;
  }
</style>
