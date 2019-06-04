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
      <el-tab-pane v-for="(item,index) of components" :key="index" :label="item.label" :name="item.components"></el-tab-pane>
    </el-tabs>
    <components :is="componentActive"></components>
  </div>
</template>

<script>
  import businessArea from "./business-area"; // 商圈
  import around from "./around"; // 周边配套
  import school from "./school"; // 学校
  export default {
    components: {
      businessArea,
      around,
      school
    },
  	props: [],
    data() {
      return {
        components:[
          {label:'商圈',components:'businessArea'},
          {label:'周边配套',components:'around'},
          {label:'学校',components:'school'},
        ],
        // 组件
        componentActive:'businessArea',
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






