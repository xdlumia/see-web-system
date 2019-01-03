<template>
    <div class="d-content main-content" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <span class="mr5">部门名称:</span>
          <el-input size="medium" v-model="filterDeptName" placeholder="请输入部门名称查询" style="width:240px"></el-input>
        </el-col>
        <el-col :span="12" class="ar">
          <el-button v-if="authorityBtn.includes('sys_dept_1001')" type="primary" size="medium" icon="el-icon-plus"  @click="editOrAddHandle('add')">新增部门</el-button>
          <el-button type="warning" size="medium"><router-link class="d-text-white" to="/system/org">组织类型设置</router-link></el-button>
        </el-col>
      </el-row>
      
      <div class="custom-tree-node title mt10">
        <span class="w200 ml10">部门名称</span>
        <div class="tree-node">
          <span class="d-elip w120">组织类型</span>
          <span class="d-elip w120">创建时间</span>
          <span class="d-elip w100">操作</span>
        </div>
      </div>
      <el-scrollbar style="height:calc(100% - 90px)">
        <el-tree
          class="treetable"
          ref="treetable"
          :data="deptData"
          node-key="id"
          :filter-node-method="filterDeptNode"
          default-expand-all
          :expand-on-click-node="false">
          <div class="custom-tree-node" slot-scope="{ node, data }">
              <span class="w200">{{node.data.deptName}}</span>
              <div class="tree-node">
                <span class="d-elip w120"> {{node.data.typeName}}</span>
                <span class="d-elip w120"> {{node.data.createTime | timeToStr}}</span>
                <span class="d-elip w100">
                  <!-- sourceFrom:   数据来源(0 A系统用户默认方式 1 同步房脉动) -->
                  <el-button v-if="authorityBtn.includes('sys_dept_1002') && node.data.sourceFrom!=1" :disabled="node.data.parentId == 0" class="el-icon-edit f16" type="text" @click="() => editOrAddHandle(data)"></el-button>
                  <el-button v-if="authorityBtn.includes('sys_dept_1003') && node.data.sourceFrom!=1" :disabled="node.data.parentId == 0" class="el-icon-delete f16" :class="node.data.parentId == 0?'':'d-text-red'" type="text" @click="() => delHandle(node, data)"></el-button>
                </span>
              </div>
            </div>
        </el-tree>
      </el-scrollbar>
      <!-- 新增编辑弹出框 -->
      <el-dialog
        :title="defalutName"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        v-loading="loading"
        width="400px">
        <el-form label-width="80px" :rules="rules" ref="dilogForm" :model="dilogForm" size="small">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="dilogForm.deptName" :maxlength="15"  placeholder="请输入部门名称" class="w200"></el-input>
          </el-form-item>
          <el-form-item label="上级部门"  >
            <el-input v-model="parentName" placeholder="请选择上级部门" class="w200" disabled></el-input>
            <el-button @click="selHandle()" v-show="isShowSelBtn">选择</el-button>
          </el-form-item>
           <el-form-item label="组织类型" prop="typeName" >
            <el-input v-model="dilogForm.typeName" placeholder="请选择组织类型" class="w200" disabled></el-input>
            <el-button @click="organaHandle()" v-show="isShowSelBtn">选择</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="ac">
            <el-button type="primary" @click="saveHandle('dilogForm')" size="small">确定</el-button>
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          </div>
        </span>
      </el-dialog>

      <!-- 树部门弹出框 -->
      <el-dialog
        title="选择部门"
        :visible.sync="dialogVisibleTree"
        width="300px">
        <div class="deptTreeBox">
            <el-tree :data="deptData" default-expand-all :expand-on-click-node="false" :props="{ children: 'children', label: 'deptName' }" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-dialog>

       <el-dialog
        title="选择组织类型"
        :visible.sync="organaDialogVisibleTree"
        width="300px">
        <div class="deptTreeBox">
            <el-tree :data="organaData" default-expand-all :expand-on-click-node="false" :props="organaDefaultProps" @node-click="organeHandleNodeClick"></el-tree>
        </div>
      </el-dialog>

  </div>
