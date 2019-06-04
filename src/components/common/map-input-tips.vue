<template>
  <div class="d-relative" style="height: 450px;">
    <div ref="mapInputTips" id="mapInputTips"></div>
    <div class="search-panel">
      <div id="r-result"><input type="text" id="suggestId" v-model="areaName" size="20" placeholder="请输入地址" style="width:150px;" /></div>
    </div>
  </div>
</template>

<script>
function G(id) {
  return document.getElementById(id);
}

export default {
  props: {
    location: {
      default: "上海市",
      type: String
    }
  },
  data() {
    return {
      coordInfo: "",
      areaName:''
    };
  },
  mounted() {
    this.mapInit();
  },
  methods: {
    mapInit() {
      let _self = this
      let map = new BMap.Map(this.$refs.mapInputTips); // 创建Map实例
      // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);// 初始化地图,设置中心点坐标和地图级别
      map.centerAndZoom(this.$local.fetch("cityInfo").name || "上海市", 11); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom();
      // 添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        // enableGeolocation: true
      });
      map.addControl(navigationControl);
      // var point = new BMap.Point(80.366974,41.236681);
      

      // 点击添加地址
      map.addEventListener("click",function(e){
        // console.log(e.point.lng + "," + e.point.lat)
        map.clearOverlays(); //清除地图上所有覆盖物
        var point = new BMap.Point(e.point.lng, e.point.lat);
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        var gc = new BMap.Geocoder(); 
        gc.getLocation(point, function(rs){
           var addComp = rs.addressComponents;
           let areaName = `${addComp.province}${addComp.city}${addComp.district}${addComp.street}`
          _self.areaName = areaName
          _self.coordInfo = {
            lng: e.point.lng,
            lat: e.point.lat,
            name: areaName
          };
          // console.log(_self)
          _self.$emit("getLocation", _self.coordInfo);
        });
        
      });
      // 智能搜索
      var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });
      // ac.addEventListener("onhighlight", function(e) {
      //   console.log(e)
      //  })
      var myValue;
      ac.addEventListener("onconfirm", e => {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        // G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        map.clearOverlays(); //清除地图上所有覆盖物
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: () => {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
            this.coordInfo = {
              lng: pp.lng,
              lat: pp.lat,
              name: myValue
            };
          }
        });
        local.search(myValue);
      });
    }
  },
  watch: {
    coordInfo: function(val) {
      this.$emit("getLocation", val);
    }
  }
};
</script>
<style scoped lang="scss" >
#mapInputTips {
  height: 100%;
  height: 100%;
}
.search-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #fff;
  padding: 10px;
  bottom: 20px;
  border-radius: 3px;
}
#r-result input {
  padding: 0 5px;
  width: 200px !important;
  border-radius: 3px;
  height: 30px;
  color: #606266;
  border: 1px solid #dcdfe6;
}
</style>
<style>
.route-icon {
  background: none !important;
}
.tangram-suggestion-main {
  z-index: 999;
}
.tangram-suggestion table tr td {
  padding: 0 !important;
}
</style>

