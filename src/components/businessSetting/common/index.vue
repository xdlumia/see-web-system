/*
 * @Author: 赵伦
 * @Date: 2019-11-04 17:39:43
 * @LastEditors: 赵伦
 * @LastEditTime: 2019-11-04 17:51:34
 * @Description: 公共设置新增公司管理页签
*/
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="公共设置" name="common">
        <common v-if="activeName=='common'" />
      </el-tab-pane>
      <el-tab-pane label="公司管理" name="companyAccount">
        <companyAccount  v-if="activeName=='companyAccount'"/>
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
      activeName: 'common'
    };
  }
};
</script>
<style lang="scss" scoped>
</style>