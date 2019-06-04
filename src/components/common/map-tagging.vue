<template>
    <div class='mapTagging'>
            <div class="map-tag-close" @click="mapVisible.mapDialogVisible = false">
                <i class="el-icon-close"></i>
            </div>
            <baidu-map class="map" :center="{lng:qucoordinates.split(',')[1],lat:qucoordinates.split(',')[0]}" :zoom="15" @click='letGet'>
                <!-- <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" ></bm-scale> -->
                 <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :enableGeolocation='true'></bm-navigation>

                 <bm-polygon :path="polygonPath" stroke-color="blue"  :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
                   <bm-view class="map">   </bm-view>
             </baidu-map>
             <div class="wfull" style="margin-top: 30px;">
             	<span slot="footer" class="ac" style="margin-left: 300px;">
			      <el-button size="small" @click="mapVisible.mapDialogVisible = false">取 消</el-button>
			      <el-button size="small" type="primary" @click="saveCor">确 定</el-button>
		    	</span>
             </div>

    </div>
</template>
<script>
//引入百度地图
import {BaiduMap,BmPolygon,BmNavigation,BmLocalSearch,BmView,BmScale,BmGeolocation} from 'vue-baidu-map'
export  default {
	props: ['qucoordinates','mapVisible'],
    data(){
        return {
            location: '',
            keyword: '',
            polygonPath: [ ]
        }
    },
    components: {
        BaiduMap,
        BmPolygon,
        BmNavigation,
        BmLocalSearch,
        BmView,
        BmScale,
        BmGeolocation
    },
    computed:{
        // polygonPath:{
        //     get() {
        //         let cor = []
        //         let corArr = this.value.split(';')
        //         corArr.forEach(item=>{
        //             let currCor = item.split(',')
        //             cor.push({"lng":Number(currCor[0]),"lat":Number(currCor[1])})
        //         })
        //         return cor
        //     },
        //     set(newValue) {
        //         let cors = ''
        //         newValue.forEach(item=>{
        //             cors += `${item.lng},${item.lat};`
        //         })
        //         console.log(cors);
        //         this.value = cors
        //     }
        // }
    },
    methods:{
         updatePolygonPath (e) {
            this.polygonPath = e.target.getPath()
        },
     saveCor(){
         if(this.polygonPath.length >= 2){
             this.$message.success({
                message: "地图标注成功！"
            });
            this.mapVisible.mapDialogVisible = false
            this.$emit('getQucoordinates',this.polygonPath)
         }else{
            this.$message('请标注地图');
         }
//		console.log(this.polygonPath)
		
     },
     letGet(event){
//       console.log(event.point)
         this.polygonPath.push(event.point)
     }

    }
}
</script>
<style lang='scss'  scoped>
.mapTagging{
    position: relative;
    width: 100%;
    height: 100%;
    .map{
    width: 100%;
    height: 400px;
    .search{
        width: 100%;
        height: 50px;
        }
    }
    .map-tag-close{ cursor: pointer; position: absolute; right: 5px; top:5px; z-index: 1;border-radius: 50%; width:30px; height: 30px; background:rgba(0,0,0,.6);color:#FFF; font-size:22px;text-align: center; line-height:30px;}

}
</style>
