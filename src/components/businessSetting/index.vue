<template>
  <el-container class="d-content business-setting main-content">
    <!-- 右侧切换 -->
    <el-aside width="110px">
      <el-tabs tab-position="left" v-model="componentActive">
        <el-tab-pane
          v-for="(item,index) of comps"
          :key="index"
          v-if="authorityButtons.includes(item.authorityCode)"
          :label="item.label"
          :name="item.componentName"
        ></el-tab-pane>
      </el-tabs>
    </el-aside>
    <!-- <components style="margin-left:110px; min-width: 1100px; position: relative;"> -->
    <el-main>
      <components :is="componentActive"></components>
    </el-main>
  </el-container>
</template>

<script>
import location from "./location/index"; // 位置
import building from "./building/index"; // 楼盘设置
import common from "./common"; // 公共
import pictureSet from "./pictureSet/index"; // 图片
import customer from "./customer"; // 房态
import defaultCity from "./defaultCity"; //城市
import process from "./process"; // 流程
import product from "./product/index"; // 产品
// import hotel from './hotel' // k酒店
import company from "./company/index"; // 企业
let defaultComponent = [
        {component: location,componentName:'location',sort:1, label:'位置',authorityCode:'asystem_assist_bizsetting_1001'},
        {component: building,componentName:'building',sort:2, label:'楼盘',authorityCode:'asystem_assist_bizsetting_1006'},
        {component: common,componentName:'common',sort:3, label:'公共', authorityCode:'asystem_assist_bizsetting_1011'},
        {component: process,componentName:'process',sort:4, label:'流程', authorityCode:'asystem_assist_bizsetting_1019' },
        {component: pictureSet,componentName:'pictureSet',sort:5, label:'图片', authorityCode:'asystem_assist_bizsetting_1013'},
        {component: customer,componentName:'customer',sort:6, label:'客户', authorityCode:'asystem_assist_bizsetting_1015'},
        {component: defaultCity,componentName:'defaultCity',sort:7, label:'城市', authorityCode:'asystem_assist_bizsetting_1017'},
        {component: product,componentName:'product',sort:8, label:'产品', authorityCode:'asystem_assist_bizsetting_1021'},
        // {component: hotel,componentName:'hotel',sort:1, label:'酒店', authorityCode:'asystem_assist_hotel'},
        {component: company,componentName:'company',sort:9, label:'企业', authorityCode:'asystem_assist_bizsetting_1024'},
      ]
export default {
  data() {
    return {
      syscode:this.$local.fetch("userInfo").syscode,
      componentActive: "location", // 业务设置当前选中
    };
  },
  components: {
    location,
    building,
    common,
    pictureSet,
    customer,
    defaultCity,
    process,
    product,
    company,
    // hotel
    },
  defaultSlot: defaultComponent,
  computed:{
    comps(){
      return this.$options.defaultSlot
    }
  },
  mounted(){},
  created() {
    for(let item of this.$options.defaultSlot){
      if(this.authorityButtons.includes(item.authorityCode)){
        this.componentActive = item.componentName
        break
      }
    }
  },
  methods: {
  }
};
</script>
<style>
.business-setting .el-tabs__item.is-left {
  width: 100px !important;
  text-align: center !important;
}
</style>
