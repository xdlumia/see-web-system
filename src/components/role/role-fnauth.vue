<!--私有组件：角色新增 or 编辑
/**
* 默认角色管理
* @system 组件存放位置
* @desc 默认角色管理页面
* @author web-王晓冬
* @date 2019年1月3日
**/
-->
<template>
  <div class="d-treeBox" v-loading="loading">
    <el-tree
    style="max-height:calc(100vh - 150px); overflow-y:auto"
    ref="tree"
    :data="treeData"
    show-checkbox
    node-key="id"
    :default-expanded-keys="treeexpanded"
    :default-checked-keys="treeexpanded"
    :props="{label: 'name'}">
    </el-tree>
    <div class="ac">
      <el-button @click="dialogMeta.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveFnauth" size="small" v-if="dialogMeta.roleSource == 'custom'">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dialogMeta"],
  data() {
    return {
      loading: false, // loading动画
      treeData: [], //角色类型数据
      treeexpanded:[],// 选中的数据
      // 功能授权弹出内容
      authForm: {
        roleId: '',
        resourceId: []
      },
    };
  },
  created() {
    this.fnLoadTree({roleIds: this.dialogMeta.data.id})
  },
  methods: {
    // 请求树数据方法
    fnLoadTree(params) {
      this.loading = true
      this.$api.bizSystemService.getAuthRoleList(params).then(res => {
        if (res.code == 200) {
          let tData = res.data || []
          this.treeData = tData
          // 获取选中数据
          this.treeexpanded = this.getCheck(tData)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取选中数据方法
    getCheck (data) {
      var checkData = []
      recursion(data)
      function recursion (data) {
        data.forEach(function (item) {
          if (item.children) {
            let subData = item.children
            recursion(subData)
          } else {
            if (item.checked) {
              checkData.push(item.id)
            }
          }
        })
      }
      return checkData
    },
    // 保存数据
    saveFnauth(formName) {
      this.loading = true
      // 获取选中的节点 key
      let checks = this.$refs.tree.getCheckedKeys()
      // 获取半选中的节点 key
      let halfChecks = this.$refs.tree.getHalfCheckedKeys()
      // 合并选中节点和半节点
      let ids = checks.concat(halfChecks)
      this.authForm.roleId = this.dialogMeta.data.id
      this.authForm.resourceId = ids.join(',')
      this.$api.bizSystemService.syncRole(this.authForm)
      .then(res => {
        // 重新加载表格数据
        this.$emit("submit", "success");
        // 关闭弹出框
        this.dialogMeta.visible = false;
      })
      .finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped>
</style>
