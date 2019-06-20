<template>
  <el-container class="d-content business-setting main-content">
    <!-- 右侧切换 -->
    <el-aside width="110px">
      <el-tabs tab-position="left" v-model="componentActive">
        <el-tab-pane
          v-for="(item,index) of components"
          :key="index"
          v-if="authorityButtons.includes(item.authorityCode)"
          :label="item.label"
          :name="item.component"
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
import hotel from './hotel' // k酒店
import company from "./company/index"; // 企业
export default {
  data() {
    return {
      syscode:this.$local.fetch("userInfo").syscode,
      componentActive: "location", // 业务设置当前选中
      components:[
        {component:'location',label:'位置',authorityCode:'asystem_assist_bizsetting_1001'},
        {component:'building',label:'楼盘',authorityCode:'asystem_assist_bizsetting_1006'},
        {component:'common',label:'公共', authorityCode:'asystem_assist_bizsetting_1011'},
        {component:'process',label:'流程', authorityCode:'asystem_assist_bizsetting_1019' },
        {component:'pictureSet', label:'图片', authorityCode:'asystem_assist_bizsetting_1013'},
        {component:'customer', label:'客户', authorityCode:'asystem_assist_bizsetting_1015'},
        {component:'defaultCity', label:'城市', authorityCode:'asystem_assist_bizsetting_1017'},
        {component:'product', label:'产品', authorityCode:'asystem_assist_bizsetting_1021'},
        {component:'hotel', label:'酒店', authorityCode:'asystem_assist_hotel'},
        {component:'company', label:'企业', authorityCode:'asystem_assist_bizsetting_1024'},
      ],
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
    hotel
  },
  mounted(){
    if(this.authorityButtons.includes('asystem_assist_bizsetting_1001')){
      this.componentActive = "location"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1006')){
      this.componentActive = "building"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1011')){
      this.componentActive = "common"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1019')){
      this.componentActive = "process"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1013')){
      this.componentActive = "pictureSet"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1015')){
      this.componentActive = "customer"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1017')){
      this.componentActive = "defaultCity"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1021')){
      this.componentActive = "product"
    }else if(this.authorityButtons.includes('asystem_assist_hotel')){
      this.componentActive = "hotel"
    }else if(this.authorityButtons.includes('asystem_assist_bizsetting_1024')){
      this.componentActive = "company"
    }
  },
  created() {
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