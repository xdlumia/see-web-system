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
    <div class="d-flex pl20 pr20">
      <span>功能列表：</span>
      <div style="flex:1"></div>
      <el-checkbox v-model="descendants">级联选择</el-checkbox>
    </div>
    <el-tree
      style="max-height:calc(100vh - 150px); overflow-y:auto"
      ref="tree"
      :data="treeData"
      :check-strictly="true"
      show-checkbox
      node-key="id"
      @check="onCheckChange"
      :default-expanded-keys="treeChecked"
      :default-checked-keys="treeChecked"
      :props="{label: 'name'}">

    </el-tree>
    <div class="ac">
      <el-button @click="dialogMeta.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveFnauth" size="small" v-if="dialogMeta.roleSource == 'custom'">确 定
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["dialogMeta"],
    data() {
      return {
        loading: false, // loading动画
        treeData: [],
        treeChecked: [],
        descendants: true,
        // 功能授权弹出内容
        authForm: {
          roleId: '',
          resourceId: []
        },
      };
    },
    computed: {},
    created() {
      this.fnLoadTree({roleIds: this.dialogMeta.data.id})
    },
    watch: {},
    methods: {
      // 请求树数据方法
      fnLoadTree(params) {
        this.loading = true
        this.$api.bizSystemService.getAuthRoleList(params).then(res => {
          let tData = res.data || []
          this.treeData = tData
          this.treeChecked = this.getTreeExpanded();
        }).finally(() => {
          this.loading = false
        })
      },

      loop(data, fun, childrenKey = "children") {
        if (data instanceof Array) {
          data.forEach((item) => {
            this.loop(item, fun, childrenKey)
          })
          return
        }

        fun(data);

        if (data[childrenKey]) {
          data[childrenKey].forEach(item => {
            this.loop(item, fun, childrenKey)
          })
        }
      },

      onCheckChange(data, {checkedKeys}) {
        if (this.descendants) {
          let checked = checkedKeys.includes(data.id)
          let node = this.$refs.tree.getNode(data)

          this.loop(node, (item) => {
            item.setChecked(checked, false)
          }, 'childNodes')

          let parent = node;

          if (checked) {
            while ((parent = parent.parent) != null) {
              parent.setChecked(checked, false)
            }
          }
        }
      },

      getTreeExpanded() {
        let checkData = []

        this.loop(this.treeData, (item) => {
          item.checked && checkData.push(item.id)
        })

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
