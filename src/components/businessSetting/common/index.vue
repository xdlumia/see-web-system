/*
 * @Author: 赵伦
 * @Date: 2019-11-04 17:39:43
 * @LastEditors: 赵伦
 * @LastEditTime: 2019-11-08 16:00:50
 * @Description: 公共设置新增公司管理页签
*/
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :key="item.name" :label="item.label" :name="item.name" v-for="item of tabUse">
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import common from './common';
import companyAccount from './../companyAccount';

export default {
  components: {
    common,
    companyAccount
  },
  data() {
    return {
      activeName: 'common',
      // prettier-ignore
      tabs:[
        {label:'公共设置',name:'common',component:'common',code:'assist_biz_com_tab_1001'},
        {label:'公司管理',name:'companyAccount',component:'companyAccount',code:'assist_biz_com_tab_2001'},
      ]
    };
  },
  computed: {
    tabUse() {
      let tab = this.tabs.filter(item =>
        this.authorityButtons.includes(item.code)
      );
      if (tab.length) {
        this.activeName = tab[0].name;
      }
      return tab;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>