<template>
  <el-container class="d-content business-setting main-content">
    <!-- 右侧切换 -->
    <el-aside width="110px">
      <el-tabs tab-position="left" v-model="componentActive">
        <el-tab-pane
          v-for="(item,index) of compArr"
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
import hotel from './hotel' // k酒店
import company from "./company/index"; // 企业
export default {
  data() {
    return {
      syscode:this.$local.fetch("userInfo").syscode,
      componentActive: "location", // 业务设置当前选中
      compArr:[
        {component: location,componentName:'location',label:'位置',authorityCode:'asystem_assist_bizsetting_1001'},
        {component: building,componentName:'building',label:'楼盘',authorityCode:'asystem_assist_bizsetting_1006'},
        {component: common,componentName:'common',label:'公共', authorityCode:'asystem_assist_bizsetting_1011'},
        {component: process,componentName:'process',label:'流程', authorityCode:'asystem_assist_bizsetting_1019' },
        {component: pictureSet,componentName:'pictureSet', label:'图片', authorityCode:'asystem_assist_bizsetting_1013'},
        {component: customer,componentName:'customer', label:'客户', authorityCode:'asystem_assist_bizsetting_1015'},
        {component: defaultCity,componentName:'defaultCity', label:'城市', authorityCode:'asystem_assist_bizsetting_1017'},
        {component: product,componentName:'product', label:'产品', authorityCode:'asystem_assist_bizsetting_1021'},
        {component: hotel,componentName:'hotel', label:'酒店', authorityCode:'asystem_assist_hotel'},
        {component: company,componentName:'company', label:'企业', authorityCode:'asystem_assist_bizsetting_1024'},
      ]
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
  comp:[],
  computed:{
  },
  mounted(){
      let compsName = this.compArr.map(item=>item.componentName) //获取默认的组件名称
      this.$options.comp.forEach((item)=>{
        if(compsName.indexOf(item.componentName)!==-1){
          this.compArr[compsName.indexOf(item.componentName)] = {...item,...this.compArr[compsName.indexOf(item.componentName)]}
          this.$options.components[item.componentName] = item.component
        }else{
          if(!item.authorityCode || !item.label){
            console.error(`businessSetting里${item.componentName}如果是新添加组件lable和authorityCode是必填`)
          }
          this.$options.components[item.componentName] = item.component
          this.compArr.push(item)
        }
      })
  },
  created() {
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
