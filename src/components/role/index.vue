<!--私有组件：抄录账单列表
/**
* 默认角色管理
* @system 组件存放位置
* @desc 默认角色管理页面
* @author web-王晓冬
* @date 2019年1月3日
**/
-->
<template>
    <div class="d-content main-content">
      <el-tabs v-model="activeRole" @tab-click="tabHandle">
        <el-tab-pane v-if="authorityButtons.includes('sys_role_1007')" label="默认角色" name="resourceService.getDefaultRoleList"></el-tab-pane>
        <el-tab-pane v-if="authorityButtons.includes('sys_role_1008')" label="自定义角色" name="bizSystemService.getRoleList"></el-tab-pane>
      </el-tabs>
      <!-- 默认角色查询 -->
      <el-form v-if="activeRole == 'resourceService.getDefaultRoleList'" :model="queryForm" size="medium" @submit.native.prevent>
        <el-form-item inline class="d-inline mr30 mb10" >
          <el-input  v-if="authorityButtons.includes('sys_role_1009')" @keyup.native.13="$refs.roleTable.reload(1)" v-model.trim="queryForm.name" placeholder="请输入角色名称" class="w200"></el-input>
          <div  v-if="authorityButtons.includes('sys_role_1009')" class="d-inline mt0">
              <el-select v-model="queryForm.state" slot="prepend" placeholder="请选择" size="medium">
                <el-option label="请选择" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
          </div>
          <el-button v-if="authorityButtons.includes('sys_role_1009')" type="primary" @click="$refs.roleTable.reload(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 自定义角色查询 -->
      <el-form v-if="activeRole == 'bizSystemService.getRoleList'" :model="queryForm" size="medium" @submit.native.prevent>
        <el-form-item inline class="d-inline mr30 mb10" >
          <el-input  v-if="authorityButtons.includes('sys_role_1004')" @keyup.native.13="$refs.roleTable.reload(1)" v-model.trim="queryForm.name" placeholder="请输入角色名称" class="w200"></el-input>
          <div  v-if="authorityButtons.includes('sys_role_1004')" class="d-inline mt0">
              <el-select v-model="queryForm.state" slot="prepend" placeholder="请选择" size="medium">
                <el-option label="请选择" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
          </div>
          <el-button v-if="authorityButtons.includes('sys_role_1004')" type="primary" @click="$refs.roleTable.reload(1)" icon="el-icon-search">查询</el-button>
          <el-button v-if="authorityButtons.includes('sys_role_1001') && activeRole=='bizSystemService.getRoleList'" size="medium" icon="el-icon-plus" @click="roleHandle('add',{})"  >新增角色</el-button>
        </el-form-item>
      </el-form>
    <!-- 表格数据 -->
    <d-table
      style="height:calc(100% - 94px)"
      :api="activeRole"
      :params="queryForm"
      ref="roleTable">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        align="center"
        label="名称"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roleTypeName"
        align="center"
        label="角色类型"
        min-width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.isDelete=="0"?"启用":"禁用"}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        min-width="280"
        align="center"
        show-overflow-tooltip
        label="角色描述">
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="操作"
       min-width="360">
        <template slot-scope="scope">
          <!-- 默认角色授权 -->
          <div v-if="activeRole == 'resourceService.getDefaultRoleList'">
            <el-button v-if="authorityButtons.includes('sys_role_1010')" size="mini" type="warning" plain @click="roleHandle('fnAuth',scope.row)">功能授权</el-button>
            <el-button v-if="authorityButtons.includes('sys_role_1011')" size="mini" type="warning" plain @click="roleHandle('dataAuth',scope.row)">数据授权</el-button>
          </div>
          <!-- 自定义角色授权 -->
          <div v-if="activeRole == 'bizSystemService.getRoleList'">
            <el-button v-if="authorityButtons.includes('sys_role_1005')" size="mini" type="warning" plain @click="roleHandle('fnAuth',scope.row)">功能授权</el-button>
            <el-button v-if="authorityButtons.includes('sys_role_1006')" size="mini" type="warning" plain @click="roleHandle('dataAuth',scope.row)">数据授权</el-button>
            <el-button v-if="authorityButtons.includes('sys_role_1002')" size="mini" type="primary" plain @click="roleHandle('update',scope.row)"  >修改</el-button>
            <el-button v-if="authorityButtons.includes('sys_role_1003')" size="mini" type="danger" @click="delHandle(scope.$index, scope.row)"  >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </d-table>
    <!-- 操作弹出框 -->
    <el-dialog :title="dialogMeta.title" :visible.sync="dialogMeta.visible" :width="dialogMeta.width" top="20px">
      <components :is="dialogMeta.component" :dialogMeta="dialogMeta" v-if="dialogMeta.visible" @submit="tableReload"></components>
    </el-dialog>
</div>
</template>
<script>
import roleAdd from "./role-add"; //角色新增
import roleFnauth from "./role-fnauth"; //功能授权
import roleDataAuth from "./role-data-auth"; //数据授权
export default {
  components: {
    roleAdd,
    roleFnauth,
    roleDataAuth
  },
  data () {
    return {
      // dialog 弹出框操作
      dialogMeta:{
        title:'', //弹出框标题
        visible:false,//是否显示
        component:'',//组件
        data:'',// 当前行数据
      },
      activeRole:'resourceService.getDefaultRoleList', // 当前角色数据
      // 查询表单
      queryForm: {
        limit:20,
        page:1,
        name: '',
        state: '',
        companyCode:this.$local.fetch('userInfo').companyCode, //公司编码  自定义角色不传此参数
        subsysCode:this.$local.fetch('userInfo').syscode, //子系统编码 自定义角色不传此参数
      },
    }
  },
  created () {
    // 如果没有默认角色默认显示自定义角色
    if(!this.authorityButtons.includes('sys_role_1007')){
      this.activeRole = 'bizSystemService.getRoleList'
    }
  },
  methods: {
    // 角色数据操作
    roleHandle(type,row){
      let title = {
        add:{ title:'新增角色', width:'460px', component:'roleAdd' },
        update:{ title:'编辑角色:' + row.roleName, width:'460px', component:'roleAdd' }, 
        fnAuth:{ title:'功能授权-当前角色:' + row.roleName, width:'460px', component:'roleFnauth' },
        dataAuth:{ title:'数据授权-当前角色:' + row.roleName, width:'1220px', component:'roleDataAuth' },
      }
      this.dialogMeta.visible = true
      this.dialogMeta.type = type
      this.dialogMeta.width = title[type].width
      this.dialogMeta.title = title[type].title
      this.dialogMeta.component = title[type].component
      this.dialogMeta.data = row
      this.dialogMeta.roleSource = this.activeRole == 'resourceService.getDefaultRoleList'?'default':'custom'
    },
    // 角色类型切换台
    tabHandle(){
      this.$refs.roleTable.reload(1)
    },
    // 重新加载表格数据
    tableReload: function () {
      this.$refs.roleTable.reload()
    },
    // 删除部门
    delHandle (node, data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$api.bizSystemService.delRole({id: data.id}).then(res => {
          if (res.code == 200) {
            // 执行请求部门树数据方法
            this.tableReload()
          }
        })
      }).catch(() => {})
    },
  }
}
</script>
<style scoped>
</style>
