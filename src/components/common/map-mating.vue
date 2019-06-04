<template>
  <div>
    <ul class="map-mating-type">
      <li
      v-for="(item,index) of mapTypeData"
      :class="{active:index==mapTypeActive}"
      @click = "mapTypeTab(item,index)"
      :key="index">{{item}}</li>
    </ul>
    <baidu-map
      class="baidu-map"
      :center="location"
      :scroll-wheel-zoom="scrollZoom"
      ak="GDDkUxNlLL851VkLLCAVE9Eh3MtpGfrq" >
        <bm-view class="bm-view"></bm-view>
        <div class="bm-local-search">
            <div class="bm-local-search-title">{{mapTypeTitle}}</div>
            <bm-local-search class="bm-local-search-content" :nearby="nearby" :keyword="keyword" :auto-viewport="true" :location="location">
            </bm-local-search>
        </div>
    </baidu-map>
  </div>
</template>

<script>
  import {BaiduMap,BmView,BmLocalSearch,BmCircle,BmMarker} from 'vue-baidu-map'

  export default {
    name: 'app',
    components: {
      BaiduMap,
      BmView,
      BmLocalSearch,
      BmCircle,
      BmMarker
    },
    props:['locationCoord'],
    data() {
      return {
        mapTypeData:[
          "公交",
          "地铁",
          "教育设施",
          "医院",
          "银行",
          "休闲娱乐",
          "购物",
          "餐饮",
          "健身"
        ],
        mapTypeActive:'0',
        mapTypeTitle:'公交',
        scrollZoom:false, //是否可开启鼠标滚动缩放
        radius:2000,
        location:this.locationCoord,
        keyword: '银行',
        nearby:{center:this.locationCoord,radius:2000}
      }
    },

    created() {
    },

    methods: {
      mapTypeTab(item,index){
       this.mapTypeActive = index;
       this.keyword = item

       this.mapTypeTitle = item
      },
      //获取地图的检索坐标
      // searchcomplete(res){
      //   console.log(res.Br)
      // }
    }

  }
</script>
<style scoped lang="scss" >
.map-mating-type{
  font-size:12px;
  line-height: 14px;
  margin-bottom: 10px;
  font-size:12px;
  color:#666;
  cursor: pointer;
  overflow: hidden;
  li{float: left;  padding:3px 5px; border-radius: 1px; transition:color .2s}
  li:hover{color: #409EFF}
  li.active{background: #409EFF; color:#fff;}
  }
.baidu-map {
  width: 100%;
  height:350px;
  position: relative
}
.bm-view {
  width: 100%;
  height:100%;
}
.bm-local-search{position: absolute;width: 300px; background:#fff;  right: 10px; top:10px; bottom:10px; box-shadow: 0 7px 21px rgba(0, 0, 0, 0.25)}
.bm-local-search-title{ background: #409EFF;line-height: 30px; text-align: center; color:#fff; font-size:14px;}
.bm-local-search-content{position: absolute; top:30px; bottom:0; overflow-y: auto}

</style>