</template>
<script>
// import qs from 'qs'
// import axios from 'axios'
// import {systemUrl} from  '@/assets/js/common'
/* eslint-disable eqeqeq */
export default {
  data() {
    return {
      authorityBtn: this.$local.fetch("authorityBtn").sys_dept || [], // 权限码
      loading:false,
      dialogVisible: false, // 新增编辑弹出框
      dialogVisibleTree: false, // 树部门弹出框
      organaDialogVisibleTree: false, // 组织类型
      isShowSelBtn: true, // 是否显示选择按钮
      defalutName: "新增部门",
      addOrEdit: "",
      deptData: [],
      organaData: [], // 组织数据
      filterDeptName:'', //部门名称筛选
      organaDefaultProps: {
        children: "children",
        label: "typeName"
      },
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        typeName: [
          { required: true, message: "请输入组织类型", trigger: "blur" }
        ]
      },

      // 弹出框内容
      dilogForm: {
        deptName: "",
        id: "",
        parentId: "",
        typeName: "",
        orgTypeId: ""
      },
      parentName: ""
    };
  },
  created() {
    // 执行请求部门树数据方法
    this.fnLoadDeptTree();
  },
  methods: {
    fnLoadOrganaTree: function() {
      // 请求部门树数据方法
      this.$api.bizSystemService.getOrganaList().then(res => {
        if (res.code == 200) {
          this.organaData = res.data || [];
        }
      });
    },
    // 部门名称查询
    filterDeptNode(value, data){
      if(!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    // 请求部门树数据方法
    fnLoadDeptTree: function() {
      let params = { type: 0 };
      this.loading = true
      this.$api.bizSystemService.getDeptList(params)
        .then(res => {
          if (res.code == 200) {
            this.deptData = res.data || [];
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
    // 编辑和新增部门
    editOrAddHandle(data) {
      if (data != "add") {
        this.defalutName = "修改部门：" + data.deptName;
        this.isShowSelBtn = false;
        this.addOrEdit = "edit";
        this.dilogForm.deptName = data.deptName;
        this.dilogForm.parentId = data.parentId;
        this.dilogForm.id = data.id;
        this.dilogForm.typeName = data.typeName;
        this.dilogForm.orgTypeId = data.orgTypeId;
        this.$api.bizSystemService.getDeptInfo(data.parentId).then(res => {
          if (res.code == 200) {
            this.parentName = res.data.deptName || '';
            this.dialogVisible = true;
          }
        });
      } else {
        this.dialogVisible = true;
        this.defalutName = "新增部门";
        this.addOrEdit = "add";
        this.dilogForm.deptName = "";
        this.dilogForm.id = "";
        this.dilogForm.typeName = "";
        this.dilogForm.orgTypeId = "";
        this.dilogForm.parentId = this.deptData[0] ? this.deptData[0].id : "";
        this.parentName = this.deptData[0] ? this.deptData[0].deptName : "";
        this.isShowSelBtn = true;
      }
    },
    // 选择部门
    selHandle() {
      this.dialogVisibleTree = true;
    },
    // 选择组织类型
    organaHandle() {
      this.organaDialogVisibleTree = true;
      // 执行请求组织树数据方法
      this.fnLoadOrganaTree();
    },
    // 删除部门
    delHandle(node, data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$api.bizSystemService.delDept({ id: data.id }).then(res => {
            if (res.code == 200) {
              // 下面四段代码是用来删除本地的数据
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    // 点击树节点回掉
    handleNodeClick(data) {
      this.dialogVisibleTree = false; // 关闭弹出框
      this.dilogForm.parentId = data.id;
      this.parentName = data.deptName;
    },
    organeHandleNodeClick(data) {
      this.organaDialogVisibleTree = false; // 关闭弹出框
      this.dilogForm.orgTypeId = data.id;
      this.dilogForm.typeName = data.typeName;
    },
    // 保存部门
    saveHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let submitMethod;
          if (this.addOrEdit == "edit") {
            submitMethod = this.$api.bizSystemService.updateDept(this.dilogForm);
          } else if (this.addOrEdit == "add") {
            submitMethod = this.$api.bizSystemService.addDept(this.dilogForm);
          }
          submitMethod.then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.fnLoadDeptTree();
            }
          }).finally(()=>{
              this.loading = false
            })
        }
      });
    }
  },
  watch:{
    // 部门名称查询
    filterDeptName(val) {
      this.$refs.treetable.filter(val.trim())
    }
  }
};
</script>
<style lang="scss">
.treetable .el-tree-node__content {
  border: 1px solid #efefef;
  border-top: 0;
  height: 40px;
}
.deptTreeBox {
  height: 350px;
  overflow: auto;
}
.custom-tree-node.title{ border:1px solid #efefef; background:#f2f2f2}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node .tree-node {
  display: flex;
  justify-content: space-between;
  font-size: 0;
  width: 732px;
  height: 40px;
  line-height: 40px;
}
.custom-tree-node .tree-node span{
  font-size: 14px;
}
</style>
