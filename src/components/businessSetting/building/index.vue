<!--私有组件：客户
/**
* 辅助管理-公共设置-私有组件：客户
* @/components/asistant/customer 组件存放位置
* @author web-王晓冬
* @date 2018年7月9日
**/
-->
<template>
  <div>
    <el-tabs v-model="componentActive" type="card">
      <el-tab-pane label="房屋状态" name="houseState"></el-tab-pane>
      <el-tab-pane label="电话设置" name="phoneSetting"></el-tab-pane>
    </el-tabs>
    <components :is="componentActive"></components>
  </div>
</template>

<script>
  import houseState from "./houseState"; //房屋状态
  import phoneSetting from "./phoneSetting"; // 电话设置
  export default {
    components: {
      houseState,
      phoneSetting
    },
  	props: [],
    data() {
      return {
        commonActive:'',
        // 组件
        componentActive:'houseState',
      }
    },

    created() {
    },
    methods: {
    }
  }
  ;
</script>
<style scoped lang="scss">

</style>






