 <!--
 /**
  * @desc 组织类型
  * @author web-王晓冬
  * @date 2018年10月26日
-->
<template>
    <div class="d-content main-content" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <span class="mr5">组织类型名称:</span>
          <el-input size="medium" v-model="filterOrgName" placeholder="请输入部门组织类型名称" style="width:240px"></el-input>
        </el-col>
        <el-col :span="12" class="ar">
          <el-button type="primary" size="medium" icon="el-icon-plus"  @click="editOrAddHandle('add')">新增组织类型</el-button>
        </el-col>
      </el-row>
      <div class="custom-tree-node title mt10">
        <span class="w200 ml10">组织类型名称</span>
        <div class="tree-node">
          <span class="d-elip w140">创建时间</span>
          <span class="d-elip w140">创建人</span>
          <span class="d-elip w100">操作</span>
        </div>
      </div>
      <el-scrollbar style="height:calc(100% - 90px)">
        <el-tree
          class="treetable"
          ref="treetable"
          :data="organaTypeData"
          node-key="id"
          :filter-node-method="filterOrgNode"
          default-expand-all
          :expand-on-click-node="false">
          <div class="custom-tree-node" slot-scope="{ node, data }">
              <span class="w200">{{node.data.typeName}}</span>
              <div class="tree-node">
                <span class="d-elip w140"> {{node.data.createTime | timeToStr}}</span>
                <span class="d-elip w140"> {{node.data.createName}}</span>
                <span class="d-elip w100">
                  
                  <!-- sourceFrom:   数据来源(0 A系统用户默认方式 1 同步房脉动) -->
                  <el-button :disabled="node.data.parentId == 0" class="el-icon-edit f16" type="text" @click="() => editOrAddHandle(node,data)"></el-button>
                  <el-button :disabled="node.data.parentId == 0 ||  node.data.isBuiltIn == 1" class="el-icon-delete f16" :class="node.data.parentId == 0 || node.data.isBuiltIn == 1?'':'d-text-red'" type="text" @click="() => delHandle(node, data)"></el-button>
                </span>
              </div>
            </div>
        </el-tree>
      </el-scrollbar>

      <!-- 新增编辑弹出框 -->
      <el-dialog
        :title="dialogTile"
        :visible.sync="dialogVisible"
        v-loading="loading"
        width="400px">
        <el-form label-width="110px" ref="dialogForm" :model="dialogForm" class="pr20 mt10" size="small">
          <el-form-item 
          label="组织类型名称" 
          prop="typeName"
          :rules="[
            { required: true, message: '请输入组织类型名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ]">
            <el-input v-model="dialogForm.typeName" :disabled="dialogForm.isBuiltIn==1" :maxlength="15"  placeholder="请输入组织类型名称"></el-input>
          </el-form-item>
           <el-form-item 
           label="上级组织类型" 
           prop="parentTypeName" 
           :rules="{ required: true, message: '请选择组织类型', trigger: 'blur' }">
            <el-input v-model="dialogForm.parentTypeName" placeholder="请选择上级组织类型" disabled>
                <el-button slot="append" @click="organaDialogVisibleTree = true">选择</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="ac">
            <el-button type="primary" @click="saveHandle('dialogForm')" size="small">确定</el-button>
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          </div>
        </span>
      </el-dialog>

       <el-dialog
        title="选择组织类型"
        :visible.sync="organaDialogVisibleTree"
        width="300px">
        <div class="deptTreeBox">
            <el-tree :data="organaTypeData" default-expand-all :expand-on-click-node="false" :props="organaDefaultProps" @node-click="organeHandleNodeClick"></el-tree>
        </div>
      </el-dialog>

  </div>
</template>
<script>

/* eslint-disable eqeqeq */
export default {
  data() {
    return {
    //   authorityBtn: this.$local.fetch("authorityBtn").sys_dept || [], // 权限码
      loading:false,
      dialogVisible: false, // 新增编辑弹出框
      organaDialogVisibleTree: false, // 组织类型
      dialogTile: "新增组织类型",
      addOrEdit: "",
    //   deptData: [],
      organaTypeData: [], // 组织数据
      filterOrgName:'', //部门名称筛选
      organaDefaultProps: {
        children: "children",
        label: "typeName"
      },
      // 弹出框内容
      dialogForm: {
        typeName: "",
        parentId: "",
        parentTypeName:'',
        id:'',
      },
    };
  },
  created() {
    // 初始化组织类型数据
    this.fnLoadOrganaTree();
  },
  methods: {
    fnLoadOrganaTree: function() {
      // 请求部门树数据方法
      this.$api.bizSystemService.getOrganaList().then(res => {
        if (res.code == 200) {
          this.organaTypeData = res.data || [];
        }
      });
    },
    // 组织类型查询
    filterOrgNode(value, data){
      if(!value) return true
      return data.typeName.indexOf(value) !== -1
    },

    // 编辑和新增部门
    editOrAddHandle(node,data) {
      if (node != "add") {
        this.dialogVisible = true
        this.dialogTile = "修改组织类型：" + data.typeName;
        this.addOrEdit = "edit";
        this.dialogForm.typeName = data.typeName;
        this.dialogForm.parentId = data.parentId;
        this.dialogForm.parentTypeName = node.parent.data.typeName;
        this.dialogForm.id = data.id;
        this.dialogForm.isBuiltIn = data.isBuiltIn;
      } else {
        this.dialogVisible = true;
        this.dialogTile = "新增组织类型";
        this.addOrEdit = "add";
        this.dialogForm.isBuiltIn = ''
        // 清空form表单
        this.$nextTick(()=>{
            this.$refs.dialogForm.resetFields();
        })
        this.dialogForm.parentId = this.organaTypeData[0] ? this.organaTypeData[0].id : "";
        this.dialogForm.parentTypeName = this.organaTypeData[0] ? this.organaTypeData[0].typeName : "";
      }
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
          this.$api.bizSystemService.delOrgType({ id: data.id }).then(res => {
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
    // 选择上级类型
    organeHandleNodeClick(data) {
      this.organaDialogVisibleTree = false; // 关闭弹出框
      this.dialogForm.parentId = data.id;
      this.dialogForm.parentTypeName = data.typeName;
    },
    // 保存部门
    saveHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let submitMethod;
          if (this.addOrEdit == "edit") {
            submitMethod = this.$api.bizSystemService.updateOrgType(this.dialogForm);
          } else if (this.addOrEdit == "add") {
            submitMethod = this.$api.bizSystemService.saveOrgType(this.dialogForm);
          }
          submitMethod.then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.fnLoadOrganaTree();
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
    filterOrgName(val) {
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
