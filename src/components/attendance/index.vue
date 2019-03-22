<!--员工列表
/**
* 员工列表
* @/components/attendance/ 员工列表
* @author web-王晓冬
* @date 2019年1月2日
**/
-->
<template>
  <div class="d-content main-content">
    <div class="mb10">
      <el-input size="medium" @keyup.native.13="$refs.attendanceTable.reload()" v-model="queryForm.userName" placeholder="请输入人员姓名/员工编号" class="w240"></el-input>
      <tree-select 
      size="medium"
      defaultExpandAll
      v-model="queryForm.deptId"
      :data="deptTreeData"
      :props="{label:'deptName'}"
      ></tree-select>
      <el-button size="medium" type="primary" @click="$refs.attendanceTable.reload(1)" icon="el-icon-search">查询</el-button>
    </div>
    <!-- 表格数据 -->
    <d-table api="systemService.getLoginfoList" :params="queryForm" ref="attendanceTable"  style="height:calc(100% - 40px)">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="attendanceName" min-width="120" align="center" label="姓名" width="140">
        <template slot-scope="scope">
          <span class="d-text-blue d-pointer" @click='viewInfo(scope.row)'> {{scope.row.userName}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" align="center" label="所属部门" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="account" min-width="120" align="center" label="用户账号"></el-table-column>
      <el-table-column prop="employeeNo" min-width="120" align="center" label="员工编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="loginTime" show-overflow-tooltip min-width="120" align="center" label="最近登录时间">
        <template slot-scope="scope">
          <span> {{scope.row.loginTime | timeToStr}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="onlineDuration" align="center" label="累计登陆时长(分钟)" width="140"></el-table-column>
    </d-table>

    <el-dialog :title="dialogMeta.title" :visible.sync="dialogMeta.visible" :width="dialogMeta.width" top="20px">
      <components :is="dialogMeta.component" :dialogMeta="dialogMeta" v-if="dialogMeta.visible"></components>
    </el-dialog>
  </div>
</template>
<script>
import attendanceChart from "./attendance-chart"; // 图表
export default {
  components: {
    attendanceChart,
  },
  data () {
    return {
      syscode:this.$local.fetch('userInfo').syscode, //系统code
      authorityBtn: this.$local.fetch('authorityBtn').sys_attendance || [], // 权限码
      // dialog弹出框信息
      dialogMeta:{
        title:'', //弹出框标题
        visible:false,//是否显示
        component:'',//组件
        data:'',// 当前行数据
      },
      deptTreeData:[],

      // 搜索框
      queryForm: {
        userName:'',
        orderRules:'login_time DESC',
        page:1,
        limit:20,
        deptId:'',
      },
    }
  },
  created () {
    this.getDeptList()
  },
  methods: {
    // 请求部门数据方法
    getDeptList () {
      this.$api.bizSystemService.getDeptList({type: '0'})
        .then(res => {
            this.deptTreeData = res.data || []
        })
    },
    // 查看记录
    viewInfo(row){
      this.dialogMeta.visible = true
      this.dialogMeta.data = row
      this.dialogMeta.width = "820px"
      this.dialogMeta.title = "数据统计"
      this.dialogMeta.component = 'attendanceChart'
    },
  }
}
</script>
<style scoped>
.d-treeBox{height: calc(100vh - 125px); overflow-y: auto;}
</style>
