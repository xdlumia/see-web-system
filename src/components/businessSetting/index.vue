<template>
  <el-container class="d-content business-setting main-content">
    <!-- 右侧切换 -->
    <el-aside width="110px">
      <el-tabs tab-position="left" v-model="componentActive">
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1001')"
          label="位置"
          name="location"
        ></el-tab-pane>
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1006')"
          label="楼盘"
          name="building"
        ></el-tab-pane>
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1011')"
          label="公共"
          name="common"
        ></el-tab-pane>
        <!-- 流程 -->
        <!-- 这个地方name我用的是7，为了不该动其他的name属性 -->
        <!-- 权限码暂时用1012 -->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1012')"
          label="流程"
          name="process"
        ></el-tab-pane>
        <!-- 图片 -->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1013')"
          label="图片"
          name="pictureSet"
        ></el-tab-pane>
        <!-- 客户 -->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1015')"
          label="客户"
          name="customer"
        ></el-tab-pane>
        <!--城市-->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1017')"
          label="城市"
          name="defaultCity"
        ></el-tab-pane>
        <!--产品-->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1021')"
          label="产品"
          name="product"
        ></el-tab-pane>
        <!-- 凯亚酒店 -->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_hotel')"
          label="酒店"
          name="hotel"
        ></el-tab-pane>
        <!--企业-->
        <el-tab-pane
          v-if="authorityButtons.includes('asystem_assist_bizsetting_1017')"
          label="企业"
          name="company"
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






